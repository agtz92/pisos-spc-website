import { cache } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG ?? '';

export const GRAPHQL_URL = `${API_BASE}/t/${TENANT_SLUG}/graphql/`;

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar: string | null;
}

export interface Seo {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface Post {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  publishedAt: string | null;
  createdAt: string;
  coverImage: string | null;
  category: Category | null;
  author: Author | null;
  tags: Tag[];
  seo: Seo;
}

/**
 * Cache tags let the backend invalidate only the affected pages via
 * ``revalidateTag`` (see ``app/api/revalidate/route.ts``). Each query passes
 * the tag(s) matching the Django model(s) it reads, so e.g. saving a Product
 * only rebuilds product/landing/home pages — not the blog.
 *
 * ``revalidate: 86400`` is just a 1-day safety net in case a webhook is missed
 * (backend asleep, network blip). Normal freshness comes from the on-demand
 * tag invalidation, not from time-based expiry.
 */
async function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
  tags?: string[],
): Promise<T> {
  // NOTE: deliberately no AbortController timeout here. Page/build fetches must
  // be allowed to complete even when the backend is briefly slow (e.g. under the
  // burst of concurrent requests `next build` makes while prerendering). A short
  // abort here would turn slow-but-OK renders into baked 404s / error states.
  // The per-request 504 risk lived in the EDGE middleware, which has its own
  // dedicated short timeout — see middleware.ts.
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 86400, tags: tags ?? [] },
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}

/**
 * Canonical cache-tag names, one per content type. These MUST stay in sync
 * with the model→tag map in ``app/api/revalidate/route.ts`` and the Django
 * signal in ``backend/content/signals.py`` (which sends the lowercased model
 * name; the route maps it to one of these tags).
 */
export const TAGS = {
  blog: 'blog',
  recipes: 'recipes',
  products: 'products',
  listings: 'listings',
  reviews: 'reviews',
  landing: 'landing',
  utility: 'utility',
  tenant: 'tenant',
} as const;

// ── Field fragments ───────────────────────────────────────────────────────────

const POST_FIELDS = `
  id uuid title slug excerpt body
  publishedAt createdAt coverImage
  category { id name slug }
  author { id name slug bio avatar }
  tags { id name slug }
  seo { metaTitle metaDescription ogImage canonicalUrl }
`;

const POST_LIST_FIELDS = `
  id uuid title slug excerpt
  publishedAt createdAt coverImage
  category { id name slug }
  author { id name slug avatar }
  tags { id name slug }
`;

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getPosts(options?: {
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  featured?: boolean;    // v2 — LP blog_source='featured'
  limit?: number;        // v2 — LP blog_count
}): Promise<Post[]> {
  const data = await gql<{ posts: Post[] }>(
    `query Posts($categorySlug: String, $tagSlug: String, $authorSlug: String, $featured: Boolean, $limit: Int) {
      posts(categorySlug: $categorySlug, tagSlug: $tagSlug, authorSlug: $authorSlug, featured: $featured, limit: $limit) {
        ${POST_LIST_FIELDS}
      }
    }`,
    {
      categorySlug: options?.categorySlug ?? null,
      tagSlug: options?.tagSlug ?? null,
      authorSlug: options?.authorSlug ?? null,
      featured: options?.featured ?? null,
      limit: options?.limit ?? null,
    },
    [TAGS.blog],
  );
  return data.posts;
}

export async function getPost(slug: string): Promise<Post | null> {
  const data = await gql<{ post: Post | null }>(
    `query Post($slug: String!) {
      post(slug: $slug) { ${POST_FIELDS} }
    }`,
    { slug },
    [TAGS.blog],
  );
  return data.post;
}

export async function getCategories(module?: string): Promise<Category[]> {
  const filter = module ? `(module: "${module}")` : '';
  const data = await gql<{ categories: Category[] }>(
    `query Categories {
      categories${filter} { id name slug }
    }`,
    undefined,
    [module ?? 'taxonomy'],
  );
  return data.categories;
}

