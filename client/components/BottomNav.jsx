'use client';

/**
 * BottomNav Component
 * Mobile bottom navigation bar featuring Home, Scan, History, and Profile.
 * Adheres to 48px+ tap target guidelines for outdoor mobile and farm usage.
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, History, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Scan', href: '/scan', icon: Camera, isCenter: true },
    { label: 'History', href: '/history', icon: History },
    { label: 'Profile', href: '/profile', icon: User }
  ];

  return (
    <nav className="fixed sm:absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.05)] sm:rounded-b-3xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

        if (item.isCenter) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-6 group focus:outline-none"
              aria-label="Scan Crop"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform transform active:scale-95 group-hover:scale-105 ${
                isActive
                  ? 'bg-agri-600 text-white shadow-agri-600/40 ring-4 ring-agri-100'
                  : 'bg-agri-600 text-white shadow-agri-600/30'
              }`}>
                <Camera className="w-7 h-7" />
              </div>
              <span className={`text-[11px] font-semibold mt-1 ${isActive ? 'text-agri-700 font-bold' : 'text-slate-600'}`}>
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors min-w-[64px] min-h-[48px] focus:outline-none ${
              isActive
                ? 'text-agri-700 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
            <span className="text-[11px] mt-1 tracking-tight">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
