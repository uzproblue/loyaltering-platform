'use client';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  isEmpty?: boolean;
  onCreateCampaign?: () => void;
}

export default function ChartCard({
  title,
  subtitle,
  timeRange = 'Last 30 Days',
  onTimeRangeChange,
  isEmpty = false,
  onCreateCampaign,
}: ChartCardProps) {
  if (isEmpty) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-[#e0e0e0] dark:border-[#333] shadow-sm flex flex-col min-h-[400px]">
        <div className="mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-[#757575] text-sm">Customer engagement and activity will appear here.</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-background-light/30 dark:bg-white/5 rounded-xl border border-dashed border-[#e0e0e0] dark:border-[#333]">
          <div className="size-16 rounded-full bg-white dark:bg-[#252525] shadow-sm flex items-center justify-center mb-6">
            <span className="material-symbols-outlined !text-3xl text-[#757575]">query_stats</span>
          </div>
          <h4 className="text-base font-bold mb-2">No data to display yet</h4>
          <p className="text-sm text-[#757575] max-w-sm mb-6">
            Launch a loyalty campaign to start tracking how your customers are interacting with your brand.
          </p>
          {onCreateCampaign && (
            <button
              onClick={onCreateCampaign}
              className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2"
            >
              <span className="material-symbols-outlined !text-[20px]">campaign</span>
              Create Your First Campaign
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-[#e0e0e0] dark:border-[#333] shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          {subtitle && <p className="text-[#757575] text-sm">{subtitle}</p>}
        </div>
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange?.(e.target.value)}
          className="bg-background-light dark:bg-white/5 border-none text-xs font-bold rounded-lg focus:ring-0"
        >
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Year to Date</option>
        </select>
      </div>
      <div className=" relative">
        <svg className="overflow-visible" height="100%" preserveAspectRatio="none" viewBox="0 0 800 240" width="100%">
          <defs>
            <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#303030" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#303030" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,180 C100,160 150,220 200,140 C250,60 350,100 400,60 C450,20 550,120 600,100 C650,80 750,40 800,20 L800,240 L0,240 Z"
            fill="url(#gradient)"
          />
          <path
            d="M0,180 C100,160 150,220 200,140 C250,60 350,100 400,60 C450,20 550,120 600,100 C650,80 750,40 800,20"
            fill="none"
            stroke="#303030"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
        <div className="flex justify-between">
          <span className="text-[#757575] text-xs font-bold">Week 1</span>
          <span className="text-[#757575] text-xs font-bold">Week 2</span>
          <span className="text-[#757575] text-xs font-bold">Week 3</span>
          <span className="text-[#757575] text-xs font-bold">Week 4</span>
        </div>
      </div>
    </div>
  );
}

