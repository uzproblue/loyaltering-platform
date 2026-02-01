'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfile } from '@/store/slices/userSlice';
import Image from 'next/image';

interface WalletCardPreviewProps {
  logo: string;
  cardTitle: string;
  cardBackgroundColor: string;
  textColor: string;
  qrCodeColor: string;
  qrCodeBackgroundColor: string;
}

export default function WalletCardPreview({
  logo,
  cardTitle,
  cardBackgroundColor,
  textColor,
  qrCodeColor,
  qrCodeBackgroundColor,
}: WalletCardPreviewProps) {
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);

  // Fetch user profile on mount
  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile]);

  const restaurantId = profile?.restaurantId || null;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[400px]">
      {/* Front/Back Toggle */}
      <div className="flex bg-gray-200 dark:bg-[#2b2b2b] p-1 rounded-lg w-fit">
        <button
          onClick={() => setCardSide('front')}
          className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${
            cardSide === 'front'
              ? 'bg-white dark:bg-[#333] text-primary dark:text-white shadow-sm'
              : 'text-[#757575]'
          }`}
        >
          Front
        </button>
        <button
          onClick={() => setCardSide('back')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            cardSide === 'back'
              ? 'bg-white dark:bg-[#333] text-primary dark:text-white shadow-sm'
              : 'text-[#757575]'
          }`}
        >
          Back
        </button>
      </div>

      {/* Apple Wallet Pass Mockup */}
      <div
        className="relative w-full max-w-[340px] aspect-[1/1.6] rounded-[24px] overflow-hidden flex flex-col transition-all border border-white/10 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]"
        style={{ backgroundColor: cardBackgroundColor }}
      >
        {cardSide === 'front' ? (
          <>
            {/* Top Bar (Logo & Title) */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-3 justify-between w-full">
                {logo ? (
                  <Image
                    width={32}
                    height={32}
                    src={logo}
                    alt="Logo"
                    className="w-8 h-8 min-w-8 min-h-8 max-w-8 max-h-8 rounded-full border border-white/20 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">image</span>
                  </div>
                )}
                <span className="text-white text-sm font-bold tracking-tight" style={{ color: textColor }}>
                  {cardTitle || 'Rewards Card'}
                </span>
                <div className="text-white text-sm font-bold tracking-tight" style={{ color: textColor }}>
                  #12345
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="flex-1 px-6 py-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: `${textColor}99` }}>
                    Points Balance
                  </p>
                  <p className="text-2xl font-black mt-1" style={{ color: textColor }}>
                    2,450 pts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: `${textColor}99` }}>
                    Tier
                  </p>
                  <p className="text-lg font-bold mt-1" style={{ color: textColor }}>
                    Gold
                  </p>
                </div>
              </div>
              {/* QR Code Area */}
            <div className="px-2 py-6 flex flex-col items-center gap-2">
              {restaurantId ? (
                <>
                  <div className="w-full h-full p-3 rounded-lg" style={{ backgroundColor: qrCodeBackgroundColor }}>
                    <QRCodeSVG
                      value={restaurantId}
                      size={248}
                      level='H'
                      fgColor={qrCodeColor}
                      bgColor={qrCodeBackgroundColor}
                    />
                  </div>
                </>
              ) : (
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400 text-2xl">qr_code_scanner</span>
                </div>
              )}
            </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: `${textColor}99` }}>
                  Member Name
                </p>
                <p className="text-lg font-medium" style={{ color: textColor }}>
                  Alex Thompson
                </p>
              </div>
            </div>

            
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-sm" style={{ color: textColor }}>
              Back of card preview
            </p>
          </div>
        )}
      </div>

      <p className="text-[#757575] text-xs text-center max-w-[280px]">
        This preview is an approximation. Actual appearance may vary slightly across Apple Wallet and Google Pay.
      </p>
    </div>
  );
}
