"use client";

import { useEditor } from "@/hooks/useEditor";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PropertiesGroup } from "./PropertiesGroup";
import { Button } from "../ui/button";
import { FlipHorizontal, FlipVertical } from "lucide-react";

export function TransformProperties() {
  const { state, dispatch } = useEditor();
  const { selectedElement } = state;

  if (!selectedElement) return null;

  const handleChange = (prop: string, value: any) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, [prop]: parseFloat(value) || 0 } });
  };
  
  const handleFlip = (axis: 'horizontal' | 'vertical') => {
    if (!selectedElement) return;
    if (axis === 'horizontal') {
        dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, flipHorizontal: !selectedElement.flipHorizontal } });
    } else {
        dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, flipVertical: !selectedElement.flipVertical } });
    }
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
        <div className="col-span-2 flex items-center gap-2">
            <Button variant="outline" className="w-full" onClick={() => handleFlip('horizontal')}>
                <FlipHorizontal className="mr-2 h-4 w-4" />
                Flip Horizontal
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleFlip('vertical')}>
                <FlipVertical className="mr-2 h-4 w-4" />
                Flip Vertical
            </Button>
        </div>
    </PropertiesGroup>
  );
}
