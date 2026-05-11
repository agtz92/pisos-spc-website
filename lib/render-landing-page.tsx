import { getPosts, getRecipes, getProducts, getListings, getReviews, type LandingPage } from '@/lib/graphql';
import { getTenantCached } from '@/lib/modules';
import type { ModuleData } from '@/components/landingpage/sections';
import LandingPageLayoutStorefront from '@/components/landingpage/LandingPageLayoutStorefront';
import LandingPageLayoutServices from '@/components/landingpage/LandingPageLayoutServices';
import LandingPageLayoutDigital from '@/components/landingpage/LandingPageLayoutDigital';
import LandingPageLayoutPortfolio from '@/components/landingpage/LandingPageLayoutPortfolio';
import LandingPageLayoutLinks from '@/components/landingpage/LandingPageLayoutLinks';
import LandingPageLayoutMacro from '@/components/landingpage/LandingPageLayoutMacro';

export async function fetchLandingPageModules(): Promise<ModuleData> {
  const tenant = await getTenantCached();
  const active = tenant?.modules ?? [];
  const [posts, recipes, products, listings, reviews] = await Promise.all([
    active.includes('blog')       ? getPosts().catch(() => [])    : Promise.resolve([]),
    active.includes('recipes')    ? getRecipes().catch(() => [])  : Promise.resolve([]),
    active.includes('products')   ? getProducts().catch(() => []) : Promise.resolve([]),
    active.includes('realestate') ? getListings().catch(() => []) : Promise.resolve([]),
    active.includes('reviews')    ? getReviews().catch(() => [])  : Promise.resolve([]),
  ]);
  return { posts, recipes, products, listings, reviews, activeModules: active };
}

export function renderLandingPage(page: LandingPage, modules: ModuleData) {
  const layout = page.layout || 'storefront';
  if (layout === 'macro')     return <LandingPageLayoutMacro     page={page} modules={modules} />;
  if (layout === 'services')  return <LandingPageLayoutServices  page={page} modules={modules} />;
  if (layout === 'digital')   return <LandingPageLayoutDigital   page={page} modules={modules} />;
  if (layout === 'portfolio') return <LandingPageLayoutPortfolio page={page} modules={modules} />;
  if (layout === 'links')     return <LandingPageLayoutLinks     page={page} modules={modules} />;
  return <LandingPageLayoutStorefront page={page} modules={modules} />;
}
