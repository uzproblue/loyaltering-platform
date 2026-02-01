'use client';

interface QuickActionsProps {
  onNewMemberSignup: () => void;
  onShiftSummary?: () => void;
}

export default function QuickActions({ onNewMemberSignup, onShiftSummary }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={onNewMemberSignup}
        className="flex items-center justify-center gap-3 p-4 bg-white dark:bg-background-dark border border-black/10 dark:border-white/10 rounded-xl hover:bg-primary/5 transition-colors"
        type="button"
      >
        <span className="material-symbols-outlined text-primary">add_circle_outline</span>
        <span className="font-semibold text-sm">New Member Signup</span>
      </button>
      <button
        onClick={onShiftSummary}
        className="flex items-center justify-center gap-3 p-4 bg-white dark:bg-background-dark border border-black/10 dark:border-white/10 rounded-xl hover:bg-primary/5 transition-colors"
        type="button"
      >
        <span className="material-symbols-outlined text-primary">summarize</span>
        <span className="font-semibold text-sm">Shift Summary</span>
      </button>
    </div>
  );
}

