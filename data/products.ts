export type Product = {
  id: string;
  title: string;
  category: 'hoodies' | 't-shirts' | 'pants';
  price: number;
  image: string;
  description: string;
  sizes: string[];
};

export const shopCategories = [
  { label: 'T-Shirts', slug: 't-shirts' },
  { label: 'Hoodies', slug: 'hoodies' },
  { label: 'Pants', slug: 'pants' },
] as const;

export const products: Record<string, Product> = {
  'v1-hoodie': {
    id: 'v1-hoodie',
    title: 'V1 Heavy Hoodie',
    category: 'hoodies',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80',
    description:
      'Heavyweight cotton hoodie with a structured silhouette, brushed interior, and a clean technical finish made for daily rotation.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'protocol-tshirt': {
    id: 'protocol-tshirt',
    title: 'Protocol Zip Hoodie',
    category: 'hoodies',
    price: 1650,
    image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=1200&q=80',
    description:
      'Midweight zip hoodie with a sharp front line, soft brushed backing, and an easy oversized drape for layered everyday wear.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'dxlr-cap': {
    id: 'dxlr-cap',
    title: 'Signature Washed Hoodie',
    category: 'hoodies',
    price: 1550,
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80',
    description:
      'Washed fleece hoodie with a softened vintage finish, roomy hood shape, and a relaxed fit that feels broken-in from day one.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'cargo-pants': {
    id: 'cargo-pants',
    title: 'Utility Oversized Hoodie',
    category: 'hoodies',
    price: 1750,
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80',
    description:
      'Oversized heavyweight hoodie with clean seam lines, a boxy shoulder, and dense fabric made for a structured street silhouette.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'shadow-core-hoodie': {
    id: 'shadow-core-hoodie',
    title: 'Shadow Core Hoodie',
    category: 'hoodies',
    price: 1890,
    image: 'https://images.unsplash.com/photo-1619603364904-c0498317e145?auto=format&fit=crop&w=1200&q=80',
    description:
      'Dense brushed hoodie with a darker washed tone, dropped shoulders, and a clean front built for a minimal heavy look.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'midnight-pullover': {
    id: 'midnight-pullover',
    title: 'Midnight Pullover Hoodie',
    category: 'hoodies',
    price: 1720,
    image: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?auto=format&fit=crop&w=1200&q=80',
    description:
      'Relaxed pullover hoodie with a soft interior, oversized hood volume, and a smoother silhouette for everyday layering.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'studio-fleece-hoodie': {
    id: 'studio-fleece-hoodie',
    title: 'Studio Heavy Tee',
    category: 't-shirts',
    price: 980,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    description:
      'Structured heavyweight tee with a boxy body, clean neckline, and a minimal fit built for daily layering.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'mono-street-hoodie': {
    id: 'mono-street-hoodie',
    title: 'Mono Street Tee',
    category: 't-shirts',
    price: 920,
    image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1200&q=80',
    description:
      'Monochrome oversized tee with a heavier cotton feel and a clean front made for a sharp streetwear profile.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'vector-cargo-pants': {
    id: 'vector-cargo-pants',
    title: 'Vector Cargo Pants',
    category: 'pants',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    description:
      'Relaxed cargo pants with utility pocketing, a strong leg line, and durable fabric built for everyday movement.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'core-track-pants': {
    id: 'core-track-pants',
    title: 'Core Track Pants',
    category: 'pants',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=80',
    description:
      'Straight-leg track pants with a clean drape, soft technical feel, and an easy silhouette for daily rotation.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
};

export const productCards = Object.values(products).map(
  ({ id, title, category, price, image }) => ({
    id,
    title,
    category,
    price,
    image,
  })
);

export const featuredProducts = productCards.slice(0, 4);
