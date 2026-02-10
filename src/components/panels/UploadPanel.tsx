"use client";

import { useEditor } from "@/hooks/useEditor";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export function UploadPanel() {
    const { dispatch } = useEditor();
    const { toast } = useToast();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const src = e.target?.result as string;
                    dispatch({ type: 'ADD_ELEMENT', payload: { type: 'image', data: { src } } });
                };
                reader.readAsDataURL(file);
            } else {
                toast({
                    title: "Invalid File Type",
                    description: "Please upload an image file (PNG, JPG, SVG, etc.).",
                    variant: "destructive"
                });
            }
        }
    };
    
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <h3 className="font-medium">Upload Image</h3>
            <Input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/*"
            />
            <Button variant="outline" className="w-full h-24" onClick={handleButtonClick}>
                <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6"/>
                    <span>Click to upload</span>
                </div>
            </Button>
            <p className="text-xs text-muted-foreground text-center">Upload your own SVG or image file.</p>
        </div>
    );
}
