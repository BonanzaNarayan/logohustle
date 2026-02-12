"use client";

import { useEditor } from "@/hooks/useEditor";
import { Button } from "../ui/button";
import { Minus, Spline, Waypoints } from "lucide-react";

export function LinePanel() {
    const { dispatch } = useEditor();
    
    const addPath = (pathData: string, name: string, width = 100, height = 100) => {
        dispatch({ type: 'ADD_ELEMENT', payload: { type: 'path', data: { pathData, name, width, height, strokeWidth: 2 } } });
    }

    return (
        <div className="space-y-4">
            <h3 className="font-medium">Add a Line or Curve</h3>
            <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => addPath('M 0 50 L 100 50', 'Line', 150, 10)}>
                    <Minus className="h-8 w-8"/>
                    <span>Straight Line</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => addPath('M 0 75 Q 50 0, 100 75', 'Curve', 100, 75)}>
                    <Spline className="h-8 w-8"/>
                    <span>Curve</span>
                </Button>
                 <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => addPath('M 0 50 C 25 100, 75 0, 100 50', 'S-Curve', 100, 100)}>
                    <Waypoints className="h-8 w-8"/>
                    <span>S-Curve</span>
                </Button>
            </div>
        </div>
    )
}
