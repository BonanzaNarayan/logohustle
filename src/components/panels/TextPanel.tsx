"use client";

import { useEditor } from "@/hooks/useEditor";
import { Button } from "../ui/button";

export function TextPanel() {
  const { dispatch } = useEditor();

  const addText = (data: any) => {
    dispatch({ type: 'ADD_ELEMENT', payload: { type: 'text', data } });
  };

  return (
    <div className="space-y-4">
        <h3 className="font-medium">Add Text</h3>
        <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => addText({ fontSize: 64, fontWeight: 700, content: 'Heading' })}>
                Add a heading
            </Button>
            <Button variant="outline" onClick={() => addText({ fontSize: 40, fontWeight: 600, content: 'Subheading' })}>
                Add a subheading
            </Button>
            <Button variant="outline" onClick={() => addText({ fontSize: 24, fontWeight: 400, content: 'Body text' })}>
                Add body text
            </Button>
        </div>
    </div>
  );
}
