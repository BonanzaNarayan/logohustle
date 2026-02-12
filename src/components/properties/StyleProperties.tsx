"use client";

import { useEditor } from "@/hooks/useEditor";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { PropertiesGroup } from "./PropertiesGroup";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

export function StyleProperties() {
  const { state, dispatch } = useEditor();
  const { selectedElement } = state;

  if (!selectedElement) return null;

  const handleChange = (prop: string, value: any) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, [prop]: value } });
  };
  
  const handleOpacityChange = (value: number[]) => {
     dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, opacity: value[0] } });
  }

  const handleShadowChange = (prop: string, value: any) => {
    if (!selectedElement || !('shadow' in selectedElement)) return;

    const newShadow = { ...selectedElement.shadow, [prop]: value };
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id: selectedElement.id, shadow: newShadow } });
  };
  
  const handleNumericShadowChange = (prop: string, value: string) => {
    handleShadowChange(prop, parseFloat(value) || 0);
  }

  return (
    <>
      {(('color' in selectedElement) || ('opacity' in selectedElement)) &&
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
      }

      {'shadow' in selectedElement && (
        <PropertiesGroup title="Shadow">
          <div className="col-span-2 flex items-center justify-between">
              <Label className="text-sm">Enable</Label>
              <Switch checked={selectedElement.shadow.enabled} onCheckedChange={(checked) => handleShadowChange('enabled', checked)}/>
          </div>
          {selectedElement.shadow.enabled && (
            <>
              <div className="col-span-2">
                  <Label className="text-xs">Color</Label>
                  <div className="flex items-center gap-2">
                      <Input type="color" className="p-1 h-8 w-8" value={selectedElement.shadow.color} onChange={e => handleShadowChange('color', e.target.value)} />
                      <Input type="text" value={selectedElement.shadow.color} onChange={e => handleShadowChange('color', e.target.value)} />
                  </div>
              </div>
               <div className="col-span-2 space-y-2">
                  <Label className="text-xs">Opacity</Label>
                  <div className="flex items-center gap-2">
                      <Slider 
                          value={[selectedElement.shadow.opacity]}
                          onValueChange={(value) => handleShadowChange('opacity', value[0])}
                          max={1}
                          step={0.01}
                      />
                      <span className="text-sm w-12 text-right">{Math.round(selectedElement.shadow.opacity * 100)}%</span>
                  </div>
              </div>
              <div>
                  <Label className="text-xs">Blur</Label>
                  <Input type="number" min={0} value={selectedElement.shadow.blur} onChange={e => handleNumericShadowChange('blur', e.target.value)} />
              </div>
              <div>
                  <Label className="text-xs">X Offset</Label>
                  <Input type="number" value={selectedElement.shadow.offsetX} onChange={e => handleNumericShadowChange('offsetX', e.target.value)} />
              </div>
              <div className="col-span-2">
                  <Label className="text-xs">Y Offset</Label>
                  <Input type="number" value={selectedElement.shadow.offsetY} onChange={e => handleNumericShadowChange('offsetY', e.target.value)} />
              </div>
            </>
          )}
        </PropertiesGroup>
      )}
    </>
  );
}
