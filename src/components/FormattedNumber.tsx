"use client";

import { useEffect, useRef, useState } from "react";

interface FormattedNumberProps {
  readonly value: number;
  readonly className?: string;
  readonly animated?: boolean;
}

interface DigitGroup {
  readonly digits: string;
  readonly index: number;
}

function splitIntoGroups(num: number): readonly DigitGroup[] {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(num));

  const parts = formatted.split(",");

  return parts.map((digits, index) => ({
    digits,
    index,
  }));
}

function DigitGroups({
  value,
  className,
}: {
  readonly value: number;
  readonly className?: string;
}) {
  const groups = splitIntoGroups(value);

  return (
    <span className={`tabular-nums inline-flex items-baseline ${className ?? ""}`}>
      {groups.map((group) => (
        <span key={group.index} className="inline-flex items-baseline">
          {group.index > 0 && (
            <span className="text-text-muted mx-0.5">,</span>
          )}
          <span>{group.digits}</span>
        </span>
      ))}
    </span>
  );
}

function AnimatedFormattedNumber({
  value,
  className,
}: {
  readonly value: number;
  readonly className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimated = useRef(false);
  const rafId = useRef<number | null>(null);

  // Sync immediately when value changes after initial animation
  useEffect(() => {
    if (hasAnimated.current) {
      setDisplayValue(value);
    }
  }, [value]);

  // Animate from 0 → value when element first scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        const startTime = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - startTime) / 2000, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(eased * value);
          if (progress < 1) {
            rafId.current = requestAnimationFrame(tick);
          } else {
            rafId.current = null;
          }
        }

        setDisplayValue(0);
        rafId.current = requestAnimationFrame(tick);
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [value]);

  return (
    <span ref={ref}>
      <DigitGroups value={displayValue} className={className} />
    </span>
  );
}

export default function FormattedNumber({
  value,
  className,
  animated = true,
}: FormattedNumberProps) {
  if (!animated) {
    return <DigitGroups value={value} className={className} />;
  }

  return <AnimatedFormattedNumber value={value} className={className} />;
}
