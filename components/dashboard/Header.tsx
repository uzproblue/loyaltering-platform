'use client';

import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  showSetupPending?: boolean;
}

export default function Header({ title = 'Enterprise Master Dashboard', showSetupPending = false }: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    // Clear onboarding skip flag so onboarding shows again on next login
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('onboarding_skipped');
    }
    await signOut({ redirect: false });
    router.push('/sign-in');
  };

  return (
    <header className="h-16 bg-white dark:bg-background-dark border-b border-[#e0e0e0] dark:border-[#333] flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-primary dark:text-white">{title}</h2>
        {showSetupPending && (
          <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-900/30">
            Setup Pending
          </span>
        )}
      </div>
      <div className="flex items-center gap-6">
        <div className="relative max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757575] !text-xl">
            search
          </span>
          <input
            className="w-64 bg-background-light dark:bg-white/5 border-none rounded-lg pl-10 text-sm focus:ring-1 focus:ring-primary"
            placeholder="Search data..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-6">
          <button className="size-10 rounded-full flex items-center justify-center text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="relative group">
            <div className="size-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm cursor-pointer relative">
              <Image
                alt="Admin user profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXGe1RvcEcVMqt7lwb3YW3pfZx33Y3OmdEQIzOgmgs35p367ba_1Ekk90c0mOD1KBwK47fApbQjpUh3UQRBE1akyfPW2PZWUIE4Cf9w0Ro3IEArSFUv8STynMV7o1vUjZjbbk5i2owZ10WY1daJExl6DSrTyrM0_0Hh3BFC7V5OLb0AALM5-gemUfgzU-AOLiepayGnCTXOKx6nIJ9MAeHVk3HNTVqO81Cv4IAIRU7sMlOqJavU7nipfk_aBM78h4o4TETM9dcTQ"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1e1e1e] rounded-lg shadow-lg border border-[#e0e0e0] dark:border-[#333] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-4 border-b border-[#e0e0e0] dark:border-[#333]">
                <p className="text-sm font-semibold">{session?.user?.name || 'User'}</p>
                <p className="text-xs text-[#757575]">{session?.user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

