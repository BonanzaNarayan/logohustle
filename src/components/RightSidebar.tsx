"use client";

import { useEditor } from "@/hooks/useEditor";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { TransformProperties } from "./properties/TransformProperties";
import { StyleProperties } from "./properties/StyleProperties";
import { TextProperties } from "./properties/TextProperties";

export function RightSidebar() {
  const { state, dispatch } = useEditor();
  const { selectedElement } = state;

  const handleDelete = () => {
    if(selectedElement) {
      dispatch({ type: 'DELETE_ELEMENT', payload: { id: selectedElement.id } });
    }
  }

  return (
    <aside className="w-[300px] bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Properties</h2>
      </div>
      <ScrollArea className="flex-1">
        {selectedElement ? (
          <div className="p-4 space-y-6">
            <TransformProperties />
            <StyleProperties />
            {selectedElement.type === 'text' && <TextProperties />}
            
            <Button variant="destructive" className="w-full" onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" />
              Delete Element
            </Button>
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground h-full flex items-center justify-center">
            <p>Select an element to see its properties.</p>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
