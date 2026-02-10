"use client";

import { useEditor } from "@/hooks/useEditor";
import { Button } from "../ui/button";
import { Square, Circle } from "lucide-react";

export function ShapePanel() {
    const { dispatch } = useEditor();
    
    const addShape = (shape: 'rectangle' | 'circle') => {
        dispatch({ type: 'ADD_ELEMENT', payload: { type: 'shape', data: { shape } } });
    }

    return (
        <div className="space-y-4">
            <h3 className="font-medium">Add a Shape</h3>
            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => addShape('rectangle')}>
                    <Square className="h-8 w-8"/>
                    <span>Rectangle</span>
                </Button>
                 <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => addShape('circle')}>
                    <Circle className="h-8 w-8"/>
                    <span>Circle</span>
                </Button>
            </div>
        </div>
    )
}
