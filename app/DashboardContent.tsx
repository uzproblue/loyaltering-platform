'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import StatsGrid, { StatItem } from '@/components/dashboard/StatsGrid';
import ChartCard from '@/components/dashboard/ChartCard';
import LocationsTable, { Location } from '@/components/dashboard/LocationsTable';
import AIRecommendationsPanel, { Recommendation } from '@/components/dashboard/AIRecommendationsPanel';
import OnboardingGuide from '@/components/dashboard/OnboardingGuide';
import AddLocationModal from '@/components/dashboard/AddLocationModal';
import LocationCreatedSuccessModal from '@/components/dashboard/LocationCreatedSuccessModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfile } from '@/store/slices/userSlice';
import { fetchLocations } from '@/store/slices/locationsSlice';

export default function DashboardContent() {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const { locations, isLoading: isLoadingLocations } = useAppSelector((state) => state.locations);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdLocation, setCreatedLocation] = useState<{
    location: {
      id: string;
      name: string;
      address: string;
      category: string;
      createdAt: string;
    };
    operator: {
      id: string;
      name: string;
      email: string;
      role: string;
      locationAccess: string[];
      password: string;
      createdAt: string;
    };
  } | null>(null);

  // Fetch user profile and locations on mount
  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
    }
    dispatch(fetchLocations());
  }, [dispatch, profile]);

  // hasData should be based on actual business metrics, not just locations
  // For now, keep it false until we have real customer/campaign/revenue data
  const hasData = false; // TODO: Set to true when there's actual customer/campaign/revenue data

  // Sample data - in production, this would come from API calls
  const stats: StatItem[] = hasData
    ? [
        {
          label: 'Total Customers',
          value: '128,430',
          change: { value: '+12%', type: 'positive' },
        },
        {
          label: 'Active Campaigns',
          value: '42',
          change: { value: '0%', type: 'neutral' },
        },
        {
          label: 'Wallet Adds',
          value: '8,120',
          change: { value: '-2%', type: 'negative' },
        },
        {
          label: 'Revenue',
          value: '$452,900',
          change: { value: '+8%', type: 'positive' },
        },
      ]
    : [
        {
          label: 'Total Customers',
          value: '0',
          emptyMessage: 'Connect a location to see data',
        },
        {
          label: 'Active Campaigns',
          value: '0',
          emptyMessage: 'Create your first campaign',
        },
        {
          label: 'Wallet Adds',
          value: 'N/A',
          emptyMessage: 'Pending program launch',
        },
        {
          label: 'Revenue',
          value: '$0.00',
          emptyMessage: 'Start tracking sales activity',
        },
      ];


  const recommendations: Recommendation[] = hasData
    ? [
        {
          id: '1',
          type: 'urgent',
          title: 'Low Retention: Downtown',
          description:
            'Retention dropped by 14% this week. We recommend a "Welcome Back" double-stamp campaign.',
          actionLabel: 'Apply Automation',
          onAction: () => console.log('Apply automation'),
          onDismiss: () => console.log('Dismiss recommendation 1'),
        },
        {
          id: '2',
          type: 'growth',
          title: 'New Peak Hour Detected',
          description: 'Westside Mall sees 40% more traffic on Tuesdays at 2 PM. Schedule a flash sale.',
          actionLabel: 'Schedule Now',
          onAction: () => console.log('Schedule flash sale'),
          onDismiss: () => console.log('Dismiss recommendation 2'),
        },
        {
          id: '3',
          type: 'optimization',
          title: 'Redeem Rate Up',
          description:
            'Reward redemption is 22% higher than average. Consider increasing point requirements for premium items.',
          onDismiss: () => console.log('Dismiss recommendation 3'),
        },
      ]
    : [];

  const handleAddLocation = async (data: {
    location: {
      id: string;
      name: string;
      address: string;
      category: string;
      createdAt: string;
    };
    operator: {
      id: string;
      name: string;
      email: string;
      role: string;
      locationAccess: string[];
      password: string;
      createdAt: string;
    };
  }) => {
    // Close add location modal
    setIsAddLocationModalOpen(false);
    
    // Store the created location data and show success modal
    setCreatedLocation(data);
    setIsSuccessModalOpen(true);
    
    // Refresh locations list to show the new location
    dispatch(fetchLocations());
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header showSetupPending={!hasData} />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
          <StatsGrid stats={stats} isEmpty={!hasData} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Chart & Table */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <ChartCard
                title="Performance at a Glance"
                subtitle="Customer engagement across all platforms"
                isEmpty={!hasData}
                onCreateCampaign={() => console.log('Create campaign')}
              />

              <LocationsTable
                locations={locations}
                onLocationClick={(location) => console.log('Location clicked:', location)}
                isEmpty={locations.length === 0 && !isLoadingLocations}
                onAddLocation={() => setIsAddLocationModalOpen(true)}
              />
            </div>

            {/* Right: AI Panel or Onboarding Guide */}
            <aside className="flex flex-col gap-6">
              {hasData ? (
                <AIRecommendationsPanel recommendations={recommendations} />
              ) : (
                <OnboardingGuide 
                  currentStep={1} 
                  onboardingCompleted={profile?.onboardingCompleted || false}
                  hasLocations={locations.length > 0}
                />
              )}
            </aside>
          </div>
        </div>
      </main>

      {/* Add Location Modal */}
      <AddLocationModal
        isOpen={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
        onSubmit={handleAddLocation}
      />

      {/* Location Created Success Modal */}
      {createdLocation && (
        <LocationCreatedSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => {
            setIsSuccessModalOpen(false);
            setCreatedLocation(null);
          }}
          location={createdLocation.location}
          operator={createdLocation.operator}
        />
      )}
    </div>
  );
}

