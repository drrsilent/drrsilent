import type { CartItem, PaymentMethod } from '../store/useCartStore';

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export interface CheckoutPayload {
  customer: CheckoutCustomer;
  items: CartItem[];
  paymentMethod: PaymentMethod;
}

export const DXLR_WHATSAPP_NUMBER = '2001028589747';

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function buildWhatsappOrderUrl({
  customer,
  items,
  paymentMethod,
}: CheckoutPayload) {
  const subtotal = getCartSubtotal(items);
  const itemLines = items
    .map(
      (item) =>
        `- ${item.title} | Size: ${item.size} | Qty: ${item.quantity} | ${item.price * item.quantity} EGP`
    )
    .join('\n');

  const message = [
    'New DXLR order',
    '',
    `Name: ${customer.firstName} ${customer.lastName}`.trim(),
    `Phone: ${customer.phone}`,
    `Email: ${customer.email || 'Not provided'}`,
    `City: ${customer.city}`,
    `Address: ${customer.address}`,
    `Payment: ${paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : paymentMethod}`,
    '',
    'Items:',
    itemLines,
    '',
    `Subtotal: ${subtotal} EGP`,
    `Notes: ${customer.notes || 'None'}`,
  ].join('\n');

  return `https://wa.me/${DXLR_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
