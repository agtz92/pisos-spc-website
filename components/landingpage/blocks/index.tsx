/**
 * Landing Page custom blocks — polymorphic block dispatcher.
 *
 * Each ``LandingCustomBlock`` carries a ``blockType`` discriminator and a
 * free-form ``data`` payload whose shape depends on the type. The catalogue
 * of types lives on the backend at
 * ``backend/content/models.py::LandingCustomBlock.BLOCK_TYPES``.
 *
 * Phase 1 scope: only ``StickyBar`` ships as a real renderer; the other
 * components are placeholders that render ``null`` until later phases give
 * them their own layouts and editor UI. Existing landing pages keep
 * rendering identically because all custom blocks are opt-in.
 */

import type { LandingCustomBlock } from '@/lib/graphql';
import StickyBar from './StickyBar';
import Marquee from './Marquee';
import Manifesto from './Manifesto';
import Guarantee from './Guarantee';
import Booking from './Booking';
import PressKit from './PressKit';
import Support from './Support';
import SampleVideo from './SampleVideo';
import TrustStrip from './TrustStrip';
import PressMentions from './PressMentions';
import ComparisonTable from './ComparisonTable';
import ReviewsAggregate from './ReviewsAggregate';
import NewsletterSignup from './NewsletterSignup';
import BentoFeatures from './BentoFeatures';
import ProcessTimeline from './ProcessTimeline';
import Outcomes from './Outcomes';
import BonusStack from './BonusStack';
import AwardsGrid from './AwardsGrid';
import TeamGrid from './TeamGrid';
import SocialRow from './SocialRow';
import FeaturedLinkCards from './FeaturedLinkCards';
import IndustriesGrid from './IndustriesGrid';
import StickySectionNav from './StickySectionNav';
import ContactFormInline from './ContactFormInline';
import ProductsGrid from './ProductsGrid';

export {
  StickyBar, PressMentions, ComparisonTable, ReviewsAggregate, NewsletterSignup, BentoFeatures,
  ProcessTimeline, Outcomes, BonusStack, AwardsGrid, TeamGrid, SocialRow, FeaturedLinkCards,
  IndustriesGrid, StickySectionNav, ContactFormInline, ProductsGrid,
};

/** Find the first enabled custom block of a given type on a page. */
export function pickBlock<T extends string>(
  blocks: LandingCustomBlock[] | undefined,
  blockType: T,
): LandingCustomBlock | undefined {
  return (blocks ?? []).find((b) => b.blockType === blockType && b.enabled);
}

/** Render a single custom block by type. Returns ``null`` for unknown or
 *  unimplemented types so future blocks can ship without renderer churn. */
export function CustomBlock({ block }: { block: LandingCustomBlock }) {
  if (!block.enabled) return null;
  switch (block.blockType) {
    case 'marquee':       return <Marquee data={block.data} />;
    case 'manifesto':     return <Manifesto data={block.data} />;
    case 'guarantee':     return <Guarantee data={block.data} />;
    case 'booking':       return <Booking data={block.data} />;
    case 'press_kit':     return <PressKit data={block.data} />;
    case 'support':       return <Support data={block.data} />;
    case 'sample_video':  return <SampleVideo data={block.data} />;
    case 'trust_strip':   return <TrustStrip data={block.data} />;
    default:              return null;
  }
}
