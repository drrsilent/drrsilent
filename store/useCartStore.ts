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
  setCartState: (items: CartItem[], paymentMethod?: PaymentMethod) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateItemSize: (id: string, currentSize: string, nextSize: string) => void;
  updateItemQuantity: (id: string, size: string, nextQuantity: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  clearCart: () => void;
  openCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      paymentMethod: 'card',
      setCartState: (items, paymentMethod = 'card') =>
        set({
          items,
          paymentMethod,
          isOpen: false,
        }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      clearCart: () => set({ items: [], isOpen: false }),
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
      updateItemSize: (id, currentSize, nextSize) => set((state) => {
        if (currentSize === nextSize) {
          return state;
        }

        const currentItem = state.items.find(
          (item) => item.id === id && item.size === currentSize
        );

        if (!currentItem) {
          return state;
        }

        const matchingTarget = state.items.find(
          (item) => item.id === id && item.size === nextSize
        );

        if (matchingTarget) {
          return {
            items: state.items
              .filter((item) => !(item.id === id && item.size === currentSize))
              .map((item) =>
                item.id === id && item.size === nextSize
                  ? { ...item, quantity: item.quantity + currentItem.quantity }
                  : item
              ),
          };
        }

        return {
          items: state.items.map((item) =>
            item.id === id && item.size === currentSize
              ? { ...item, size: nextSize }
              : item
          ),
        };
      }),
      updateItemQuantity: (id, size, nextQuantity) => set((state) => {
        if (nextQuantity <= 0) {
          return {
            items: state.items.filter(
              (item) => !(item.id === id && item.size === size)
            ),
          };
        }

        return {
          items: state.items.map((item) =>
            item.id === id && item.size === size
              ? { ...item, quantity: nextQuantity }
              : item
          ),
        };
      }),
    }),
    { name: 'cart-storage' }
  )
);
