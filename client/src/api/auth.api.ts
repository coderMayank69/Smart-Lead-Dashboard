// ─────────────────────────────────────────────────────────────────────────────
// src/api/auth.api.ts – Typed auth API calls
// ─────────────────────────────────────────────────────────────────────────────

import { api } from './axios';
import { ApiResponse, AuthResponse, User } from '../types';

export const authApi = {
  async register(data: { name: string; email: string; password: string; role?: string }) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data;
  },

  async getProfile() {
    const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data;
  },
};
