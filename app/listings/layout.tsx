import { requireModule } from '@/lib/modules';

export default async function ListingsLayout({ children }: { children: React.ReactNode }) {
  await requireModule('realestate');
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {children}
    </div>
  );
}
