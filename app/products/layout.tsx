import { requireModule } from '@/lib/modules';

export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
  await requireModule('products');
  return <>{children}</>;
}
