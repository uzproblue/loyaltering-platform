'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import ProfileSection from '@/components/settings/ProfileSection';
import TeamManagementSection, { TeamMember } from '@/components/settings/TeamManagementSection';
import InviteTeamMemberModal from '@/components/settings/InviteTeamMemberModal';
import EditTeamMemberModal, { TeamMemberData } from '@/components/settings/EditTeamMemberModal';

export default function SettingsContent() {
  const { data: session } = useSession();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<{ name: string; email: string; password: string } | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      setIsLoadingTeam(true);
      const response = await fetch('/api/user/team');
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setTeamMembers(result.data.map((member: any) => ({
            id: member.id,
            name: member.name,
            email: member.email,
            role: member.role,
            avatar: member.avatar || '',
            locationAccess: member.locationAccess || [],
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setIsLoadingTeam(false);
    }
  };

  // Fetch locations for the current restaurant (for invite/edit modals)
  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations', { cache: 'no-store' });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && Array.isArray(result.data)) {
          setLocations(
            result.data.map((loc: { _id?: string; id?: string; name: string }) => ({
              id: loc._id || loc.id || '',
              name: loc.name,
            }))
          );
          return;
        }
      }
      setLocations([]);
    } catch {
      setLocations([]);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
    fetchLocations();
  }, []);

  const handleInviteMember = async (data: {
    name: string;
    email: string;
    role: 'admin' | 'operator';
    locationIds: string[];
  }) => {
    try {
      setIsInviting(true);
      setInviteError(null);
      setInviteSuccess(null);

      const response = await fetch('/api/user/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to invite team member');
      }

      if (result.success && result.data) {
        // Show success message with generated password
        setInviteSuccess({
          name: result.data.name,
          email: result.data.email,
          password: result.data.password,
        });

        // Refresh team members list
        await fetchTeamMembers();

        // Close modal after a short delay
        setTimeout(() => {
          setIsInviteModalOpen(false);
        }, 100);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error inviting team member:', error);
      setInviteError(error instanceof Error ? error.message : 'Failed to invite team member');
    } finally {
      setIsInviting(false);
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      locationAccess: member.locationAccess || [],
    });
    setUpdateError(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = async (data: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'operator';
    locationIds: string[];
    password?: string;
  }) => {
    try {
      setIsUpdating(true);
      setUpdateError(null);

      const response = await fetch(`/api/user/team/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to update team member');
      }

      if (result.success) {
        // Refresh team members list
        await fetchTeamMembers();

        // Close modal
        setIsEditModalOpen(false);
        setEditingMember(null);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating team member:', error);
      setUpdateError(error instanceof Error ? error.message : 'Failed to update team member');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title="Settings" />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1000px] mx-auto py-8 px-6 lg:px-12">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-4">
              <a className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:underline" href="#">
                Settings
              </a>
              <span className="text-gray-400 text-sm">/</span>
              <span className="text-primary dark:text-white text-sm font-semibold">User Profile & Roles</span>
            </nav>

            {/* Page Heading */}
            <div className="flex flex-col gap-2 mb-8">
              <h1 className="text-[#141414] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                User Profile & Team Settings
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base">
                Manage your personal information and company team permissions.
              </p>
            </div>

            <div className="flex flex-col gap-10">
              <ProfileSection />

              {!isLoadingTeam && (
                <TeamManagementSection
                  teamMembers={teamMembers}
                  onInviteMember={() => {
                    setInviteError(null);
                    setInviteSuccess(null);
                    setIsInviteModalOpen(true);
                  }}
                  onEditMember={handleEditMember}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Invite Team Member Modal */}
      <InviteTeamMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => {
          setIsInviteModalOpen(false);
          setInviteError(null);
          setInviteSuccess(null);
        }}
        onInvite={handleInviteMember}
        locations={locations}
      />

      {/* Success Message */}
      {inviteSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-background-dark w-full max-w-md rounded-xl shadow-2xl overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
              </div>
              <h2 className="text-xl font-bold text-primary dark:text-white">Invite Sent Successfully</h2>
            </div>
            <div className="mb-6 space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">{inviteSuccess.name}</span> has been invited to join your team.
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email:</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">{inviteSuccess.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Temporary Password:</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono text-gray-900 dark:text-white flex-1">{inviteSuccess.password}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inviteSuccess.password);
                      }}
                      className="text-primary hover:text-black dark:hover:text-white text-sm font-bold px-3 py-1 rounded border border-primary hover:bg-primary/10 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Please share this password with the team member. They should change it after their first login.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setInviteSuccess(null);
                }}
                className="bg-primary hover:bg-black text-white px-6 py-2 rounded-lg font-bold text-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {inviteError && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-background-dark w-full max-w-md rounded-xl shadow-2xl overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600">error</span>
              </div>
              <h2 className="text-xl font-bold text-primary dark:text-white">Invite Failed</h2>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">{inviteError}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setInviteError(null);
                }}
                className="bg-primary hover:bg-black text-white px-6 py-2 rounded-lg font-bold text-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Member Modal */}
      <EditTeamMemberModal
        isOpen={isEditModalOpen}
        member={editingMember}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMember(null);
          setUpdateError(null);
        }}
        onUpdate={handleUpdateMember}
        locations={locations}
      />

      {/* Update Error Message */}
      {updateError && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-background-dark w-full max-w-md rounded-xl shadow-2xl overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600">error</span>
              </div>
              <h2 className="text-xl font-bold text-primary dark:text-white">Update Failed</h2>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">{updateError}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setUpdateError(null);
                }}
                className="bg-primary hover:bg-black text-white px-6 py-2 rounded-lg font-bold text-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {(isInviting || isUpdating) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-background-dark rounded-xl shadow-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {isInviting ? 'Sending invite...' : 'Updating team member...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
