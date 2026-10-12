'use client';

/**
 * History Screen
 * Allows authenticated farmers to browse saved scans, filter by crop,
 * search by disease/crop name, view complete past diagnostic JSON results,
 * and delete scan records.
 * Prompts unauthenticated guests to log in or create an account.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { getScansApi, deleteScanApi } from '../../lib/api';
import { getGuestLatestScan } from '../../lib/storage';
import { SUPPORTED_CROPS } from '../../lib/crops.config';
import ResultCard from '../../components/ResultCard';
import AuthModal from '../../components/AuthModal';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Trash2,
  Calendar,
  ChevronRight,
  X,
  Sprout,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function HistoryPage() {
  const { user, showToast } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected scan modal for full result review
  const [activeScan, setActiveScan] = useState(null);

  // Guest auth modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [guestScan, setGuestScan] = useState(null);

  // Load scans
  const fetchScans = async () => {
    if (!user) {
      setGuestScan(getGuestLatestScan());
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getScansApi({
        crop: selectedCrop,
        page,
        limit: 10
      });

      if (res.success && res.data) {
        setScans(res.data.scans || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching scan history:', err);
      showToast(err.message || 'Could not load scans', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, [user, selectedCrop, page]);

  // Delete scan handler
  const handleDeleteScan = async (e, scanId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this scan record?')) return;

    try {
      const res = await deleteScanApi(scanId);
      if (res.success) {
        setScans((prev) => prev.filter((s) => (s._id || s.id) !== scanId));
        setTotalCount((prev) => Math.max(0, prev - 1));
        if (activeScan && (activeScan._id || activeScan.id) === scanId) {
          setActiveScan(null);
        }
        showToast('Scan deleted from history.', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete scan', 'error');
    }
  };

  // Client-side search filtering
  const filteredScans = scans.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.crop?.toLowerCase().includes(q) ||
      s.diseaseName?.toLowerCase().includes(q) ||
      s.plantPart?.toLowerCase().includes(q)
    );
  });

  // If user is guest
  if (!user) {
    return (
      <div className="w-full flex flex-col p-5 space-y-6">
        <div className="pt-2">
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-agri-600" />
            <span>Scan History</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track crop health, seasonal trends, and treatment outcomes
          </p>
        </div>

        {/* Guest Lock Hero Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm space-y-4">
          <div className="w-14 h-14 bg-agri-100 text-agri-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <HistoryIcon className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Account Required for Cloud History
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              Create a free farmer account to securely store your crop photos, view previous diagnostic records, and track field pathology over seasons.
            </p>
          </div>

          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full py-3 bg-agri-600 hover:bg-agri-700 text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-agri-600/30 active:scale-95 transition-all"
          >
            <span>Log In or Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Show guest's local unsaved scan if present */}
        {guestScan && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Latest Session Scan (Unsaved)
            </h3>
            <div
              onClick={() => setActiveScan({
                fullResult: guestScan.result,
                imageUrl: guestScan.previewUrl,
                crop: guestScan.result.crop,
                diseaseName: guestScan.result.diseaseName,
                createdAt: guestScan.timestamp
              })}
              className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-3 cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              {guestScan.previewUrl && (
                <img
                  src={guestScan.previewUrl}
                  alt="Guest scan preview"
                  className="w-12 h-12 rounded-xl object-cover bg-white border border-emerald-200 flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-emerald-950 truncate block">
                  {guestScan.result?.crop} · <span className="capitalize">{guestScan.result?.plantPart}</span>
                </span>
                <p className="text-[11px] text-emerald-800 truncate mt-0.5">
                  {guestScan.result?.diseaseName}
                </p>
                <span className="text-[10px] text-emerald-600 font-medium">
                  Tap to view full analysis
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
        )}

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          title="Access Farm History"
          subtitle="Sign up or log in to synchronize your scans across all devices."
        />
      </div>
    );
  }

  // Logged in user view
  return (
    <div className="w-full flex flex-col p-5 space-y-4">
      
      {/* Header */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-agri-600" />
            <span>Field Scan History</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {totalCount} saved {totalCount === 1 ? 'record' : 'records'} in your account
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by crop, disease, or organ..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-agri-500 shadow-sm"
        />
      </div>

      {/* Crop Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => { setSelectedCrop('all'); setPage(1); }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCrop === 'all'
              ? 'bg-agri-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Crops
        </button>
        {SUPPORTED_CROPS.map((crop) => (
          <button
            key={crop.id}
            onClick={() => { setSelectedCrop(crop.name); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCrop.toLowerCase() === crop.name.toLowerCase()
                ? 'bg-agri-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {crop.name}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3 pt-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-4 bg-white rounded-2xl border border-slate-200 animate-pulse flex gap-3">
              <div className="w-14 h-14 bg-slate-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
                <div className="h-2 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredScans.length === 0 ? (
        /* Empty State */
        <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3 my-4">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Sprout className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Scans Found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {searchQuery
              ? `No crop scans match "${searchQuery}".`
              : selectedCrop !== 'all'
              ? `No saved scans for ${selectedCrop} yet.`
              : 'You have not saved any crop scans yet.'}
          </p>
        </div>
      ) : (
        /* Scan List */
        <div className="space-y-2.5">
          {filteredScans.map((scan) => {
            const scanId = scan._id || scan.id;
            const isHealthy = scan.status === 'healthy';

            return (
              <div
                key={scanId}
                onClick={() => setActiveScan(scan)}
                className="group p-3.5 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/90 hover:border-agri-300 shadow-sm cursor-pointer transition-all flex items-center gap-3 relative"
              >
                {/* Thumbnail */}
                <img
                  src={scan.imageUrl || '/icon.svg'}
                  alt={scan.crop}
                  className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {scan.crop} · <span className="capitalize">{scan.plantPart || 'Leaf'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium truncate mt-0.5">
                    {scan.diseaseName}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isHealthy
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {scan.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {scan.confidence}% confidence
                    </span>
                    {scan.severity && scan.severity !== 'none' && (
                      <span className="text-[10px] font-semibold text-slate-500 capitalize">
                        · {scan.severity}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDeleteScan(e, scanId)}
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
                  aria-label="Delete scan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-medium disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-slate-500 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-medium disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Full Scan Review Modal */}
      {activeScan && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full sm:max-w-md max-h-[90vh] bg-slate-50 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 overflow-y-auto relative animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal close button */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Full Diagnosis Record
              </span>
              <button
                onClick={() => setActiveScan(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ResultCard
              result={activeScan.fullResult}
              imageUrl={activeScan.imageUrl}
              isSaved={true}
              onScanAgain={() => setActiveScan(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
