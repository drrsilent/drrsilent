import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, PaymentMethod } from './useCartStore';

export type AuthProvider = 'google' | 'apple' | 'whatsapp' | 'email';
export type OrderStatus = 'confirmed' | 'awaiting_payment';

export interface AccountUser {
  name: string;
  email: string;
  phone: string;
  provider: AuthProvider;
}

export interface AccountOrder {
  id: string;
  createdAt: string;
  total: number;
  itemCount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  items: CartItem[];
}

export interface SavedLocation {
  locationUrl: string;
  address: string;
  city: string;
  notes: string;
  updatedAt: string;
}

export interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  cardholder: string;
  expiryMonth: string;
  expiryYear: string;
  nickname: string;
  addedAt: string;
}

export interface AccountProfile {
  name: string;
  email: string;
  phone: string;
  location: SavedLocation | null;
  savedCards: SavedCard[];
  lastPaymentMethod: PaymentMethod | null;
}

interface CheckoutProfileInput {
  email: string;
  name: string;
  phone: string;
  location: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: PaymentMethod;
}

interface SaveCardInput {
  nickname: string;
  cardholder: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
}

interface AccountStore {
  isOpen: boolean;
  user: AccountUser | null;
  orders: AccountOrder[];
  profiles: Record<string, AccountProfile>;
  openAccount: () => void;
  closeAccount: () => void;
  toggleAccount: () => void;
  signIn: (user: AccountUser) => void;
  signOut: () => void;
  addOrder: (order: AccountOrder) => void;
  removeOrder: (orderId: string) => void;
  saveCheckoutProfile: (profile: CheckoutProfileInput) => void;
  saveCurrentLocation: (email: string, locationUrl: string) => void;
  saveCard: (email: string, card: SaveCardInput) => { ok: boolean; error?: string };
  removeSavedCard: (email: string, cardId: string) => void;
}

const normalizeProfileEmail = (email: string) => email.trim().toLowerCase();

const detectCardBrand = (digits: string) => {
  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^50/.test(digits)) return 'meeza';
  return 'card';
};

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      isOpen: false,
      user: null,
      orders: [],
      profiles: {},
      openAccount: () => set({ isOpen: true }),
      closeAccount: () => set({ isOpen: false }),
      toggleAccount: () => set((state) => ({ isOpen: !state.isOpen })),
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
      removeOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        })),
      saveCheckoutProfile: (profile) =>
        set((state) => {
          const email = normalizeProfileEmail(profile.email);

          if (!email) {
            return state;
          }

          const existingProfile = state.profiles[email];
          const hasLocationDetails = Boolean(
            profile.location.trim() || profile.address.trim() || profile.city.trim()
          );
          const nextLocation = hasLocationDetails
            ? {
                locationUrl:
                  profile.location.trim() ||
                  existingProfile?.location?.locationUrl ||
                  '',
                address:
                  profile.address.trim() ||
                  existingProfile?.location?.address ||
                  '',
                city: profile.city.trim() || existingProfile?.location?.city || '',
                notes:
                  profile.notes.trim() ||
                  existingProfile?.location?.notes ||
                  '',
                updatedAt: new Date().toISOString(),
              }
            : existingProfile?.location || null;

          return {
            profiles: {
              ...state.profiles,
              [email]: {
                name: profile.name.trim() || existingProfile?.name || '',
                email,
                phone: profile.phone.trim() || existingProfile?.phone || '',
                location: nextLocation,
                savedCards: existingProfile?.savedCards || [],
                lastPaymentMethod:
                  profile.paymentMethod || existingProfile?.lastPaymentMethod || null,
              },
            },
          };
        }),
      saveCurrentLocation: (email, locationUrl) =>
        set((state) => {
          const normalizedEmail = normalizeProfileEmail(email);

          if (!normalizedEmail || !locationUrl.trim()) {
            return state;
          }

          const existingProfile = state.profiles[normalizedEmail];

          return {
            profiles: {
              ...state.profiles,
              [normalizedEmail]: {
                name: existingProfile?.name || '',
                email: normalizedEmail,
                phone: existingProfile?.phone || '',
                savedCards: existingProfile?.savedCards || [],
                lastPaymentMethod: existingProfile?.lastPaymentMethod || null,
                location: {
                  locationUrl: locationUrl.trim(),
                  address: existingProfile?.location?.address || '',
                  city: existingProfile?.location?.city || '',
                  notes: existingProfile?.location?.notes || '',
                  updatedAt: new Date().toISOString(),
                },
              },
            },
          };
        }),
      saveCard: (email, card) => {
        const normalizedEmail = normalizeProfileEmail(email);
        const digits = card.cardNumber.replace(/\D/g, '');
        const expiryMonth = card.expiryMonth.replace(/\D/g, '').slice(0, 2);
        const expiryYear = card.expiryYear.replace(/\D/g, '').slice(-2);

        if (
          !normalizedEmail ||
          digits.length < 12 ||
          !card.cardholder.trim() ||
          !/^\d{2}$/.test(expiryMonth) ||
          !/^\d{2}$/.test(expiryYear) ||
          Number(expiryMonth) < 1 ||
          Number(expiryMonth) > 12
        ) {
          return {
            ok: false,
            error: 'invalid_card',
          };
        }

        set((state) => {
          const existingProfile = state.profiles[normalizedEmail];
          const nextCard: SavedCard = {
            id: crypto.randomUUID(),
            brand: detectCardBrand(digits),
            last4: digits.slice(-4),
            cardholder: card.cardholder.trim(),
            expiryMonth,
            expiryYear,
            nickname: card.nickname.trim(),
            addedAt: new Date().toISOString(),
          };

          return {
            profiles: {
              ...state.profiles,
              [normalizedEmail]: {
                name: existingProfile?.name || '',
                email: normalizedEmail,
                phone: existingProfile?.phone || '',
                location: existingProfile?.location || null,
                lastPaymentMethod: existingProfile?.lastPaymentMethod || null,
                savedCards: [nextCard, ...(existingProfile?.savedCards || [])],
              },
            },
          };
        });

        return {
          ok: true,
        };
      },
      removeSavedCard: (email, cardId) =>
        set((state) => {
          const normalizedEmail = normalizeProfileEmail(email);
          const existingProfile = state.profiles[normalizedEmail];

          if (!existingProfile) {
            return state;
          }

          return {
            profiles: {
              ...state.profiles,
              [normalizedEmail]: {
                ...existingProfile,
                savedCards: existingProfile.savedCards.filter((card) => card.id !== cardId),
              },
            },
          };
        }),
    }),
    {
      name: 'account-storage',
      partialize: (state) => ({
        user: state.user,
        orders: state.orders,
        profiles: state.profiles,
      }),
    }
  )
);
