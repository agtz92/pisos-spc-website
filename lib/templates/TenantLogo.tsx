import Link from 'next/link';

/**
 * Tenant logo, shared across every template's header and footer.
 *
 * A single uploaded asset auto-fits to wherever it renders: the height is
 * capped per context (`variant`) while width stays `auto` with
 * `object-fit: contain`, so any aspect ratio (wide wordmark, square mark, …)
 * scales without distortion or cropping. Templates fall back to their text
 * wordmark when `src` is null.
 */
interface TenantLogoProps {
  src: string;
  alt: string;
  variant: 'header' | 'footer';
  /** Wrap the image in a Link to "/". Defaults to true. */
  linked?: boolean;
  className?: string;
  /** Optional CSS size overrides. Fall back to the per-variant defaults. */
  maxHeight?: string;
  maxWidth?: string;
}

const SIZING: Record<TenantLogoProps['variant'], { maxHeight: string; maxWidth: string }> = {
  // Navbar: a touch larger, the primary brand surface.
  header: { maxHeight: 'clamp(36px, 6vw, 56px)', maxWidth: '220px' },
  // Footer: more restrained.
  footer: { maxHeight: 'clamp(28px, 5vw, 44px)', maxWidth: '180px' },
};

export function TenantLogo({ src, alt, variant, linked = true, className, maxHeight: maxHeightProp, maxWidth: maxWidthProp }: TenantLogoProps) {
  const maxHeight = maxHeightProp ?? SIZING[variant].maxHeight;
  const maxWidth = maxWidthProp ?? SIZING[variant].maxWidth;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- logo is a remote tenant asset of unknown intrinsic size; CSS object-fit handles sizing.
    <img
      src={src}
      alt={alt}
      style={{
        height: 'auto',
        width: 'auto',
        maxHeight,
        maxWidth,
        objectFit: 'contain',
        display: 'block',
      }}
    />
  );

  if (!linked) return <span className={className}>{img}</span>;

  return (
    <Link href="/" className={`inline-flex items-center no-underline ${className ?? ''}`} style={{ color: 'inherit' }}>
      {img}
    </Link>
  );
}
