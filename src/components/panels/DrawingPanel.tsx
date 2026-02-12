"use client";

import { useEditor } from "@/hooks/useEditor";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { PropertiesGroup } from "../properties/PropertiesGroup";

export function DrawingPanel() {
    const { brush, setBrush } = useEditor();

    const handleBrushChange = (prop: string, value: any) => {
        setBrush(prev => ({ ...prev, [prop]: value }));
    };

    return (
        <div className="space-y-4">
            <PropertiesGroup title="Brush Settings">
                <div className="col-span-2">
                    <Label className="text-xs">Color</Label>
                    <div className="flex items-center gap-2">
                        <Input 
                            type="color" 
                            className="p-1 h-8 w-8" 
                            value={brush.color} 
                            onChange={e => handleBrushChange('color', e.target.value)} 
                        />
                        <Input 
                            type="text" 
                            value={brush.color} 
                            onChange={e => handleBrushChange('color', e.target.value)} 
                        />
                    </div>
                </div>
                <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Stroke Width</Label>
                    <div className="flex items-center gap-2">
                        <Slider 
                            value={[brush.strokeWidth]} 
                            onValueChange={value => handleBrushChange('strokeWidth', value[0])} 
                            min={1} max={50} step={1} 
                        />
                        <span className="text-sm w-12 text-right">{brush.strokeWidth}px</span>
                    </div>
                </div>
                <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Opacity</Label>
                    <div className="flex items-center gap-2">
                        <Slider 
                            value={[brush.opacity]} 
                            onValueChange={value => handleBrushChange('opacity', value[0])} 
                            max={1} step={0.01} 
                        />
                         <span className="text-sm w-12 text-right">{Math.round(brush.opacity * 100)}%</span>
                    </div>
                </div>
            </PropertiesGroup>
            <p className="text-xs text-muted-foreground text-center">Click and drag on the canvas to draw.</p>
        </div>
    );
}
