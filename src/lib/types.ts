export type ElementType = 'text' | 'icon' | 'shape' | 'image' | 'path';

export type Position = { x: number; y: number };

export type Dimension = { width: number; height: number };

export type Shadow = {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
};

export type BaseElement = {
  id: string;
  type: ElementType;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  shadow: Shadow;
  flipHorizontal: boolean;
  flipVertical: boolean;
};

export type TextElement = BaseElement & {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fill: string;
  align: 'start' | 'middle' | 'end';
  strokeColor: string;
  strokeWidth: number;
  backgroundColor: string;
  borderRadius: number;
};

export type IconElement = BaseElement & {
  type: 'icon';
  iconName: string;
  strokeColor: string;
  fill: string;
  strokeWidth: number;
};

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'star' | 'hexagon';
export type ShapeElement = BaseElement & {
  type: 'shape';
  shape: ShapeType;
  fill: string;
  strokeWidth: number;
  strokeColor: string;
};

export type ImageElement = BaseElement & {
  type: 'image';
  src: string;
};

export type PathElement = BaseElement & {
    type: 'path';
    pathData: string;
    strokeColor: string;
    strokeWidth: number;
};

export type CanvasElement = TextElement | IconElement | ShapeElement | ImageElement | PathElement;
