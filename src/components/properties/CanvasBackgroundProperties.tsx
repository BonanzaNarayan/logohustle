"use client";

import { useEditor } from "@/hooks/useEditor";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PropertiesGroup } from "./PropertiesGroup";

export function CanvasBackgroundProperties() {
  const { state, dispatch } = useEditor();
  const { canvas } = state;

  const handleChange = (prop: string, value: any) => {
    dispatch({ type: 'UPDATE_CANVAS', payload: { [prop]: value } });
  };

  return (
    <div className="p-4 space-y-6">
        <PropertiesGroup title="Canvas">
            <div className="col-span-2">
                <Label className="text-xs">Background Color</Label>
                <div className="flex items-center gap-2">
                    <Input type="color" className="p-1 h-8 w-8" value={canvas.background} onChange={e => handleChange('background', e.target.value)} />
                    <Input type="text" value={canvas.background} onChange={e => handleChange('background', e.target.value)} />
                </div>
            </div>
        </PropertiesGroup>
    </div>
  );
}
