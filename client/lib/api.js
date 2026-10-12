/**
 * API Client Library
 * Handles communication with Express backend on /api endpoints.
 * Automatically transmits cookies and JSON payloads.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    return { success: true };
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Public Scan: uploads image file to /api/scan
 */
export async function scanCropApi(imageFile, crop = 'auto') {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('crop', crop);

  const response = await fetch(`${BASE_URL}/api/scan`, {
    method: 'POST',
    body: formData
    // Note: Do not set Content-Type header when sending FormData; browser sets multipart/form-data with boundary automatically
  });

  return handleResponse(response);
}

/**
 * Save Scan to User Account: POST /api/scans
 */
export async function saveScanApi({ fullResult, imageFile, imageBase64 }) {
  const formData = new FormData();
  formData.append('fullResult', JSON.stringify(fullResult));

  if (imageFile) {
    formData.append('image', imageFile);
  }
  if (imageBase64) {
    formData.append('imageBase64', imageBase64);
  }

  const response = await fetch(`${BASE_URL}/api/scans`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  return handleResponse(response);
}

/**
 * Get Saved Scans with optional crop filter and pagination: GET /api/scans
 */
export async function getScansApi({ crop = 'all', page = 1, limit = 10 } = {}) {
  const query = new URLSearchParams({
    crop,
    page: String(page),
    limit: String(limit)
  }).toString();

  const response = await fetch(`${BASE_URL}/api/scans?${query}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });

  return handleResponse(response);
}

/**
 * Get Single Scan by ID: GET /api/scans/:id
 */
export async function getScanByIdApi(id) {
  const response = await fetch(`${BASE_URL}/api/scans/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });

  return handleResponse(response);
}

/**
 * Delete Scan: DELETE /api/scans/:id
 */
export async function deleteScanApi(id) {
  const response = await fetch(`${BASE_URL}/api/scans/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });

  return handleResponse(response);
}

/**
 * Register: POST /api/auth/register
 */
export async function registerApi({ name, email, password }) {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  return handleResponse(response);
}

/**
 * Login: POST /api/auth/login
 */
export async function loginApi({ email, password }) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  return handleResponse(response);
}

/**
 * Logout: POST /api/auth/logout
 */
export async function logoutApi() {
  const response = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });

  return handleResponse(response);
}

/**
 * Get Current Authenticated User: GET /api/auth/me
 */
export async function getMeApi() {
  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });

  return handleResponse(response);
}

/**
 * Update Profile: PUT /api/users/me
 */
export async function updateMeApi(updateData) {
  const response = await fetch(`${BASE_URL}/api/users/me`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });

  return handleResponse(response);
}

/**
 * Delete User Account: DELETE /api/users/me
 */
export async function deleteMeApi() {
  const response = await fetch(`${BASE_URL}/api/users/me`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });

  return handleResponse(response);
}
