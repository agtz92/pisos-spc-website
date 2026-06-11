import type { Metadata } from 'next';
import { getTenant, resolveMediaUrl } from '@/lib/graphql';
import { ModernLayout } from '@/lib/templates/modern';
import { RetroLayout } from '@/lib/templates/retro';
import { FuturisticLayout } from '@/lib/templates/futuristic';
import { ExecutiveLayout } from '@/lib/templates/executive';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import './globals.css';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: {
    template: '%s | Pisos SPC',
    default: 'Pisos SPC',
  },
  description: 'Pisos SPC',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let tenant: Awaited<ReturnType<typeof getTenant>> = null;
  try {
    tenant = await getTenant();
  } catch {
    // Backend might not be running
  }

  const siteName = tenant?.name ?? 'Pisos SPC';
  const logo = resolveMediaUrl(tenant?.logo);
  const enabledModules = tenant?.modules ?? [];
  const template = tenant?.template ?? 'modern';
  const savedConfig = (tenant?.templateConfig?.[template] ?? {}) as Record<string, unknown>;

  const layoutProps = { siteName, logo, enabledModules, savedConfig, children };

  let TemplateLayout: React.ComponentType<typeof layoutProps>;
  if (template === 'retro') {
    TemplateLayout = RetroLayout;
  } else if (template === 'futuristic') {
    TemplateLayout = FuturisticLayout;
  } else if (template === 'executive') {
    TemplateLayout = ExecutiveLayout;
  } else {
    TemplateLayout = ModernLayout;
  }

  const customHead      = tenant?.customCodeHead ?? '';
  const customBodyStart = tenant?.customCodeBodyStart ?? '';
  const customBodyEnd   = tenant?.customCodeBodyEnd ?? '';

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {customHead ? (
          <span suppressHydrationWarning dangerouslySetInnerHTML={{ __html: customHead }} />
        ) : null}
      </head>
      <body className="min-h-full">
        {customBodyStart ? (
          <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: customBodyStart }} />
        ) : null}
        <TemplateLayout {...layoutProps} />
        {/* WhatsApp floating CTA — tenant-configurable; renders nothing
            unless the tenant enables it AND provides a phone. Phase 2
            will allow per-page overrides via prop drilling from the
            page renderer (LandingPage, Post, UtilityPage). */}
        <WhatsAppFloat
          enabled={tenant?.whatsappEnabled ?? false}
          phone={tenant?.whatsappPhone ?? ''}
          message={tenant?.whatsappMessage ?? ''}
          lottieEnabled={tenant?.whatsappLottieEnabled ?? true}
        />
        {customBodyEnd ? (
          <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: customBodyEnd }} />
        ) : null}
      </body>
    </html>
  );
}
