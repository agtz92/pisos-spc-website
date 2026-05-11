export type TemplateName = 'modern' | 'retro' | 'futuristic' | 'executive';
export type ModuleName = 'blog' | 'recipes' | 'realestate' | 'reviews' | 'products';

export interface ModernTemplateColors {
  accent: string;
  accentSoft: string;
  accentStrong: string;
  ink: string;
  mutedText: string;
  textOnAccent: string;
  gridLine: string;
  gridLineSoft: string;
  pageBackground: string;
  panelBackground: string;
  mutedPanelBackground: string;
}

export interface ModernTemplateCopy {
  utilityBarLabel: string;
  headerTagline: string;
  footerDescription: string;
  footerEyebrow: string;
  footerNavHeading: string;
  footerNoteChip: string;
  footerNoteBody: string;
  footerCopyrightTagline: string;
  footerBottomTagline: string;
}

export interface ModernTemplateLayout {
  navItems: Record<string, { label: string; href: string }>;
}

export interface ModernTemplateConfig {
  colors: ModernTemplateColors;
  copy: ModernTemplateCopy;
  layout: ModernTemplateLayout;
}

export interface RetroTemplateColors {
  ink: string;
  mutedText: string;
  textOnAccent: string;
  highlightInk: string;
  pageBackground: string;
  panelBackground: string;
  mutedPanelBackground: string;
  contentBackground: string;
  sidebarBackground: string;
  footerBackground: string;
  navBackground: string;
  navAltBackground: string;
  panelBorder: string;
  highlight: string;
  highlightStrong: string;
  link: string;
  paperNoise: string;
}

export interface RetroSidebarCardConfig {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  emphasis?: boolean;
}

export interface RetroTemplateCopy {
  eyebrow: string;
  tagline: string;
  metaLabel: string;
  featureLabel: string;
  featureTitle: string;
  featureDescription: string;
  footerEyebrow: string;
  footerDescription: string;
  footerNavHeading: string;
  footerHoursHeading: string;
  footerHoursBody: string;
  footerHoursBadgePrefix: string;
  footerCopyrightTagline: string;
  footerBottomTagline: string;
  statHighlights: Array<{ label: string; value: string }>;
  sidebarCards: RetroSidebarCardConfig[];
}

export type RetroBackgroundAdornment = 'paper' | 'grid' | 'dots' | 'none';

export interface RetroTemplateLayout {
  navItems: Record<string, { label: string; href: string }>;
  backgroundAdornment: RetroBackgroundAdornment;
}

export interface RetroTemplateConfig {
  colors: RetroTemplateColors;
  copy: RetroTemplateCopy;
  layout: RetroTemplateLayout;
}

export interface FuturisticTemplateColors {
  pageBackground: string;
  bodyText: string;
  ink: string;
  mutedText: string;
  accent: string;
  accentStrong: string;
  accentBorder: string;
  accentGlow: string;
  panelBackground: string;
  mutedPanelBackground: string;
  panelBorder: string;
  headerBackground: string;
  footerBackground: string;
  topGlowLine: string;
  scanlineOverlay: string;
  gridOverlay: string;
  imageBorder: string;
}

export interface FuturisticTemplateCopy {
  footerPrefix: string;
  footerSubtitle: string;
  footerDescription: string;
  footerNavHeading: string;
  footerSystemHeading: string;
  footerSystemStatus: string;
  footerSystemTheme: string;
  footerInterfaceLabel: string;
  footerBottomTagline: string;
}

export type FuturisticBackgroundAdornment = 'grid' | 'scanlines' | 'dots' | 'circuit' | 'none';

export interface FuturisticTemplateLayout {
  navItems: Record<string, { label: string; href: string }>;
  mainContainerClassName: string;
  backgroundAdornment: FuturisticBackgroundAdornment;
}

export interface FuturisticTemplateConfig {
  colors: FuturisticTemplateColors;
  copy: FuturisticTemplateCopy;
  layout: FuturisticTemplateLayout;
}

export interface ExecutiveTemplateColors {
  pageBackground: string;
  ink: string;
  mutedText: string;
  accent: string;
  accentStrong: string;
  panelBackground: string;
  mutedPanelBackground: string;
  panelBorder: string;
  headerBackground: string;
  footerBackground: string;
  notificationDot: string;
}

