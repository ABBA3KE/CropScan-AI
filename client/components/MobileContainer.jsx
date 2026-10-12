'use client';

/**
 * MobileContainer Component
 * Centres the mobile-first application inside a sleek phone-width wrapper on desktop
 * while providing full-bleed native feel on mobile devices.
 */

import React from 'react';
import BottomNav from './BottomNav';
import Toast from './Toast';

export default function MobileContainer({ children }) {
  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-start sm:py-6 selection:bg-agri-500 selection:text-white">
      {/* Outer desktop background ambient glow */}
      <div className="fixed inset-0 pointer-events-none opacity-20 hidden sm:block bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-agri-600 via-slate-900 to-black" />

      {/* Main phone frame container */}
      <div className="w-full sm:max-w-md min-h-screen sm:min-h-[920px] bg-slate-50 text-slate-800 relative flex flex-col shadow-2xl sm:rounded-3xl sm:border border-slate-700/40 overflow-x-hidden pb-20">
        
        {/* Floating global toast notifications */}
        <Toast />

        {/* Inner screen content */}
        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>

        {/* Fixed bottom navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
