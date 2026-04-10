type BrandWordmarkProps = {
  className?: string;
  letterClassName?: string;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function BrandWordmark({
  className,
  letterClassName,
}: BrandWordmarkProps) {
  return (
    <span
      aria-label="DXLR"
      dir="ltr"
      className={joinClasses(
        'inline-flex items-end whitespace-nowrap uppercase leading-none [unicode-bidi:isolate]',
        className
      )}
    >
      <span className={joinClasses('relative z-[1]', letterClassName)}>D</span>
      <span
        className={joinClasses(
          'relative -mx-[0.05em] origin-center scale-x-[0.96] -skew-x-[6deg]',
          letterClassName
        )}
      >
        X
      </span>
      <span className={joinClasses('relative -ml-[0.04em]', letterClassName)}>L</span>
      <span
        className={joinClasses(
          'relative -ml-[0.06em] origin-left scale-x-[0.99]',
          letterClassName
        )}
      >
        R
      </span>
    </span>
  );
}
