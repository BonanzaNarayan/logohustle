"use client";

import { useState } from "react";
import { icons } from "lucide-react";
import { LucideIcon } from "@/lib/lucide-icons";
import { Input } from "../ui/input";
import { useEditor } from "@/hooks/useEditor";
import { Search } from "lucide-react";

const availableIcons = Object.keys(icons);

export function IconPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const { dispatch } = useEditor();

  const filteredIcons = availableIcons.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddIcon = (name: string) => {
    dispatch({ type: 'ADD_ELEMENT', payload: { type: 'icon', data: { name, color: '#000000' } } });
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {filteredIcons.map((iconName) => (
          <button
            key={iconName}
            onClick={() => handleAddIcon(iconName)}
            className="aspect-square flex items-center justify-center rounded-md border border-transparent hover:border-primary hover:bg-primary/10 transition-colors"
            title={iconName}
          >
            <LucideIcon name={iconName} className="h-6 w-6 text-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
