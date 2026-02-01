'use client';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
  locationAccess?: string[];
}

interface TeamManagementSectionProps {
  teamMembers: TeamMember[];
  onInviteMember?: () => void;
  onEditMember?: (member: TeamMember) => void;
}

export default function TeamManagementSection({
  teamMembers,
  onInviteMember,
  onEditMember,
}: TeamManagementSectionProps) {
  const getRoleBadge = (role: TeamMember['role']) => {
    if (role === 'admin') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary text-white">
          Admin
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
        User
      </span>
    );
  };

  return (
    <section className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage access levels for your organization.</p>
        </div>
        <button
          onClick={onInviteMember}
          className="bg-primary hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Invite Team Member
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-8 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url("${member.avatar}")` }}
                    />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{member.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{member.email}</td>
                <td className="px-6 py-4">{getRoleBadge(member.role)}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEditMember?.(member)}
                    className="text-primary dark:text-gray-300 hover:underline text-sm font-bold"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="p-4 bg-gray-50/30 dark:bg-gray-800/30 flex justify-between items-center">
        <p className="text-xs text-gray-500">Showing {teamMembers.length} of {teamMembers.length} members</p>
        <div className="flex gap-2">
          <button
            className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-400"
            disabled
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            className="size-8 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-400"
            disabled
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}