export interface ExecutiveTemplateCopy {
  footerTagline: string;
  footerDescription: string;
  footerStatusText: string;
  footerNavHeading: string;
  footerBriefingHeading: string;
  footerBriefingTitle: string;
  footerBriefingBody: string;
  footerBriefingCta: string;
  footerBottomTagline: string;
}

export interface ExecutiveTemplateLayout {
  navItems: Record<string, { label: string; href: string }>;
}

export interface ExecutiveTemplateConfig {
  colors: ExecutiveTemplateColors;
  copy: ExecutiveTemplateCopy;
  layout: ExecutiveTemplateLayout;
}

export interface TemplateConfigMap {
  modern: ModernTemplateConfig;
  retro: RetroTemplateConfig;
  futuristic: FuturisticTemplateConfig;
  executive: ExecutiveTemplateConfig;
}

export interface ModuleCardStyle {
  borderRadius: number;
  shadow: string;
}

export interface ScorePalette {
  background: string;
  text: string;
  shadow: string;
}

export interface ReviewTypeStyle {
  bg: string;
  text: string;
}

export interface ReviewsModuleColors {
  accent: string;
  ink: string;
  railBorder: string;
  sectionRule: string;
  featuredBadgeBackground: string;
  featuredBadgeText: string;
  featuredBadgeBorder: string;
  featuredCard: ModuleCardStyle;
  reviewCard: ModuleCardStyle;
  typeStyles: Record<string, ReviewTypeStyle>;
  scorePalettes: {
    excellent: ScorePalette;
    great: ScorePalette;
    good: ScorePalette;
    mixed: ScorePalette;
    poor: ScorePalette;
  };
}

export interface ReviewsModuleCopy {
  title: string;
  emptyState: string;
  railHeading: string;
  moreReviewsLabel: string;
  reviewTypes: Record<string, string>;
}

export interface ReviewsModuleLayout {
  containerClassName: string;
  featuredGridClassName: string;
  remainingGridClassName: string;
  sideReviewCount: number;
  railReviewCount: number;
  variant?: string;
}

export interface ReviewsModuleConfig {
  colors: ReviewsModuleColors;
  copy: ReviewsModuleCopy;
  layout: ReviewsModuleLayout;
}

export interface BasicModuleColors {
  accent: string;
  ink: string;
  panelBackground: string;
  panelBorder: string;
}

export interface BasicModuleCopy {
  title: string;
  emptyState: string;
  featuredLabel: string;
  moreLabel: string;
  heroEyebrow?: string;
  heroDescription?: string;
  amenitiesHeading?: string;
}

export interface BasicModuleLayout {
  containerClassName: string;
  featuredGridClassName: string;
  featuredSideCount: number;
  railCount: number;
  variant?: string;
}

export interface BasicModuleConfig {
  colors: BasicModuleColors;
  copy: BasicModuleCopy;
  layout: BasicModuleLayout;
}

export interface ModuleConfigMap {
  blog: BasicModuleConfig;
  recipes: BasicModuleConfig;
  realestate: BasicModuleConfig;
  reviews: ReviewsModuleConfig;
  products: BasicModuleConfig;
}

