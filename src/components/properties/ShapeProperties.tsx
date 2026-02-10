"use client";

import { useEditor } from "@/hooks/useEditor";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PropertiesGroup } from "./PropertiesGroup";
import { ShapeElement } from "@/lib/types";

export function ShapeProperties() {
  const { state, dispatch } = useEditor();
  const { selectedElement } = state;

  if (!selectedElement || selectedElement.type !== 'shape') return null;

  const shapeElement = selectedElement as ShapeElement;

  const handleChange = (prop: string, value: any) => {
    const isNumeric = ['strokeWidth'].includes(prop);
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, [prop]: isNumeric ? parseFloat(value) || 0 : value } });
  };

  return (
    <PropertiesGroup title="Shape">
        <div>
            <Label className="text-xs">Stroke Width</Label>
            <Input type="number" min={0} value={shapeElement.strokeWidth} onChange={e => handleChange('strokeWidth', e.target.value)} />
        </div>
        <div className="col-span-2">
            <Label className="text-xs">Stroke Color</Label>
            <div className="flex items-center gap-2">
                 <Input type="color" className="p-1 h-8 w-8" value={shapeElement.strokeColor} onChange={e => handleChange('strokeColor', e.target.value)} />
                 <Input type="text" value={shapeElement.strokeColor} onChange={e => handleChange('strokeColor', e.target.value)} />
            </div>
        </div>
    </PropertiesGroup>
  );
}
