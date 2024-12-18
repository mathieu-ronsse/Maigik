import { Service } from '../types/service';
import { ImageUp, Palette, Scissors, Wand2, Layout, Play } from 'lucide-react';

export const services: Service[] = [
  {
    id: 'upscale',
    name: 'Upscale',
    description: 'Enhance image resolution without quality loss',
    icon: 'ImageUp',
    imageUrl: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206'
  },
  {
    id: 'colorize',
    name: 'Colorize',
    description: 'Add vibrant colors to black and white images',
    icon: 'Palette',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853'
  },
  {
    id: 'extract',
    name: 'Extract',
    description: 'Remove backgrounds and isolate objects',
    icon: 'Scissors',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb'
  },
  {
    id: 'generate',
    name: 'Generate',
    description: 'Create unique images from text descriptions',
    icon: 'Wand2',
    imageUrl: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d'
  },
  {
    id: 'outpaint',
    name: 'Outpaint',
    description: 'Extend images beyond their original boundaries',
    icon: 'Layout',
    imageUrl: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519'
  },
  {
    id: 'animate',
    name: 'Animate',
    description: 'Bring still images to life with motion',
    icon: 'Play',
    imageUrl: 'https://images.unsplash.com/photo-1616161560417-66d4db5892ec'
  }
];