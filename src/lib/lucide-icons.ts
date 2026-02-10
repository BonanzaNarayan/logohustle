import { icons } from 'lucide-react';

// A curated list of icons for the editor
export const availableIcons = [
  'Accessibility', 'Activity', 'Airplay', 'AlarmCheck', 'AlarmClock', 'Album',
  'AlignCenter', 'AlignJustify', 'AlignLeft', 'AlignRight', 'Anchor', 'Angry',
  'Aperture', 'Apple', 'Archive', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp',
  'Award', 'Axe', 'Backpack', 'Badge', 'BaggageClaim', 'Banana', 'Banknote',
  'BarChart', 'Battery', 'Beaker', 'Bell', 'Bike', 'Binary', 'Bird',
  'Bitcoin', 'Blinds', 'Bluetooth', 'Bold', 'Bomb', 'Book', 'Bookmark',
  'Bot', 'Box', 'Brain', 'Briefcase', 'Brush', 'Bug', 'Building', 'Bus',
  'Cake', 'Calculator', 'Calendar', 'Camera', 'Car', 'Carrot', 'Cat',
  'Check', 'ChevronDown', 'ChevronLeft', 'ChevronRight', 'ChevronsDown',
  'ChevronsLeft', 'ChevronsRight', 'ChevronsUp', 'ChevronUp', 'Chrome',
  'Circle', 'Clipboard', 'Clock', 'Cloud', 'CloudDrizzle', 'CloudFog',
  'CloudLightning', 'CloudRain', 'CloudSnow', 'Cloudy', 'Code', 'Codepen',
  'Coffee', 'Coins', 'Compass', 'Computer', 'Construction', 'Contact', 'Cookie',
  'Copy', 'Copyright', 'Cpu', 'CreditCard', 'Crop', 'Crown', 'CupSoda',
  'Currency', 'Database', 'Diamond', 'Disc', 'Dog', 'DollarSign', 'Download',
  'Dribbble', 'Droplet', 'Edit', 'Egg', 'Equal', 'Eraser', 'Euro', 'Eye',
  'Facebook', 'Factory', 'Fan', 'Feather', 'Figma', 'File', 'Film', 'Filter',
  'Flag', 'Flame', 'Flashlight', 'Flower', 'Folder', 'Football', 'Framer', 'Gamepad',
  'Gem', 'Ghost', 'Gift', 'Github', 'Gitlab', 'GlassWater', 'Globe', 'GraduationCap',
  'Grape', 'Grid', 'Hammer', 'HardDrive', 'Hash', 'Haze', 'Headphones', 'Heart',
  'HelpCircle', 'Hexagon', 'Home', 'Image', 'Inbox', 'Infinity', 'Info', 'Instagram',
  'Italic', 'Keyboard', 'Lamp', 'Laptop', 'Layers', 'Layout', 'Leaf', 'LifeBuoy',
  'Lightbulb', 'Link', 'Linkedin', 'List', 'Lock', 'LogIn', 'LogOut', 'Mail',
  'Map', 'MapPin', 'Maximize', 'Medal', 'Megaphone', 'Menu', 'MessageCircle', 'Mic',
  'Minimize', 'Monitor', 'Moon', 'MoreHorizontal', 'Mountain', 'Mouse', 'Music',
  'Navigation', 'Network', 'Octagon', 'Package', 'Palette', 'Paperclip', 'PartyPopper',
  'Pause', 'Pen', 'Percent', 'Phone', 'PieChart', 'Pizza', 'Plane', 'Play', 'Plug',
  'Plus', 'Pocket', 'Podcast', 'Power', 'Printer', 'Puzzle', 'QrCode', 'Quote',
  'Radio', 'Recycle', 'Redo', 'RefreshCw', 'Reply', 'Rocket', 'RotateCw', 'Rss',
  'Save', 'Scale', 'Scissors', 'ScreenShare', 'Search', 'Send', 'Server', 'Settings',
  'Share2', 'Shield', 'ShoppingBag', 'ShoppingCart', 'Shuffle', 'Sidebar', 'Signal',
  'Slack', 'Slice', 'Sliders', 'Smartphone', 'Smile', 'Snowflake', 'Sparkles', 'Speaker',
  'Square', 'Star', 'Sticker', 'Sun', 'Sword', 'Tablet', 'Tag', 'Target', 'Tent',
  'Terminal', 'ThumbsDown', 'ThumbsUp', 'Timer', 'ToggleLeft', 'ToggleRight', 'Tool',
  'Train', 'Trash', 'TrendingUp', 'Triangle', 'Truck', 'Twitch', 'Twitter', 'Type',
  'Umbrella', 'Underline', 'Undo', 'Unlink', 'Unlock', 'Upload', 'User', 'Users',
  'Vegan', 'Video', 'View', 'Voicemail', 'Volume2', 'Wallet', 'Watch', 'Wifi',
  'Wind', 'Wine', 'Wrench', 'X', 'Youtube', 'Zap', 'ZoomIn', 'ZoomOut',
];

export const LucideIcon = ({ name, ...props }: { name: string, className?: string, size?: number, color?: string }) => {
  const IconComponent = icons[name as keyof typeof icons];

  if (!IconComponent) {
    // Return a default icon or null
    return null;
  }

  return <IconComponent {...props} />;
};
