"use client";

import { useEditor } from "@/hooks/useEditor";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PropertiesGroup } from "./PropertiesGroup";
import { Slider } from "../ui/slider";

export function StyleProperties() {
  const { state, dispatch } = useEditor();
  const { selectedElement } = state;

  if (!selectedElement) return null;
  if (!('color' in selectedElement) && !('opacity' in selectedElement)) return null;

  const handleChange = (prop: string, value: any) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, [prop]: value } });
  };
  
  const handleOpacityChange = (value: number[]) => {
     dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, opacity: value[0] } });
  }

  return (
    <PropertiesGroup title="Styling">
      {'color' in selectedElement && (
         <div className="col-span-2">
            <Label className="text-xs">Color</Label>
            <div className="flex items-center gap-2">
                 <Input type="color" className="p-1 h-8 w-8" value={selectedElement.color} onChange={e => handleChange('color', e.target.value)} />
                <Input type="text" value={selectedElement.color} onChange={e => handleChange('color', e.target.value)} />
            </div>
        </div>
      )}
      {'opacity' in selectedElement && (
        <div className="col-span-2 space-y-2">
            <Label className="text-xs">Opacity</Label>
            <div className="flex items-center gap-2">
                <Slider 
                    value={[selectedElement.opacity]}
                    onValueChange={handleOpacityChange}
                    max={1}
                    step={0.01}
                />
                <span className="text-sm w-12 text-right">{Math.round(selectedElement.opacity * 100)}%</span>
            </div>
        </div>
      )}
    </PropertiesGroup>
  );
}
