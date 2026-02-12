"use client";

import { useEditor } from "@/hooks/useEditor";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PropertiesGroup } from "./PropertiesGroup";
import { DrawingElement } from "@/lib/types";
import { Slider } from "../ui/slider";

export function DrawingProperties() {
  const { state, dispatch } = useEditor();
  const { selectedElement } = state;

  if (!selectedElement || selectedElement.type !== 'drawing') return null;

  const drawingElement = selectedElement as DrawingElement;

  const handleChange = (prop: string, value: any) => {
    const isNumeric = ['strokeWidth'].includes(prop);
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, [prop]: isNumeric ? parseFloat(value) || 0 : value } });
  };

  return (
    <PropertiesGroup title="Drawing">
        <div className="col-span-2">
            <Label className="text-xs">Stroke Color</Label>
            <div className="flex items-center gap-2">
                 <Input type="color" className="p-1 h-8 w-8" value={drawingElement.strokeColor} onChange={e => handleChange('strokeColor', e.target.value)} />
                 <Input type="text" value={drawingElement.strokeColor} onChange={e => handleChange('strokeColor', e.target.value)} />
            </div>
        </div>
        <div className="col-span-2 space-y-2">
          <Label className="text-xs">Stroke Width</Label>
          <div className="flex items-center gap-2">
              <Slider 
                  value={[drawingElement.strokeWidth]} 
                  onValueChange={value => handleChange('strokeWidth', value[0])} 
                  min={1} max={50} step={1} 
              />
              <span className="text-sm w-12 text-right">{drawingElement.strokeWidth}px</span>
          </div>
      </div>
    </PropertiesGroup>
  );
}
