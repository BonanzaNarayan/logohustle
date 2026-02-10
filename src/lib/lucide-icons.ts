
import React from 'react';
import { icons } from 'lucide-react';

export const LucideIcon = ({ name, ...props }: { name: string, className?: string, size?: number | string, color?: string }) => {
  const IconComponent = icons[name as keyof typeof icons];

  if (!IconComponent) {
    // Return a default icon or null
    return null;
  }

  return React.createElement(IconComponent, props);
};