export const colorPalettes = {
  global: {
    white: '#ffffff',
    whiteSoft: '#fffdfd',
    whiteRose: '#fff8fb',
    whiteRoseMuted: '#fff4fa',
    ink: '#161218',
    inkStrong: '#111111',
    inkSoft: '#374151',
    inkMuted: '#6b7280',
    borderSoft: '#e5e7eb',
    panelSoft: '#f3f4f6',
  },
  moduleSpecific: {
    editorialAccent: '#e5201b',
  },
  templateSpecific: {
    modern: {
    accent: '#ec0f7f',
    accentSoft: '#f7b6d6',
    accentStrong: '#c105aa',
    accentBorder: 'rgba(236, 15, 127, 0.18)',
    accentShadow: 'rgba(236, 15, 127, 0.08)',
    gridLine: 'rgba(236, 15, 127, 0.04)',
    gridLineSoft: 'rgba(236, 15, 127, 0.03)',
    mutedText: 'rgba(22, 18, 24, 0.58)',
    panelBorder: 'rgba(22, 18, 24, 0.1)',
    footerText: 'rgba(22, 18, 24, 0.65)',
    footerMetaText: 'rgba(22, 18, 24, 0.55)',
    footerEyebrowText: 'rgba(22, 18, 24, 0.4)',
    articleHoverText: 'rgba(22, 18, 24, 0.68)',
    textOnAccent: '#fff8fc',
    },
    retro: {
    ink: '#171412',
    mutedText: '#5b4f44',
    textOnAccent: '#171412',
    highlightInk: '#171412',
    panelBackground: '#f8f1e2',
    mutedPanelBackground: '#efe3cb',
    contentBackground: '#fbf5e7',
    sidebarBackground: '#f1e6d4',
    footerBackground: '#efe0bf',
    navBackground: '#f6ecd6',
    navAltBackground: '#efdfbf',
    panelBorder: '#2e2925',
    highlight: '#f0c14b',
    highlightStrong: '#e4a826',
    link: '#9f4d19',
    paperNoise:
      'radial-gradient(circle at 20% 20%, rgba(0,0,0,0.12) 0 1px, transparent 1px), radial-gradient(circle at 80% 40%, rgba(0,0,0,0.08) 0 1px, transparent 1px), radial-gradient(circle at 50% 80%, rgba(0,0,0,0.08) 0 1px, transparent 1px)',
    pageBackground:
      'radial-gradient(circle at top left, rgba(247, 219, 154, 0.26), transparent 30%), linear-gradient(180deg, #f4efe4 0%, #efe6d5 100%)',
    },
    executive: {
    pageBackground: '#f1f5f9',
    ink: '#1e293b',
    mutedText: '#64748b',
    accent: '#2563eb',
    accentStrong: '#1d4ed8',
    panelBackground: '#ffffff',
    mutedPanelBackground: '#f8fafc',
    panelBorder: '#e2e8f0',
    headerBackground: '#ffffff',
    footerBackground: '#ffffff',
    notificationDot: '#ef4444',
    },
    futuristic: {
    pageBackground: '#020817',
    bodyText: '#cbd5e1',
    ink: '#e2e8f0',
    mutedText: '#94a3b8',
    accent: '#22d3ee',
    accentStrong: '#06b6d4',
    accentBorder: 'rgba(34,211,238,0.25)',
    panelBackground: 'rgba(15,23,42,0.82)',
    mutedPanelBackground: 'rgba(30,41,59,0.6)',
    panelBorder: 'rgba(34,211,238,0.2)',
    panelBorderStrong: 'rgba(34,211,238,0.4)',
    accentGlow: 'rgba(34,211,238,0.5)',
    buttonGlow: 'rgba(34,211,238,0.15)',
    headerBackground: 'rgba(2,8,23,0.95)',
    footerBackground: 'rgba(2,8,23,0.95)',
    topGlowLine: 'linear-gradient(90deg, transparent, #22d3ee 30%, #06b6d4 70%, transparent)',
    scanlineOverlay:
      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
    gridOverlay:
      'linear-gradient(rgba(30,41,59,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.4) 1px, transparent 1px)',
    imageBorder: 'rgba(34,211,238,0.25)',
    footerMeta: '#334155',
    },
  },
  moduleStyleSpecific: {
    reviews: {
    accent: '#ec0f7f',
    badgeText: '#9d174d',
    railBorder: '#f3c2d8',
    typeStyles: {
      movie: { bg: '#e6f0ff', text: '#2257c2' },
      music: { bg: '#f8e9ff', text: '#8c35c7' },
      product: { bg: '#fff0e5', text: '#c7671f' },
      book: { bg: '#e8f6ea', text: '#2c7b46' },
      game: { bg: '#ffe9ef', text: '#c52a5d' },
      restaurant: { bg: '#fff7dc', text: '#ad7a08' },
      other: { bg: '#f3f4f6', text: '#6b7280' },
    },
    scorePalettes: {
      excellent: {
        background: '#00c875',
        text: '#001a0d',
        shadow: 'rgba(0, 200, 117, 0.3)',
      },
      great: {
        background: '#3dc45a',
        text: '#001a0d',
        shadow: 'rgba(61, 196, 90, 0.28)',
      },
      good: {
        background: '#66cc33',
        text: '#0d1a00',
        shadow: 'rgba(102, 204, 51, 0.28)',
      },
      mixed: {
        background: '#ffbd3f',
        text: '#1a1000',
        shadow: 'rgba(255, 189, 63, 0.3)',
      },
      poor: {
        background: '#ff614e',
        text: '#1a0400',
        shadow: 'rgba(255, 97, 78, 0.3)',
      },
    },
    retroScorePalettes: {
      excellent: {
        background: '#2a5e1f',
        text: '#f8f1e2',
        shadow: 'transparent',
      },
      great: {
        background: '#4d7c38',
        text: '#f8f1e2',
        shadow: 'transparent',
      },
      good: {
        background: '#7a6a18',
        text: '#f8f1e2',
        shadow: 'transparent',
      },
      mixed: {
        background: '#9e5018',
        text: '#f8f1e2',
        shadow: 'transparent',
      },
      poor: {
        background: '#8b2318',
        text: '#f8f1e2',
        shadow: 'transparent',
      },
    },
    futuristicScorePalettes: {
      excellent: { background: '#00c875', text: '#001a0d', shadow: 'rgba(0,200,117,0.4)' },
      great:     { background: '#00a8d4', text: '#00101a', shadow: 'rgba(0,168,212,0.38)' },
      good:      { background: '#7acc00', text: '#0a1a00', shadow: 'rgba(122,204,0,0.38)' },
      mixed:     { background: '#f0b000', text: '#1a0e00', shadow: 'rgba(240,176,0,0.38)' },
      poor:      { background: '#f03050', text: '#1a0010', shadow: 'rgba(240,48,80,0.4)' },
    },
    executiveScorePalettes: {
      excellent: { background: '#2a8a5a', text: '#f0faf5', shadow: 'rgba(42,138,90,0.22)' },
      great:     { background: '#3d7ab5', text: '#f0f5ff', shadow: 'rgba(61,122,181,0.22)' },
      good:      { background: '#6a9e2a', text: '#f5fae8', shadow: 'rgba(106,158,42,0.22)' },
      mixed:     { background: '#c4842a', text: '#fdf6ee', shadow: 'rgba(196,132,42,0.22)' },
      poor:      { background: '#b03a3a', text: '#fdf0f0', shadow: 'rgba(176,58,58,0.22)' },
    },
  },
  },
} as const;

