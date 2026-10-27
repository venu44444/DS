import React, { useState } from 'react';

export default function SvgChart({ chart }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!chart || !Array.isArray(chart.labels) || !Array.isArray(chart.values) || chart.values.length === 0) {
    return (
      <div className="p-6 text-center text-portal-text-muted text-xs italic">
        No chart visualization data provided for this experiment.
      </div>
    );
  }

  const { type = 'bar', title, labels, values } = chart;
  const width = 560;
  const height = 240;
  const padding = { top: 30, right: 30, bottom: 45, left: 55 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const numericValues = values.map(v => (typeof v === 'number' ? v : parseFloat(v) || 0));
  const minVal = Math.min(0, ...numericValues);
  const maxVal = Math.max(...numericValues, 1);
  const range = maxVal - minVal || 1;

  const getY = (val) => {
    return padding.top + chartHeight - ((val - minVal) / range) * chartHeight;
  };

  const zeroY = getY(0);

  // 4 horizontal grid ticks
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(fraction => {
    const val = minVal + fraction * range;
    return {
      val: Number.isInteger(val) ? val : parseFloat(val.toFixed(2)),
      y: padding.top + chartHeight - fraction * chartHeight,
    };
  });

  return (
    <div className="w-full flex flex-col items-center bg-portal-bg-secondary/40 p-4 rounded-xl border border-portal-border">
      {title && (
        <h4 className="text-xs font-bold text-portal-text tracking-wide mb-2 uppercase">
          {title}
        </h4>
      )}

      <div className="w-full max-w-xl overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ minWidth: '380px' }}
        >
          {/* Background Grid Lines */}
          {ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={t.y}
                x2={width - padding.right}
                y2={t.y}
                stroke="var(--color-border)"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={t.y + 4}
                textAnchor="end"
                className="text-[10px] fill-portal-text-muted font-mono"
              >
                {t.val}
              </text>
            </g>
          ))}

          {/* Zero baseline */}
          <line
            x1={padding.left}
            y1={zeroY}
            x2={width - padding.right}
            y2={zeroY}
            stroke="var(--color-border-strong)"
            strokeWidth="1.5"
          />

          {/* Bar Chart rendering */}
          {type === 'bar' &&
            numericValues.map((val, idx) => {
              const barWidth = Math.max(12, (chartWidth / numericValues.length) * 0.55);
              const xCenter = padding.left + ((idx + 0.5) / numericValues.length) * chartWidth;
              const x = xCenter - barWidth / 2;
              const yVal = getY(val);
              const barHeight = Math.abs(zeroY - yVal);
              const barY = val >= 0 ? yVal : zeroY;
              const isHovered = hoveredIndex === idx;

              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x={x}
                    y={barY}
                    width={barWidth}
                    height={Math.max(barHeight, 2)}
                    rx={3}
                    fill={isHovered ? 'var(--color-primary)' : 'var(--color-teal)'}
                    opacity={isHovered ? 1 : 0.85}
                    className="transition-all duration-150"
                  />
                  {/* Tooltip value */}
                  {isHovered && (
                    <text
                      x={xCenter}
                      y={barY - 6}
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-portal-text font-mono"
                    >
                      {val}
                    </text>
                  )}
                  {/* X Axis Label */}
                  <text
                    x={xCenter}
                    y={height - padding.bottom + 18}
                    textAnchor="middle"
                    className="text-[9px] sm:text-[10px] fill-portal-text-muted font-sans font-medium"
                  >
                    {labels[idx] ? String(labels[idx]).slice(0, 10) : ''}
                  </text>
                </g>
              );
            })}

          {/* Line Chart rendering */}
          {type === 'line' && (
            <g>
              {/* Path area fill */}
              {(() => {
                const points = numericValues.map((val, idx) => {
                  const x = padding.left + ((idx + 0.5) / numericValues.length) * chartWidth;
                  const y = getY(val);
                  return `${x},${y}`;
                });
                const firstX = padding.left + (0.5 / numericValues.length) * chartWidth;
                const lastX = padding.left + ((numericValues.length - 0.5) / numericValues.length) * chartWidth;
                const areaD = `M ${firstX},${zeroY} L ${points.join(' L ')} L ${lastX},${zeroY} Z`;
                const lineD = `M ${points.join(' L ')}`;

                return (
                  <>
                    <path
                      d={areaD}
                      fill="var(--color-primary)"
                      opacity="0.12"
                    />
                    <path
                      d={lineD}
                      fill="none"
                      stroke="var(--color-primary)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                );
              })()}

              {/* Data points */}
              {numericValues.map((val, idx) => {
                const x = padding.left + ((idx + 0.5) / numericValues.length) * chartWidth;
                const y = getY(val);
                const isHovered = hoveredIndex === idx;

                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 6 : 4}
                      fill="var(--color-bg)"
                      stroke="var(--color-primary)"
                      strokeWidth="2"
                    />
                    {isHovered && (
                      <text
                        x={x}
                        y={y - 10}
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-portal-text font-mono"
                      >
                        {val}
                      </text>
                    )}
                    <text
                      x={x}
                      y={height - padding.bottom + 18}
                      textAnchor="middle"
                      className="text-[9px] sm:text-[10px] fill-portal-text-muted font-sans font-medium"
                    >
                      {labels[idx] ? String(labels[idx]).slice(0, 10) : ''}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
