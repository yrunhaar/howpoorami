"use client";

import { useState, useEffect, useRef } from "react";

interface ResponsiveChartProps {
  readonly aspectRatio?: number; // width / height
  readonly minHeight?: number;
  readonly maxHeight?: number;
  readonly children: (dimensions: { width: number; height: number }) => React.ReactNode;
}

export default function ResponsiveChart({
  aspectRatio = 16 / 9,
  minHeight = 300,
  maxHeight = 600,
  children,
}: ResponsiveChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const rawHeight = width / aspectRatio;
      const height = Math.max(minHeight, Math.min(maxHeight, rawHeight));
      setDimensions({ width, height });
    }

    measure();

    const observer = new ResizeObserver(measure);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [aspectRatio, minHeight, maxHeight]);

  return (
    <div ref={containerRef} className="w-full">
      {dimensions.width > 0 && children(dimensions)}
    </div>
  );
}
