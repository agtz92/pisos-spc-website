import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
      <p className="text-6xl font-bold text-gray-200">404</p>
      <h1 className="text-2xl font-semibold text-gray-800">Page not found</h1>
      <p className="text-gray-500">This page doesn&apos;t exist or isn&apos;t available on this site.</p>
      <Link href="/" className="mt-2 text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4">
        Go home
      </Link>
    </div>
  );
}
