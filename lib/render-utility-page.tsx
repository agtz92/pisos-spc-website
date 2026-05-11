import type { UtilityPage } from '@/lib/graphql';
import UtilityAboutNarrative from '@/components/utilitypage/UtilityAboutNarrative';
import UtilityAboutTeamGrid from '@/components/utilitypage/UtilityAboutTeamGrid';
import UtilityAboutTimeline from '@/components/utilitypage/UtilityAboutTimeline';
import UtilityContactSplit from '@/components/utilitypage/UtilityContactSplit';
import UtilityContactCentered from '@/components/utilitypage/UtilityContactCentered';
import UtilityContactFullBleed from '@/components/utilitypage/UtilityContactFullBleed';
import UtilityFaqAccordion from '@/components/utilitypage/UtilityFaqAccordion';
import UtilityFaqTwoColumn from '@/components/utilitypage/UtilityFaqTwoColumn';
import UtilityFaqSearchable from '@/components/utilitypage/UtilityFaqSearchable';
import UtilityLegalSingle from '@/components/utilitypage/UtilityLegalSingle';
import UtilityLegalToc from '@/components/utilitypage/UtilityLegalToc';
import UtilityLegalCompact from '@/components/utilitypage/UtilityLegalCompact';
import UtilityNotFoundCentered from '@/components/utilitypage/UtilityNotFoundCentered';
import UtilityNotFoundSplit from '@/components/utilitypage/UtilityNotFoundSplit';

export function renderUtilityPage(page: UtilityPage) {
  switch (page.layout) {
    case 'about_narrative':    return <UtilityAboutNarrative    page={page} />;
    case 'about_team_grid':    return <UtilityAboutTeamGrid     page={page} />;
    case 'about_timeline':     return <UtilityAboutTimeline     page={page} />;
    case 'contact_split':      return <UtilityContactSplit      page={page} />;
    case 'contact_centered':   return <UtilityContactCentered   page={page} />;
    case 'contact_full_bleed': return <UtilityContactFullBleed  page={page} />;
    case 'faq_accordion':      return <UtilityFaqAccordion      page={page} />;
    case 'faq_two_column':     return <UtilityFaqTwoColumn      page={page} />;
    case 'faq_searchable':     return <UtilityFaqSearchable     page={page} />;
    case 'legal_single':       return <UtilityLegalSingle       page={page} />;
    case 'legal_toc':          return <UtilityLegalToc          page={page} />;
    case 'legal_compact':      return <UtilityLegalCompact      page={page} />;
    case 'notfound_centered':  return <UtilityNotFoundCentered  page={page} />;
    case 'notfound_split':     return <UtilityNotFoundSplit     page={page} />;
    default:                   return <UtilityAboutNarrative    page={page} />;
  }
}