export async function getTags(module?: string): Promise<Tag[]> {
  const filter = module ? `(module: "${module}")` : '';
  const data = await gql<{ tags: Tag[] }>(
    `query Tags {
      tags${filter} { id name slug }
    }`,
    undefined,
    [module ?? 'taxonomy'],
  );
  return data.tags;
}

export async function getAuthors(): Promise<Author[]> {
  const data = await gql<{ authors: Author[] }>(
    `query Authors {
      authors { id name slug bio avatar }
    }`,
    undefined,
    [TAGS.blog, TAGS.reviews],
  );
  return data.authors;
}

export async function getAuthor(slug: string): Promise<Author | null> {
  const data = await gql<{ author: Author | null }>(
    `query Author($slug: String!) {
      author(slug: $slug) { id name slug bio avatar }
    }`,
    { slug },
    [TAGS.blog, TAGS.reviews],
  );
  return data.author;
}

// ── Tenant ────────────────────────────────────────────────────────────────────

export interface TenantInfo {
  name: string;
  logo: string | null;
  template: string;
  templateConfig: Record<string, unknown> | null;
  modules: string[];
  isVerified: boolean;     // v2 · Phase 6 — Links profile verified badge
  customCodeHead: string;
  customCodeBodyStart: string;
  customCodeBodyEnd: string;
  // WhatsApp floating button (Phase 1) ────────────────────────────────────
  whatsappEnabled: boolean;
  whatsappPhone: string;
  whatsappMessage: string;
  whatsappLottieEnabled: boolean;
  // Product stock badge config ─────────────────────────────────────────────
  productStockIndicatorEnabled: boolean;
  productInStockLabel: string;
  productInStockColor: string;
  productOutOfStockLabel: string;
  productOutOfStockColor: string;
}

export async function getTenant(): Promise<TenantInfo | null> {
  const data = await gql<{ tenant: TenantInfo | null }>(
    `query Tenant {
      tenant {
        name
        logo
        template
        templateConfig
        modules
        isVerified
        customCodeHead
        customCodeBodyStart
        customCodeBodyEnd
        whatsappEnabled
        whatsappPhone
        whatsappMessage
        whatsappLottieEnabled
        productStockIndicatorEnabled
        productInStockLabel
        productInStockColor
        productOutOfStockLabel
        productOutOfStockColor
      }
    }`,
    undefined,
    [TAGS.tenant],
  );
  return data.tenant;
}

// ── Redirects ────────────────────────────────────────────────────────────────

export interface PublicRedirect {
  fromPath: string;
  toPath: string;
  statusCode: number;
  isWildcard: boolean;
}

export async function getRedirects(): Promise<PublicRedirect[]> {
  const data = await gql<{ redirects: PublicRedirect[] }>(
    `query Redirects { redirects { fromPath toPath statusCode isWildcard } }`,
    undefined,
    [TAGS.tenant],
  );
  return data.redirects ?? [];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
}

// ── Recipe types ──────────────────────────────────────────────────────────────

export interface IngredientModel {
  id: string;
  name: string;
  slug: string;
}

export interface RecipeIngredient {
  id: string;
  ingredient: IngredientModel;
  amount: string;
  unit: string;
  notes: string;
  order: number;
}

export interface RecipeInstruction {
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  difficulty: string;
  notes: string;
  publishedAt: string | null;
  createdAt: string;
  category: Category | null;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
}

// ── Product types ─────────────────────────────────────────────────────────────

export interface SpecGroup {
  name: string;
  headers: string[];
  rows: string[][];
}

export interface ProductImage {
  id: string;
  image: string | null;
  alt: string;
  order: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage: string | null;
  price: string | null;
  compareAtPrice: string | null;
  sku: string;
  stock: number | null;
  brand: string;
  publishedAt: string | null;
  createdAt: string;
  category: Category | null;
  /** Only populated by getProduct (detail). List queries omit this field for payload size. */
  specifications?: SpecGroup[];
  /** Gallery images. Detail page only — list fragments omit it. Cover image
   *  always renders first, then these in ``order``. */
  images?: ProductImage[];
}