export const templateConfigs: TemplateConfigMap = {
  modern: {
    colors: {
      accent: colorPalettes.templateSpecific.modern.accent,
      accentSoft: colorPalettes.templateSpecific.modern.accentSoft,
      accentStrong: colorPalettes.templateSpecific.modern.accentStrong,
      ink: colorPalettes.global.ink,
      mutedText: colorPalettes.templateSpecific.modern.mutedText,
      textOnAccent: colorPalettes.templateSpecific.modern.textOnAccent,
      gridLine: colorPalettes.templateSpecific.modern.gridLine,
      gridLineSoft: colorPalettes.templateSpecific.modern.gridLineSoft,
      pageBackground:
        `radial-gradient(circle at top left, rgba(247, 182, 214, 0.32), transparent 30%), linear-gradient(180deg, ${colorPalettes.global.whiteSoft} 0%, ${colorPalettes.global.white} 22%, ${colorPalettes.global.white} 100%)`,
      panelBackground: 'rgba(255, 255, 255, 0.96)',
      mutedPanelBackground: colorPalettes.global.whiteRoseMuted,
    },
    copy: {
      utilityBarLabel: 'Independent magazine template',
      headerTagline: 'Sharp takes, useful guides, and standout stories',
      footerDescription:
        'Built for bold editorial layouts with strong hierarchy, energetic accents, and roomy image-forward storytelling.',
      footerEyebrow: 'Latest edition',
      footerNavHeading: 'Sections',
      footerNoteChip: 'On the press',
      footerNoteBody: 'Fresh stories every week, hand-edited and image-forward.',
      footerCopyrightTagline: 'All rights reserved.',
      footerBottomTagline: 'Independent · Editorial · Curated',
    },
    layout: {
      navItems: {
        blog: { label: 'Blog', href: '/blog' },
        recipes: { label: 'Recipes', href: '/recipes' },
        products: { label: 'Products', href: '/products' },
        realestate: { label: 'Real Estate', href: '/listings' },
        reviews: { label: 'Reviews', href: '/reviews' },
        landingpage: { label: 'Landing Pages', href: '/lp' },
        utilitypage: { label: 'Pages', href: '/u' },
      },
    },
  },
  retro: {
    colors: {
      ink: colorPalettes.templateSpecific.retro.ink,
      mutedText: colorPalettes.templateSpecific.retro.mutedText,
      textOnAccent: colorPalettes.templateSpecific.retro.textOnAccent,
      highlightInk: colorPalettes.templateSpecific.retro.highlightInk,
      pageBackground: colorPalettes.templateSpecific.retro.pageBackground,
      panelBackground: colorPalettes.templateSpecific.retro.panelBackground,
      mutedPanelBackground: colorPalettes.templateSpecific.retro.mutedPanelBackground,
      contentBackground: colorPalettes.templateSpecific.retro.contentBackground,
      sidebarBackground: colorPalettes.templateSpecific.retro.sidebarBackground,
      footerBackground: colorPalettes.templateSpecific.retro.footerBackground,
      navBackground: colorPalettes.templateSpecific.retro.navBackground,
      navAltBackground: colorPalettes.templateSpecific.retro.navAltBackground,
      panelBorder: colorPalettes.templateSpecific.retro.panelBorder,
      highlight: colorPalettes.templateSpecific.retro.highlight,
      highlightStrong: colorPalettes.templateSpecific.retro.highlightStrong,
      link: colorPalettes.templateSpecific.retro.link,
      paperNoise: colorPalettes.templateSpecific.retro.paperNoise,
    },
    copy: {
      eyebrow: 'Crafted For Curious Browsers',
      tagline: 'A playful print-shop shell with brighter hierarchy, cleaner navigation, and enough breathing room to keep browsing comfortable.',
      metaLabel: 'Retro Menu',
      featureLabel: 'House Special',
      featureTitle: 'Bold retro framing, but with modern spacing and easy scanning built in.',
      featureDescription:
        'Inspired by old menu boards, packaging art, and illustrated diner ephemera. The layout keeps the personality, but avoids cramped columns, tiny labels, and overly noisy interactions.',
      footerEyebrow: 'Open Daily',
      footerDescription:
        'The retro template is now structured to support stronger configuration later through config.ts, so palette, copy, and navigation can evolve without rewriting the shell.',
      footerNavHeading: 'On the menu',
      footerHoursHeading: 'House Hours',
      footerHoursBody: 'Open Daily · 7 days a week',
      footerHoursBadgePrefix: 'Est.',
      footerCopyrightTagline: 'Hand-set with care.',
      footerBottomTagline: 'Paper · Press · Print',
      statHighlights: [
        { label: 'Panels', value: '06' },
        { label: 'Accent Tone', value: 'Gold' },
        { label: 'Readability', value: 'High' },
      ],
      sidebarCards: [
        {
          eyebrow: 'Quick Take',
          title: 'Warm paper textures',
          description: 'Soft grain and layered paneling keep the nostalgic feel without burying the content.',
          cta: 'Paper Stock',
        },
        {
          eyebrow: 'Comfort First',
          title: 'Bigger targets',
          description: 'Navigation and content panels use larger hit areas so the vintage look stays pleasant on touch devices.',
          cta: 'UX Tune-Up',
          emphasis: true,
        },
        {
          eyebrow: 'Config Ready',
          title: 'Future-proof shell',
          description: 'This layout now reads from config.ts so the background agent can fill in template-specific content later.',
          cta: 'Config Source',
        },
      ],
    },
    layout: {
      navItems: {
        blog: { label: 'Blog', href: '/blog' },
        recipes: { label: 'Recipes', href: '/recipes' },
        products: { label: 'Products', href: '/products' },
        realestate: { label: 'Real Estate', href: '/listings' },
        reviews: { label: 'Reviews', href: '/reviews' },
        landingpage: { label: 'Landing Pages', href: '/lp' },
        utilitypage: { label: 'Pages', href: '/u' },
      },
      backgroundAdornment: 'paper',
    },
  },
  executive: {
    colors: {
      pageBackground: colorPalettes.templateSpecific.executive.pageBackground,
      ink: colorPalettes.templateSpecific.executive.ink,
      mutedText: colorPalettes.templateSpecific.executive.mutedText,
      accent: colorPalettes.templateSpecific.executive.accent,
      accentStrong: colorPalettes.templateSpecific.executive.accentStrong,
      panelBackground: colorPalettes.templateSpecific.executive.panelBackground,
      mutedPanelBackground: colorPalettes.templateSpecific.executive.mutedPanelBackground,
      panelBorder: colorPalettes.templateSpecific.executive.panelBorder,
      headerBackground: colorPalettes.templateSpecific.executive.headerBackground,
      footerBackground: colorPalettes.templateSpecific.executive.footerBackground,
      notificationDot: colorPalettes.templateSpecific.executive.notificationDot,
    },
    copy: {
      footerTagline: 'All rights reserved.',
      footerDescription: 'A focused workspace for clear decisions, structured updates, and confident execution.',
      footerStatusText: 'Live status: All systems normal',
      footerNavHeading: 'Workspace',
      footerBriefingHeading: 'Briefing',
      footerBriefingTitle: 'Weekly digest',
      footerBriefingBody: 'Curated highlights and updates delivered every Monday.',
      footerBriefingCta: 'Subscribe',
      footerBottomTagline: 'Privacy · Terms · Status',
    },
    layout: {
      navItems: {
        blog: { label: 'Blog', href: '/blog' },
        recipes: { label: 'Recipes', href: '/recipes' },
        products: { label: 'Products', href: '/products' },
        realestate: { label: 'Real Estate', href: '/listings' },
        reviews: { label: 'Reviews', href: '/reviews' },
        landingpage: { label: 'Landing Pages', href: '/lp' },
        utilitypage: { label: 'Pages', href: '/u' },
      },
    },
  },
  futuristic: {
    colors: {
      pageBackground: colorPalettes.templateSpecific.futuristic.pageBackground,
      bodyText: colorPalettes.templateSpecific.futuristic.bodyText,
      ink: colorPalettes.templateSpecific.futuristic.ink,
      mutedText: colorPalettes.templateSpecific.futuristic.mutedText,
      accent: colorPalettes.templateSpecific.futuristic.accent,
      accentStrong: colorPalettes.templateSpecific.futuristic.accentStrong,
      accentBorder: colorPalettes.templateSpecific.futuristic.accentBorder,
      accentGlow: colorPalettes.templateSpecific.futuristic.accentGlow,
      panelBackground: colorPalettes.templateSpecific.futuristic.panelBackground,
      mutedPanelBackground: colorPalettes.templateSpecific.futuristic.mutedPanelBackground,
      panelBorder: colorPalettes.templateSpecific.futuristic.panelBorder,
      headerBackground: colorPalettes.templateSpecific.futuristic.headerBackground,
      footerBackground: colorPalettes.templateSpecific.futuristic.footerBackground,
      topGlowLine: colorPalettes.templateSpecific.futuristic.topGlowLine,
      scanlineOverlay: colorPalettes.templateSpecific.futuristic.scanlineOverlay,
      gridOverlay: colorPalettes.templateSpecific.futuristic.gridOverlay,
      imageBorder: colorPalettes.templateSpecific.futuristic.imageBorder,
    },
    copy: {
      footerPrefix: '>_',
      footerSubtitle: 'Adaptive Interface',
      footerDescription: 'Config-driven shell rendering modular surfaces in a unified runtime.',
      footerNavHeading: 'Modules',
      footerSystemHeading: 'System',
      footerSystemStatus: 'Operational',
      footerSystemTheme: 'Config-Driven',
      footerInterfaceLabel: 'interface',
      footerBottomTagline: 'All signals secured',
    },
    layout: {
      navItems: {
        blog: { label: 'LOG', href: '/blog' },
        recipes: { label: 'RECIPES', href: '/recipes' },
        products: { label: 'PRODUCTS', href: '/products' },
        realestate: { label: 'REAL ESTATE', href: '/listings' },
        reviews: { label: 'REVIEWS', href: '/reviews' },
        landingpage: { label: 'PAGES', href: '/lp' },
        utilitypage: { label: 'UTIL', href: '/u' },
      },
      mainContainerClassName: 'relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10',
      backgroundAdornment: 'grid',
    },
  },
};

