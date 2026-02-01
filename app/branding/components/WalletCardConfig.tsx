'use client';

import ImageUploader from './ImageUploader';
import ColorPicker from './ColorPicker';
import ActionButtons from './ActionButtons';

interface WalletCardConfigProps {
  logo: string;
  cardTitle: string;
  cardBackgroundColor: string;
  textColor: string;
  qrCodeColor: string;
  qrCodeBackgroundColor: string;
  onLogoChange: (logo: string) => void;
  onCardTitleChange: (title: string) => void;
  onCardBackgroundColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  onQrCodeColorChange: (color: string) => void;
  onQrCodeBackgroundColorChange: (color: string) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
}

export default function WalletCardConfig({
  logo,
  cardTitle,
  cardBackgroundColor,
  textColor,
  qrCodeColor,
  qrCodeBackgroundColor,
  onLogoChange,
  onCardTitleChange,
  onCardBackgroundColorChange,
  onTextColorChange,
  onQrCodeColorChange,
  onQrCodeBackgroundColorChange,
  onSave,
  onReset,
  isSaving = false,
}: WalletCardConfigProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-8">
        {/* Card Title Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#757575]">text_fields</span>
            <h3 className="text-xl font-bold text-primary dark:text-white">Card Title</h3>
          </div>
          <div className="bg-white dark:bg-[#222] border border-[#e0e0e0] dark:border-[#333] rounded-xl p-4">
            <label className="block text-sm font-semibold text-[#757575] mb-2">Card Title</label>
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => onCardTitleChange(e.target.value)}
              placeholder="Loyaltering Rewards"
              className="w-full bg-white dark:bg-[#2b2b2b] border border-[#e0e0e0] dark:border-[#444] rounded-lg px-4 py-2.5 text-sm text-primary dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
        </section>

        {/* Assets Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#757575]">image</span>
            <h3 className="text-xl font-bold text-primary dark:text-white">Assets</h3>
          </div>
          <div className="bg-white dark:bg-[#222] border border-[#e0e0e0] dark:border-[#333] rounded-xl overflow-hidden divide-y divide-[#e0e0e0] dark:divide-[#333]">
            <ImageUploader
              id="wallet-logo-upload"
              image={logo}
              onImageChange={onLogoChange}
              label="Logo"
              description="Square icon, 1:1 ratio recommended (PNG, SVG)"
              variant="square"
            />
          </div>
        </section>

        {/* Colors Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#757575]">palette</span>
            <h3 className="text-xl font-bold text-primary dark:text-white">Colors</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker
              id="card-bg-color"
              label="Card Background"
              color={cardBackgroundColor}
              onColorChange={onCardBackgroundColorChange}
            />
            <ColorPicker
              id="text-color"
              label="Text & Labels"
              color={textColor}
              onColorChange={onTextColorChange}
            />
            <ColorPicker
              id="qr-code-color"
              label="QR Code Color"
              color={qrCodeColor}
              onColorChange={onQrCodeColorChange}
            />
            <ColorPicker
              id="qr-code-bg-color"
              label="QR Code Background"
              color={qrCodeBackgroundColor}
              onColorChange={onQrCodeBackgroundColorChange}
            />
          </div>
        </section>
      </div>

      {/* Footer Actions */}
      <ActionButtons onSave={onSave} onReset={onReset} variant="wallet" isSaving={isSaving} />
    </>
  );
}
