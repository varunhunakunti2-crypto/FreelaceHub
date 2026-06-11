import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function AuthCard({ children, title, description }: AuthCardProps) {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border dark:border-gray-700 transition-all">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
