"use client";

import { useEditor } from "@/hooks/useEditor";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PropertiesGroup } from "./PropertiesGroup";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const fontFamilies = [
    "Inter", "Arial", "Helvetica", "Times New Roman", "Courier New", "Verdana", "Georgia", "Garamond", "Comic Sans MS", "Trebuchet MS"
];

export function TextProperties() {
  const { state, dispatch } = useEditor();
  const { selectedElement } = state;

  if (!selectedElement || selectedElement.type !== 'text') return null;

  const handleChange = (prop: string, value: any) => {
     const isNumeric = ['fontSize', 'fontWeight'].includes(prop);
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, [prop]: isNumeric ? parseFloat(value) || 0 : value } });
  };

  return (
    <PropertiesGroup title="Text">
        <div className="col-span-2">
            <Label className="text-xs">Content</Label>
            <Textarea value={selectedElement.content} onChange={e => handleChange('content', e.target.value)} />
        </div>
        <div className="col-span-2">
            <Label className="text-xs">Font Family</Label>
            <Select value={selectedElement.fontFamily} onValueChange={value => handleChange('fontFamily', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    {fontFamilies.map(font => <SelectItem key={font} value={font}>{font}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div>
            <Label className="text-xs">Font Size</Label>
            <Input type="number" value={selectedElement.fontSize} onChange={e => handleChange('fontSize', e.target.value)} />
        </div>
        <div>
            <Label className="text-xs">Font Weight</Label>
            <Input type="number" step={100} value={selectedElement.fontWeight} onChange={e => handleChange('fontWeight', e.target.value)} />
        </div>
        <div className="col-span-2">
            <Label className="text-xs">Align</Label>
            <Select value={selectedElement.align} onValueChange={value => handleChange('align', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="start">Left</SelectItem>
                    <SelectItem value="middle">Center</SelectItem>
                    <SelectItem value="end">Right</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </PropertiesGroup>
  );
}
