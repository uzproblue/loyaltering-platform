'use client';

interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
  saveLabel?: string;
  resetLabel?: string;
  variant?: 'default' | 'wallet';
  isSaving?: boolean;
}

export default function ActionButtons({
  onSave,
  onReset,
  saveLabel = 'Save Changes',
  resetLabel = 'Reset',
  variant = 'default',
  isSaving = false,
}: ActionButtonsProps) {
  if (variant === 'wallet') {
    return (
      <div className="p-6 border-t border-[#e0e0e0] dark:border-[#333] bg-white dark:bg-[#191919] flex gap-3">
        <button
          onClick={onSave}
          className="flex-1 rounded-lg bg-primary text-white h-12 font-bold text-base hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          Save Design
        </button>
        <button
          onClick={onReset}
          className="px-6 rounded-lg bg-white dark:bg-[#222] border border-[#e0e0e0] dark:border-[#333] text-primary dark:text-white h-12 font-bold text-base hover:bg-gray-50 dark:hover:bg-[#2b2b2b] transition-all"
        >
          {resetLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 border-t border-[#e0e0e0] dark:border-[#333] bg-white dark:bg-[#191919] flex gap-3">
      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex-1 bg-primary dark:bg-white text-white dark:text-primary py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Saving...
          </>
        ) : (
          saveLabel
        )}
      </button>
      <button
        onClick={onReset}
        className="px-6 py-2.5 rounded-lg text-sm font-bold text-[#757575] dark:text-gray-400 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
      >
        {resetLabel}
      </button>
    </div>
  );
}
