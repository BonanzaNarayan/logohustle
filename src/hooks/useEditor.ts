"use client";

import { EditorContext } from "@/contexts/EditorContext";
import { useContext } from "react";

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  
  const { 
    state, 
    dispatch, 
    isSnapping, 
    setIsSnapping, 
    snapLines, 
    setSnapLines,
  } = context;

  const { history, historyIndex, clipboard } = state;
  const present = history[historyIndex];

  return {
    state: present,
    dispatch,
    clipboard,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    isSnapping,
    setIsSnapping,
    snapLines,
    setSnapLines,
  };
};