// ── Listing types ─────────────────────────────────────────────────────────────

export interface Listing {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  listingType: string;
  propertyType: string;
  price: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  bedrooms: number | null;
  bathrooms: string | null;
  area: string | null;
  yearBuilt: number | null;
  parking: number | null;
  amenities: { id: string; name: string }[];
  publishedAt: string | null;
  createdAt: string;
  category: Category | null;
}

// ── Review types ──────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  title: string;
  slug: string;
  subject: string;
  reviewType: string;
  creator: string;
  releaseYear: number | null;
  genre: string;
  rating: string | null;
  body: string;
  verdict: string;
  pros: string[];
  cons: string[];
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
  category: Category | null;
  author: Author | null;
}

// ── Recipe queries ────────────────────────────────────────────────────────────

const RECIPE_LIST_FIELDS = `
  id title slug description coverImage
  prepTime cookTime servings difficulty
  publishedAt createdAt
  category { id name slug }
`;

const RECIPE_FIELDS = `
  id title slug description coverImage
  prepTime cookTime servings difficulty notes
  publishedAt createdAt
  category { id name slug }
  ingredients { id amount unit notes order ingredient { id name slug } }
  instructions { description }
`;

export async function getRecipes(options?: { categorySlug?: string; limit?: number }): Promise<Recipe[]> {
  const data = await gql<{ recipes: Recipe[] }>(
    `query Recipes($categorySlug: String, $limit: Int) {
      recipes(categorySlug: $categorySlug, limit: $limit) { ${RECIPE_LIST_FIELDS} }
    }`,
    { categorySlug: options?.categorySlug ?? null, limit: options?.limit ?? null },
    [TAGS.recipes],
  );
  return data.recipes;
}

export async function getRecipe(slug: string): Promise<Recipe | null> {
  const data = await gql<{ recipe: Recipe | null }>(
    `query Recipe($slug: String!) {
      recipe(slug: $slug) { ${RECIPE_FIELDS} }
    }`,
    { slug },
    [TAGS.recipes],
  );
  return data.recipe;
}

// ── Product queries ───────────────────────────────────────────────────────────

const PRODUCT_LIST_FIELDS = `
  id title slug shortDescription description coverImage
  price compareAtPrice brand sku stock
  publishedAt createdAt
  category { id name slug }
`;

const PRODUCT_DETAIL_FIELDS = `
  ${PRODUCT_LIST_FIELDS}
  specifications { name headers rows }
  images { id image alt order }
`;

export async function getProducts(options?: {
  categorySlug?: string;
  featured?: boolean;   // v2 — LP products_source='featured'
  limit?: number;       // v2 — LP products_count
}): Promise<Product[]> {
  const data = await gql<{ products: Product[] }>(
    `query Products($categorySlug: String, $featured: Boolean, $limit: Int) {
      products(categorySlug: $categorySlug, featured: $featured, limit: $limit) { ${PRODUCT_LIST_FIELDS} }
    }`,
    {
      categorySlug: options?.categorySlug ?? null,
      featured: options?.featured ?? null,
      limit: options?.limit ?? null,
    },
    [TAGS.products],
  );
  return data.products;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const data = await gql<{ product: Product | null }>(
    `query Product($slug: String!) {
      product(slug: $slug) { ${PRODUCT_DETAIL_FIELDS} }
    }`,
    { slug },
    [TAGS.products],
  );
  return data.product;
}

// ── Listing queries ───────────────────────────────────────────────────────────

const LISTING_LIST_FIELDS = `
  id title slug coverImage
  listingType propertyType price
  address city state country
  bedrooms bathrooms area
  publishedAt createdAt
  category { id name slug }
`;

