"use client";

import { useEffect } from "react";
import { EditorProvider } from "@/contexts/EditorContext";
import { useEditor } from "@/hooks/useEditor";
import { Toolbar } from "./Toolbar";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { Canvas } from "./Canvas";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function EditorUI() {
    const { state, dispatch } = useEditor();
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeElement = document.activeElement;
            const isTextInput = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA' || 
                (activeElement as HTMLElement).isContentEditable
            );
            
            if (isTextInput) return;

            if ((e.key === "Delete" || e.key === "Backspace") && state.selectedElement) {
                e.preventDefault();
                dispatch({ type: 'DELETE_ELEMENT', payload: { id: state.selectedElement.id } });
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'c' && state.selectedElement) {
                e.preventDefault();
                dispatch({ type: 'COPY_ELEMENT' });
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
                e.preventDefault();
                dispatch({ type: 'PASTE_ELEMENT' });
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'd' && state.selectedElement) {
                e.preventDefault();
                dispatch({ type: 'DUPLICATE_ELEMENT' });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dispatch, state.selectedElement]);

    return (
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
    );
}


export function EditorLayout() {
  return (
    <EditorProvider>
      <DndProvider backend={HTML5Backend}>
        <EditorUI />
      </DndProvider>
    </EditorProvider>
  );
}
