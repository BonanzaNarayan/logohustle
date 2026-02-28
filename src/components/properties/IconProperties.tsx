"use client";

import { useEditor } from "@/hooks/useEditor";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PropertiesGroup } from "./PropertiesGroup";
import { IconElement } from "@/lib/types";

export function IconProperties() {
  const { state, dispatch } = useEditor();
  const { selectedElement } = state;

  if (!selectedElement || selectedElement.type !== 'icon') return null;

  const iconElement = selectedElement as IconElement;

  const handleChange = (prop: string, value: any) => {
    const isNumeric = ['strokeWidth'].includes(prop);
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, [prop]: isNumeric ? parseFloat(value) || 0 : value } });
  };

  return (
    <PropertiesGroup title="Icon Stroke">
        <div className="col-span-2">
            <Label className="text-xs">Stroke Color</Label>
            <div className="flex items-center gap-2">
                 <Input type="color" className="p-1 h-8 w-8" value={iconElement.strokeColor} onChange={e => handleChange('strokeColor', e.target.value)} />
                 <Input type="text" value={iconElement.strokeColor} onChange={e => handleChange('strokeColor', e.target.value)} />
            </div>
        </div>
        <div>
            <Label className="text-xs">Stroke Width</Label>
            <Input type="number" min={0} value={iconElement.strokeWidth} onChange={e => handleChange('strokeWidth', e.target.value)} />
        </div>
    </PropertiesGroup>
  );
}
