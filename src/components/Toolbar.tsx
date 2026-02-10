"use client";

import { Logo } from "./Logo";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, Image as ImageIcon, Trash } from "lucide-react";
import { useEditor } from "@/hooks/useEditor";
import { downloadFile } from "@/lib/download";
import { useToast } from "@/hooks/use-toast";

export function Toolbar() {
  const { state, dispatch } = useEditor();
  const { toast } = useToast();

  const createSvg = () => {
    const { width, height, background, elements } = state.canvas;

    let svgElements = '';

    elements.forEach(el => {
      const transform = `translate(${el.x} ${el.y}) rotate(${el.rotation} ${el.width/2} ${el.height/2})`;
      switch(el.type) {
        case 'text':
          svgElements += `<text x="${el.width/2}" y="${el.height/2}" font-family="${el.fontFamily}" font-size="${el.fontSize}" font-weight="${el.fontWeight}" fill="${el.color}" text-anchor="middle" dominant-baseline="central" transform="${transform}" style="opacity: ${el.opacity}">${el.content}</text>`;
          break;
        case 'icon':
            // This is a simplification. A real implementation would need the SVG path for each icon.
            // For now, we'll just put a placeholder.
            const iconSvg = `<svg x="0" y="0" width="${el.width}" height="${el.height}" fill="${el.color}" style="opacity: ${el.opacity}" transform="${transform}"><text>ICON:${el.name}</text></svg>`;
            svgElements += iconSvg;
            break;
        case 'shape':
          let shapeSvg = '';
          if (el.shape === 'rectangle') {
            shapeSvg = `<rect x="0" y="0" width="${el.width}" height="${el.height}" fill="${el.color}" stroke="${el.strokeColor}" stroke-width="${el.strokeWidth}" style="opacity: ${el.opacity}" transform="${transform}" />`;
          } else if (el.shape === 'circle') {
             shapeSvg = `<circle cx="${el.width/2}" cy="${el.height/2}" r="${el.width/2}" fill="${el.color}" stroke="${el.strokeColor}" stroke-width="${el.strokeWidth}" style="opacity: ${el.opacity}" transform="${transform}" />`;
          }
          svgElements += shapeSvg;
          break;
        case 'image':
            svgElements += `<image href="${el.src}" x="0" y="0" width="${el.width}" height="${el.height}" style="opacity: ${el.opacity}" transform="${transform}" />`;
            break;
      }
    });
    
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect width="100%" height="100%" fill="${background}"/>
      ${svgElements}
    </svg>`;
  }

  const handleExportSVG = () => {
    const svgString = createSvg();
    downloadFile(svgString, "logo.svg", "image/svg+xml");
  };

  const handleExportPNG = () => {
    const svgString = createSvg();
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = state.canvas.width;
      canvas.height = state.canvas.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
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
            description: "Could not export to PNG. See console for details.",
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
