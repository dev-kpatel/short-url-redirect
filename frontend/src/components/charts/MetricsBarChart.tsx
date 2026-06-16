import React, { useEffect, useRef, useState } from "react";

export interface BarData {
  label: string;
  value: number;
}

interface MetricsBarChartProps {
  data: BarData[];
  mode: "vertical" | "horizontal";
  height?: number;
}

export const MetricsBarChart: React.FC<MetricsBarChartProps> = ({
  data,
  mode,
  height = 240,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(500);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Resize listener
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const paddingLeft = 64;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 32;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map((d) => d.value), 5);

  return (
    <div ref={containerRef} className="w-full select-none">
      {mode === "vertical" ? (
        // Vertical Bar Chart (e.g., Redirect Counts by Type)
        <svg width={width} height={height} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + chartHeight * ratio;
            const gridVal = Math.round(maxVal - ratio * maxVal);
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  className="text-xs font-sans fill-muted-foreground"
                  textAnchor="end"
                >
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, idx) => {
            const barWidth = Math.max(Math.min(chartWidth / data.length - 24, 60), 20);
            const x =
              paddingLeft +
              (idx / data.length) * chartWidth +
              (chartWidth / data.length - barWidth) / 2;
            const barHeight = (item.value / maxVal) * chartHeight;
            const y = paddingTop + chartHeight - barHeight;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Bar rectangle with transition */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="6"
                  fill={hoveredIdx === idx ? "var(--lime-brand)" : "var(--lime-brand)"}
                  fillOpacity={hoveredIdx === idx ? "0.9" : "0.75"}
                  className="transition-all duration-300"
                />
                {/* Bar Value text above bar */}
                {hoveredIdx === idx && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-foreground"
                  >
                    {item.value}
                  </text>
                )}
                {/* Label on X-axis */}
                <text
                  x={x + barWidth / 2}
                  y={paddingTop + chartHeight + 18}
                  textAnchor="middle"
                  className="text-xs font-sans fill-muted-foreground"
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          {/* Bottom baseline */}
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={width - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="var(--border)"
            strokeWidth="1"
          />
        </svg>
      ) : (
        // Horizontal Bar Chart (e.g., Top 5 Visited Links)
        <svg width={width} height={height} className="overflow-visible">
          {data.map((item, idx) => {
            const rowHeight = chartHeight / data.length;
            const barHeight = Math.min(rowHeight - 12, 24);
            const y = paddingTop + idx * rowHeight + (rowHeight - barHeight) / 2;
            const barWidth = maxVal > 0 ? (item.value / maxVal) * (chartWidth - 48) : 0;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Row label */}
                <text
                  x={paddingLeft - 8}
                  y={y + barHeight / 2 + 4}
                  textAnchor="end"
                  className="text-xs font-mono font-bold fill-foreground"
                >
                  {item.label}
                </text>

                {/* Horizontal Bar Rectangle */}
                <rect
                  x={paddingLeft}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  fill="var(--lime-brand)"
                  fillOpacity={hoveredIdx === idx ? "0.9" : "0.75"}
                  className="transition-all duration-300"
                />

                {/* Inline value display */}
                <text
                  x={paddingLeft + barWidth + 8}
                  y={y + barHeight / 2 + 4}
                  textAnchor="start"
                  className={`text-xs font-semibold ${
                    hoveredIdx === idx ? "fill-foreground font-bold" : "fill-muted-foreground"
                  }`}
                >
                  {item.value} hits
                </text>
              </g>
            );
          })}

          {/* Left vertical baseline */}
          <line
            x1={paddingLeft}
            y1={paddingTop - 6}
            x2={paddingLeft}
            y2={paddingTop + chartHeight + 6}
            stroke="var(--border)"
            strokeWidth="1"
          />
        </svg>
      )}
    </div>
  );
};
