import {
  Rows4,
  MessageCircle,
  Heart,
  Eye,
  MessageCircleHeart,
  HeartOff,
} from 'lucide-react';
import { JSX } from 'react';

const NOTIF_ICONS: Record<string, JSX.Element> = {
  All: <Rows4 className="w-4 h-4" />,
  Message: <MessageCircle className="w-4 h-4" />,
  Like: <Heart className="w-4 h-4" />,
  View: <Eye className="w-4 h-4" />,
  Match: <MessageCircleHeart className="w-4 h-4" />,
  Unlike: <HeartOff className="w-4 h-4" />,
};

export const getIcon = (type: string) => NOTIF_ICONS[type] || null;
