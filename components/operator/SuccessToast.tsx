'use client';

interface SuccessToastProps {
  title: string;
  description: string;
  onClose: () => void;
}

export default function SuccessToast({ title, description, onClose }: SuccessToastProps) {
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-4 bg-primary text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform translate-y-0 opacity-100 transition-all animate-in slide-in-from-bottom-5">
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
        <span className="material-symbols-outlined text-sm">check</span>
      </div>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs opacity-70">{description}</p>
      </div>
      <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}

