"use client";

import React, { useRef } from 'react';
import type { XYCoord, Identifier } from 'dnd-core';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Type, Square, Smile, Image as ImageIcon } from 'lucide-react';
import { CanvasElement } from '@/lib/types';
import { useEditor } from '@/hooks/useEditor';
import { cn } from '@/lib/utils';

const ItemTypes = {
  LAYER: 'layer',
};

export interface LayerItemProps {
  element: CanvasElement;
  index: number;
  moveLayer: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const getLayerIcon = (type: CanvasElement['type']) => {
    switch (type) {
        case 'text': return <Type className="h-4 w-4" />;
        case 'shape': return <Square className="h-4 w-4" />;
        case 'icon': return <Smile className="h-4 w-4" />;
        case 'image': return <ImageIcon className="h-4 w-4" />;
        default: return null;
    }
}

const getLayerName = (element: CanvasElement) => {
    switch (element.type) {
        case 'text': return element.content.substring(0, 20) || "Text";
        case 'shape': return element.shape.charAt(0).toUpperCase() + element.shape.slice(1);
        case 'icon': return element.name;
        case 'image': return "Image";
        default: return "Element";
    }
}

export function LayerItem({ element, index, moveLayer }: LayerItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { state, dispatch } = useEditor();
    const isSelected = state.selectedElement?.id === element.id;

    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
        accept: ItemTypes.LAYER,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) return;
            
            const dragIndex = item.index;
            const hoverIndex = index;
            
            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveLayer(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.LAYER,
        item: () => ({ id: element.id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));
    
    const handleSelectElement = () => {
        dispatch({ type: 'SELECT_ELEMENT', payload: { id: element.id } });
    }

    return (
        <div
            ref={ref}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            data-handler-id={handlerId}
            onClick={handleSelectElement}
            className={cn(
                "flex items-center gap-2 p-2 rounded-md border border-transparent transition-colors",
                "cursor-grab active:cursor-grabbing",
                isDragging && "bg-primary/10",
                isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted"
            )}
        >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
            <div className="text-muted-foreground">{getLayerIcon(element.type)}</div>
            <span className="text-sm flex-1 truncate">{getLayerName(element)}</span>
        </div>
    );
}
