"use client";

import { EditorContext } from "@/contexts/EditorContext";
import { useContext } from "react";

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
