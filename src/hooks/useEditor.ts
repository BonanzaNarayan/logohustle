"use client";

import { EditorContext, EditorState } from "@/contexts/EditorContext";
import { useContext } from "react";

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  
  const { state, dispatch } = context;
  const { history, historyIndex, clipboard } = state;
  const present = history[historyIndex];

  return {
    state: present,
    dispatch,
    clipboard,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
};
