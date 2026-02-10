"use client";

import { createContext, useReducer, useEffect, ReactNode, Dispatch, useState } from "react";
import { CanvasElement } from "@/lib/types";
import { nanoid } from "nanoid";
import { Loader2 } from "lucide-react";

export type EditorState = {
  canvas: {
    width: number;
    height: number;
    backgroundType: 'solid' | 'gradient';
    background: string;
    gradient: {
      color1: string;
      color2: string;
      angle: number;
    };
    pattern: {
      type: 'none' | 'grid' | 'graph' | 'dots';
      color: string;
      opacity: number;
      scale: number;
      blur: number;
    };
    noise: {
      enabled: boolean;
      opacity: number;
    };
  };
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  clipboard: CanvasElement | null;
};

export type Action =
  | { type: "LOAD_STATE"; payload: EditorState }
  | { type: "ADD_ELEMENT"; payload: { type: CanvasElement['type']; data?: Partial<CanvasElement> } }
  | { type: "UPDATE_ELEMENT"; payload: Partial<CanvasElement> & { id: string } }
  | { type: "DELETE_ELEMENT"; payload: { id: string } }
  | { type: "SELECT_ELEMENT"; payload: { id: string | null } }
  | { type: "UPDATE_CANVAS"; payload: Partial<EditorState['canvas']> }
  | { type: 'COPY_ELEMENT' }
  | { type: 'PASTE_ELEMENT' }
  | { type: 'DUPLICATE_ELEMENT' };

const initialState: EditorState = {
  canvas: {
    width: 512,
    height: 512,
    backgroundType: 'solid',
    background: '#ffffff',
    gradient: {
      color1: '#ffffff',
      color2: '#d4d4d8',
      angle: 90,
    },
    pattern: {
      type: 'none',
      color: '#000000',
      opacity: 0.1,
      scale: 1,
      blur: 0,
    },
    noise: {
      enabled: false,
      opacity: 0.1,
    },
  },
  elements: [],
  selectedElement: null,
  clipboard: null,
};

function editorReducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case "LOAD_STATE": {
      const loadedState = action.payload;
      const mergedCanvas = {
          ...initialState.canvas,
          ...(loadedState.canvas || {}),
          gradient: { ...initialState.canvas.gradient, ...(loadedState.canvas?.gradient || {}) },
          pattern: { ...initialState.canvas.pattern, ...(loadedState.canvas?.pattern || {}) },
          noise: { ...initialState.canvas.noise, ...(loadedState.canvas?.noise || {}) },
      };
      return {
          ...initialState,
          ...loadedState,
          canvas: mergedCanvas,
          clipboard: null,
      };
    }
    case "ADD_ELEMENT": {
      const { type, data } = action.payload;
      const newElementDefaults = {
        id: nanoid(),
        x: state.canvas.width / 2 - 50,
        y: state.canvas.height / 2 - 50,
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 1,
      };

      let newElement: CanvasElement;

      switch(type) {
        case 'text':
          newElement = {
            ...newElementDefaults,
            type: 'text',
            content: "Hello World",
            fontFamily: "Inter",
            fontSize: 48,
            fontWeight: 400,
            color: "#000000",
            align: 'middle',
            width: 250,
            height: 60,
             ...data
          } as CanvasElement;
          break;
        case 'icon':
          newElement = {
            ...newElementDefaults,
            type: 'icon',
            name: "Smile",
            color: "#000000",
            ...data
          } as CanvasElement;
          break;
        case 'shape':
           newElement = {
            ...newElementDefaults,
            type: 'shape',
            shape: "rectangle",
            color: "#344054",
            strokeColor: 'transparent',
            strokeWidth: 0,
            ...data,
            ...(data?.shape === 'circle' && { width: 100, height: 100 }),
            ...(data?.shape === 'triangle' && { height: 87 }),
          } as CanvasElement;
          break;
        case 'image':
           newElement = {
            ...newElementDefaults,
            type: 'image',
            src: "",
            ...data
          } as CanvasElement;
           break;
        default:
          throw new Error("Invalid element type");
      }
      
      return {
        ...state,
        elements: [...state.elements, newElement],
        selectedElement: newElement,
      };
    }
    case "UPDATE_ELEMENT": {
      const updatedElements = state.elements.map((el) =>
        el.id === action.payload.id ? { ...el, ...action.payload } : el
      );
      return {
        ...state,
        elements: updatedElements,
        selectedElement: state.selectedElement && state.selectedElement.id === action.payload.id ? { ...state.selectedElement, ...action.payload } as CanvasElement : state.selectedElement
      };
    }
    case "DELETE_ELEMENT": {
        const filteredElements = state.elements.filter(el => el.id !== action.payload.id);
        return {
            ...state,
            elements: filteredElements,
            selectedElement: state.selectedElement && state.selectedElement.id === action.payload.id ? null : state.selectedElement
        };
    }
    case "SELECT_ELEMENT": {
      const selected = state.elements.find((el) => el.id === action.payload.id) || null;
      return {
        ...state,
        selectedElement: selected,
      };
    }
    case "UPDATE_CANVAS": {
        return {
            ...state,
            canvas: { ...state.canvas, ...action.payload },
        };
    }
    case 'COPY_ELEMENT': {
        if (!state.selectedElement) return state;
        return {
            ...state,
            clipboard: { ...state.selectedElement }
        };
    }
    case 'PASTE_ELEMENT': {
        if (!state.clipboard) return state;
        const newElement = {
            ...state.clipboard,
            id: nanoid(),
            x: state.clipboard.x + 20,
            y: state.clipboard.y + 20,
        };
        return {
            ...state,
            elements: [...state.elements, newElement],
            selectedElement: newElement
        };
    }
    case 'DUPLICATE_ELEMENT': {
        if (!state.selectedElement) return state;
        const newElement = {
            ...state.selectedElement,
            id: nanoid(),
            x: state.selectedElement.x + 20,
            y: state.selectedElement.y + 20,
        };
        return {
            ...state,
            elements: [...state.elements, newElement],
            selectedElement: newElement
        };
    }
    default:
      return state;
  }
}

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: Dispatch<Action>;
} | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("logoForgeState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: "LOAD_STATE", payload: parsedState });
      } catch (e) {
        console.error("Failed to parse saved state:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded) {
      const stateToSave = { ...state, clipboard: null, selectedElement: null };
      localStorage.setItem("logoForgeState", JSON.stringify(stateToSave));
    }
  }, [state, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}
