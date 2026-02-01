'use client';

import { useState, useEffect, useCallback } from 'react';
import CustomerVerificationModal from './CustomerVerificationModal';
import QRScannerModal from './QRScannerModal';
import AddPointsModal from './AddPointsModal';
import RedeemRewardModal from './RedeemRewardModal';

interface ScannerCardProps {
  onScanSuccess: (message: { title: string; description: string }) => void;
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

const RECENT_SEARCHES_KEY = 'operator_recent_customer_searches';
const MAX_RECENT_SEARCHES = 5;

export default function ScannerCard({ onScanSuccess }: ScannerCardProps) {
  const [memberId, setMemberId] = useState('');
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAddPointsModalOpen, setIsAddPointsModalOpen] = useState(false);
  const [addPointsCustomer, setAddPointsCustomer] = useState<CustomerData | null>(null);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [redeemCustomer, setRedeemCustomer] = useState<CustomerData | null>(null);

  // Load recent IDs from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentIds(JSON.parse(stored));
        }
      } catch {
        // Ignore errors
      }
    }
  }, []);

  const handleCheck = async () => {
    const q = memberId.trim();
    if (!q) return;

    setIsLoading(true);
    setError(null);
    setCustomer(null);

    try {
      const response = await fetch(
        `/api/customers/search?q=${encodeURIComponent(q)}`,
        {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        }
      );

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success && result?.data) {
        setCustomer(result.data);
        
        // Add member code to recent searches
        if (result.data.memberCode) {
          const memberCodeWithHash = `#${result.data.memberCode}`;
          setRecentIds((prev) => {
            // Remove if already exists, then add to front
            const filtered = prev.filter((id) => id !== memberCodeWithHash);
            const updated = [memberCodeWithHash, ...filtered].slice(0, MAX_RECENT_SEARCHES);
            
            // Save to localStorage
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
              } catch (error) {
                console.warn('Failed to save recent searches to localStorage:', error);
              }
            }
            
            return updated;
          });
        }
        
        onScanSuccess({
          title: 'Customer Found',
          description: `${result.data.name} verified successfully`
        });
      } else {
        const errorMessage = result?.message || 'Customer not found. Please check the member ID or phone number and try again.';
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error searching customer:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setCustomer(null);
    setError(null);
    setMemberId(''); // Clear input after closing
  };

  const handleAddPoints = () => {
    if (!customer || !customer._id || !customer.restaurantId) {
      alert('Customer information is incomplete');
      return;
    }
    // Store customer data and close customer modal, then open add points modal
    setAddPointsCustomer(customer);
    setCustomer(null);
    setError(null);
    setIsAddPointsModalOpen(true);
  };

  const handleAddPointsSuccess = (message: { title: string; description: string }) => {
    setIsAddPointsModalOpen(false);
    onScanSuccess(message);
    // Refresh customer data to show updated balance
    if (addPointsCustomer?.memberCode) {
      setMemberId(addPointsCustomer.memberCode);
      // Re-open customer modal with updated data
      setTimeout(() => {
        handleCheck();
      }, 500);
    }
    setAddPointsCustomer(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRedeemReward = () => {
    if (!customer || !customer._id || !customer.restaurantId) {
      alert('Customer information is incomplete');
      return;
    }
    // Store customer data and close customer modal, then open redeem modal
    setRedeemCustomer(customer);
    setCustomer(null);
    setError(null);
    setIsRedeemModalOpen(true);
  };

  const handleRedeemSuccess = (message: { title: string; description: string }) => {
    setIsRedeemModalOpen(false);
    onScanSuccess(message);
    // Refresh customer data to show updated balance
    if (redeemCustomer?.memberCode) {
      setMemberId(redeemCustomer.memberCode);
      // Re-open customer modal with updated data
      setTimeout(() => {
        handleCheck();
      }, 500);
    }
    setRedeemCustomer(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleViewProfile = () => {
    // TODO: Implement view profile functionality
    console.log('View profile for customer:', customer?._id);
    handleCloseModal();
  };

  const handleQuickId = (id: string) => {
    setMemberId(id.replace('#', ''));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  const handleLaunchScanner = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Launch scanner clicked, current state:', isScannerOpen);
    setIsScannerOpen(true);
    console.log('Scanner state set to open');
  }, [isScannerOpen]);

  const handleCloseScanner = () => {
    setIsScannerOpen(false);
  };

  const handleQRScanSuccess = (decodedText: string) => {
    console.log('QR Code scanned:', decodedText);
    // Optionally, you can use the scanned value to search for customer
    // For now, just log it as requested
  };

  // Handle spacebar key press on the scanner area
  useEffect(() => {
    const handleSpacebar = (e: KeyboardEvent) => {
      if (e.key === ' ' && !isScannerOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        handleLaunchScanner();
      }
    };

    window.addEventListener('keydown', handleSpacebar);
    return () => window.removeEventListener('keydown', handleSpacebar);
  }, [isScannerOpen, handleLaunchScanner]);

  // Debug: log scanner state
  useEffect(() => {
    console.log('Scanner open state changed:', isScannerOpen);
  }, [isScannerOpen]);

  return (
    <>
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={handleCloseScanner}
        onScanSuccess={handleQRScanSuccess}
      />
      <CustomerVerificationModal
        key={refreshTrigger}
        customer={customer}
        error={error}
        onClose={handleCloseModal}
        onAddPoints={handleAddPoints}
        onRedeemReward={handleRedeemReward}
        onViewProfile={handleViewProfile}
        onTransactionCreated={() => setRefreshTrigger(prev => prev + 1)}
      />
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
      
      <section className="bg-white dark:bg-background-dark border border-black/10 dark:border-white/10 rounded-xl p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Process Validation</h1>
          <p className="opacity-60 text-sm">Scan a customer&apos;s digital card or QR code to apply rewards.</p>
        </div>

      {/* Scanner Area */}
      <div
        className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-primary/20 dark:border-white/20 hover:border-primary transition-all bg-background-light dark:bg-white/5 aspect-video flex flex-col items-center justify-center gap-4 mb-8"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Scanner area clicked');
          handleLaunchScanner();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLaunchScanner();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Launch camera scanner"
        style={{ position: 'relative' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none z-0"></div>
        <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform pointer-events-none z-10">
          <span className="material-symbols-outlined text-5xl">qr_code_scanner</span>
        </div>
        <div className="text-center z-10 relative pointer-events-none">
          <p className="text-lg font-bold">Launch Camera Scanner</p>
          <p className="text-xs opacity-60">Press spacebar or click to activate</p>
        </div>
        {/* Viewfinder corners decoration */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-primary pointer-events-none"></div>
        <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-primary pointer-events-none"></div>
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-primary pointer-events-none"></div>
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-primary pointer-events-none"></div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px bg-black/10 dark:border-white/10 flex-1"></div>
        <span className="text-xs font-bold uppercase tracking-widest opacity-40">OR</span>
        <div className="h-px bg-black/10 dark:border-white/10 flex-1"></div>
      </div>

      {/* Manual Entry */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold opacity-70">Manual ID Entry</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 opacity-40">search</span>
            <input
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Enter Member ID or Phone Number..."
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button
            onClick={handleCheck}
            disabled={isLoading}
            className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? 'Searching...' : 'Check'}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div className="flex gap-2 flex-wrap pt-2">
          {recentIds.map((id) => (
            <button
              key={id}
              onClick={() => handleQuickId(id)}
              className="text-xs bg-black/5 dark:bg-white/10 px-2 py-1 rounded cursor-pointer hover:bg-black/10 transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

