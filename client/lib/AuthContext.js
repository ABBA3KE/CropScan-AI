'use client';

/**
 * Authentication Context & Provider
 * Manages user state, login, registration, logout, and automatic
 * saving of pending guest scan results upon logging in or registering.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi, loginApi, registerApi, logoutApi, saveScanApi } from './api';
import { getPendingScan, clearPendingScan } from './storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Check current session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await getMeApi();
        if (res.success && res.user) {
          setUser(res.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  // Helper to show temporary toast message
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Helper to automatically upload and save pending guest scan if present
  const handlePendingScanSave = async () => {
    const pending = getPendingScan();
    if (pending && pending.fullResult) {
      try {
        await saveScanApi({
          fullResult: pending.fullResult,
          imageBase64: pending.previewUrl
        });
        clearPendingScan();
        showToast('Your previous scan has been saved to your account history!', 'success');
      } catch (err) {
        console.warn('[AuthContext] Failed to auto-save pending scan:', err);
      }
    }
  };

  // Login handler
  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    if (res.success && res.user) {
      setUser(res.user);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      // Auto-save pending scan if user had scanned as guest
      await handlePendingScanSave();
      return res;
    }
    throw new Error(res.error || 'Login failed');
  };

  // Register handler
  const register = async (name, email, password) => {
    const res = await registerApi({ name, email, password });
    if (res.success && res.user) {
      setUser(res.user);
      showToast(`Welcome to CropScan AI, ${res.user.name}!`, 'success');
      // Auto-save pending scan if user had scanned as guest
      await handlePendingScanSave();
      return res;
    }
    throw new Error(res.error || 'Registration failed');
  };

  // Logout handler
  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      showToast('Logged out successfully.', 'info');
    }
  };

  // Refresh user details (e.g. after updating profile)
  const refreshUser = async () => {
    try {
      const res = await getMeApi();
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        showToast,
        toastMessage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
