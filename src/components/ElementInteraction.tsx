"use client";

import React, { useState, useEffect } from "react";
import { CanvasElement, TextElement, IconElement, ShapeElement, ImageElement } from "@/lib/types";
import { useEditor } from "@/hooks/useEditor";
import { LucideIcon } from "@/lib/lucide-icons";

interface ElementInteractionProps {
  element: CanvasElement;
  children: React.ReactNode;
}

const renderElement = (element: CanvasElement) => {
    switch (element.type) {
      case 'text':
        const textEl = element as TextElement;
        return (
          <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor={textEl.align === 'center' ? 'middle' : (textEl.align === 'left' ? 'start' : 'end')}
            fontFamily={textEl.fontFamily}
            fontSize={textEl.fontSize}
            fontWeight={textEl.fontWeight}
            fill={textEl.color}
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          >
            {textEl.content}
          </text>
        );
      case 'icon':
        const iconEl = element as IconElement;
        return <LucideIcon name={iconEl.name} color={iconEl.color} size="100%" />;
      case 'shape':
        const shapeEl = element as ShapeElement;
        if (shapeEl.shape === 'rectangle') {
            return <rect width="100%" height="100%" fill={shapeEl.color} stroke={shapeEl.strokeColor} strokeWidth={shapeEl.strokeWidth} />
        }
        if (shapeEl.shape === 'circle') {
            return <circle cx="50%" cy="50%" r="50%" fill={shapeEl.color} stroke={shapeEl.strokeColor} strokeWidth={shapeEl.strokeWidth} />
        }
        return null;
    case 'image':
        const imageEl = element as ImageElement;
        return <image href={imageEl.src} width="100%" height="100%" />;
      default:
        return null;
    }
  };


export function ElementInteraction({ element }: { element: CanvasElement }) {
  const { state, dispatch } = useEditor();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const isSelected = state.selectedElement?.id === element.id;

  const handleMouseDown = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    dispatch({ type: 'SELECT_ELEMENT', payload: { id: element.id } });
    setIsDragging(true);
    const svgPoint = getSVGPoint(e);
    setDragStart({ x: svgPoint.x - element.x, y: svgPoint.y - element.y });
  };

  const getSVGPoint = (e: MouseEvent | React.MouseEvent) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (svg) {
        let point = svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        point = point.matrixTransform(svg.getScreenCTM()?.inverse());
        return point;
    }
    return { x: 0, y: 0 };
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const svgPoint = getSVGPoint(e);
        dispatch({
          type: 'UPDATE_ELEMENT',
          payload: { id: element.id, x: svgPoint.x - dragStart.x, y: svgPoint.y - dragStart.y },
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, dispatch, element.id]);


  return (
    <g
      transform={`translate(${element.x}, ${element.y}) rotate(${element.rotation} ${element.width / 2} ${element.height / 2})`}
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      opacity={element.opacity}
    >
      <foreignObject x={0} y={0} width={element.width} height={element.height} style={{pointerEvents: 'none'}}>
         <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {renderElement(element)}
         </div>
      </foreignObject>

      {isSelected && (
        <>
          <rect
            x={-2}
            y={-2}
            width={element.width + 4}
            height={element.height + 4}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="5,5"
            pointerEvents="none"
          />
        </>
      )}
    </g>
  );
}
