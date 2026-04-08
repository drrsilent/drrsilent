import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from '../lib/i18n';

type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
      toggleLocale: () =>
        set({
          locale: get().locale === 'en' ? 'ar' : 'en',
        }),
    }),
    {
      name: 'dxlr-locale',
    }
  )
);
