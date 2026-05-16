// ─────────────────────────────────────────────────────────────────────────────
// src/store/ui.store.ts – UI/theme state store
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  isDarkMode: boolean;
  sidebarOpen: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      sidebarOpen: true,

      toggleDarkMode: () => {
        const newMode = !get().isDarkMode;
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ isDarkMode: newMode });
      },

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'sld_ui',
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
