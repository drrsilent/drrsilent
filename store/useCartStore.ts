import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export type PaymentMethod = 'card' | 'cash_on_delivery' | 'apple_pay';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  paymentMethod: PaymentMethod;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  openCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      paymentMethod: 'card',
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      openCart: () => set({ isOpen: true }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addToCart: (newItem) => set((state) => {
        const existing = state.items.find(i => i.id === newItem.id && i.size === newItem.size);
        if (existing) {
          return { items: state.items.map(i => i.id === newItem.id && i.size === newItem.size ? {...i, quantity: i.quantity + 1} : i) };
        }
        return { items: [...state.items, newItem] };
      }),
      removeFromCart: (id, size) => set((state) => ({
        items: state.items.filter(i => !(i.id === id && i.size === size))
      })),
    }),
    { name: 'cart-storage' }
  )
);
