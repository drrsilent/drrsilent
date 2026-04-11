import type { Locale } from '../lib/translations';

export type Product = {
  id: string;
  title: string;
  category: 'hoodies' | 't-shirts' | 'pants';
  price: number;
  image: string;
  views: string[];
  description: string;
  sizes: string[];
};

export const shopCategories = [
  { label: 'T-Shirts', slug: 't-shirts' },
  { label: 'Hoodies', slug: 'hoodies' },
  { label: 'Pants', slug: 'pants' },
] as const;

const makeViews = (slug: string) =>
  [1, 2, 3, 4].map((frame) => `/products/dxlr-360/${slug}/${String(frame).padStart(2, '0')}.jpg`);

const productImage = (slug: string, frame = 1) =>
  `/products/dxlr-360/${slug}/${String(frame).padStart(2, '0')}.jpg`;

export const products: Record<string, Product> = {
  'black-premium-tshirt': {
    id: 'black-premium-tshirt',
    title: 'Black Premium T-Shirt',
    category: 't-shirts',
    price: 980,
    image: productImage('black-premium-tshirt'),
    views: makeViews('black-premium-tshirt'),
    description:
      'Minimal black tonal-embroidered tee in luxury heavy-weight cotton with a clean ghost-mannequin shape and a quiet DXLR finish.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'white-premium-tshirt': {
    id: 'white-premium-tshirt',
    title: 'White Premium T-Shirt',
    category: 't-shirts',
    price: 980,
    image: productImage('white-premium-tshirt'),
    views: makeViews('white-premium-tshirt'),
    description:
      'Crisp white premium tee with tonal detailing, heavy cotton structure, and a clean 360-ready silhouette for everyday rotation.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'beige-oversized-tshirt': {
    id: 'beige-oversized-tshirt',
    title: 'Beige Oversized T-Shirt',
    category: 't-shirts',
    price: 1050,
    image: productImage('beige-oversized-tshirt'),
    views: makeViews('beige-oversized-tshirt'),
    description:
      'Beige oversized tee with a soft premium drape, tonal chest embroidery, and a relaxed minimalist luxury profile.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'black-ghost-hoodie': {
    id: 'black-ghost-hoodie',
    title: 'Black Ghost Hoodie',
    category: 'hoodies',
    price: 1800,
    image: productImage('black-ghost-hoodie'),
    views: makeViews('black-ghost-hoodie'),
    description:
      'Black heavyweight hoodie presented in full ghost-mannequin 360 views with a deep tone, pouch pocket, and structured hood.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'white-ghost-hoodie': {
    id: 'white-ghost-hoodie',
    title: 'White Ghost Hoodie',
    category: 'hoodies',
    price: 1750,
    image: productImage('white-ghost-hoodie'),
    views: makeViews('white-ghost-hoodie'),
    description:
      'Clean white pullover hoodie with a smooth ghost-mannequin profile, soft volume, and a minimal premium streetwear finish.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'olive-cargo-pants': {
    id: 'olive-cargo-pants',
    title: 'Olive Cargo Pants',
    category: 'pants',
    price: 2100,
    image: productImage('olive-cargo-pants'),
    views: makeViews('olive-cargo-pants'),
    description:
      'Olive cargo pants with utility pockets, a clean tapered leg, and four-direction 360 product views for confident sizing.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'denim-360-pants': {
    id: 'denim-360-pants',
    title: 'Denim 360 Pants',
    category: 'pants',
    price: 2050,
    image: productImage('denim-360-pants'),
    views: makeViews('denim-360-pants'),
    description:
      'Dark denim pants with a clean straight profile, visible stitching, and front, side, and back views inside the 360 viewer.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'grey-sweatpants': {
    id: 'grey-sweatpants',
    title: 'Grey Sweatpants',
    category: 'pants',
    price: 1650,
    image: productImage('grey-sweatpants'),
    views: makeViews('grey-sweatpants'),
    description:
      'Grey fleece sweatpants with an easy tapered fit, elastic cuffs, and a clean 360 product spin for every angle.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'black-sweatpants': {
    id: 'black-sweatpants',
    title: 'Black Sweatpants',
    category: 'pants',
    price: 1650,
    image: productImage('black-sweatpants'),
    views: makeViews('black-sweatpants'),
    description:
      'Black fleece sweatpants with a minimal athletic profile, soft daily comfort, and 360 views across front, sides, and back.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  'navy-sweatpants': {
    id: 'navy-sweatpants',
    title: 'Navy Sweatpants',
    category: 'pants',
    price: 1650,
    image: productImage('navy-sweatpants'),
    views: makeViews('navy-sweatpants'),
    description:
      'Navy sweatpants in a soft heavyweight fleece with a relaxed taper and a complete 360 ghost-mannequin product view.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
};

const productCopy: Record<
  string,
  {
    title: Record<Locale, string>;
    description: Record<Locale, string>;
  }
> = {
  'black-premium-tshirt': {
    title: {
      en: 'Black Premium T-Shirt',
      ar: 'تي شيرت بريميوم أسود',
    },
    description: {
      en: products['black-premium-tshirt'].description,
      ar: 'تي شيرت أسود Minimalist بتطريز هادئ وخامة قطن ثقيلة فاخرة، بقصة نظيفة وملمس مناسب للاستخدام اليومي.',
    },
  },
  'white-premium-tshirt': {
    title: {
      en: 'White Premium T-Shirt',
      ar: 'تي شيرت بريميوم أبيض',
    },
    description: {
      en: products['white-premium-tshirt'].description,
      ar: 'تي شيرت أبيض بخامة قطن ثقيلة وتفاصيل هادئة، مصمم بشكل نظيف مع معاينة 360 للقطعة من كل زاوية.',
    },
  },
  'beige-oversized-tshirt': {
    title: {
      en: 'Beige Oversized T-Shirt',
      ar: 'تي شيرت بيج أوفرسايز',
    },
    description: {
      en: products['beige-oversized-tshirt'].description,
      ar: 'تي شيرت بيج أوفرسايز بقصة مريحة وانسدال ناعم، مع تطريز بسيط على الصدر وإحساس luxury هادئ.',
    },
  },
  'black-ghost-hoodie': {
    title: {
      en: 'Black Ghost Hoodie',
      ar: 'هودي جوست أسود',
    },
    description: {
      en: products['black-ghost-hoodie'].description,
      ar: 'هودي أسود ثقيل بمعاينة Ghost Mannequin بزاوية 360، مع كاب ثابت وجيب أمامي وشكل قوي وواضح.',
    },
  },
  'white-ghost-hoodie': {
    title: {
      en: 'White Ghost Hoodie',
      ar: 'هودي جوست أبيض',
    },
    description: {
      en: products['white-ghost-hoodie'].description,
      ar: 'هودي أبيض نظيف بقصة مريحة وحجم كاب متوازن، مع عرض 360 يوضح الواجهة والجنب والظهر.',
    },
  },
  'olive-cargo-pants': {
    title: {
      en: 'Olive Cargo Pants',
      ar: 'بنطال كارجو زيتوني',
    },
    description: {
      en: products['olive-cargo-pants'].description,
      ar: 'بنطال كارجو زيتوني بجيوب عملية وقصة مستقيمة مريحة، مع معاينة 360 تساعد العميل يشوف التفاصيل بوضوح.',
    },
  },
  'denim-360-pants': {
    title: {
      en: 'Denim 360 Pants',
      ar: 'بنطال دينم 360',
    },
    description: {
      en: products['denim-360-pants'].description,
      ar: 'بنطال دينم داكن بخياطة واضحة وقصة نظيفة، مع عرض أمامي وجانبي وخلفي داخل عارض 360.',
    },
  },
  'grey-sweatpants': {
    title: {
      en: 'Grey Sweatpants',
      ar: 'سويت بانتس رمادي',
    },
    description: {
      en: products['grey-sweatpants'].description,
      ar: 'سويت بانتس رمادي بخامة فليس ناعمة وقصة مريحة، مع زوايا 360 توضح الشكل قبل الشراء.',
    },
  },
  'black-sweatpants': {
    title: {
      en: 'Black Sweatpants',
      ar: 'سويت بانتس أسود',
    },
    description: {
      en: products['black-sweatpants'].description,
      ar: 'سويت بانتس أسود بتصميم minimal وراحة يومية، مع عرض 360 للواجهة والجنب والظهر.',
    },
  },
  'navy-sweatpants': {
    title: {
      en: 'Navy Sweatpants',
      ar: 'سويت بانتس كحلي',
    },
    description: {
      en: products['navy-sweatpants'].description,
      ar: 'سويت بانتس كحلي بخامة فليس ثقيلة وقصة مريحة، مع معاينة 360 كاملة للقطعة.',
    },
  },
};

export function getLocalizedProduct(productOrId: Product | string, locale: Locale): Product {
  const product =
    typeof productOrId === 'string' ? products[productOrId] : productOrId;

  if (!product) {
    throw new Error(`Unknown product: ${String(productOrId)}`);
  }

  const copy = productCopy[product.id];

  return {
    ...product,
    title: copy?.title[locale] ?? product.title,
    description: copy?.description[locale] ?? product.description,
  };
}

export function getLocalizedProducts(locale: Locale) {
  return Object.values(products).map((product) => getLocalizedProduct(product, locale));
}

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

export function getLocalizedProductCards(locale: Locale) {
  return productCards.map((product) => {
    const localizedProduct = getLocalizedProduct(product.id, locale);

    return {
      ...product,
      title: localizedProduct.title,
    };
  });
}

export function getLocalizedFeaturedProducts(locale: Locale) {
  return getLocalizedProductCards(locale).slice(0, 4);
}
