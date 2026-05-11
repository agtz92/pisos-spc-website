import { requireModule } from '@/lib/modules';

export default async function LandingPageLayout({ children }: { children: React.ReactNode }) {
  await requireModule('landingpage');
  return <>{children}</>;
}
