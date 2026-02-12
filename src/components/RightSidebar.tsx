"use client";

import { useEditor } from "@/hooks/useEditor";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { TransformProperties } from "./properties/TransformProperties";
import { StyleProperties } from "./properties/StyleProperties";
import { TextProperties } from "./properties/TextProperties";
import { ShapeProperties } from "./properties/ShapeProperties";
import { CanvasBackgroundProperties } from "./properties/CanvasBackgroundProperties";
import { IconProperties } from "./properties/IconProperties";
import { PathProperties } from "./properties/PathProperties";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LayersPanel } from "./LayersPanel";

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
       <Tabs defaultValue="properties" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 rounded-none h-16 bg-transparent border-b border-border">
            <TabsTrigger value="properties" className="h-full text-muted-foreground data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-none">Properties</TabsTrigger>
            <TabsTrigger value="layers" className="h-full text-muted-foreground data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-none">Layers</TabsTrigger>
        </TabsList>
        <TabsContent value="properties" className="flex-1 flex flex-col mt-0 overflow-hidden">
            <ScrollArea className="flex-1">
              {selectedElement ? (
                <div className="p-4 space-y-6">
                  <TransformProperties />
                  <StyleProperties />
                  {selectedElement.type === 'text' && <TextProperties />}
                  {selectedElement.type === 'shape' && <ShapeProperties />}
                  {selectedElement.type === 'icon' && <IconProperties />}
                  {selectedElement.type === 'path' && <PathProperties />}
                  
                  <Button variant="destructive" className="w-full" onClick={handleDelete}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Element
                  </Button>
                </div>
              ) : (
                <CanvasBackgroundProperties />
              )}
            </ScrollArea>
        </TabsContent>
        <TabsContent value="layers" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <LayersPanel />
            </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