const LISTING_FIELDS = `
  id title slug description coverImage
  listingType propertyType price
  address city state zipCode country
  bedrooms bathrooms area yearBuilt parking
  amenities { id name }
  publishedAt createdAt
  category { id name slug }
`;

export async function getListings(options?: {
  listingType?: string;
  propertyType?: string;
  limit?: number;    // v2 — LP listings_count
}): Promise<Listing[]> {
  const data = await gql<{ listings: Listing[] }>(
    `query Listings($listingType: String, $propertyType: String, $limit: Int) {
      listings(listingType: $listingType, propertyType: $propertyType, limit: $limit) { ${LISTING_LIST_FIELDS} }
    }`,
    {
      listingType: options?.listingType ?? null,
      propertyType: options?.propertyType ?? null,
      limit: options?.limit ?? null,
    },
    [TAGS.listings],
  );
  return data.listings;
}

export async function getListing(slug: string): Promise<Listing | null> {
  const data = await gql<{ listing: Listing | null }>(
    `query Listing($slug: String!) {
      listing(slug: $slug) { ${LISTING_FIELDS} }
    }`,
    { slug },
    [TAGS.listings],
  );
  return data.listing;
}

// ── Review queries ────────────────────────────────────────────────────────────

const REVIEW_LIST_FIELDS = `
  id title slug subject reviewType creator releaseYear genre rating coverImage
  publishedAt createdAt
  category { id name slug }
  author { id name slug avatar }
`;

const REVIEW_FIELDS = `
  id title slug subject reviewType creator releaseYear genre rating
  body verdict pros cons coverImage
  publishedAt createdAt
  category { id name slug }
  author { id name slug bio avatar }
`;

export async function getReviews(options?: {
  reviewType?: string;
  categorySlug?: string;
  orderByRating?: boolean;  // v2 — LP reviews_source='highest'
  limit?: number;           // v2 — LP reviews_count
}): Promise<Review[]> {
  const data = await gql<{ reviews: Review[] }>(
    `query Reviews($reviewType: String, $categorySlug: String, $orderByRating: Boolean, $limit: Int) {
      reviews(reviewType: $reviewType, categorySlug: $categorySlug, orderByRating: $orderByRating, limit: $limit) { ${REVIEW_LIST_FIELDS} }
    }`,
    {
      reviewType: options?.reviewType ?? null,
      categorySlug: options?.categorySlug ?? null,
      orderByRating: options?.orderByRating ?? null,
      limit: options?.limit ?? null,
    },
    [TAGS.reviews],
  );
  return data.reviews;
}

export async function getReview(slug: string): Promise<Review | null> {
  const data = await gql<{ review: Review | null }>(
    `query Review($slug: String!) {
      review(slug: $slug) { ${REVIEW_FIELDS} }
    }`,
    { slug },
    [TAGS.reviews],
  );
  return data.review;
}

// ── Landing Page interfaces ───────────────────────────────────────────────────

export interface LandingFeature {
  id: string;
  title: string;
  icon: string;
  image: string | null;   // optional uploaded image — overrides icon if set
  description: string;
  linkText: string;
  linkUrl: string;
  span: string;     // v2 — 'regular' | 'wide' | 'tall' (bento layout)
  order: number;
}

export interface LandingPressMention {
  id: string;
  mediaName: string;
  quote: string;
  logo: string | null;
  url: string;
  order: number;
}

export interface LandingComparisonRow {
  id: string;
  featureName: string;
  values: Record<string, unknown>;  // { "<pricing_plan_id>": "✓" | "5GB" | ... }
  order: number;
}

export interface LandingNewsletterBlock {
  id: string;
  heading: string;
  subheading: string;
  placeholder: string;
  buttonText: string;
  successMessage: string;
  provider: string;
  providerListId: string;
  enabled: boolean;
}

// ── Phase 5 — Specialty sub-models ──────────────────────────────────────────

export interface LandingProcessStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  duration: string;
  icon: string;
  image: string | null;
  order: number;
}

export interface LandingOutcome {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string | null;
  order: number;
}

