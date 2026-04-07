'use client';

type FlyToCartOptions = {
  imageSrc: string;
  sourceRect?: DOMRect;
};

export function flyToCart({ imageSrc, sourceRect }: FlyToCartOptions) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const cartButton = document.querySelector('[data-cart-button="true"]');

  if (!(cartButton instanceof HTMLElement)) {
    return;
  }

  const cartRect = cartButton.getBoundingClientRect();
  const startRect =
    sourceRect ??
    new DOMRect(window.innerWidth / 2 - 40, window.innerHeight / 2 - 40, 80, 80);

  const flyer = document.createElement('div');
  flyer.setAttribute('aria-hidden', 'true');
  flyer.style.position = 'fixed';
  flyer.style.left = `${startRect.left}px`;
  flyer.style.top = `${startRect.top}px`;
  flyer.style.width = `${startRect.width}px`;
  flyer.style.height = `${startRect.height}px`;
  flyer.style.borderRadius = '20px';
  flyer.style.backgroundImage = `url("${imageSrc}")`;
  flyer.style.backgroundSize = 'cover';
  flyer.style.backgroundPosition = 'center';
  flyer.style.boxShadow = '0 18px 50px rgba(0, 0, 0, 0.22)';
  flyer.style.pointerEvents = 'none';
  flyer.style.zIndex = '250';
  flyer.style.willChange = 'transform, opacity';

  document.body.appendChild(flyer);

  const translateX = cartRect.left + cartRect.width / 2 - (startRect.left + startRect.width / 2);
  const translateY = cartRect.top + cartRect.height / 2 - (startRect.top + startRect.height / 2);

  flyer.animate(
    [
      {
        transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
        opacity: 1,
      },
      {
        transform: `translate3d(${translateX * 0.55}px, ${translateY * 0.35}px, 0) scale(0.72) rotate(4deg)`,
        opacity: 0.95,
        offset: 0.65,
      },
      {
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(0.24) rotate(8deg)`,
        opacity: 0.1,
      },
    ],
    {
      duration: 700,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    }
  ).finished.finally(() => {
    flyer.remove();
  });

  window.dispatchEvent(new CustomEvent('cart:bump'));
}
