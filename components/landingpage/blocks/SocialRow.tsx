/**
 * SocialRow — Compact strip of social platform handles (Links layout).
 */
import type { LandingPage } from '@/lib/graphql';
import { t } from '../sections';

const PLATFORM_LABEL: Record<string, string> = {
  instagram: 'IG', twitter: '𝕏', youtube: 'YT', tiktok: 'TT',
  linkedin: 'in', spotify: '♪', github: 'GH', facebook: 'f',
};

export default function SocialRow({ page }: { page: LandingPage }) {
  const items = page.socialLinks || [];
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2 my-4">
      {items.map((s) => (
        <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-colors"
           style={{ background: t.panel, border: `1px solid ${t.panelBorder}`, color: t.accent }}
           title={s.platform}>
          {PLATFORM_LABEL[s.platform] || s.platform.charAt(0).toUpperCase()}
        </a>
      ))}
    </div>
  );
}
