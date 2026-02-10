"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { IconPanel } from "./panels/IconPanel";
import { TextPanel } from "./panels/TextPanel";
import { ShapePanel } from "./panels/ShapePanel";
import { UploadPanel } from "./panels/UploadPanel";
import { LayoutGrid, Type, Shapes, Upload } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function LeftSidebar() {
  return (
    <aside className="w-[300px] bg-card border-r border-border flex flex-col">
      <Tabs defaultValue="icons" className="flex-1 flex flex-col">
        <TooltipProvider>
          <TabsList className="grid w-full grid-cols-4 rounded-none h-16 bg-transparent border-b border-border">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="icons" className="h-full text-muted-foreground data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-none"><LayoutGrid /></TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Icons</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="text" className="h-full text-muted-foreground data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-none"><Type /></TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Text</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="shapes" className="h-full text-muted-foreground data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-none"><Shapes /></TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Shapes</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="upload" className="h-full text-muted-foreground data-[state=active]:text-primary data-[state=active]:bg-primary/10 rounded-none"><Upload /></TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Upload</TooltipContent>
            </Tooltip>
          </TabsList>
        </TooltipProvider>

        <ScrollArea className="flex-1">
          <TabsContent value="icons" className="mt-0 p-4">
            <IconPanel />
          </TabsContent>
          <TabsContent value="text" className="mt-0 p-4">
            <TextPanel />
          </TabsContent>
          <TabsContent value="shapes" className="mt-0 p-4">
            <ShapePanel />
          </TabsContent>
          <TabsContent value="upload" className="mt-0 p-4">
            <UploadPanel />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}