export const moduleConfigs: ModuleConfigMap = {
  blog: {
    colors: {
      accent: colorPalettes.moduleSpecific.editorialAccent,
      ink: colorPalettes.global.inkStrong,
      panelBackground: colorPalettes.global.white,
      panelBorder: colorPalettes.global.borderSoft,
    },
    copy: {
      title: 'Blog',
      emptyState: 'No published posts yet.',
      featuredLabel: 'Latest',
      moreLabel: 'More Articles',
    },
    layout: {
      containerClassName: 'max-w-7xl mx-auto px-4 sm:px-6',
      featuredGridClassName: 'xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.72fr)_minmax(220px,0.62fr)]',
      featuredSideCount: 2,
      railCount: 6,
    },
  },
  recipes: {
    colors: {
      accent: colorPalettes.moduleSpecific.editorialAccent,
      ink: colorPalettes.global.inkStrong,
      panelBackground: colorPalettes.global.white,
      panelBorder: colorPalettes.global.borderSoft,
    },
    copy: {
      title: 'Recipes',
      emptyState: 'No recipes published yet.',
      featuredLabel: 'Latest',
      moreLabel: 'More Recipes',
    },
    layout: {
      containerClassName: 'max-w-7xl mx-auto px-4 sm:px-6',
      featuredGridClassName: 'xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.72fr)_minmax(220px,0.62fr)]',
      featuredSideCount: 2,
      railCount: 6,
    },
  },
  realestate: {
    colors: {
      accent: colorPalettes.templateSpecific.modern.accent,
      ink: colorPalettes.global.ink,
      panelBackground: colorPalettes.global.white,
      panelBorder: colorPalettes.global.borderSoft,
    },
    copy: {
      title: 'Listings',
      emptyState: 'No listings published yet.',
      featuredLabel: 'Featured Listings',
      moreLabel: 'More Properties',
      heroEyebrow: 'Property Finder',
      heroDescription: 'Browse a cleaner, easier-to-scan property feed with stronger pricing, specs, and location hierarchy.',
      amenitiesHeading: 'What makes it more special?',
    },
    layout: {
      containerClassName: 'max-w-6xl mx-auto px-4 sm:px-6 py-10',
      featuredGridClassName: '',
      featuredSideCount: 0,
      railCount: 0,
    },
  },
  reviews: {
    colors: {
      accent: colorPalettes.moduleStyleSpecific.reviews.accent,
      ink: colorPalettes.global.ink,
      railBorder: colorPalettes.moduleStyleSpecific.reviews.railBorder,
      sectionRule: colorPalettes.global.borderSoft,
      featuredBadgeBackground: `linear-gradient(135deg, ${colorPalettes.global.whiteRose} 0%, ${colorPalettes.templateSpecific.modern.accentSoft} 100%)`,
      featuredBadgeText: colorPalettes.moduleStyleSpecific.reviews.badgeText,
      featuredBadgeBorder: 'rgba(157, 23, 77, 0.14)',
      featuredCard: {
        borderRadius: 24,
        shadow: '0 18px 48px rgba(22, 18, 24, 0.08)',
      },
      reviewCard: {
        borderRadius: 24,
        shadow: '0 14px 40px rgba(22, 18, 24, 0.05)',
      },
      typeStyles: colorPalettes.moduleStyleSpecific.reviews.typeStyles,
      scorePalettes: colorPalettes.moduleStyleSpecific.reviews.scorePalettes,
    },
    copy: {
      title: 'Reviews',
      emptyState: 'No reviews published yet.',
      railHeading: 'Buzz',
      moreReviewsLabel: 'More Reviews',
      reviewTypes: {
        movie: 'Movies',
        music: 'Music',
        product: 'Products',
        book: 'Books',
        game: 'Games',
        restaurant: 'Restaurants',
      },
    },
    layout: {
      containerClassName: 'max-w-6xl mx-auto px-4 sm:px-6 py-10',
      featuredGridClassName: 'xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.72fr)_minmax(220px,0.62fr)]',
      remainingGridClassName: 'md:grid-cols-2 xl:grid-cols-3',
      sideReviewCount: 2,
      railReviewCount: 5,
    },
  },
  products: {
    colors: {
      accent: colorPalettes.templateSpecific.modern.accent,
      ink: colorPalettes.global.ink,
      panelBackground: colorPalettes.global.white,
      panelBorder: colorPalettes.global.borderSoft,
    },
    copy: {
      title: 'Products',
      emptyState: 'No products published yet.',
      featuredLabel: 'Featured Products',
      moreLabel: 'More Products',
    },
    layout: {
      containerClassName: 'max-w-6xl mx-auto px-4 sm:px-6 py-10',
      featuredGridClassName: '',
      featuredSideCount: 0,
      railCount: 0,
    },
  },
};

export function getTemplateConfig<T extends TemplateName>(template: T): TemplateConfigMap[T] {
  return templateConfigs[template];
}

export function getModuleConfig<T extends ModuleName>(moduleName: T): ModuleConfigMap[T] {
  return moduleConfigs[moduleName];
}