export interface LandingBonus {
  id: string;
  title: string;
  description: string;
  valueUsd: number | null;
  icon: string;
  image: string | null;
  order: number;
}

export interface LandingAward {
  id: string;
  title: string;
  organization: string;
  year: number | null;
  image: string | null;
  url: string;
  order: number;
}

export interface LandingSocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
}

export interface LandingFeaturedLink {
  id: string;
  title: string;
  description: string;
  image: string | null;
  url: string;
  badge: string;
  order: number;
}

export interface LandingTeamMember {
  id: string;
  roleOverride: string;
  order: number;
  author: {
    id: string;
    name: string;
    slug: string;
    bio: string;
    avatar: string | null;
    role: string;
    isTeamMember: boolean;
    isInstructor: boolean;
    socialLinks: Record<string, unknown>;
  };
}

// ── Phase 6 — Layout-specific sub-models ────────────────────────────────────

export interface LandingIndustry {
  id: string;
  name: string;
  icon: string;
  image: string | null;
  order: number;
}

export interface LandingBentoCell {
  id: string;
  module: string;       // 'blog' | 'products' | 'reviews' | 'recipes' | 'listings'
  sourceId: number;
  span: string;         // 'regular' | 'wide' | 'tall'
  order: number;
}

export interface LandingTestimonial {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  authorCompany: string;
  avatar: string | null;
  rating: number | null;
  order: number;
}

export interface LandingPricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string | null;
  annualPrice: string | null;
  features: string[];
  ctaText: string;
  ctaUrl: string;
  isHighlighted: boolean;
  badge: string;
  order: number;
}

export interface LandingFaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface LandingStatItem {
  id: string;
  value: string;
  label: string;
  description: string;
  order: number;
}

export interface LandingLogo {
  id: string;
  name: string;
  url: string;
  image: string | null;
  order: number;
}

/** Polymorphic optional block on a LandingPage.
 *
 *  ``data`` is a JSON object whose shape depends on ``blockType``. The
 *  catalogue of types lives at ``backend/content/models.py::LandingCustomBlock``.
 *  Each component under ``website/components/landingpage/blocks/`` documents
 *  the payload it expects.
 */
