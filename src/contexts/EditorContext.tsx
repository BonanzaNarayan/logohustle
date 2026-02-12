"use client";

import { createContext, useReducer, useEffect, ReactNode, Dispatch, useState, SetStateAction } from "react";
import { CanvasElement, IconElement, ShapeElement, TextElement, ImageElement, DrawingElement } from "@/lib/types";
import { nanoid } from "nanoid";
import { Loader2 } from "lucide-react";

// This is the state that gets tracked in the undo/redo history
export type EditorCoreState = {
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
};

// This is the full state of the editor, including history
export type EditorState = {
  history: EditorCoreState[];
  historyIndex: number;
  clipboard: CanvasElement | null;
};

export type Action =
  | { type: "LOAD_STATE"; payload: Partial<EditorCoreState> }
  | { type: "ADD_ELEMENT"; payload: { type: CanvasElement['type']; data?: Partial<CanvasElement> } }
  | { type: "UPDATE_ELEMENT"; payload: Partial<CanvasElement> & { id: string } }
  | { type: "DELETE_ELEMENT"; payload: { id: string } }
  | { type: "SELECT_ELEMENT"; payload: { id: string | null } }
  | { type: "UPDATE_CANVAS"; payload: Partial<EditorCoreState['canvas']> }
  | { type: 'COPY_ELEMENT' }
  | { type: 'PASTE_ELEMENT' }
  | { type: 'DUPLICATE_ELEMENT' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_CANVAS' }
  | { type: 'REORDER_ELEMENTS', payload: { dragIndex: number, hoverIndex: number } };

const initialCanvasState = {
  width: 512,
  height: 512,
  backgroundType: 'solid',
  background: '#111827',
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
};

const initialCoreState: EditorCoreState = {
  canvas: initialCanvasState,
  elements: [],
  selectedElement: null,
};

const initialState: EditorState = {
  history: [initialCoreState],
  historyIndex: 0,
  clipboard: null,
};

function editorReducer(state: EditorState, action: Action): EditorState {
  const { history, historyIndex, clipboard } = state;
  const present = history[historyIndex];

  switch (action.type) {
    case "LOAD_STATE": {
      const loadedState = action.payload;
      const mergedCanvas = {
          ...initialCanvasState,
          ...(loadedState.canvas || {}),
          gradient: { ...initialCanvasState.gradient, ...(loadedState.canvas?.gradient || {}) },
          pattern: { ...initialCanvasState.pattern, ...(loadedState.canvas?.pattern || {}) },
          noise: { ...initialCanvasState.noise, ...(loadedState.canvas?.noise || {}) },
      };
      const newCoreState: EditorCoreState = {
          ...initialCoreState,
          canvas: mergedCanvas,
          elements: loadedState.elements || [],
      }
      return {
          ...initialState,
          history: [newCoreState],
      };
    }

    case 'UNDO':
      return {
        ...state,
        historyIndex: Math.max(0, historyIndex - 1),
      };

    case 'REDO':
      return {
        ...state,
        historyIndex: Math.min(history.length - 1, historyIndex + 1),
      };

    case 'SELECT_ELEMENT': {
      const selected = present.elements.find((el) => el.id === action.payload.id) || null;
      if (present.selectedElement?.id === selected?.id) return state;

      const newPresent = { ...present, selectedElement: selected };
      const newHistory = [...history];
      newHistory[historyIndex] = newPresent;
      return {
        ...state,
        history: newHistory,
      };
    }

    case 'COPY_ELEMENT': {
      if (!present.selectedElement) return state;
      return { ...state, clipboard: { ...present.selectedElement } };
    }

    default: {
      // All other actions create a new history entry
      let newPresent = { ...present };

      switch(action.type) {
        case "ADD_ELEMENT": {
          const { type, data } = action.payload;
          const newElementDefaults = {
            id: nanoid(),
            x: newPresent.canvas.width / 2 - 50,
            y: newPresent.canvas.height / 2 - 50,
            width: 100,
            height: 100,
            rotation: 0,
            opacity: 1,
            shadow: {
              enabled: false,
              color: '#000000',
              blur: 5,
              offsetX: 5,
              offsetY: 5,
              opacity: 0.5,
            },
          };

          let newElement: CanvasElement;

          switch(type) {
            case 'text':
              newElement = { ...newElementDefaults, type: 'text', content: "Hello World", fontFamily: "Inter", fontSize: 48, fontWeight: 400, fill: "#ffffff", align: 'middle', strokeColor: 'transparent', strokeWidth: 0, width: 250, height: 60, backgroundColor: 'transparent', borderRadius: 0, ...data } as TextElement;
              break;
            case 'icon': {
              const iconIdentifier = (data as any)?.name || "Smile";
              const { name: ignoredName, ...restOfData } = (data || {}) as { name?: string } & Partial<IconElement>;

              newElement = {
                ...newElementDefaults,
                type: 'icon',
                iconName: iconIdentifier,
                name: iconIdentifier, // This is BaseElement.name
                strokeColor: "#ffffff",
                fill: 'none',
                strokeWidth: 2,
                ...restOfData,
              } as IconElement;
              break;
            }
            case 'shape':
              newElement = { ...newElementDefaults, type: 'shape', shape: "rectangle", fill: "#ffffff", strokeColor: "transparent", strokeWidth: 0, ...data, ...(data?.shape === 'circle' && { width: 100, height: 100 }), ...(data?.shape === 'triangle' && { height: 87 }), ...(data?.shape === 'star' && { width: 100, height: 100 }), ...(data?.shape === 'hexagon' && { height: 87 }) } as ShapeElement;
              break;
            case 'image':
              newElement = { ...newElementDefaults, type: 'image', src: "", ...data } as ImageElement;
              break;
            case 'drawing':
              newElement = { ...newElementDefaults, type: 'drawing', pathData: '', strokeColor: '#ffffff', strokeWidth: 5, pathOffsetX: 0, pathOffsetY: 0, ...data } as DrawingElement;
              break;
            default:
              throw new Error("Invalid element type");
          }
          
          newPresent = {
            ...newPresent,
            elements: [...newPresent.elements, newElement],
            selectedElement: newElement,
          };
          break;
        }
        case "UPDATE_ELEMENT": {
          const updatedElements = newPresent.elements.map((el) =>
            el.id === action.payload.id ? { ...el, ...action.payload } : el
          );
          newPresent = {
            ...newPresent,
            elements: updatedElements,
            selectedElement: newPresent.selectedElement && newPresent.selectedElement.id === action.payload.id ? { ...newPresent.selectedElement, ...action.payload } as CanvasElement : newPresent.selectedElement
          };
          break;
        }
        case "DELETE_ELEMENT": {
          const filteredElements = newPresent.elements.filter(el => el.id !== action.payload.id);
          newPresent = {
            ...newPresent,
            elements: filteredElements,
            selectedElement: newPresent.selectedElement && newPresent.selectedElement.id === action.payload.id ? null : newPresent.selectedElement
          };
          break;
        }
        case "UPDATE_CANVAS": {
          newPresent = {
            ...newPresent,
            canvas: { ...newPresent.canvas, ...action.payload },
          };
          break;
        }
        case 'PASTE_ELEMENT': {
          if (!clipboard) return state;
          const newElement = {
            ...clipboard,
            id: nanoid(),
            x: clipboard.x + 20,
            y: clipboard.y + 20,
          };
          newPresent = {
            ...newPresent,
            elements: [...newPresent.elements, newElement],
            selectedElement: newElement
          };
          break;
        }
        case 'DUPLICATE_ELEMENT': {
          if (!present.selectedElement) return state;
          const newElement = {
            ...present.selectedElement,
            id: nanoid(),
            x: present.selectedElement.x + 20,
            y: present.selectedElement.y + 20,
          };
          newPresent = {
            ...newPresent,
            elements: [...newPresent.elements, newElement],
            selectedElement: newElement
          };
          break;
        }
        case 'CLEAR_CANVAS': {
            newPresent = {
                ...newPresent,
                elements: [],
                selectedElement: null,
            };
            break;
        }
        case 'REORDER_ELEMENTS': {
          const { dragIndex, hoverIndex } = action.payload;

          if (dragIndex < 0 || dragIndex >= newPresent.elements.length || hoverIndex < 0 || hoverIndex >= newPresent.elements.length) {
            break; 
          }

          const newElements = [...newPresent.elements];
          const [draggedItem] = newElements.splice(dragIndex, 1);
          newElements.splice(hoverIndex, 0, draggedItem);
          
          newPresent = {
              ...newPresent,
              elements: newElements,
          };
          break;
        }
      }

      if (newPresent === present) {
        return state;
      }
      
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newPresent);
      
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }
  }
}

