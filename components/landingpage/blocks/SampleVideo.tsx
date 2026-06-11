/**
 * SampleVideo — "Try a free lesson" iframe (Digital layout).
 *
 * ``data`` shape: ``{ url: string, label?: string, poster_url?: string }``.
 * Accepts either a YouTube/Vimeo embed URL or a direct MP4 URL. Renders
 * a 16:9 responsive container.
 */
import { t } from '../sections';

type SampleVideoData = { url?: string; label?: string; poster_url?: string };

function isYouTubeOrVimeo(url: string): boolean {
  return /youtube\.com\/embed|youtu\.be|player\.vimeo\.com/.test(url);
}

export default function SampleVideo({ data }: { data: Record<string, unknown> }) {
  const d = data as SampleVideoData;
  if (!d.url) return null;
  return (
    <section className="py-16" style={{ background: t.mutedPanel }}>
      <div className="max-w-4xl mx-auto px-4">
        {d.label && (
          <h3 className="text-center text-2xl font-bold mb-6" style={{ color: t.ink }}>{d.label}</h3>
        )}
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          style={{ aspectRatio: '16 / 9', background: '#000' }}
        >
          {isYouTubeOrVimeo(d.url) ? (
            <iframe
              src={d.url}
              title={d.label || 'Sample video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          ) : (
            <video
              src={d.url}
              poster={d.poster_url}
              controls
              playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
