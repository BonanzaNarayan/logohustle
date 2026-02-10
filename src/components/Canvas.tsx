"use client";

import { useEditor } from "@/hooks/useEditor";
import { ElementInteraction } from "./ElementInteraction";

export function Canvas() {
  const { state, dispatch } = useEditor();
  const { canvas, elements } = state;

  const handleCanvasMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // If an element is clicked, propagation is stopped in ElementInteraction.
    // So this will only fire for clicks on the canvas background.
    dispatch({ type: 'SELECT_ELEMENT', payload: { id: null } });
  };

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
      </svg>
    </div>
  );
}
