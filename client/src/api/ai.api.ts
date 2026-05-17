// src/api/ai.api.ts
import { api } from './axios';
import type { ApiResponse } from '../types';

export const aiApi = {
  async chat(message: string, context?: string) {
    const res = await api.post<ApiResponse<{ reply: string }>>('/ai/chat', { message, context });
    return res.data;
  },
};
