'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar - fixed on desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative lg:ml-64 transition-all duration-300">
        {/* Topbar - sticky with blur */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="page-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
