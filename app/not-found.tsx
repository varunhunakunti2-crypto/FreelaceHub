import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-2xl w-full rounded-[2rem] border border-slate-200/80 bg-white p-12 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">404</p>
        <h1 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
          The page you are looking for does not exist, or it may have been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
