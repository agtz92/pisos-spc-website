import type { Metadata } from 'next';
import { getTenant } from '@/lib/graphql';
import { ModernLayout } from '@/lib/templates/modern';
import { RetroLayout } from '@/lib/templates/retro';
import { FuturisticLayout } from '@/lib/templates/futuristic';
import { ExecutiveLayout } from '@/lib/templates/executive';
import './globals.css';

export const revalidate = 60;

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
  const enabledModules = tenant?.modules ?? [];
  const template = tenant?.template ?? 'modern';
  const savedConfig = (tenant?.templateConfig?.[template] ?? {}) as Record<string, unknown>;

  const layoutProps = { siteName, enabledModules, savedConfig, children };

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

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <TemplateLayout {...layoutProps} />
      </body>
    </html>
  );
}
