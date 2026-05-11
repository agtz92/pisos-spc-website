import { requireModule } from '@/lib/modules';

export default async function UtilityPageLayout({ children }: { children: React.ReactNode }) {
  await requireModule('utilitypage');
  return <>{children}</>;
}