export interface LandingCustomBlock {
  id: string;
  blockType: string;
  data: Record<string, unknown>;
  enabled: boolean;
  order: number;
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  status: string;
  layout: string;
  rootPath: string;
  metaTitle: string;
  metaDescription: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBody: string;
  heroImage: string | null;
  heroStyle: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaUrl: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaUrl: string;
  featuresHeading: string;
  featuresSubheading: string;
  featuresLayout: string;
  featuresMediaStyle: string;
  testimonialsHeading: string;
  pricingHeading: string;
  pricingSubheading: string;
  faqHeading: string;
  statsHeading: string;
  logobarHeading: string;
  ctaHeading: string;
  ctaSubheading: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string;
  ctaSecondaryText: string;
  ctaSecondaryUrl: string;
  ctaStyle: string;
  heroEnabled: boolean;
  featuresEnabled: boolean;
  testimonialsEnabled: boolean;
  pricingEnabled: boolean;
  faqEnabled: boolean;
  statsEnabled: boolean;
  logobarEnabled: boolean;
  ctaEnabled: boolean;
  // v2 · Sticky bar (universal opt-in promo bar at the top of the page)
  stickyBarEnabled: boolean;
  stickyBarText: string;
  stickyBarCtaText: string;
  stickyBarCtaUrl: string;
  stickyBarEndsAt: string | null;
  stickyBarStyle: string;
  // v2 · Hero video URL (optional; renderer falls back to heroImage)
  heroVideoUrl: string;
  // v2 · Conditional module rendering — controls what the layout shows from
  // the tenant's content modules and how many items are pulled in.
  blogSectionEnabled: boolean;
  blogSource: string;        // latest | featured | category
  blogCount: number;
  blogCategorySlug: string;
  blogShowFilters: boolean;
  productsSectionEnabled: boolean;
  productsSource: string;    // latest | bestsellers | featured | category
  productsCount: number;
  productsLayout: string;    // grid | carousel | curriculum
  productsCategorySlug: string;
  productsShowFilters: boolean;
  reviewsSectionEnabled: boolean;
  reviewsShowAggregate: boolean;
  reviewsCount: number;
  reviewsSource: string;     // latest | highest
  recipesSectionEnabled: boolean;
  recipesCount: number;
  listingsSectionEnabled: boolean;
  listingsCount: number;
  // Per-section labels — empty → renderer falls back to layout default
  blogSectionHeading: string;
  blogSectionLinkText: string;
  blogSectionLinkUrl: string;
  productsSectionHeading: string;
  productsSectionLinkText: string;
  productsSectionLinkUrl: string;
  reviewsSectionHeading: string;
  recipesSectionHeading: string;
  recipesSectionLinkText: string;
  recipesSectionLinkUrl: string;
  listingsSectionHeading: string;
  listingsSectionLinkText: string;
  listingsSectionLinkUrl: string;
  // v2 · SEO / Social / Schema (Phase 3)
  ogTitle: string;
  ogDescription: string;
  ogImage: string | null;
  twitterCardType: string;       // 'summary' | 'summary_large_image'
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  includeInSitemap: boolean;
  schemaType: string;            // 'auto' | 'organization' | 'course' | ...
  schemaOverrides: Record<string, unknown>;
  showReadingTime: boolean;
  showLastUpdated: boolean;
  showBreadcrumbs: boolean;
  stickyTocEnabled: boolean;
  // v2 · Phase 4 — Cross-layout opt-in blocks
  pressMentionsEnabled: boolean;
  pressMentionsHeading: string;
  comparisonEnabled: boolean;
  comparisonHeading: string;
  pressMentions: LandingPressMention[];
  comparisonRows: LandingComparisonRow[];
  newsletter: LandingNewsletterBlock | null;
  // v2 · Phase 5 — Specialty sub-models
  processEnabled: boolean;
  processHeading: string;
  outcomesEnabled: boolean;
  outcomesHeading: string;
  bonusesEnabled: boolean;
  bonusesHeading: string;
  awardsEnabled: boolean;
  awardsHeading: string;
  teamEnabled: boolean;
  teamHeading: string;
  processSteps: LandingProcessStep[];
  outcomes: LandingOutcome[];
  bonuses: LandingBonus[];
  awards: LandingAward[];
  socialLinks: LandingSocialLink[];
  featuredLinks: LandingFeaturedLink[];
  teamMembers: LandingTeamMember[];
  // v2 · Phase 6 — Layout-specific
  stickySectionNavEnabled: boolean;
  macroPillNavEnabled: boolean;   // Macro layout — opt-in floating pill nav over the hero
  industriesEnabled: boolean;
  industriesHeading: string;
  industries: LandingIndustry[];
  bentoCells: LandingBentoCell[];
  // v2 · Inline contact form (opt-in)
  contactFormEnabled: boolean;
  contactFormHeading: string;
  contactFormSubheading: string;
  contactFormNamePlaceholder: string;
  contactFormEmailPlaceholder: string;
  contactFormMessagePlaceholder: string;
  contactFormButtonText: string;
  contactFormSuccessTitle: string;
  contactFormSuccessBody: string;
  createdAt: string;
  updatedAt: string;
  features: LandingFeature[];
  testimonials: LandingTestimonial[];
  pricingPlans: LandingPricingPlan[];
  faqItems: LandingFaqItem[];
  statItems: LandingStatItem[];
  logos: LandingLogo[];
  // v2 · Polymorphic optional blocks (marquee, manifesto, guarantee, etc.)
  customBlocks: LandingCustomBlock[];
}

export interface LandingPageSummary {
  id: string;
  title: string;
  slug: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string | null;
  heroBadge: string;
  // v2 · sitemap-relevant fields
  rootPath: string;
  canonicalUrl: string;
  includeInSitemap: boolean;
}

