'use client';

export interface Recommendation {
  id: string;
  type: 'urgent' | 'growth' | 'optimization';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

interface AIRecommendationsPanelProps {
  recommendations: Recommendation[];
}

export default function AIRecommendationsPanel({ recommendations }: AIRecommendationsPanelProps) {
  const getRecommendationStyles = (type: Recommendation['type']) => {
    switch (type) {
      case 'urgent':
        return {
          container: 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30',
          badge: 'text-orange-600',
        };
      case 'growth':
        return {
          container: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30',
          badge: 'text-blue-600',
        };
      case 'optimization':
        return {
          container: 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30',
          badge: 'text-green-600',
        };
    }
  };

  const getBadgeText = (type: Recommendation['type']) => {
    switch (type) {
      case 'urgent':
        return 'Urgent Alert';
      case 'growth':
        return 'Growth Tip';
      case 'optimization':
        return 'Optimization';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-primary/20 dark:border-primary/40 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-primary dark:text-white">bolt</span>
        <h3 className="text-lg font-bold">AI Recommendations</h3>
      </div>
      <div className="flex flex-col gap-4">
        {recommendations.map((rec) => {
          const styles = getRecommendationStyles(rec.type);
          return (
            <div key={rec.id} className={`p-4 rounded-lg border ${styles.container}`}>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold ${styles.badge} uppercase tracking-widest`}>
                  {getBadgeText(rec.type)}
                </span>
                {rec.onDismiss && (
                  <button
                    onClick={rec.onDismiss}
                    className="material-symbols-outlined !text-[16px] text-[#757575] cursor-pointer hover:text-[#141414] dark:hover:text-white"
                  >
                    close
                  </button>
                )}
              </div>
              <h4 className="text-sm font-bold mb-1">{rec.title}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                {rec.description}
              </p>
              {rec.actionLabel && rec.onAction && (
                <button
                  onClick={rec.onAction}
                  className="text-xs font-bold text-primary dark:text-white underline decoration-2 underline-offset-4"
                >
                  {rec.actionLabel}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-8 pt-6 border-t border-[#e0e0e0] dark:border-[#333]">
        <h4 className="text-xs font-bold text-[#757575] uppercase mb-4">Quick Actions</h4>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 w-full text-left text-sm font-medium hover:text-primary dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-lg">download</span>
            Monthly Report Export
          </button>
          <button className="flex items-center gap-3 w-full text-left text-sm font-medium hover:text-primary dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-lg">mail</span>
            Email All Location Admins
          </button>
        </div>
      </div>
    </div>
  );
}

