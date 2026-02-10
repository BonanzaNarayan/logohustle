"use client";

import { useEditor } from "@/hooks/useEditor";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PropertiesGroup } from "./PropertiesGroup";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { EditorState } from "@/contexts/EditorContext";

export function CanvasBackgroundProperties() {
  const { state, dispatch } = useEditor();
  const { canvas } = state;

  const handleChange = (prop: string, value: any) => {
    dispatch({ type: 'UPDATE_CANVAS', payload: { [prop]: value } });
  };
  
  const handleGradientChange = (prop: keyof EditorState['canvas']['gradient'], value: any) => {
    dispatch({ type: 'UPDATE_CANVAS', payload: { gradient: { ...canvas.gradient, [prop]: value } } });
  };

  const handlePatternChange = (prop: keyof EditorState['canvas']['pattern'], value: any) => {
    dispatch({ type: 'UPDATE_CANVAS', payload: { pattern: { ...canvas.pattern, [prop]: value } } });
  };

  const handleNoiseChange = (prop: keyof EditorState['canvas']['noise'], value: any) => {
    dispatch({ type: 'UPDATE_CANVAS', payload: { noise: { ...canvas.noise, [prop]: value } } });
  };

  return (
    <div className="p-4 space-y-6">
      <PropertiesGroup title="Background">
        <div className="col-span-2">
            <RadioGroup 
                defaultValue="solid" 
                className="flex items-center" 
                value={canvas.backgroundType}
                onValueChange={(value) => handleChange('backgroundType', value)}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="solid" id="r1" />
                    <Label htmlFor="r1">Solid</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gradient" id="r2" />
                    <Label htmlFor="r2">Gradient</Label>
                </div>
            </RadioGroup>
        </div>
        {canvas.backgroundType === 'solid' ? (
             <div className="col-span-2">
                <Label className="text-xs">Color</Label>
                <div className="flex items-center gap-2">
                    <Input type="color" className="p-1 h-8 w-8" value={canvas.background} onChange={e => handleChange('background', e.target.value)} />
                    <Input type="text" value={canvas.background} onChange={e => handleChange('background', e.target.value)} />
                </div>
            </div>
        ) : (
            <>
                <div className="col-span-2">
                    <Label className="text-xs">Color 1</Label>
                    <div className="flex items-center gap-2">
                        <Input type="color" className="p-1 h-8 w-8" value={canvas.gradient.color1} onChange={e => handleGradientChange('color1', e.target.value)} />
                        <Input type="text" value={canvas.gradient.color1} onChange={e => handleGradientChange('color1', e.target.value)} />
                    </div>
                </div>
                <div className="col-span-2">
                    <Label className="text-xs">Color 2</Label>
                    <div className="flex items-center gap-2">
                        <Input type="color" className="p-1 h-8 w-8" value={canvas.gradient.color2} onChange={e => handleGradientChange('color2', e.target.value)} />
                        <Input type="text" value={canvas.gradient.color2} onChange={e => handleGradientChange('color2', e.target.value)} />
                    </div>
                </div>
                <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Angle</Label>
                     <div className="flex items-center gap-2">
                        <Slider value={[canvas.gradient.angle]} onValueChange={value => handleGradientChange('angle', value[0])} max={360} step={1} />
                        <span className="text-sm w-12 text-right">{canvas.gradient.angle}°</span>
                    </div>
                </div>
            </>
        )}
      </PropertiesGroup>

      <PropertiesGroup title="Pattern Overlay">
        <div className="col-span-2">
            <Label className="text-xs">Pattern</Label>
            <Select value={canvas.pattern.type} onValueChange={(value) => handlePatternChange('type', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="graph">Graph</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                </SelectContent>
            </Select>
        </div>
        {canvas.pattern.type !== 'none' && (
            <>
                <div className="col-span-2">
                    <Label className="text-xs">Color</Label>
                    <div className="flex items-center gap-2">
                        <Input type="color" className="p-1 h-8 w-8" value={canvas.pattern.color} onChange={e => handlePatternChange('color', e.target.value)} />
                        <Input type="text" value={canvas.pattern.color} onChange={e => handlePatternChange('color', e.target.value)} />
                    </div>
                </div>
                <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Opacity</Label>
                    <Slider value={[canvas.pattern.opacity]} onValueChange={value => handlePatternChange('opacity', value[0])} max={1} step={0.01} />
                </div>
                 <div>
                    <Label className="text-xs">Scale</Label>
                    <Input type="number" min={0.1} step={0.1} value={canvas.pattern.scale} onChange={e => handlePatternChange('scale', parseFloat(e.target.value))} />
                </div>
                 <div>
                    <Label className="text-xs">Blur</Label>
                    <Input type="number" min={0} step={0.1} value={canvas.pattern.blur} onChange={e => handlePatternChange('blur', parseFloat(e.target.value))} />
                </div>
            </>
        )}
      </PropertiesGroup>
      
       <PropertiesGroup title="Noise">
        <div className="col-span-2 flex items-center justify-between">
            <Label className="text-sm">Enable</Label>
            <Switch checked={canvas.noise.enabled} onCheckedChange={(checked) => handleNoiseChange('enabled', checked)}/>
        </div>
         {canvas.noise.enabled && (
             <div className="col-span-2 space-y-2">
                <Label className="text-xs">Opacity</Label>
                <Slider value={[canvas.noise.opacity]} onValueChange={value => handleNoiseChange('opacity', value[0])} max={1} step={0.01} />
            </div>
         )}
       </PropertiesGroup>
    </div>
  );
}