export async function getLandingPages(): Promise<LandingPageSummary[]> {
  const data = await gql<{ landingPages: LandingPageSummary[] }>(
    `query LandingPages {
      landingPages {
        id title slug heroHeadline heroSubheadline heroImage heroBadge
        rootPath canonicalUrl includeInSitemap
      }
    }`,
    undefined,
    [TAGS.landing],
  );
  // Sitemap consumers filter on includeInSitemap; UI consumers ignore it.
  return data.landingPages;
}

const LANDING_PAGE_FIELDS = `
  id title slug status layout rootPath metaTitle metaDescription
  heroBadge heroHeadline heroSubheadline heroBody heroImage heroStyle heroVideoUrl
  heroPrimaryCtaText heroPrimaryCtaUrl heroSecondaryCtaText heroSecondaryCtaUrl
  featuresHeading featuresSubheading featuresLayout featuresMediaStyle
  testimonialsHeading
  pricingHeading pricingSubheading
  faqHeading statsHeading logobarHeading
  ctaHeading ctaSubheading ctaPrimaryText ctaPrimaryUrl ctaSecondaryText ctaSecondaryUrl ctaStyle
  heroEnabled featuresEnabled testimonialsEnabled pricingEnabled
  faqEnabled statsEnabled logobarEnabled ctaEnabled
  stickyBarEnabled stickyBarText stickyBarCtaText stickyBarCtaUrl stickyBarEndsAt stickyBarStyle
  blogSectionEnabled blogSource blogCount blogCategorySlug blogShowFilters
  productsSectionEnabled productsSource productsCount productsLayout productsCategorySlug productsShowFilters
  reviewsSectionEnabled reviewsShowAggregate reviewsCount reviewsSource
  recipesSectionEnabled recipesCount
  listingsSectionEnabled listingsCount
  blogSectionHeading blogSectionLinkText blogSectionLinkUrl
  productsSectionHeading productsSectionLinkText productsSectionLinkUrl
  reviewsSectionHeading
  recipesSectionHeading recipesSectionLinkText recipesSectionLinkUrl
  listingsSectionHeading listingsSectionLinkText listingsSectionLinkUrl
  ogTitle ogDescription ogImage twitterCardType
  canonicalUrl robotsIndex robotsFollow includeInSitemap
  schemaType schemaOverrides
  showReadingTime showLastUpdated showBreadcrumbs stickyTocEnabled
  pressMentionsEnabled pressMentionsHeading comparisonEnabled comparisonHeading
  processEnabled processHeading outcomesEnabled outcomesHeading
  bonusesEnabled bonusesHeading awardsEnabled awardsHeading
  teamEnabled teamHeading
  stickySectionNavEnabled macroPillNavEnabled industriesEnabled industriesHeading
  contactFormEnabled contactFormHeading contactFormSubheading
  contactFormNamePlaceholder contactFormEmailPlaceholder contactFormMessagePlaceholder
  contactFormButtonText contactFormSuccessTitle contactFormSuccessBody
  createdAt updatedAt
  features { id title icon image description linkText linkUrl span order }
  pressMentions { id mediaName quote logo url order }
  comparisonRows { id featureName values order }
  newsletter { id heading subheading placeholder buttonText successMessage provider providerListId enabled }
  processSteps { id stepNumber title description duration icon image order }
  outcomes { id title description icon image order }
  bonuses { id title description valueUsd icon image order }
  awards { id title organization year image url order }
  socialLinks { id platform url order }
  featuredLinks { id title description image url badge order }
  teamMembers { id roleOverride order author { id name slug bio avatar role isTeamMember isInstructor socialLinks } }
  industries { id name icon image order }
  bentoCells { id module sourceId span order }
  testimonials { id quote authorName authorTitle authorCompany avatar rating order }
  pricingPlans { id name description monthlyPrice annualPrice features ctaText ctaUrl isHighlighted badge order }
  faqItems { id question answer order }
  statItems { id value label description order }
  logos { id name url image order }
  customBlocks { id blockType data enabled order }
`;

