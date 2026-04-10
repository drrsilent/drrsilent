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
  const direction = cartRect.left + cartRect.width / 2 >= startRect.left + startRect.width / 2 ? 1 : -1;

  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.position = 'fixed';
  layer.style.inset = '0';
  layer.style.pointerEvents = 'none';
  layer.style.zIndex = '250';

  const trail = document.createElement('div');
  trail.style.position = 'fixed';
  trail.style.left = `${startRect.left + startRect.width * 0.14}px`;
  trail.style.top = `${startRect.top + startRect.height * 0.18}px`;
  trail.style.width = `${Math.max(startRect.width * 0.72, 44)}px`;
  trail.style.height = `${Math.max(startRect.height * 0.72, 44)}px`;
  trail.style.borderRadius = '999px';
  trail.style.background =
    'radial-gradient(circle at center, rgba(255,255,255,0.55) 0%, rgba(185,154,107,0.34) 34%, rgba(185,154,107,0.08) 62%, rgba(185,154,107,0) 74%)';
  trail.style.filter = 'blur(10px)';
  trail.style.opacity = '0.78';
  trail.style.willChange = 'transform, opacity, filter';

  const flyer = document.createElement('div');
  flyer.style.position = 'fixed';
  flyer.style.left = `${startRect.left}px`;
  flyer.style.top = `${startRect.top}px`;
  flyer.style.width = `${startRect.width}px`;
  flyer.style.height = `${startRect.height}px`;
  flyer.style.borderRadius = '22px';
  flyer.style.overflow = 'hidden';
  flyer.style.boxShadow = '0 24px 70px rgba(0, 0, 0, 0.24)';
  flyer.style.willChange = 'transform, opacity, filter';

  const flyerImage = document.createElement('div');
  flyerImage.style.position = 'absolute';
  flyerImage.style.inset = '0';
  flyerImage.style.backgroundImage = `url("${imageSrc}")`;
  flyerImage.style.backgroundSize = 'cover';
  flyerImage.style.backgroundPosition = 'center';

  const flyerSheen = document.createElement('div');
  flyerSheen.style.position = 'absolute';
  flyerSheen.style.inset = '0';
  flyerSheen.style.background =
    'linear-gradient(135deg, rgba(255,255,255,0.26), rgba(255,255,255,0) 34%, rgba(255,255,255,0.08) 68%, rgba(255,255,255,0) 100%)';
  flyerSheen.style.mixBlendMode = 'screen';

  const flyerRing = document.createElement('div');
  flyerRing.style.position = 'absolute';
  flyerRing.style.inset = '0';
  flyerRing.style.border = '1px solid rgba(255,255,255,0.28)';
  flyerRing.style.borderRadius = 'inherit';
  flyerRing.style.boxSizing = 'border-box';

  flyer.appendChild(flyerImage);
  flyer.appendChild(flyerSheen);
  flyer.appendChild(flyerRing);
  layer.appendChild(trail);
  layer.appendChild(flyer);
  document.body.appendChild(layer);

  const translateX = cartRect.left + cartRect.width / 2 - (startRect.left + startRect.width / 2);
  const translateY = cartRect.top + cartRect.height / 2 - (startRect.top + startRect.height / 2);
  const arcLift = Math.max(Math.abs(translateY) * 0.16, 26);
  const drift = Math.max(Math.abs(translateX) * 0.04, 10) * direction;

  trail.animate(
    [
      {
        transform: 'translate3d(0, 0, 0) scale(0.9)',
        opacity: 0.78,
        filter: 'blur(10px)',
      },
      {
        transform: `translate3d(${translateX * 0.42 + drift * 0.35}px, ${translateY * 0.2 - arcLift}px, 0) scale(1.18)`,
        opacity: 0.44,
        filter: 'blur(14px)',
        offset: 0.4,
      },
      {
        transform: `translate3d(${translateX * 0.84}px, ${translateY * 0.76 - arcLift * 0.25}px, 0) scale(0.62)`,
        opacity: 0.08,
        filter: 'blur(18px)',
      },
    ],
    {
      duration: 820,
      easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
      fill: 'forwards',
    }
  );

  flyer.animate(
    [
      {
        transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
        opacity: 1,
        filter: 'blur(0px)',
      },
      {
        transform: `translate3d(${translateX * 0.34 + drift}px, ${translateY * 0.12 - arcLift}px, 0) scale(0.94) rotate(${direction * 5}deg)`,
        opacity: 1,
        offset: 0.34,
      },
      {
        transform: `translate3d(${translateX * 0.7 + drift * 0.4}px, ${translateY * 0.6 - arcLift * 0.38}px, 0) scale(0.52) rotate(${direction * 11}deg)`,
        opacity: 0.94,
        filter: 'blur(0.15px)',
        offset: 0.78,
      },
      {
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(0.14) rotate(${direction * 15}deg)`,
        opacity: 0,
        filter: 'blur(0.8px)',
      },
    ],
    {
      duration: 820,
      easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
      fill: 'forwards',
    }
  ).finished.finally(() => {
    layer.remove();
  });

  window.dispatchEvent(new CustomEvent('cart:impact'));
  window.dispatchEvent(new CustomEvent('cart:bump'));
}
