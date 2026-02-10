"use client";

import { useEditor } from "@/hooks/useEditor";
import { ElementInteraction } from "./ElementInteraction";

export function Canvas() {
  const { state, dispatch } = useEditor();
  const { canvas, elements } = state;

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target === e.currentTarget) {
      dispatch({ type: 'SELECT_ELEMENT', payload: { id: null } });
    }
  };

  return (
    <div
      className="shadow-lg rounded-lg overflow-hidden"
      style={{
        width: canvas.width,
        height: canvas.height,
        backgroundColor: canvas.background,
      }}
    >
      <svg
        width={canvas.width}
        height={canvas.height}
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        onClick={handleCanvasClick}
      >
        {elements.map((element) => (
          <ElementInteraction key={element.id} element={element}>
            {/* The actual rendering is handled inside ElementInteraction for simplicity */}
          </ElementInteraction>
        ))}
      </svg>
    </div>
  );
}
