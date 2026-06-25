import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold tracking-tight text-brand-500">404</h1>
        <p className="mt-4 text-xl font-medium text-slate-900">Page not found</p>
        <p className="mt-2 text-sm text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
