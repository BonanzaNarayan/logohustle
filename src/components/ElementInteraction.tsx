"use client";

import React, { useState, useEffect, useRef } from "react";
import { CanvasElement, TextElement, IconElement, ShapeElement, ImageElement } from "@/lib/types";
import { useEditor } from "@/hooks/useEditor";
import { LucideIcon } from "@/lib/lucide-icons";

export const ElementInteraction = React.memo(function ElementInteraction({ element }: { element: CanvasElement }) {
  const { state, dispatch, isSnapping, setSnapLines } = useEditor();
  const { elements, canvas } = state;
  const [interaction, setInteraction] = useState<'drag' | 'resize' | 'rotate' | null>(null);
  const interactionRef = useRef<{
    startPoint: { x: number; y: number };
    startElement: CanvasElement;
    svg: SVGSVGElement;
    resizeDirection?: string;
    startAngle?: number;
    center?: {x: number; y: number};
  } | null>(null);
  
  const isSelected = state.selectedElement?.id === element.id;

  const getSVGPoint = (e: MouseEvent | React.MouseEvent, svg: SVGSVGElement) => {
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (ctm) {
        return point.matrixTransform(ctm.inverse());
    }
    return point;
  }

  const handleMouseDown = (e: React.MouseEvent, interactionType: 'drag' | 'resize' | 'rotate', direction?: string) => {
    e.stopPropagation();
    if(element.id !== state.selectedElement?.id) {
      dispatch({ type: 'SELECT_ELEMENT', payload: { id: element.id } });
    }
    setInteraction(interactionType);
    
    const svg = (e.currentTarget as Element).ownerSVGElement;
    if (!svg) return;

    const startPoint = getSVGPoint(e, svg);
    
    interactionRef.current = {
      startPoint,
      startElement: { ...element },
      svg,
    }
    
    if (interactionType === 'resize') {
      interactionRef.current.resizeDirection = direction;
    }
    if (interactionType === 'rotate') {
        const center = {
            x: element.x + element.width / 2,
            y: element.y + element.height / 2,
        };
        interactionRef.current.center = center;
        interactionRef.current.startAngle = Math.atan2(startPoint.y - center.y, startPoint.x - center.x) * (180 / Math.PI) - element.rotation;
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!interaction || !interactionRef.current) return;

      const { svg, startPoint, startElement } = interactionRef.current;
      const currentPoint = getSVGPoint(e, svg);
      const dx = currentPoint.x - startPoint.x;
      const dy = currentPoint.y - startPoint.y;

      if (interaction === 'drag') {
        let finalDx = dx;
        let finalDy = dy;
        const newSnapLines: { x: number[]; y: number[] } = { x: [], y: [] };
        
        if (isSnapping) {
            const snapThreshold = 5;
            const currentElPos = { x: startElement.x + dx, y: startElement.y + dy };
            
            const currentBox = {
                left: currentElPos.x,
                right: currentElPos.x + startElement.width,
                centerX: currentElPos.x + startElement.width / 2,
                top: currentElPos.y,
                bottom: currentElPos.y + startElement.height,
                centerY: currentElPos.y + startElement.height / 2
            };

            const otherElements = elements.filter(el => el.id !== startElement.id);
            const xTargets = [0, canvas.width / 2, canvas.width, ...otherElements.flatMap(el => [el.x, el.x + el.width, el.x + el.width/2])];
            const yTargets = [0, canvas.height / 2, canvas.height, ...otherElements.flatMap(el => [el.y, el.y + el.height, el.y + el.height/2])];
            
            let bestSnapX = { dist: snapThreshold, offset: 0, target: -1 };
            let bestSnapY = { dist: snapThreshold, offset: 0, target: -1 };

            const checkSnap = (pos: number, target: number, best: typeof bestSnapX) => {
                const dist = Math.abs(pos - target);
                if (dist < best.dist) {
                    best.dist = dist;
                    best.offset = target - pos;
                    best.target = target;
                }
            };

            for (const target of xTargets) {
                checkSnap(currentBox.left, target, bestSnapX);
                checkSnap(currentBox.right, target, bestSnapX);
                checkSnap(currentBox.centerX, target, bestSnapX);
            }
            
            for (const target of yTargets) {
                checkSnap(currentBox.top, target, bestSnapY);
                checkSnap(currentBox.bottom, target, bestSnapY);
                checkSnap(currentBox.centerY, target, bestSnapY);
            }
            
            if (bestSnapX.target !== -1) {
                finalDx += bestSnapX.offset;
                newSnapLines.x.push(bestSnapX.target);
            }
            if (bestSnapY.target !== -1) {
                finalDy += bestSnapY.offset;
                newSnapLines.y.push(bestSnapY.target);
            }
        }
        
        setSnapLines(newSnapLines);
        
        dispatch({
            type: 'UPDATE_ELEMENT',
            payload: { id: element.id, x: startElement.x + finalDx, y: startElement.y + finalDy },
        });
      } else if (interaction === 'rotate' && interactionRef.current.center && interactionRef.current.startAngle !== undefined) {
        const { center, startAngle } = interactionRef.current;
        const angle = Math.atan2(currentPoint.y - center.y, currentPoint.x - center.x) * (180 / Math.PI);
        let newRotation = angle - startAngle;
        dispatch({ type: 'UPDATE_ELEMENT', payload: { id: element.id, rotation: newRotation } });
      } else if (interaction === 'resize' && interactionRef.current.resizeDirection) {
        const { resizeDirection } = interactionRef.current;
        const rad = startElement.rotation * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const rotatedDx = dx * cos + dy * sin;
        const rotatedDy = -dx * sin + dy * cos;
        
        let { x, y, width, height } = startElement;

        if (resizeDirection.includes('e')) {
            width += rotatedDx;
        }
        if (resizeDirection.includes('w')) {
            width -= rotatedDx;
            x += rotatedDx * cos;
            y += rotatedDx * sin;
        }
        if (resizeDirection.includes('s')) {
            height += rotatedDy;
        }
        if (resizeDirection.includes('n')) {
            height -= rotatedDy;
            x += rotatedDy * sin;
            y -= rotatedDy * cos;
        }

        if (width < 10) width = 10;
        if (height < 10) height = 10;

        dispatch({
          type: 'UPDATE_ELEMENT',
          payload: { id: element.id, x, y, width, height },
        });
      }
    };

    const handleMouseUp = () => {
      setInteraction(null);
      interactionRef.current = null;
      setSnapLines({ x: [], y: [] });
    };
    
    if (interaction) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setSnapLines({ x: [], y: [] });
    };
  }, [interaction, dispatch, element.id, isSnapping, elements, canvas.width, canvas.height, setSnapLines]);
  
  const handleSize = 8;
  const cursors: {[key: string]: string} = {
    n: 'n-resize', s: 's-resize', e: 'e-resize', w: 'w-resize',
    nw: 'nw-resize', ne: 'ne-resize', sw: 'sw-resize', se: 'se-resize',
  }
  const resizeHandles = [
      { dir: 'nw', x: -handleSize/2, y: -handleSize/2 },
      { dir: 'n', x: element.width/2 - handleSize/2, y: -handleSize/2 },
      { dir: 'ne', x: element.width - handleSize/2, y: -handleSize/2 },
      { dir: 'w', x: -handleSize/2, y: element.height/2 - handleSize/2 },
      { dir: 'e', x: element.width - handleSize/2, y: element.height/2 - handleSize/2 },
      { dir: 'sw', x: -handleSize/2, y: element.height - handleSize/2 },
      { dir: 's', x: element.width/2 - handleSize/2, y: element.height - handleSize/2 },
      { dir: 'se', x: element.width - handleSize/2, y: element.height - handleSize/2 },
  ]
  
  const renderContent = () => {
    switch (element.type) {
      case 'text':
        const textEl = element as TextElement;
        return (
          <text
            x={textEl.width / 2}
            y={textEl.height / 2}
            dominantBaseline="central"
            textAnchor={textEl.align}
            fontFamily={textEl.fontFamily}
            fontSize={textEl.fontSize}
            fontWeight={textEl.fontWeight}
            fill={textEl.color}
            style={{ userSelect: 'none' }}
          >
            {textEl.content}
          </text>
        );
      case 'icon': {
        const iconEl = element as IconElement;
        return (
          <LucideIcon
            name={iconEl.name}
            color={iconEl.color}
            fill={iconEl.fill}
            strokeWidth={iconEl.strokeWidth}
            width={element.width}
            height={element.height}
          />
        );
      }
      case 'shape': {
        const shapeEl = element as ShapeElement;
        const props = {
            fill: shapeEl.color,
            stroke: shapeEl.strokeColor,
            strokeWidth: shapeEl.strokeWidth
        };
        switch (shapeEl.shape) {
            case 'rectangle':
                return <rect x="0" y="0" width={element.width} height={element.height} {...props} />
            case 'circle':
                return <circle cx={element.width / 2} cy={element.height / 2} r={Math.min(element.width, element.height) / 2} {...props} />
            case 'triangle':
                return <polygon points={`${element.width / 2},0 0,${element.height} ${element.width},${element.height}`} {...props} />
            case 'star': {
                const w = element.width;
                const h = element.height;
                const points = [
                    w * 0.5, h * 0,
                    w * 0.618, h * 0.363,
                    w * 1, h * 0.363,
                    w * 0.691, h * 0.593,
                    w * 0.809, h * 0.951,
                    w * 0.5, h * 0.73,
                    w * 0.191, h * 0.951,
                    w * 0.309, h * 0.593,
                    w * 0, h * 0.363,
                    w * 0.382, h * 0.363
                ].join(' ');
                return <polygon points={points} {...props} />;
            }
            case 'hexagon': {
                const w = element.width;
                const h = element.height;
                const points = `${w/2},0 ${w},${h/4} ${w},${3*h/4} ${w/2},${h} 0,${3*h/4} 0,${h/4}`;
                return <polygon points={points} {...props} />;
            }
        }
        return null;
      }
    case 'image':
        const imageEl = element as ImageElement;
        return <image href={imageEl.src} x="0" y="0" width={element.width} height={element.height} />;
      default:
        return null;
    }
  };


  return (
    <g
      transform={`translate(${element.x}, ${element.y})`}
    >
      <g 
        transform={`rotate(${element.rotation} ${element.width / 2} ${element.height / 2})`}
        onMouseDown={(e) => handleMouseDown(e, 'drag')}
        style={{ cursor: interaction === 'drag' ? 'grabbing' : 'grab' }}
      >
        <g opacity={element.opacity}>
            {renderContent()}
        </g>
        
        {/* Transparent rect to ensure draggable area */}
        <rect x={0} y={0} width={element.width} height={element.height} fill="transparent" />

        {isSelected && (
          <g data-interaction-handles="true">
            <rect
              x={-2}
              y={-2}
              width={element.width + 4}
              height={element.height + 4}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              strokeDasharray="3,3"
              pointerEvents="none"
            />
            {resizeHandles.map(({ dir, x, y }) => (
                <rect
                    key={dir}
                    x={x}
                    y={y}
                    width={handleSize}
                    height={handleSize}
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--primary-foreground))"
                    strokeWidth="1"
                    onMouseDown={(e) => handleMouseDown(e, 'resize', dir)}
                    style={{ cursor: cursors[dir] }}
                />
            ))}
            <g transform={`translate(${element.width / 2}, ${-20})`}>
                <line y2="15" stroke="hsl(var(--primary))" strokeWidth="1" />
                <circle
                    r={5}
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--primary-foreground))"
                    strokeWidth="1"
                    onMouseDown={(e) => handleMouseDown(e, 'rotate')}
                    style={{ cursor: 'crosshair' }}
                />
            </g>
          </g>
        )}
      </g>
    </g>
  );
});
