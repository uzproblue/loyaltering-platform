'use client';

export interface StatItem {
  label: string;
  value: string | number;
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  emptyMessage?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  isEmpty?: boolean;
}

export default function StatsGrid({ stats, isEmpty = false }: StatsGridProps) {
  const getChangeColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'text-[#078807] bg-[#078807]/10';
      case 'negative':
        return 'text-[#e70808] bg-[#e70808]/10';
      default:
        return 'text-[#757575] bg-[#757575]/10';
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-[#e0e0e0] dark:border-[#333] shadow-sm"
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-[#757575] text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
            {stat.change && !isEmpty && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${getChangeColor(stat.change.type)}`}
              >
                {stat.change.value}
              </span>
            )}
          </div>
          <p className={`text-2xl font-bold tracking-tight ${isEmpty ? 'text-gray-300 dark:text-gray-600' : ''}`}>
            {stat.value}
          </p>
          {isEmpty && stat.emptyMessage && (
            <p className="text-[10px] text-gray-400 mt-1">{stat.emptyMessage}</p>
          )}
        </div>
      ))}
    </section>
  );
}

