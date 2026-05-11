import { requireModule } from '@/lib/modules';

export default async function RecipesLayout({ children }: { children: React.ReactNode }) {
  await requireModule('recipes');
  return <>{children}</>;
}
