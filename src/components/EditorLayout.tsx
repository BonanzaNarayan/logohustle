"use client";

import { EditorProvider } from "@/contexts/EditorContext";
import { Toolbar } from "./Toolbar";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { Canvas } from "./Canvas";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


export function EditorLayout() {
  return (
    <EditorProvider>
        <div className="flex h-dvh w-full flex-col bg-background text-foreground">
          <Toolbar />
          <div className="flex flex-1 overflow-hidden">
            <LeftSidebar />
            <main className="flex-1 relative flex items-center justify-center overflow-auto p-4 bg-muted/40">
              <Canvas />
            </main>
            <RightSidebar />
          </div>
        </div>
    </EditorProvider>
  );
}
