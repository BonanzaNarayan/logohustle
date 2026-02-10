"use client";

import React, { useState, useEffect, useRef } from "react";
import { CanvasElement, TextElement, IconElement, ShapeElement, ImageElement } from "@/lib/types";
import { useEditor } from "@/hooks/useEditor";
import { LucideIcon } from "@/lib/lucide-icons";

export function ElementInteraction({ element }: { element: CanvasElement }) {
  const { state, dispatch } = useEditor();
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

      const { svg, startPoint, startElement, resizeDirection, center, startAngle } = interactionRef.current;
      const currentPoint = getSVGPoint(e, svg);
      const dx = currentPoint.x - startPoint.x;
      const dy = currentPoint.y - startPoint.y;

      if (interaction === 'drag') {
        dispatch({
          type: 'UPDATE_ELEMENT',
          payload: { id: element.id, x: startElement.x + dx, y: startElement.y + dy },
        });
      } else if (interaction === 'rotate' && center && startAngle !== undefined) {
        const angle = Math.atan2(currentPoint.y - center.y, currentPoint.x - center.x) * (180 / Math.PI);
        let newRotation = angle - startAngle;
        dispatch({ type: 'UPDATE_ELEMENT', payload: { id: element.id, rotation: newRotation } });
      } else if (interaction === 'resize' && resizeDirection) {
        
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
            x += dx - (rotatedDx * cos - 0 * sin);
            y += dy - (rotatedDx * sin + 0 * cos);
        }
        if (resizeDirection.includes('s')) {
            height += rotatedDy;
        }
        if (resizeDirection.includes('n')) {
            height -= rotatedDy;
            x += dx - (0 * cos - rotatedDy * sin);
            y += dy - (0 * sin + rotatedDy * cos);
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
    };
    
    if (interaction) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interaction, dispatch, element.id]);
  
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
      case 'icon':
        const iconEl = element as IconElement;
        return (
          <foreignObject x="0" y="0" width={element.width} height={element.height}>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                  <LucideIcon name={iconEl.name} color={iconEl.color} size="100%" />
              </div>
          </foreignObject>
        );
      case 'shape':
        const shapeEl = element as ShapeElement;
        if (shapeEl.shape === 'rectangle') {
            return <rect x="0" y="0" width={shapeEl.width} height={shapeEl.height} fill={shapeEl.color} stroke={shapeEl.strokeColor} strokeWidth={shapeEl.strokeWidth} />
        }
        if (shapeEl.shape === 'circle') {
            return <circle cx={shapeEl.width / 2} cy={shapeEl.height / 2} r={Math.min(shapeEl.width, shapeEl.height) / 2} fill={shapeEl.color} stroke={shapeEl.strokeColor} strokeWidth={shapeEl.strokeWidth} />
        }
        if (shapeEl.shape === 'triangle') {
            return <polygon points={`${shapeEl.width / 2},0 0,${shapeEl.height} ${shapeEl.width},${shapeEl.height}`} fill={shapeEl.color} stroke={shapeEl.strokeColor} strokeWidth={shapeEl.strokeWidth} />
        }
        return null;
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
      opacity={element.opacity}
    >
      <g 
        transform={`rotate(${element.rotation} ${element.width / 2} ${element.height / 2})`}
        onMouseDown={(e) => handleMouseDown(e, 'drag')}
        style={{ cursor: interaction === 'drag' ? 'grabbing' : 'grab' }}
      >
        {renderContent()}
        
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
}
