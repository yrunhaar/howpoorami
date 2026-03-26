"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

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

function useCountUp(
  target: number,
  isInView: boolean,
  durationMs: number = 2000,
): number {
  const [current, setCurrent] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease out cubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * target);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, target, durationMs]);

  return current;
}

function StaticFormattedNumber({
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
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const animatedValue = useCountUp(value, isInView);

  const displayValue = isInView ? animatedValue : 0;
  const groups = splitIntoGroups(displayValue);

  return (
    <span
      ref={ref}
      className={`tabular-nums inline-flex items-baseline ${className ?? ""}`}
    >
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

export default function FormattedNumber({
  value,
  className,
  animated = true,
}: FormattedNumberProps) {
  if (!animated) {
    return <StaticFormattedNumber value={value} className={className} />;
  }

  return <AnimatedFormattedNumber value={value} className={className} />;
}
