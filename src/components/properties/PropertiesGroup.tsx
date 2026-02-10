import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface PropertiesGroupProps {
  title: string;
  children: React.ReactNode;
}

export const PropertiesGroup = ({ title, children }: PropertiesGroupProps) => {
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="w-full flex justify-between items-center mb-2 group">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180"/>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
