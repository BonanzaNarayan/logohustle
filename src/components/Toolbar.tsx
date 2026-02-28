"use client";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, Image as ImageIcon, Undo2, Redo2, Trash2, Magnet } from "lucide-react";
import { useEditor } from "@/hooks/useEditor";
import { downloadFile } from "@/lib/download";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Logo } from "./Logo";

export function Toolbar() {
  const { state, dispatch, canUndo, canRedo, isSnapping, setIsSnapping } = useEditor();
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
    
    // Embed Google Fonts CSS into the SVG so they are applied in the exported file
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Inter:wght@400;500;600;700&family=Lobster&family=Oswald&family=Pacifico&family=Playfair+Display&family=Roboto+Slab&family=Shadows+Into+Light&display=swap');`;
    svgClone.insertBefore(style, svgClone.firstChild);

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
    img.onerror = (e: any) => {
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

  const handleClearCanvas = () => {
    dispatch({ type: 'CLEAR_CANVAS' });
  };
  
  return (
    <header className="h-16 flex items-center justify-between px-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <Logo />
        <h1 className="text-2xl text-foreground font-stylish">LogoHustle</h1>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Button variant="ghost" size="icon" onClick={() => dispatch({type: 'UNDO'})} disabled={!canUndo} aria-label="Undo">
              <Undo2 />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => dispatch({type: 'REDO'})} disabled={!canRedo} aria-label="Redo">
              <Redo2 />
          </Button>
          <Tooltip>
              <TooltipTrigger asChild>
                  <Button 
                    variant={isSnapping ? 'secondary' : 'ghost'} 
                    size="icon" 
                    onClick={() => setIsSnapping(!isSnapping)} 
                    aria-label="Toggle Snapping"
                  >
                      <Magnet />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                  <p>Toggle Snapping</p>
              </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Clear Canvas">
              <Trash2 className="text-rose-600" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear the entire canvas. This action can be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleClearCanvas}>Clear Canvas</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={'sm'}>
              <Download className="" />
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