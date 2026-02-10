"use client";

import { useEditor } from "@/hooks/useEditor";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PropertiesGroup } from "./PropertiesGroup";

export function TransformProperties() {
  const { state, dispatch } = useEditor();
  const { selectedElement } = state;

  if (!selectedElement) return null;

  const handleChange = (prop: string, value: any) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, [prop]: parseFloat(value) || 0 } });
  };

  return (
    <PropertiesGroup title="Transform">
        <div>
            <Label className="text-xs">X</Label>
            <Input type="number" value={Math.round(selectedElement.x)} onChange={e => handleChange('x', e.target.value)} />
        </div>
        <div>
            <Label className="text-xs">Y</Label>
            <Input type="number" value={Math.round(selectedElement.y)} onChange={e => handleChange('y', e.target.value)} />
        </div>
        <div>
            <Label className="text-xs">Width</Label>
            <Input type="number" value={Math.round(selectedElement.width)} onChange={e => handleChange('width', e.target.value)} />
        </div>
        <div>
            <Label className="text-xs">Height</Label>
            <Input type="number" value={Math.round(selectedElement.height)} onChange={e => handleChange('height', e.target.value)} />
        </div>
        <div className="col-span-2">
            <Label className="text-xs">Rotation</Label>
            <Input type="number" value={Math.round(selectedElement.rotation)} onChange={e => handleChange('rotation', e.target.value)} />
        </div>
    </PropertiesGroup>
  );
}
