import React, { useEffect, useRef, useState } from 'react';

type CountUpFormat = 'plain' | 'compact';

type CountUpProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  durationMs?: number;
  format?: CountUpFormat;
  className?: string;
};

const useInViewOnce = (ref: React.RefObject<HTMLElement>) => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, ref]);

  return inView;
};

const formatNumber = (value: number, format: CountUpFormat, decimals: number) => {
  if (format === 'compact') {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
};

const CountUp: React.FC<CountUpProps> = ({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  durationMs = 900,
  format = 'plain',
  className,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const inView = useInViewOnce(spanRef);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start: number | null = null;
    const from = 0;
    const to = value;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView, value, durationMs]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}
      {formatNumber(displayValue, format, decimals)}
      {suffix}
    </span>
  );
};

export default CountUp;
