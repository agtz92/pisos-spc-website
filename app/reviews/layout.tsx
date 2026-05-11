import { requireModule } from '@/lib/modules';

export default async function ReviewsLayout({ children }: { children: React.ReactNode }) {
  await requireModule('reviews');
  return <>{children}</>;
}
