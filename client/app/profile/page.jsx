'use client';

/**
 * Profile Screen
 * Manages farmer account details, scan usage statistics, edit name,
 * password change, logout, and account deletion.
 * Provides instant Sign In / Sign Up actions for guests.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { updateMeApi, deleteMeApi, getMeApi } from '../../lib/api';
import { APP_CONFIG } from '../../lib/crops.config';
import AuthModal from '../../components/AuthModal';
import {
  User,
  Mail,
  Shield,
  LogOut,
  Trash2,
  Edit2,
  Lock,
  Calendar,
  Activity,
  Sprout,
  Check,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, refreshUser, showToast } = useAuth();
  const [profileStats, setProfileStats] = useState({
    totalScans: 0,
    mostScannedCrop: 'None yet'
  });

  // Modal / Form States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Load latest stats
  useEffect(() => {
    async function fetchStats() {
      if (user) {
        try {
          const res = await getMeApi();
          if (res.success && res.user) {
            setProfileStats({
              totalScans: res.user.totalScans || 0,
              mostScannedCrop: res.user.mostScannedCrop || 'None yet'
            });
            setNewName(res.user.name || '');
          }
        } catch (err) {
          console.warn('Could not load user stats:', err);
        }
      }
    }
    fetchStats();
  }, [user]);

  // Handle Edit Name
  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSavingName(true);
    try {
      const res = await updateMeApi({ name: newName.trim() });
      if (res.success) {
        await refreshUser();
        setEditingName(false);
        showToast('Name updated successfully.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update name', 'error');
    } finally {
      setSavingName(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setSavingPassword(true);
    try {
      const res = await updateMeApi({ currentPassword, newPassword });
      if (res.success) {
        setChangingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        showToast('Password changed successfully.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      'WARNING: This will permanently delete your farmer account and all stored crop scan records.\nType "DELETE" to confirm:'
    );

    if (confirmation === 'DELETE') {
      try {
        const res = await deleteMeApi();
        if (res.success) {
          await logout();
          showToast('Your account was permanently deleted.', 'info');
        }
      } catch (err) {
        showToast(err.message || 'Failed to delete account', 'error');
      }
    }
  };

  // Unauthenticated Guest View
  if (!user) {
    return (
      <div className="w-full flex flex-col p-5 space-y-6">
        <div className="pt-2">
          <h1 className="text-lg font-bold text-slate-900">Farmer Profile</h1>
          <p className="text-xs text-slate-500">Sign in to manage your scans and preferences</p>
        </div>

        {/* Guest prompt card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 bg-agri-100 text-agri-700 rounded-full flex items-center justify-center mx-auto shadow-inner text-2xl">
            👨‍🌾
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Guest Farmer Mode</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              You are currently using CropScan AI as a guest. Your latest scan is saved in your local browser only.
            </p>
          </div>

          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full py-3.5 bg-agri-600 hover:bg-agri-700 text-white font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-agri-600/30 active:scale-95 transition-all"
          >
            <span>Sign In / Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* About the Project Card */}
        <div className="p-5 bg-slate-100 rounded-3xl border border-slate-200 space-y-2 text-xs text-slate-600">
          <h3 className="font-bold text-slate-800 text-sm">About {APP_CONFIG.projectName}</h3>
          <p className="leading-relaxed">
            Final Year Project developed by <span className="font-semibold text-slate-900">{APP_CONFIG.author}</span>.
          </p>
          <p className="leading-relaxed text-[11px] text-slate-500">
            Powered by Google Gemini Multimodal Vision API, Node.js Express, MongoDB, and Next.js PWA.
          </p>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  // Authenticated View
  return (
    <div className="w-full flex flex-col p-5 space-y-5 pb-12">
      
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-lg font-bold text-slate-900">Farmer Account</h1>
        <p className="text-xs text-slate-500">Manage your farm profile & security</p>
      </div>

      {/* User Info Card */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-agri-600 to-agri-800 text-white font-bold text-xl flex items-center justify-center shadow-md shadow-agri-800/20">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-slate-900 truncate">
              {user.name}
            </h2>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Activity className="w-3.5 h-3.5 text-agri-600" />
              <span className="text-[10px] font-semibold uppercase">Total Scans</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{profileStats.totalScans}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Sprout className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] font-semibold uppercase">Top Crop</span>
            </div>
            <p className="text-sm font-bold text-slate-900 truncate">{profileStats.mostScannedCrop}</p>
          </div>
        </div>
      </div>

      {/* Profile Actions: Edit Name */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-agri-600" />
            <h3 className="text-xs font-bold text-slate-900">Full Name</h3>
          </div>
          <button
            onClick={() => setEditingName(!editingName)}
            className="text-xs font-semibold text-agri-700 hover:underline"
          >
            {editingName ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingName ? (
          <form onSubmit={handleUpdateName} className="space-y-2 pt-1">
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-500"
            />
            <button
              type="submit"
              disabled={savingName}
              className="py-2 px-4 bg-agri-600 hover:bg-agri-700 text-white font-semibold text-xs rounded-xl shadow-sm disabled:opacity-50"
            >
              {savingName ? 'Saving...' : 'Save Name'}
            </button>
          </form>
        ) : (
          <p className="text-xs text-slate-600 font-medium">{user.name}</p>
        )}
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-agri-600" />
            <h3 className="text-xs font-bold text-slate-900">Security & Password</h3>
          </div>
          <button
            onClick={() => setChangingPassword(!changingPassword)}
            className="text-xs font-semibold text-agri-700 hover:underline"
          >
            {changingPassword ? 'Cancel' : 'Change'}
          </button>
        </div>

        {changingPassword ? (
          <form onSubmit={handleChangePassword} className="space-y-2.5 pt-1">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                New Password (min 6 chars)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-500"
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="py-2 px-4 bg-agri-600 hover:bg-agri-700 text-white font-semibold text-xs rounded-xl shadow-sm disabled:opacity-50"
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        ) : (
          <p className="text-xs text-slate-400">••••••••••••</p>
        )}
      </div>

      {/* Logout & Danger Zone */}
      <div className="space-y-2 pt-2">
        <button
          onClick={logout}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-200 shadow-sm transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>Log Out of Account</span>
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-full py-2.5 px-4 text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>Delete Account & Data</span>
        </button>
      </div>

      {/* Academic Project Credits */}
      <div className="text-center pt-4 text-[11px] text-slate-400 space-y-1">
        <p className="font-semibold text-slate-500">{APP_CONFIG.projectName} · v1.0.0</p>
        <p>Final Year Student Project Defence Edition</p>
        <p>Musa Musa · Department of Computer Science</p>
      </div>

    </div>
  );
}