// ``cache()`` memoises per-request: ``generateMetadata`` and the page component
// both call these heavy LP queries, and without it each runs twice (POST fetches
// are NOT request-memoised by Next). With it, the giant query runs once per render.
export const getLandingPage = cache(async (slug: string): Promise<LandingPage | null> => {
  const data = await gql<{ landingPage: LandingPage | null }>(
    `query LandingPage($slug: String!) {
      landingPage(slug: $slug) { ${LANDING_PAGE_FIELDS} }
    }`,
    { slug },
    [TAGS.landing],
  );
  return data.landingPage;
});

export const getHomepageLandingPage = cache(async (): Promise<LandingPage | null> => {
  const data = await gql<{ homepageLandingPage: LandingPage | null }>(
    `query HomepageLandingPage {
      homepageLandingPage { ${LANDING_PAGE_FIELDS} }
    }`,
    undefined,
    [TAGS.landing],
  );
  return data.homepageLandingPage;
});

export const getLandingPageByRootSlug = cache(async (slug: string): Promise<LandingPage | null> => {
  const data = await gql<{ landingPageByRootSlug: LandingPage | null }>(
    `query LandingPageByRootSlug($slug: String!) {
      landingPageByRootSlug(slug: $slug) { ${LANDING_PAGE_FIELDS} }
    }`,
    { slug },
    [TAGS.landing],
  );
  return data.landingPageByRootSlug;
});

// ── Utility Pages ───────────────────────────────────────────────────────────

export interface UtilityFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface UtilityTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  linkUrl: string;
  order: number;
}

export interface UtilityContactChannel {
  id: string;
  icon: string;
  label: string;
  value: string;
  href: string;
  order: number;
}

export interface UtilityTimelineMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  order: number;
}

export interface UtilityPage {
  id: string;
  kind: string;
  layout: string;
  title: string;
  slug: string;
  status: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  body: string;
  heroImage: string | null;
  ctaText: string;
  ctaUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactFormEnabled: boolean;
  lastUpdatedLabel: string;
  createdAt: string;
  updatedAt: string;
  faqItems: UtilityFaqItem[];
  teamMembers: UtilityTeamMember[];
  contactChannels: UtilityContactChannel[];
  timelineMilestones: UtilityTimelineMilestone[];
}

export interface UtilityPageSummary {
  id: string;
  title: string;
  slug: string;
  kind: string;
  layout: string;
  headline: string;
  subheadline: string;
  heroImage: string | null;
}

const UTILITY_PAGE_FIELDS = `
  id kind layout title slug status metaTitle metaDescription
  eyebrow headline subheadline body heroImage
  ctaText ctaUrl contactEmail contactPhone contactAddress contactFormEnabled
  lastUpdatedLabel createdAt updatedAt
  faqItems { id question answer category order }
  teamMembers { id name role bio photo linkUrl order }
  contactChannels { id icon label value href order }
  timelineMilestones { id year title description order }
`;

export async function getUtilityPages(kind?: string): Promise<UtilityPageSummary[]> {
  const data = await gql<{ utilityPages: UtilityPageSummary[] }>(
    `query UtilityPages($kind: String) {
      utilityPages(kind: $kind) {
        id title slug kind layout headline subheadline heroImage
      }
    }`,
    kind ? { kind } : {},
    [TAGS.utility],
  );
  return data.utilityPages;
}

export const getUtilityPage = cache(async (slug: string): Promise<UtilityPage | null> => {
  const data = await gql<{ utilityPage: UtilityPage | null }>(
    `query UtilityPage($slug: String!) {
      utilityPage(slug: $slug) { ${UTILITY_PAGE_FIELDS} }
    }`,
    { slug },
    [TAGS.utility],
  );
  return data.utilityPage;
});
