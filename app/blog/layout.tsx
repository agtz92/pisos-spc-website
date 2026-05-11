import { requireModule } from '@/lib/modules';

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  await requireModule('blog');
  return <>{children}</>;
}
