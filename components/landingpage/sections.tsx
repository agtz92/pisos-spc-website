/**
 * Shared utilities for landing page layout variants.
 * CSS variable tokens, icon map, small reusable sub-components, and module data types.
 */

import type { Post, Recipe, Product, Listing, Review } from '@/lib/graphql';

export type { Post, Recipe, Product, Listing, Review };

export interface ModuleData {
  posts: Post[];
  recipes: Recipe[];
  products: Product[];
  listings: Listing[];
  reviews: Review[];
  activeModules: string[];
}

import {
  PenTool, Utensils, ShoppingBag, Home, Star, Layout, Zap, Globe,
  BarChart2, Lock, MessageSquare, Mail, Bell, Settings, Users,
  Heart, Bookmark, Camera, Music, Video, Code, Database, Cloud,
  Shield, Cpu, Package, Truck, Map, Phone, Search, Lightbulb,
  Award, CheckCircle, ArrowRight, ChevronRight, type LucideIcon,
} from 'lucide-react';

// ── CSS variable tokens ──────────────────────────────────────────────────────

export const t = {
  accent:      'var(--template-accent, #2563eb)',
  ink:         'var(--template-ink, #111827)',
  mutedText:   'var(--template-muted-text, #6b7280)',
  panel:       'var(--template-panel, #ffffff)',
  panelBorder: 'var(--template-panel-border, #e5e7eb)',
  mutedPanel:  'var(--template-muted-panel, #f8fafc)',
};

// ── Icon map ─────────────────────────────────────────────────────────────────

export const ICON_MAP: Record<string, LucideIcon> = {
  'pen-tool': PenTool, 'utensils': Utensils, 'shopping-bag': ShoppingBag,
  'home': Home, 'star': Star, 'layout': Layout, 'zap': Zap, 'globe': Globe,
  'bar-chart': BarChart2, 'lock': Lock, 'message-square': MessageSquare,
  'mail': Mail, 'bell': Bell, 'settings': Settings, 'users': Users,
  'heart': Heart, 'bookmark': Bookmark, 'camera': Camera, 'music': Music,
  'video': Video, 'code': Code, 'database': Database, 'cloud': Cloud,
  'shield': Shield, 'cpu': Cpu, 'package': Package, 'truck': Truck,
  'map': Map, 'phone': Phone, 'search': Search, 'lightbulb': Lightbulb,
  'award': Award, 'check-circle': CheckCircle, 'arrow-right': ArrowRight,
  'chevron-right': ChevronRight,
};

// ── Small shared sub-components ──────────────────────────────────────────────

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= rating ? '#facc15' : t.panelBorder }}>★</span>
      ))}
    </div>
  );
}

export function FeatureIcon({ icon, size = 24 }: { icon: string; size?: number }) {
  const C: LucideIcon | undefined = icon ? ICON_MAP[icon.toLowerCase()] : undefined;
  if (C) return <C size={size} strokeWidth={1.75} />;
  if (icon) return <span style={{ fontSize: size }}>{icon}</span>;
  return <span style={{ fontSize: size, fontWeight: 700 }}>✦</span>;
}
