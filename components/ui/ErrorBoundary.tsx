'use client';

import React from 'react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallbackTitle, fallbackDescription } = this.props;

    if (!hasError) {
      return children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
        <div className="max-w-xl w-full rounded-[2rem] border border-slate-200/80 bg-white p-10 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 mb-6 mx-auto">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white text-center mb-2">
            {fallbackTitle ?? 'Something went wrong'}
          </h1>
          <p className="text-sm leading-6 text-slate-500 dark:text-slate-400 text-center mb-6">
            {fallbackDescription ?? 'An unexpected error occurred while loading this part of the app.'}
          </p>
          {error ? (
            <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-950/80 dark:text-slate-300 mb-6 overflow-x-auto">
              <strong className="block mb-2">Error:</strong>
              <pre className="whitespace-pre-wrap">{error.message}</pre>
            </div>
          ) : null}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={this.resetError}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Retry
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
