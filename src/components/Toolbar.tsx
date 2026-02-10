"use client";

import { Logo } from "./Logo";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, Image as ImageIcon } from "lucide-react";
import { useEditor } from "@/hooks/useEditor";
import { downloadFile } from "@/lib/download";
import { useToast } from "@/hooks/use-toast";

export function Toolbar() {
  const { state } = useEditor();
  const { toast } = useToast();

  const getSvgString = () => {
    const svgNode = document.getElementById('logo-canvas');
    if (!svgNode) {
      toast({
        title: "Error exporting",
        description: "Could not find the canvas SVG element.",
        variant: "destructive",
      });
      return null;
    }

    const svgClone = svgNode.cloneNode(true) as SVGSVGElement;
    
    // Remove selection handles
    const interactionHandles = svgClone.querySelector('[data-interaction-handles="true"]');
    if (interactionHandles) {
      interactionHandles.remove();
    }

    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgClone);
  }

  const handleExportSVG = () => {
    const svgString = getSvgString();
    if(svgString) {
      downloadFile(svgString, "logo.svg", "image/svg+xml");
    }
  };

  const handleExportPNG = () => {
    const svgString = getSvgString();
    if (!svgString) return;

    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 2; // for better quality
      canvas.width = (state.canvas.width || 512) * scale;
      canvas.height = (state.canvas.height || 512) * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = 'logo.png';
        a.click();
        URL.revokeObjectURL(pngUrl);
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = (e) => {
        console.error("Error loading SVG image for PNG export", e);
        toast({
            title: "Export Error",
            description: "Could not export to PNG. Icons might not be loading correctly.",
            variant: "destructive"
        })
        URL.revokeObjectURL(url);
    }
    img.src = url;
  };
  
  return (
    <header className="h-16 flex items-center justify-between px-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <Logo />
        <h1 className="text-lg font-semibold text-foreground">LogoForge</h1>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportSVG}>
              <FileJson className="mr-2 h-4 w-4" />
              Export as SVG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPNG}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Export as PNG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
