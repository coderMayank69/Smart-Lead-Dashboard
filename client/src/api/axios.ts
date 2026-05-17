// ─────────────────────────────────────────────────────────────────────────────
// src/api/axios.ts – Axios instance with auth interceptor
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Request interceptor – attach JWT ──────────────────────────────────────────
// Reads token directly from zustand store (which persists to localStorage
// under 'sld_auth') instead of a separate 'sld_token' key.
// This eliminates the desync where zustand has the token but the
// standalone localStorage key was cleared or stale.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor – handle 401 globally ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear zustand store (which handles localStorage cleanup)
      useAuthStore.getState().clearAuth();
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
