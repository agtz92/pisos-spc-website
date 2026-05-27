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

async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
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
}): Promise<Post[]> {
  const data = await gql<{ posts: Post[] }>(
    `query Posts($categorySlug: String, $tagSlug: String, $authorSlug: String) {
      posts(categorySlug: $categorySlug, tagSlug: $tagSlug, authorSlug: $authorSlug) {
        ${POST_LIST_FIELDS}
      }
    }`,
    {
      categorySlug: options?.categorySlug ?? null,
      tagSlug: options?.tagSlug ?? null,
      authorSlug: options?.authorSlug ?? null,
    },
  );
  return data.posts;
}

export async function getPost(slug: string): Promise<Post | null> {
  const data = await gql<{ post: Post | null }>(
    `query Post($slug: String!) {
      post(slug: $slug) { ${POST_FIELDS} }
    }`,
    { slug },
  );
  return data.post;
}

export async function getCategories(module?: string): Promise<Category[]> {
  const filter = module ? `(module: "${module}")` : '';
  const data = await gql<{ categories: Category[] }>(
    `query Categories {
      categories${filter} { id name slug }
    }`,
  );
  return data.categories;
}

export async function getTags(module?: string): Promise<Tag[]> {
  const filter = module ? `(module: "${module}")` : '';
  const data = await gql<{ tags: Tag[] }>(
    `query Tags {
      tags${filter} { id name slug }
    }`,
  );
  return data.tags;
}

export async function getAuthors(): Promise<Author[]> {
  const data = await gql<{ authors: Author[] }>(
    `query Authors {
      authors { id name slug bio avatar }
    }`,
  );
  return data.authors;
}

export async function getAuthor(slug: string): Promise<Author | null> {
  const data = await gql<{ author: Author | null }>(
    `query Author($slug: String!) {
      author(slug: $slug) { id name slug bio avatar }
    }`,
    { slug },
  );
  return data.author;
}

// ── Tenant ────────────────────────────────────────────────────────────────────

export interface TenantInfo {
  name: string;
  template: string;
  templateConfig: Record<string, unknown> | null;
  modules: string[];
}