type BrushState = { color: string; strokeWidth: number; opacity: number };

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: Dispatch<Action>;
  isSnapping: boolean;
  setIsSnapping: (isSnapping: boolean) => void;
  snapLines: { x: number[]; y: number[] };
  setSnapLines: Dispatch<SetStateAction<{ x: number[]; y: number[] }>>;
  isDrawingMode: boolean;
  setIsDrawingMode: (isDrawingMode: boolean) => void;
  brush: BrushState;
  setBrush: Dispatch<SetStateAction<BrushState>>;
} | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSnapping, setIsSnapping] = useState(true);
  const [snapLines, setSnapLines] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [brush, setBrush] = useState<BrushState>({ color: '#ffffff', strokeWidth: 5, opacity: 1 });


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
      const presentState = state.history[state.historyIndex];
      const stateToSave = { ...presentState, selectedElement: null };
      localStorage.setItem("logoForgeState", JSON.stringify(stateToSave));
    }
  }, [state, isLoaded]);

  useEffect(() => {
    if (state.selectedElement) {
        setIsDrawingMode(false);
    }
  }, [state.selectedElement])

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <EditorContext.Provider value={{ 
        state, 
        dispatch, 
        isSnapping, 
        setIsSnapping, 
        snapLines, 
        setSnapLines,
        isDrawingMode,
        setIsDrawingMode,
        brush,
        setBrush,
    }}>
      {children}
    </EditorContext.Provider>
  );
}
