'use client';

/**
 * Toast Notification Component
 * Renders animated message toasts triggered across the application.
 */

import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useAuth();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  const bgStyles = {
    success: 'bg-emerald-800 text-white border-emerald-700',
    error: 'bg-rose-800 text-white border-rose-700',
    info: 'bg-slate-800 text-white border-slate-700'
  }[type] || 'bg-slate-800 text-white';

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info
  }[type] || Info;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div className={`flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border ${bgStyles}`}>
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-300" />
        <p className="text-xs sm:text-sm font-medium leading-snug flex-1">
          {message}
        </p>
      </div>
    </div>
  );
}
