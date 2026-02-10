export type ElementType = 'text' | 'icon' | 'shape' | 'image';

export type Position = { x: number; y: number };

export type Dimension = { width: number; height: number };

export type BaseElement = {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
};

export type TextElement = BaseElement & {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  align: 'left' | 'center' | 'right';
};

export type IconElement = BaseElement & {
  type: 'icon';
  name: string;
  color: string;
};

export type ShapeType = 'rectangle' | 'circle' | 'triangle';
export type ShapeElement = BaseElement & {
  type: 'shape';
  shape: ShapeType;
  color: string;
  strokeWidth: number;
  strokeColor: string;
};

export type ImageElement = BaseElement & {
  type: 'image';
  src: string;
};

export type CanvasElement = TextElement | IconElement | ShapeElement | ImageElement;
