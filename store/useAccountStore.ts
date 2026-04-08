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

interface AccountStore {
  isOpen: boolean;
  user: AccountUser | null;
  orders: AccountOrder[];
  openAccount: () => void;
  closeAccount: () => void;
  toggleAccount: () => void;
  signIn: (user: AccountUser) => void;
  signOut: () => void;
  addOrder: (order: AccountOrder) => void;
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      isOpen: false,
      user: null,
      orders: [],
      openAccount: () => set({ isOpen: true }),
      closeAccount: () => set({ isOpen: false }),
      toggleAccount: () => set((state) => ({ isOpen: !state.isOpen })),
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
    }),
    {
      name: 'account-storage',
      partialize: (state) => ({
        user: state.user,
        orders: state.orders,
      }),
    }
  )
);
