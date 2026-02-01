'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import BrandingTabs from './components/BrandingTabs';
import SignUpPageConfig from './components/SignUpPageConfig';
import WalletCardConfig from './components/WalletCardConfig';
import SignUpPagePreview from './components/SignUpPagePreview';
import WalletCardPreview from './components/WalletCardPreview';
import { useAppSelector } from '@/store/hooks';

type BrandingTab = 'signup' | 'wallet' | 'printables';

export default function BrandingContent() {
  const { profile } = useAppSelector((state) => state.user);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<BrandingTab>('signup');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Sign-up page state
  const [headerImage, setHeaderImage] = useState<string>('');
  const [welcomeTitle, setWelcomeTitle] = useState('Join our rewards program');
  const [description, setDescription] = useState('Earn points for every purchase and unlock exclusive rewards. It\'s free and easy to join!');
  const [formFields, setFormFields] = useState({
    fullName: true,
    birthday: true,
    email: true, // disabled/required
    phone: false,
  });

  // Wallet card state
  const [walletLogo, setWalletLogo] = useState<string>('');
  const [cardTitle, setCardTitle] = useState('Loyaltering Rewards');
  const [cardBackgroundColor, setCardBackgroundColor] = useState('#303030');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [qrCodeColor, setQrCodeColor] = useState('#000000');
  const [qrCodeBackgroundColor, setQrCodeBackgroundColor] = useState('#FFFFFF');

  const handleSave = async () => {
    if (!profile?.restaurantId) {
      setSaveError('Restaurant ID not found. Please ensure you are logged in.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/restaurants/${profile.restaurantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signupPageConfig: {
            headerImage,
            welcomeTitle,
            description,
            formFields,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to save branding settings');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving branding settings:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save branding settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignUpReset = () => {
    setWelcomeTitle('Join our rewards program');
    setDescription('Earn points for every purchase and unlock exclusive rewards. It\'s free and easy to join!');
    setFormFields({
      fullName: true,
      birthday: true,
      email: true,
      phone: false,
    });
    setHeaderImage('');
  };

  const handleWalletReset = () => {
    setWalletLogo('');
    setCardTitle('Loyaltering Rewards');
    setCardBackgroundColor('#303030');
    setTextColor('#FFFFFF');
    setQrCodeColor('#000000');
    setQrCodeBackgroundColor('#FFFFFF');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="Branding Setup" />

        <div className="flex-1 flex overflow-hidden">
          {/* Configuration Panel (Left) */}
          <aside className="w-[480px] flex flex-col bg-white dark:bg-[#191919] border-r border-[#e0e0e0] dark:border-[#333]">
            <BrandingTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Scrollable Content */}
            {activeTab === 'signup' && (
              <>
                <SignUpPageConfig
                  headerImage={headerImage}
                  welcomeTitle={welcomeTitle}
                  description={description}
                  formFields={formFields}
                  onHeaderImageChange={setHeaderImage}
                  onWelcomeTitleChange={setWelcomeTitle}
                  onDescriptionChange={setDescription}
                  onFormFieldsChange={setFormFields}
                  onSave={handleSave}
                  onReset={handleSignUpReset}
                  isSaving={isSaving}
                />
                {saveError && (
                  <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-700 dark:text-red-400">{saveError}</p>
                  </div>
                )}
                {saveSuccess && (
                  <div className="px-6 py-3 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-400">Branding settings saved successfully!</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'wallet' && (
              <WalletCardConfig
                logo={walletLogo}
                cardTitle={cardTitle}
                cardBackgroundColor={cardBackgroundColor}
                textColor={textColor}
                qrCodeColor={qrCodeColor}
                qrCodeBackgroundColor={qrCodeBackgroundColor}
                onLogoChange={setWalletLogo}
                onCardTitleChange={setCardTitle}
                onCardBackgroundColorChange={setCardBackgroundColor}
                onTextColorChange={setTextColor}
                onQrCodeColorChange={setQrCodeColor}
                onQrCodeBackgroundColorChange={setQrCodeBackgroundColor}
                onSave={handleSave}
                onReset={handleWalletReset}
                isSaving={isSaving}
              />
            )}

            {activeTab === 'printables' && (
              <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
                <p className="text-[#757575] text-sm">Printables configuration coming soon...</p>
              </div>
            )}
          </aside>

          {/* Preview Canvas (Right) */}
          <section className="flex-1 bg-background-light dark:bg-background-dark flex items-center justify-center p-8 overflow-y-auto">
            {activeTab === 'signup' && (
              <SignUpPagePreview
                headerImage={headerImage}
                welcomeTitle={welcomeTitle}
                description={description}
                formFields={formFields}
              />
            )}

            {activeTab === 'wallet' && (
              <WalletCardPreview
                logo={walletLogo}
                cardTitle={cardTitle}
                cardBackgroundColor={cardBackgroundColor}
                textColor={textColor}
                qrCodeColor={qrCodeColor}
                qrCodeBackgroundColor={qrCodeBackgroundColor}
              />
            )}

            {activeTab === 'printables' && (
              <div className="text-[#757575] text-sm">Printables preview coming soon...</div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
