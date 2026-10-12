'use client';

/**
 * Home Screen
 * Displays agricultural greeting, prominent Scan Crop CTA button,
 * 5 supported crop cards with local names, photo capture tips,
 * and recent scan activity.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import { SUPPORTED_CROPS, APP_CONFIG } from '../lib/crops.config';
import { getGuestLatestScan } from '../lib/storage';
import { getScansApi } from '../lib/api';
import {
  Camera,
  Sprout,
  Sun,
  Maximize2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const [recentScans, setRecentScans] = useState([]);
  const [guestScan, setGuestScan] = useState(null);
  const [loadingScans, setLoadingScans] = useState(true);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    async function loadRecent() {
      if (user) {
        try {
          const res = await getScansApi({ limit: 3 });
          if (res.success && res.data?.scans) {
            setRecentScans(res.data.scans);
          }
        } catch (err) {
          console.warn('Could not load user recent scans:', err);
        } finally {
          setLoadingScans(false);
        }
      } else {
        // Check guest local scan
        const guestData = getGuestLatestScan();
        if (guestData) {
          setGuestScan(guestData);
        }
        setLoadingScans(false);
      }
    }

    loadRecent();
  }, [user]);

  return (
    <div className="w-full flex flex-col p-5 space-y-6">
      
      {/* 1. Header & Greeting */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-agri-600 to-agri-800 flex items-center justify-center text-white shadow-md shadow-agri-800/20">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-agri-700 uppercase tracking-wider">
              {APP_CONFIG.projectName}
            </span>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'Farmer'}
            </h1>
          </div>
        </div>

        <Link
          href="/profile"
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold transition-colors"
          aria-label="View Profile"
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
        </Link>
      </div>

      {/* 2. Large Hero Scan Button */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-agri-700 via-agri-800 to-emerald-950 p-6 text-white shadow-xl shadow-agri-900/20">
        {/* Subtle background graphic */}
        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-agri-500/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-start space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/15 text-agri-200 backdrop-blur-md border border-white/10">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span>Instant AI Plant Pathology</span>
          </span>

          <div>
            <h2 className="text-xl font-bold tracking-tight leading-snug">
              Detect Crop Diseases In Seconds
            </h2>
            <p className="text-xs text-agri-100/90 mt-1 max-w-[280px] leading-relaxed">
              Take or upload a photo of a leaf, cob, grain head, or fruit for immediate diagnostic & treatment advice.
            </p>
          </div>

          <Link
            href="/scan"
            className="w-full py-3.5 px-5 bg-white hover:bg-agri-50 text-agri-800 font-bold rounded-2xl text-sm flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98] transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-agri-100 flex items-center justify-center text-agri-700">
              <Camera className="w-4 h-4" />
            </div>
            <span>Scan Crop Now</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </div>

      {/* 3. Recent Scans Activity */}
      {(user && recentScans.length > 0) || guestScan ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-agri-600" />
              <span>{user ? 'Recent Field Scans' : 'Latest Scan (Guest)'}</span>
            </h2>
            {user && (
              <Link href="/history" className="text-xs text-agri-700 font-semibold hover:underline flex items-center gap-1">
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {user && recentScans.length > 0 ? (
            <div className="space-y-2">
              {recentScans.map((scan) => (
                <Link
                  key={scan._id || scan.id}
                  href={`/history?scanId=${scan._id || scan.id}`}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200/80 hover:border-agri-300 shadow-sm transition-all"
                >
                  <img
                    src={scan.imageUrl || '/icon.svg'}
                    alt={scan.crop}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {scan.crop} · <span className="capitalize">{scan.plantPart || 'Leaf'}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">
                      {scan.diseaseName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        scan.status === 'healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {scan.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {scan.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>
          ) : guestScan ? (
            <Link
              href="/scan"
              className="flex items-center gap-3 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 shadow-sm"
            >
              {guestScan.previewUrl && (
                <img
                  src={guestScan.previewUrl}
                  alt="Recent guest scan"
                  className="w-12 h-12 rounded-xl object-cover bg-white border border-emerald-200 flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 truncate">
                    {guestScan.result?.crop} ({guestScan.result?.plantPart})
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Unsaved</span>
                </div>
                <p className="text-[11px] text-emerald-800 truncate mt-0.5">
                  {guestScan.result?.diseaseName}
                </p>
                <p className="text-[10px] text-emerald-600 mt-1">
                  Tap to view diagnosis or save to account
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-700" />
            </Link>
          ) : null}
        </div>
      ) : null}

      {/* 4. Supported Crops (5 Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Supported Target Crops</h2>
            <p className="text-[11px] text-slate-500">Leaves, stems, cobs, heads, panicles & fruits</p>
          </div>
          <Link href="/crops" className="text-xs text-agri-700 font-semibold hover:underline">
            Crop Guide
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {SUPPORTED_CROPS.map((crop) => (
            <Link
              key={crop.id}
              href={`/crops/${crop.id}`}
              className="group p-3.5 bg-white rounded-2xl border border-slate-200/90 hover:border-agri-400 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {crop.iconEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-agri-700 transition-colors">
                      {crop.name}
                    </h3>
                    <span className="text-[10px] font-medium text-slate-400 italic">
                      ({crop.scientificName})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {crop.localNames}
                  </p>
                  <p className="text-[10px] text-agri-700 font-semibold mt-1">
                    {crop.diseases.length} detectable conditions & pests
                  </p>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-agri-100 flex items-center justify-center text-slate-400 group-hover:text-agri-700 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Tips on Taking a Good Photo */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-agri-600" />
          <span>Tips for Accurate AI Detection</span>
        </h2>
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <Sun className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-800">Natural Daylight</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Avoid dark shadows or blinding flash glare.
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <Maximize2 className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-800">Focus on Lesion</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Capture border between healthy and affected tissue.
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <Camera className="w-4 h-4 text-blue-500" />
            <h4 className="text-xs font-bold text-slate-800">Fill the Frame</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Hold camera 15-30cm away and steady hand.
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <Sprout className="w-4 h-4 text-purple-500" />
            <h4 className="text-xs font-bold text-slate-800">Check All Organs</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              Scan cobs, panicles, heads, and stems too.
            </p>
          </div>
        </div>
      </div>

      {/* Project Defence Credential Footer */}
      <div className="text-center pt-2 pb-4 text-[11px] text-slate-400 space-y-1">
        <p className="font-semibold text-slate-500">{APP_CONFIG.projectName} · v1.0.0</p>
        <p>Built for Smallholder Farmers & Extension Agents</p>
        <p>Final Year Project by {APP_CONFIG.author}</p>
      </div>

    </div>
  );
}
