"use client";

import { useEditor } from "@/hooks/useEditor";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PropertiesGroup } from "./PropertiesGroup";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TextElement } from "@/lib/types";

const fontFamilies = [
    "Pacifico",
    "Lobster",
    "Shadows Into Light",
    "Abril Fatface",
    "Playfair Display",
    "Oswald",
    "Roboto Slab",
    "Inter", 
    "Arial", 
    "Helvetica", 
    "Times New Roman", 
    "Courier New", 
    "Verdana", 
    "Georgia",
];

export function TextProperties() {
  const { state, dispatch } = useEditor();
  const { selectedElement } = state;

  if (!selectedElement || selectedElement.type !== 'text') return null;

  const textElement = selectedElement as TextElement;

  const handleChange = (prop: string, value: any) => {
     const isNumeric = ['fontSize', 'fontWeight', 'strokeWidth', 'borderRadius'].includes(prop);
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, [prop]: isNumeric ? parseFloat(value) || 0 : value } });
  };

  return (
    <PropertiesGroup title="Text">
        <div className="col-span-2">
            <Label className="text-xs">Content</Label>
            <Textarea value={textElement.content} onChange={e => handleChange('content', e.target.value)} />
        </div>
        <div className="col-span-2">
            <Label className="text-xs">Font Family</Label>
            <Select value={textElement.fontFamily} onValueChange={value => handleChange('fontFamily', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    {fontFamilies.map(font => <SelectItem key={font} value={font} style={{fontFamily: font}}>{font}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div>
            <Label className="text-xs">Font Size</Label>
            <Input type="number" value={textElement.fontSize} onChange={e => handleChange('fontSize', e.target.value)} />
        </div>
        <div>
            <Label className="text-xs">Font Weight</Label>
            <Input type="number" step={100} value={textElement.fontWeight} onChange={e => handleChange('fontWeight', e.target.value)} />
        </div>
        <div className="col-span-2">
            <Label className="text-xs">Align</Label>
            <Select value={textElement.align} onValueChange={value => handleChange('align', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="start">Left</SelectItem>
                    <SelectItem value="middle">Center</SelectItem>
                    <SelectItem value="end">Right</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="col-span-2">
            <Label className="text-xs">Stroke Color</Label>
            <div className="flex items-center gap-2">
                 <Input type="color" className="p-1 h-8 w-8" value={textElement.strokeColor} onChange={e => handleChange('strokeColor', e.target.value)} />
                 <Input type="text" value={textElement.strokeColor} onChange={e => handleChange('strokeColor', e.target.value)} />
            </div>
        </div>
        <div>
            <Label className="text-xs">Stroke Width</Label>
            <Input type="number" min={0} value={textElement.strokeWidth} onChange={e => handleChange('strokeWidth', e.target.value)} />
        </div>
        <div className="col-span-2">
            <Label className="text-xs">Background Color</Label>
            <div className="flex items-center gap-2">
                 <Input type="color" className="p-1 h-8 w-8" value={textElement.backgroundColor} onChange={e => handleChange('backgroundColor', e.target.value)} />
                 <Input type="text" value={textElement.backgroundColor} onChange={e => handleChange('backgroundColor', e.target.value)} placeholder="transparent"/>
            </div>
        </div>
        {textElement.backgroundColor && textElement.backgroundColor !== 'transparent' && (
            <div>
                <Label className="text-xs">Border Radius</Label>
                <Input type="number" min={0} value={textElement.borderRadius} onChange={e => handleChange('borderRadius', e.target.value)} />
            </div>
        )}
    </PropertiesGroup>
  );
}
