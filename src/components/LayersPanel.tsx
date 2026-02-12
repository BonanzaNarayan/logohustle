"use client";

import { useEditor } from "@/hooks/useEditor";
import { LayerItem } from "./LayerItem";
import { useCallback } from "react";

export function LayersPanel() {
  const { state, dispatch } = useEditor();
  const { elements } = state;

  const moveLayer = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      // The elements array is ordered from bottom layer to top layer.
      // The UI displays layers from top to bottom.
      // We need to convert the UI indices to the original array indices.
      const totalElements = elements.length;
      const originalDragIndex = totalElements - 1 - dragIndex;
      const originalHoverIndex = totalElements - 1 - hoverIndex;
      
      dispatch({ type: "REORDER_ELEMENTS", payload: { dragIndex: originalDragIndex, hoverIndex: originalHoverIndex } });
    },
    [dispatch, elements.length]
  );
  
  // Reverse the elements array to display layers from top to bottom
  const reversedElements = [...elements].reverse();

  return (
    <div className="p-2 space-y-1">
      {reversedElements.length > 0 ? (
        reversedElements.map((element, index) => (
          <LayerItem
            key={element.id}
            index={index}
            element={element}
            moveLayer={moveLayer}
          />
        ))
      ) : (
        <p className="text-sm text-muted-foreground text-center p-4">The canvas is empty.</p>
      )}
    </div>
  );
}
