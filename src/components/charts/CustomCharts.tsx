import React, { useState } from 'react';

// Common Chart Interfaces
interface DataPoint {
  label: string;
  sales: number;
  expenses: number;
}

interface ExpenseBreakdownPoint {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface CashflowPoint {
  month: string;
  inflow: number;
  outflow: number;
}

// -------------------------------------------------------------
// LINE CHART: Sales Trends (Mon - Sun)
// -------------------------------------------------------------
interface LineChartProps {
  data: DataPoint[];
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG dimensions
  const width = 500;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(...data.map(d => Math.max(d.sales, d.expenses)), 1000) * 1.15;
  const minVal = 0;

  // Coordinate helper mapping
  const getX = (index: number) => {
    return paddingX + (index * (width - paddingX * 2)) / (data.length - 1);
  };
  
  const getY = (val: number) => {
    return height - paddingY - ((val - minVal) * (height - paddingY * 2)) / (maxVal - minVal);
  };

  // Generate Bezier Curve Path for Sales
  const getBezierPath = (points: {x: number, y: number}[]) => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 3;
      const cpY1 = curr.y;
      const cpX2 = curr.x + 2 * (next.x - curr.x) / 3;
      const cpY2 = next.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const salesPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.sales) }));
  const expensesPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.expenses) }));

  const salesPath = getBezierPath(salesPoints);
  const expensesPath = getBezierPath(expensesPoints);

  // Path closure for area gradients
  const salesAreaPath = salesPoints.length > 0 
    ? `${salesPath} L ${salesPoints[salesPoints.length - 1].x} ${height - paddingY} L ${salesPoints[0].x} ${height - paddingY} Z` 
    : '';

  const expensesAreaPath = expensesPoints.length > 0 
    ? `${expensesPath} L ${expensesPoints[expensesPoints.length - 1].x} ${height - paddingY} L ${expensesPoints[0].x} ${height - paddingY} Z` 
    : '';

  // Grid Y ticks
  const gridTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridTicks.map((t, idx) => {
          const yVal = minVal + t * (maxVal - minVal);
          const yPos = getY(yVal);
          return (
            <g key={idx}>
              <line 
                x1={paddingX} 
                y1={yPos} 
                x2={width - paddingX} 
                y2={yPos} 
                stroke="#f1f5f9" 
                strokeWidth={1} 
              />
              <text 
                x={paddingX - 10} 
                y={yPos + 4} 
                fontSize={9} 
                fill="#94a3b8" 
                textAnchor="end"
                fontFamily="Inter"
              >
                {Math.round(yVal / 100) * 100}
              </text>
            </g>
          );
        })}

        {/* Areas */}
        <path d={salesAreaPath} fill="url(#salesGrad)" />
        <path d={expensesAreaPath} fill="url(#expGrad)" />

        {/* Curved Lines */}
        <path d={salesPath} fill="none" stroke="#4f46e5" strokeWidth={3} strokeLinecap="round" />
        <path d={expensesPath} fill="none" stroke="#f43f5e" strokeWidth={2} strokeLinecap="round" strokeDasharray="4 3" opacity={0.8} />

        {/* X Axis Labels */}
        {data.map((d, i) => (
          <text 
            key={i} 
            x={getX(i)} 
            y={height - paddingY + 18} 
            fontSize={10} 
            fill="#64748b" 
            textAnchor="middle"
            fontFamily="Outfit"
            fontWeight={500}
          >
            {d.label}
          </text>
        ))}

        {/* Interactive Hover Nodes */}
        {data.map((d, i) => {
          const x = getX(i);
          const isHovered = hoveredIdx === i;

          return (
            <g 
              key={i} 
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              {/* Invisible touch column for easy hover trigger */}
              <rect 
                x={x - (width - paddingX * 2) / (data.length * 2)} 
                y={paddingY} 
                width={(width - paddingX * 2) / (data.length - 1)} 
                height={height - paddingY * 2} 
                fill="transparent" 
              />

              {isHovered && (
                <line 
                  x1={x} 
                  y1={paddingY} 
                  x2={x} 
                  y2={height - paddingY} 
                  stroke="#cbd5e1" 
                  strokeWidth={1} 
                  strokeDasharray="2 2"
                />
              )}

              {/* Sales Circle */}
              <circle 
                cx={x} 
                cy={getY(d.sales)} 
                r={isHovered ? 6 : 4} 
                fill="#4f46e5" 
                stroke="#fff" 
                strokeWidth={isHovered ? 2 : 1.5}
                className="transition-all duration-150"
              />

              {/* Expenses Circle */}
              <circle 
                cx={x} 
                cy={getY(d.expenses)} 
                r={isHovered ? 5 : 3.5} 
                fill="#f43f5e" 
                stroke="#fff" 
                strokeWidth={isHovered ? 2 : 1.5}
                className="transition-all duration-150"
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIdx !== null && (
        <div 
          className="absolute z-10 bg-slate-900 text-white rounded-lg px-3 py-2 text-xs shadow-lg pointer-events-none transition-all duration-75 flex flex-col gap-0.5 border border-slate-800"
          style={{
            left: `${(getX(hoveredIdx) / width) * 100}%`,
            top: `${(getY(data[hoveredIdx].sales) / height) * 100 - 30}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-semibold border-b border-slate-800 pb-1 mb-1 text-slate-300">
            {data[hoveredIdx].label}day Report
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Sales:</span>
            <span className="font-semibold text-emerald-400">₹{data[hoveredIdx].sales}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Expenses:</span>
            <span className="font-semibold text-rose-400">₹{data[hoveredIdx].expenses}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-brand-500 inline-block" />
          Sales Trend
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-accent-rose inline-block" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }} />
          Expenses
        </div>
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// BAR CHART: Cashflow Summary (Inflow vs Outflow)
// -------------------------------------------------------------
interface BarChartProps {
  data: CashflowPoint[];
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 500;
  const height = 240;
  const paddingX = 45;
  const paddingY = 30;

  const maxVal = Math.max(...data.map(d => Math.max(d.inflow, d.outflow)), 10000) * 1.15;
  const minVal = 0;

  const getX = (index: number) => {
    return paddingX + (index * (width - paddingX * 2)) / data.length;
  };
  
  const getY = (val: number) => {
    return height - paddingY - ((val - minVal) * (height - paddingY * 2)) / (maxVal - minVal);
  };

  const barWidth = 14;
  const groupSpacing = 4;
  const stepWidth = (width - paddingX * 2) / data.length;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
          const yVal = minVal + t * (maxVal - minVal);
          const yPos = getY(yVal);
          return (
            <g key={idx}>
              <line x1={paddingX} y1={yPos} x2={width - paddingX} y2={yPos} stroke="#f1f5f9" strokeWidth={1} />
              <text x={paddingX - 10} y={yPos + 4} fontSize={9} fill="#94a3b8" textAnchor="end" fontFamily="Inter">
                {Math.round(yVal / 1000)}k
              </text>
            </g>
          );
        })}

        {/* Bars Drawing */}
        {data.map((d, i) => {
          const xCenter = getX(i) + stepWidth / 2;
          const xInflow = xCenter - barWidth - groupSpacing / 2;
          const xOutflow = xCenter + groupSpacing / 2;
          
          const yInflow = getY(d.inflow);
          const yOutflow = getY(d.outflow);
          const yZero = getY(0);

          const hInflow = yZero - yInflow;
          const hOutflow = yZero - yOutflow;

          return (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              {/* Invisible hover detector block for the month group */}
              <rect 
                x={getX(i)} 
                y={paddingY} 
                width={stepWidth} 
                height={height - paddingY * 2} 
                fill="transparent" 
              />

              {/* Inflow Bar */}
              <rect
                x={xInflow}
                y={yInflow}
                width={barWidth}
                height={Math.max(hInflow, 2)}
                rx={4}
                fill="#10b981" // Green Accent
                className="transition-all duration-200"
                opacity={hoveredIdx === null || hoveredIdx === i ? 1 : 0.6}
              />

              {/* Outflow Bar */}
              <rect
                x={xOutflow}
                y={yOutflow}
                width={barWidth}
                height={Math.max(hOutflow, 2)}
                rx={4}
                fill="#f43f5e" // Rose Accent
                className="transition-all duration-200"
                opacity={hoveredIdx === null || hoveredIdx === i ? 1 : 0.6}
              />

              {/* Label */}
              <text
                x={xCenter}
                y={height - paddingY + 16}
                fontSize={10}
                fill="#64748b"
                textAnchor="middle"
                fontFamily="Outfit"
                fontWeight={500}
              >
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIdx !== null && (
        <div 
          className="absolute z-10 bg-slate-900 text-white rounded-lg px-3 py-2 text-xs shadow-lg pointer-events-none transition-all duration-75 flex flex-col gap-0.5 border border-slate-800"
          style={{
            left: `${((getX(hoveredIdx) + stepWidth / 2) / width) * 100}%`,
            top: `${(getY(data[hoveredIdx].inflow) / height) * 100 - 30}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-semibold border-b border-slate-800 pb-1 mb-1 text-slate-300">
            {data[hoveredIdx].month} Cash Flow
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Inflow:</span>
            <span className="font-semibold text-emerald-400">₹{data[hoveredIdx].inflow}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Outflow:</span>
            <span className="font-semibold text-rose-400">₹{data[hoveredIdx].outflow}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block" />
          Cash In (Sales)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-accent-rose inline-block" />
          Cash Out (Expenses)
        </div>
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// DONUT CHART: Expense Breakdown By Category
// -------------------------------------------------------------
interface DonutChartProps {
  data: ExpenseBreakdownPoint[];
}

export const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG parameters
  const size = 200;
  const radius = 70;
  const strokeWidth = 22;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate cumulative totals
  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);

  let accumulatedAngle = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full">
      {/* Circle rendering */}
      <div className="relative w-[180px] h-[180px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {data.map((d, i) => {
            const ratio = d.amount / totalAmount;
            const strokeDashoffset = circumference - ratio * circumference;
            const strokeDasharray = `${circumference} ${circumference}`;
            const rotation = accumulatedAngle * 360;
            
            accumulatedAngle += ratio;
            const isHovered = hoveredIdx === i;

            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={d.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(${rotation} ${center} ${center})`}
                className="transition-all duration-200 cursor-pointer origin-center"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Total Text overlay in the middle of donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-widest">
            {hoveredIdx !== null ? data[hoveredIdx].category : 'Total'}
          </span>
          <span className="font-heading text-lg font-bold text-slate-800">
            ₹{hoveredIdx !== null ? data[hoveredIdx].amount : totalAmount}
          </span>
          {hoveredIdx !== null && (
            <span className="text-slate-500 text-xs font-semibold">
              {data[hoveredIdx].percentage}%
            </span>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="flex flex-col gap-2 w-full sm:w-auto text-left">
        {data.map((d, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-between gap-4 px-3 py-1.5 rounded-xl border border-transparent transition-all duration-150 cursor-pointer ${hoveredIdx === i ? 'bg-slate-100/70 border-slate-200/50' : ''}`}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: d.color }} />
              <span className="text-xs font-semibold text-slate-700">{d.category}</span>
            </div>
            <div className="text-xs font-bold text-slate-900">
              ₹{d.amount} <span className="text-slate-400 font-normal ml-1">({d.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
