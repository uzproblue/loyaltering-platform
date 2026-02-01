'use client';

import { Session } from 'next-auth';

interface OperatorHeaderProps {
  session: Session | null;
  onSignOut: () => void;
}

export default function OperatorHeader({ session, onSignOut }: OperatorHeaderProps) {
  return (
    <nav className="border-b border-black/10 dark:border-white/10 bg-white dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold italic">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight">NOUZ</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium border-l border-black/10 dark:border-white/10 pl-8">
            <div className="flex items-center gap-2 opacity-60">
              <span className="material-symbols-outlined text-lg">store</span>
              <span>Downtown Flagship</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{session?.user?.name || 'Operator'}</p>
            <p className="text-xs opacity-60">Shift Operator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/30 flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined opacity-70">account_circle</span>
          </div>
          <button
            onClick={onSignOut}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Sign Out"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

