"use client";

import { useEditor } from "@/hooks/useEditor";
import { ElementInteraction } from "./ElementInteraction";
import { useState, useRef } from "react";

export function Canvas() {
  const { state, dispatch, snapLines, isDrawingMode, brush, setIsDrawingMode } = useEditor();
  const { canvas, elements } = state;

  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const isDrawing = useRef(false);

  const getSVGPoint = (e: React.MouseEvent | MouseEvent, svg: SVGSVGElement) => {
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (ctm) {
      return point.matrixTransform(ctm.inverse());
    }
    return point;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawingMode) {
      isDrawing.current = true;
      const point = getSVGPoint(e, e.currentTarget);
      setCurrentPath(`M ${point.x} ${point.y}`);
      e.preventDefault();
      e.stopPropagation();
    } else {
      // If an element is clicked, propagation is stopped in ElementInteraction.
      // So this will only fire for clicks on the canvas background.
      dispatch({ type: "SELECT_ELEMENT", payload: { id: null } });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawingMode && isDrawing.current && currentPath) {
      const point = getSVGPoint(e, e.currentTarget);
      setCurrentPath((prev) => prev + ` L ${point.x} ${point.y}`);
      e.preventDefault();
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawingMode && isDrawing.current && currentPath) {
      isDrawing.current = false;

      // To get an accurate bounding box, we have to temporarily add it to the DOM
      const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      tempPath.setAttribute("d", currentPath);
      const bbox = tempPath.getBBox();

      if (bbox.width > 0 || bbox.height > 0) {
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            type: 'drawing',
            data: {
              pathData: currentPath,
              strokeColor: brush.color,
              strokeWidth: brush.strokeWidth,
              opacity: brush.opacity,
              x: bbox.x,
              y: bbox.y,
              width: bbox.width,
              height: bbox.height,
              pathOffsetX: bbox.x,
              pathOffsetY: bbox.y,
            }
          }
        });
      }
      
      setCurrentPath(null);
      e.preventDefault();
    }
  };
  
  const handleMouseLeave = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawingMode && isDrawing.current) {
        handleCanvasMouseUp(e);
    }
  }

  return (
    <div
      className="shadow-lg rounded-lg overflow-hidden"
    >
      <svg
        id="logo-canvas"
        width={canvas.width}
        height={canvas.height}
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDrawingMode ? 'crosshair' : 'default' }}
      >
        <defs>
          {canvas.backgroundType === 'gradient' && (
            <linearGradient id="background-gradient" gradientTransform={`rotate(${canvas.gradient.angle}, 0.5, 0.5)`}>
              <stop offset="0%" stopColor={canvas.gradient.color1} />
              <stop offset="100%" stopColor={canvas.gradient.color2} />
            </linearGradient>
          )}
          {canvas.pattern.type === 'grid' && (
            <pattern id="pattern-grid" patternUnits="userSpaceOnUse" width={20 * canvas.pattern.scale} height={20 * canvas.pattern.scale}>
                <path d={`M ${20 * canvas.pattern.scale} 0 L 0 0 0 ${20 * canvas.pattern.scale}`} fill="none" stroke={canvas.pattern.color} strokeWidth="1"/>
            </pattern>
          )}
          {canvas.pattern.type === 'graph' && (
            <pattern id="pattern-graph" patternUnits="userSpaceOnUse" width={10 * canvas.pattern.scale} height={10 * canvas.pattern.scale}>
                <path d={`M ${10 * canvas.pattern.scale} 0 L 0 0 0 ${10 * canvas.pattern.scale}`} fill="none" stroke={canvas.pattern.color} strokeWidth="0.5"/>
            </pattern>
          )}
          {canvas.pattern.type === 'dots' && (
             <pattern id="pattern-dots" patternUnits="userSpaceOnUse" width={10 * canvas.pattern.scale} height={10 * canvas.pattern.scale}>
                <circle cx={5 * canvas.pattern.scale} cy={5 * canvas.pattern.scale} r={1 * canvas.pattern.scale} fill={canvas.pattern.color} />
            </pattern>
          )}
          {elements.map(element => {
            if ('shadow' in element && element.shadow.enabled) {
                return (
                    <filter key={`shadow-${element.id}`} id={`shadow-${element.id}`}>
                        <feDropShadow
                            dx={element.shadow.offsetX}
                            dy={element.shadow.offsetY}
                            stdDeviation={element.shadow.blur}
                            floodColor={element.shadow.color}
                            floodOpacity={element.shadow.opacity}
                        />
                    </filter>
                )
            }
            return null;
          })}
          {canvas.noise.enabled && (
            <filter id="noise-filter">
                <feTurbulence 
                    type="fractalNoise" 
                    baseFrequency="0.65" 
                    numOctaves="1" 
                    stitchTiles="stitch"
                />
            </filter>
          )}
        </defs>

        <rect
          width="100%"
          height="100%"
          fill={canvas.backgroundType === 'solid' ? canvas.background : 'url(#background-gradient)'}
        />

        {canvas.pattern.type !== 'none' && (
          <rect
            width="100%"
            height="100%"
            fill={`url(#pattern-${canvas.pattern.type})`}
            opacity={canvas.pattern.opacity}
            style={{ filter: `blur(${canvas.pattern.blur}px)` }}
          />
        )}
        
        {canvas.noise.enabled && (
          <rect 
            width="100%" 
            height="100%" 
            filter="url(#noise-filter)" 
            opacity={canvas.noise.opacity} 
            style={{ mixBlendMode: 'soft-light' }} 
          />
        )}

        {elements.map((element) => (
          <ElementInteraction key={element.id} element={element}>
            {/* The actual rendering is handled inside ElementInteraction for simplicity */}
          </ElementInteraction>
        ))}

        {snapLines.x.map((x, i) => (
          <line key={`snap-x-${i}`} x1={x} y1={0} x2={x} y2={canvas.height} stroke="hsl(var(--ring))" strokeWidth="1" strokeDasharray="3,3" />
        ))}
        {snapLines.y.map((y, i) => (
          <line key={`snap-y-${i}`} x1={0} y1={y} x2={canvas.width} y2={y} stroke="hsl(var(--ring))" strokeWidth="1" strokeDasharray="3,3" />
        ))}
        
        {currentPath && (
            <path
                d={currentPath}
                stroke={brush.color}
                strokeWidth={brush.strokeWidth}
                opacity={brush.opacity}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pointerEvents: 'none' }}
            />
        )}
      </svg>
    </div>
  );
}
