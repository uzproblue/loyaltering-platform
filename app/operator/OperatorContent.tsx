'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ScannerCard from '@/components/operator/ScannerCard';
import ActivityLog from '@/components/operator/ActivityLog';
import QuickActions from '@/components/operator/QuickActions';
import OperatorHeader from '@/components/operator/OperatorHeader';
import SuccessToast from '@/components/operator/SuccessToast';
import NewMemberRegistration from '@/components/operator/NewMemberRegistration';
import Sidebar from '@/components/dashboard/Sidebar';
import CustomerVerificationModal from '@/components/operator/CustomerVerificationModal';
import AddPointsModal from '@/components/operator/AddPointsModal';
import RedeemRewardModal from '@/components/operator/RedeemRewardModal';

interface OperatorContentProps {
  userRole?: string;
}

interface CustomerData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  memberCode?: string;
  restaurantId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OperatorContent({ userRole = 'user' }: OperatorContentProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '' });
  const [mode, setMode] = useState<'scanner' | 'new-member'>('scanner');
  const [showModeToast, setShowModeToast] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Customer modal state for ActivityLog
  const [activityCustomer, setActivityCustomer] = useState<CustomerData | null>(null);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [isActivityLoading, setIsActivityLoading] = useState(false);
  const [isAddPointsModalOpen, setIsAddPointsModalOpen] = useState(false);
  const [addPointsCustomer, setAddPointsCustomer] = useState<CustomerData | null>(null);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [redeemCustomer, setRedeemCustomer] = useState<CustomerData | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const isAdmin = userRole === 'admin';

  const handleSignOut = async () => {
    // Clear onboarding skip flag so onboarding shows again on next login
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('onboarding_skipped');
    }
    await signOut({ redirect: false });
    router.push('/sign-in');
  };

  const handleScanSuccess = (message: { title: string; description: string }) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const enterNewMemberMode = () => {
    setMode('new-member');
    setShowModeToast(true);
  };

  const exitNewMemberMode = () => {
    setMode('scanner');
    setShowModeToast(false);
  };

  // Handle customer click from ActivityLog
  const handleActivityCustomerClick = async (customerId: string) => {
    setIsActivityLoading(true);
    setActivityError(null);
    setActivityCustomer(null);

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success && result?.data) {
        setActivityCustomer(result.data);
        handleScanSuccess({
          title: 'Customer Found',
          description: `${result.data.name} loaded successfully`
        });
      } else {
        const errorMessage = result?.message || 'Customer not found.';
        setActivityError(errorMessage);
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      setActivityError('An error occurred while fetching customer. Please try again.');
    } finally {
      setIsActivityLoading(false);
    }
  };

  const handleCloseActivityModal = () => {
    setActivityCustomer(null);
    setActivityError(null);
  };

  const handleActivityAddPoints = () => {
    if (!activityCustomer || !activityCustomer._id || !activityCustomer.restaurantId) {
      alert('Customer information is incomplete');
      return;
    }
    setAddPointsCustomer(activityCustomer);
    setActivityCustomer(null);
    setActivityError(null);
    setIsAddPointsModalOpen(true);
  };

  const handleActivityRedeemReward = () => {
    if (!activityCustomer || !activityCustomer._id || !activityCustomer.restaurantId) {
      alert('Customer information is incomplete');
      return;
    }
    setRedeemCustomer(activityCustomer);
    setActivityCustomer(null);
    setActivityError(null);
    setIsRedeemModalOpen(true);
  };

  const handleActivityViewProfile = () => {
    console.log('View profile for customer:', activityCustomer?._id);
    handleCloseActivityModal();
  };

  const handleAddPointsSuccess = (message: { title: string; description: string }) => {
    setIsAddPointsModalOpen(false);
    handleScanSuccess(message);
    // Refresh customer data
    if (addPointsCustomer?._id) {
      setTimeout(() => {
        handleActivityCustomerClick(addPointsCustomer._id);
      }, 500);
    }
    setAddPointsCustomer(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRedeemSuccess = (message: { title: string; description: string }) => {
    setIsRedeemModalOpen(false);
    handleScanSuccess(message);
    // Refresh customer data
    if (redeemCustomer?._id) {
      setTimeout(() => {
        handleActivityCustomerClick(redeemCustomer._id);
      }, 500);
    }
    setRedeemCustomer(null);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-primary dark:text-white font-display">
      {/* Sidebar - only visible for admin */}
      {isAdmin && (
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <OperatorHeader session={session} onSignOut={handleSignOut} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Scanning Actions */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {mode === 'scanner' ? (
            <>
              {/* Scanner Hero Card */}
              <ScannerCard onScanSuccess={handleScanSuccess} />

              {/* Quick Action Shortcuts */}
              <QuickActions onNewMemberSignup={enterNewMemberMode} />
            </>
          ) : (
            <>
              <NewMemberRegistration
                onClose={exitNewMemberMode}
                onSubmit={async (values) => {
                  try {
                    const response = await fetch('/api/customers', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        name: values.name,
                        email: values.email,
                        phone: values.phone,
                        dateOfBirth: values.dateOfBirth,
                      }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                      throw new Error(data.error || data.message || 'Failed to create customer');
                    }

                    // Success - show toast and return to scanner mode
                    handleScanSuccess({
                      title: 'Customer Registered',
                      description: `${values.name} has been successfully registered${values.awardWelcomePoints ? ' (+50 pts)' : ''}.`,
                    });
                    exitNewMemberMode();
                  } catch (error) {
                    // Error - show error toast
                    handleScanSuccess({
                      title: 'Registration Failed',
                      description: error instanceof Error ? error.message : 'Failed to create customer. Please try again.',
                    });
                  }
                }}
              />

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={exitNewMemberMode}
                  className="flex items-center justify-center gap-3 p-4 bg-primary text-white rounded-xl shadow-md"
                >
                  <span className="material-symbols-outlined">qr_code_scanner</span>
                  <span className="font-semibold text-sm">Back to Scanner</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 p-4 bg-white dark:bg-background-dark border border-black/10 dark:border-white/10 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-primary">summarize</span>
                  <span className="font-semibold text-sm">Shift Summary</span>
                </button>
              </div>
            </>
          )}
        </div>

            {/* Right Column: Recent Activity Log */}
            <div className="lg:col-span-5">
              <ActivityLog onCustomerClick={handleActivityCustomerClick} />
            </div>
          </div>

          {/* Map/Location Context Decoration */}
          <div className="max-w-7xl mx-auto px-4 pb-12 opacity-50 flex items-center gap-2 text-xs font-medium uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span>Terminal ID: POS-1120-WEST</span>
            <span className="mx-2">•</span>
            <span>Session: 4h 12m</span>
          </div>
        </main>

        {/* Success Toast Notification */}
        {showToast && (
          <SuccessToast
            title={toastMessage.title}
            description={toastMessage.description}
            onClose={() => setShowToast(false)}
          />
        )}

        {mode === 'new-member' && showModeToast && (
          <SuccessToast
            title="New Registration Mode"
            description="Operator is registering a new loyal customer."
            onClose={() => setShowModeToast(false)}
          />
        )}

        {/* Customer Modal from ActivityLog */}
        <CustomerVerificationModal
          key={`activity-${refreshTrigger}`}
          customer={activityCustomer}
          error={activityError}
          onClose={handleCloseActivityModal}
          onAddPoints={handleActivityAddPoints}
          onRedeemReward={handleActivityRedeemReward}
          onViewProfile={handleActivityViewProfile}
          onTransactionCreated={() => setRefreshTrigger(prev => prev + 1)}
        />

        {/* Add Points Modal for ActivityLog */}
        {addPointsCustomer && (
          <AddPointsModal
            customer={addPointsCustomer}
            isOpen={isAddPointsModalOpen}
            onClose={() => {
              setIsAddPointsModalOpen(false);
              setAddPointsCustomer(null);
            }}
            onSuccess={handleAddPointsSuccess}
          />
        )}

        {/* Redeem Modal for ActivityLog */}
        {redeemCustomer && (
          <RedeemRewardModal
            customer={redeemCustomer}
            isOpen={isRedeemModalOpen}
            onClose={() => {
              setIsRedeemModalOpen(false);
              setRedeemCustomer(null);
            }}
            onSuccess={handleRedeemSuccess}
          />
        )}
      </div>
    </div>
  );
}

