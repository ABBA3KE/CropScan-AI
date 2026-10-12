/**
 * Guest Storage & Pending Scan Manager
 * Handles local persistence of guest scan results and preserves
 * pending unsaved scans so they are automatically saved upon registration or login.
 */

const GUEST_LATEST_SCAN_KEY = 'cropscan_guest_latest_scan';
const PENDING_SCAN_KEY = 'cropscan_pending_scan';

export function saveGuestLatestScan(scanData, previewUrl) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      result: scanData,
      previewUrl,
      timestamp: Date.now()
    };
    localStorage.setItem(GUEST_LATEST_SCAN_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[Storage] Could not cache guest scan:', err);
  }
}

export function getGuestLatestScan() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(GUEST_LATEST_SCAN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

export function clearGuestLatestScan() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(GUEST_LATEST_SCAN_KEY);
  } catch (err) {}
}

/**
 * Stores a pending scan that an unauthenticated user intends to save
 * after they register or log in.
 */
export function setPendingScan(scanData, previewUrl) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      fullResult: scanData,
      previewUrl,
      timestamp: Date.now()
    };
    localStorage.setItem(PENDING_SCAN_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[Storage] Could not set pending scan:', err);
  }
}

export function getPendingScan() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PENDING_SCAN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

export function clearPendingScan() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PENDING_SCAN_KEY);
  } catch (err) {}
}
