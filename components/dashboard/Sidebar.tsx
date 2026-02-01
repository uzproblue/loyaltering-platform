'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside
      className={`bg-[#FAFAFA] dark:bg-[#121212] border-r border-[#e0e0e0] dark:border-[#333] flex flex-col justify-between shrink-0 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col gap-6 p-6">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <img src="/loyaltering-logo.svg" alt="Loyaltering" className="size-10 shrink-0 dark:invert" width={40} height={40} />
          {!isCollapsed && (
            <div>
              <h1 className="text-base font-bold leading-tight">Loyaltering</h1>
              <p className="text-[#757575] text-xs font-normal">Enterprise Team</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/')
                ? 'bg-primary/10 text-primary dark:text-white font-medium'
                : 'text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            {!isCollapsed && <span className="text-sm">Global Overview</span>}
          </Link>
          <Link
            href="/locations"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/locations')
                ? 'bg-primary/10 text-primary dark:text-white font-medium'
                : 'text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">location_on</span>
            {!isCollapsed && <span className="text-sm">Locations</span>}
          </Link>
          <Link
            href="/campaigns"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/campaigns')
                ? 'bg-primary/10 text-primary dark:text-white font-medium'
                : 'text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">campaign</span>
            {!isCollapsed && <span className="text-sm">Campaigns</span>}
          </Link>
          <Link
            href="/analytics"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/analytics')
                ? 'bg-primary/10 text-primary dark:text-white font-medium'
                : 'text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">monitoring</span>
            {!isCollapsed && <span className="text-sm">Analytics</span>}
          </Link>
          <Link
            href="/branding"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/branding')
                ? 'bg-primary/10 text-primary dark:text-white font-medium'
                : 'text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">palette</span>
            {!isCollapsed && <span className="text-sm">Branding</span>}
          </Link>
          <Link
            href="/operator"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/operator')
                ? 'bg-primary/10 text-primary dark:text-white font-medium'
                : 'text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">point_of_sale</span>
            {!isCollapsed && <span className="text-sm">Operator</span>}
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/settings')
                ? 'bg-primary/10 text-primary dark:text-white font-medium'
                : 'text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            {!isCollapsed && <span className="text-sm">Settings</span>}
          </Link>
        </nav>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
          <span className="material-symbols-outlined">help</span>
          {!isCollapsed && <span className="text-sm">Help Center</span>}
        </div>
        {/* Collapse Toggle Button */}
        <button
          onClick={onToggle}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors mt-auto"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-symbols-outlined">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
          {!isCollapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