export async function getTenant(): Promise<TenantInfo | null> {
  const data = await gql<{ tenant: TenantInfo | null }>(
    `query Tenant {
      tenant { name template templateConfig modules }
    }`,
  );
  return data.tenant;
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

export interface Product {
  id: string;
  title: string;
  slug: string;
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

export async function getRecipes(options?: { categorySlug?: string }): Promise<Recipe[]> {
  const data = await gql<{ recipes: Recipe[] }>(
    `query Recipes($categorySlug: String) {
      recipes(categorySlug: $categorySlug) { ${RECIPE_LIST_FIELDS} }
    }`,
    { categorySlug: options?.categorySlug ?? null },
  );
  return data.recipes;
}

export async function getRecipe(slug: string): Promise<Recipe | null> {
  const data = await gql<{ recipe: Recipe | null }>(
    `query Recipe($slug: String!) {
      recipe(slug: $slug) { ${RECIPE_FIELDS} }
    }`,
    { slug },
  );
  return data.recipe;
}

// ── Product queries ───────────────────────────────────────────────────────────

const PRODUCT_LIST_FIELDS = `
  id title slug description coverImage
  price compareAtPrice brand sku stock
  publishedAt createdAt
  category { id name slug }
`;

const PRODUCT_DETAIL_FIELDS = `
  ${PRODUCT_LIST_FIELDS}
  specifications { name headers rows }
`;

export async function getProducts(options?: { categorySlug?: string }): Promise<Product[]> {
  const data = await gql<{ products: Product[] }>(
    `query Products($categorySlug: String) {
      products(categorySlug: $categorySlug) { ${PRODUCT_LIST_FIELDS} }
    }`,
    { categorySlug: options?.categorySlug ?? null },
  );
  return data.products;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const data = await gql<{ product: Product | null }>(
    `query Product($slug: String!) {
      product(slug: $slug) { ${PRODUCT_DETAIL_FIELDS} }
    }`,
    { slug },
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

export async function getListings(options?: { listingType?: string; propertyType?: string }): Promise<Listing[]> {
  const data = await gql<{ listings: Listing[] }>(
    `query Listings($listingType: String, $propertyType: String) {
      listings(listingType: $listingType, propertyType: $propertyType) { ${LISTING_LIST_FIELDS} }
    }`,
    { listingType: options?.listingType ?? null, propertyType: options?.propertyType ?? null },
  );
  return data.listings;
}

export async function getListing(slug: string): Promise<Listing | null> {
  const data = await gql<{ listing: Listing | null }>(
    `query Listing($slug: String!) {
      listing(slug: $slug) { ${LISTING_FIELDS} }
    }`,
    { slug },
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

export async function getReviews(options?: { reviewType?: string; categorySlug?: string }): Promise<Review[]> {
  const data = await gql<{ reviews: Review[] }>(
    `query Reviews($reviewType: String, $categorySlug: String) {
      reviews(reviewType: $reviewType, categorySlug: $categorySlug) { ${REVIEW_LIST_FIELDS} }
    }`,
    { reviewType: options?.reviewType ?? null, categorySlug: options?.categorySlug ?? null },
  );
  return data.reviews;
}

export async function getReview(slug: string): Promise<Review | null> {
  const data = await gql<{ review: Review | null }>(
    `query Review($slug: String!) {
      review(slug: $slug) { ${REVIEW_FIELDS} }
    }`,
    { slug },
  );
  return data.review;
}

// ── Landing Page interfaces ───────────────────────────────────────────────────

export interface LandingFeature {
  id: string;
  title: string;
  icon: string;
  description: string;
  linkText: string;
  linkUrl: string;
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
  createdAt: string;
  updatedAt: string;
  features: LandingFeature[];
  testimonials: LandingTestimonial[];
  pricingPlans: LandingPricingPlan[];
  faqItems: LandingFaqItem[];
  statItems: LandingStatItem[];
  logos: LandingLogo[];
}

export interface LandingPageSummary {
  id: string;
  title: string;
  slug: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string | null;
  heroBadge: string;
}

export async function getLandingPages(): Promise<LandingPageSummary[]> {
  const data = await gql<{ landingPages: LandingPageSummary[] }>(
    `query LandingPages {
      landingPages {
        id title slug heroHeadline heroSubheadline heroImage heroBadge
      }
    }`,
  );
  return data.landingPages;
}

const LANDING_PAGE_FIELDS = `
  id title slug status layout rootPath metaTitle metaDescription
  heroBadge heroHeadline heroSubheadline heroBody heroImage heroStyle
  heroPrimaryCtaText heroPrimaryCtaUrl heroSecondaryCtaText heroSecondaryCtaUrl
  featuresHeading featuresSubheading featuresLayout
  testimonialsHeading
  pricingHeading pricingSubheading
  faqHeading statsHeading logobarHeading
  ctaHeading ctaSubheading ctaPrimaryText ctaPrimaryUrl ctaSecondaryText ctaSecondaryUrl ctaStyle
  heroEnabled featuresEnabled testimonialsEnabled pricingEnabled
  faqEnabled statsEnabled logobarEnabled ctaEnabled
  createdAt updatedAt
  features { id title icon description linkText linkUrl order }
  testimonials { id quote authorName authorTitle authorCompany avatar rating order }
  pricingPlans { id name description monthlyPrice annualPrice features ctaText ctaUrl isHighlighted badge order }
  faqItems { id question answer order }
  statItems { id value label description order }
  logos { id name url image order }
`;

export async function getLandingPage(slug: string): Promise<LandingPage | null> {
  const data = await gql<{ landingPage: LandingPage | null }>(
    `query LandingPage($slug: String!) {
      landingPage(slug: $slug) { ${LANDING_PAGE_FIELDS} }
    }`,
    { slug },
  );
  return data.landingPage;
}

export async function getHomepageLandingPage(): Promise<LandingPage | null> {
  const data = await gql<{ homepageLandingPage: LandingPage | null }>(
    `query HomepageLandingPage {
      homepageLandingPage { ${LANDING_PAGE_FIELDS} }
    }`,
  );
  return data.homepageLandingPage;
}

export async function getLandingPageByRootSlug(slug: string): Promise<LandingPage | null> {
  const data = await gql<{ landingPageByRootSlug: LandingPage | null }>(
    `query LandingPageByRootSlug($slug: String!) {
      landingPageByRootSlug(slug: $slug) { ${LANDING_PAGE_FIELDS} }
    }`,
    { slug },
  );
  return data.landingPageByRootSlug;
}

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
  );
  return data.utilityPages;
}

export async function getUtilityPage(slug: string): Promise<UtilityPage | null> {
  const data = await gql<{ utilityPage: UtilityPage | null }>(
    `query UtilityPage($slug: String!) {
      utilityPage(slug: $slug) { ${UTILITY_PAGE_FIELDS} }
    }`,
    { slug },
  );
  return data.utilityPage;
}
