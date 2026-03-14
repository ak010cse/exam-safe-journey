import React, { useState, useEffect } from 'react';
import {
  useGetAllUsers,
  useGetDashboardStats,
  useGetUserGrowth,
  useGetEngagementMetrics,
  useGetFlaggedContent,
  useBanUser,
  useUpdateUserRole,
  useModerateContent,
} from '@/lib/hooks';
import { formatDistanceToNow } from 'date-fns';

export const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) return <div className="py-8">Loading dashboard...</div>;

  const statData = stats?.data || {};

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={statData.totalUsers}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={statData.activeUsers}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Banned Users"
          value={statData.bannedUsers}
          icon="🚫"
          color="red"
        />
        <StatCard
          title="Engagement Rate"
          value={`${statData.engagementRate}%`}
          icon="📈"
          color="purple"
        />
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Community Posts"
          value={statData.totalPosts}
          icon="📝"
          color="blue"
        />
        <StatCard
          title="Comments"
          value={statData.totalComments}
          icon="💬"
          color="green"
        />
        <StatCard
          title="Partners Matched"
          value={statData.totalPartners}
          icon="👫"
          color="pink"
        />
        <StatCard
          title="Q&A Questions"
          value={statData.totalQuestions}
          icon="❓"
          color="amber"
        />
      </div>

      {/* Additional Sections */}
      <UserGrowthChart />
      <EngagementMetricsSection />
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: string;
  color: string;
}> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
    pink: 'bg-pink-50 border-pink-200',
    amber: 'bg-amber-50 border-amber-200',
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export const UserManagementPanel: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');

  const { data, isLoading, refetch } = useGetAllUsers(page, 20, search, status, role);
  const { mutate: banUser } = useBanUser();
  const { mutate: updateRole } = useUpdateUserRole();

  const users = data?.data || [];
  const pagination = data?.pagination || {};

  const handleBanUser = (userId: string) => {
    const reason = prompt('Enter ban reason:');
    if (reason) {
      banUser(
        { userId, reason },
        {
          onSuccess: () => {
            alert('User banned successfully');
            refetch();
          },
          onError: () => {
            alert('Failed to ban user');
          },
        }
      );
    }
  };

  const handleChangeRole = (userId: string, newRole: 'USER' | 'MODERATOR' | 'ADMIN') => {
    updateRole(
      { userId, role: newRole },
      {
        onSuccess: () => {
          alert('Role updated successfully');
          refetch();
        },
        onError: () => {
          alert('Failed to update role');
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search by email or name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-2 text-sm"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BANNED">Banned</option>
          </select>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="MODERATOR">Moderator</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="py-8">Loading users...</div>
      ) : (
        <div className="bg-white border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Joined</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleChangeRole(user.id, e.target.value as any)
                      }
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="USER">User</option>
                      <option value="MODERATOR">Moderator</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'BANNED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-2">
                    {user.status !== 'BANNED' && (
                      <button
                        onClick={() => handleBanUser(user.id)}
                        className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const ContentModerationPanel: React.FC = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('PENDING');
  const [contentType, setContentType] = useState('');

  const { data, isLoading, refetch } = useGetFlaggedContent(page, 20, status, contentType);
  const { mutate: moderateContent } = useModerateContent('');

  const flaggedItems = data?.data || [];
  const pagination = data?.pagination || {};

  const handleModerate = (flagId: string, action: 'APPROVE' | 'REJECT' | 'DELETE') => {
    const reason = prompt('Enter moderation reason:');
    if (reason) {
      moderateContent(
        flagId,
        { action, reason },
        {
          onSuccess: () => {
            alert(`Content ${action.toLowerCase()}ed`);
            refetch();
          },
          onError: () => {
            alert('Failed to moderate content');
          },
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Content Moderation</h2>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <select
            value={contentType}
            onChange={(e) => {
              setContentType(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">All Types</option>
            <option value="POST">Post</option>
            <option value="COMMENT">Comment</option>
          </select>
        </div>
      </div>

      {/* Flagged Content List */}
      {isLoading ? (
        <div className="py-8">Loading flagged content...</div>
      ) : flaggedItems.length === 0 ? (
        <div className="text-center py-8 bg-blue-50 rounded-lg">
          <p className="text-gray-600">No flagged content to review</p>
        </div>
      ) : (
        <div className="space-y-3">
          {flaggedItems.map((item: any) => (
            <div key={item.id} className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-sm">
                    {item.contentType} flagged for: {item.reason}
                  </p>
                  <p className="text-xs text-gray-600">
                    Reported by {item.flaggedBy?.email || 'Anonymous'} •{' '}
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    item.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : item.status === 'RESOLVED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {item.status === 'PENDING' && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleModerate(item.id, 'APPROVE')}
                    className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleModerate(item.id, 'REJECT')}
                    className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleModerate(item.id, 'DELETE')}
                    className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const UserGrowthChart: React.FC = () => {
  const [days, setDays] = useState(30);
  const { data, isLoading } = useGetUserGrowth(days);

  if (isLoading) return <div className="py-4">Loading chart...</div>;

  const growthData = data?.data || [];

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">User Growth</h3>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
        <p className="text-gray-500">Chart will be rendered here ({growthData.length} data points)</p>
      </div>
    </div>
  );
};

export const EngagementMetricsSection: React.FC = () => {
  const { data, isLoading } = useGetEngagementMetrics();

  if (isLoading) return <div className="py-4">Loading metrics...</div>;

  const metrics = data?.data || {};
  const topContributors = metrics.topContributors || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
        <div className="space-y-3">
          <div>
            <p className="text-gray-600">Avg Posts Per User</p>
            <p className="text-2xl font-bold text-blue-600">{metrics.averagePostsPerUser}</p>
          </div>
          <div>
            <p className="text-gray-600">Avg Comments Per User</p>
            <p className="text-2xl font-bold text-green-600">{metrics.averageCommentsPerUser}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
        <div className="space-y-2">
          {topContributors.slice(0, 5).map((contributor: any, idx: number) => (
            <div key={contributor.id} className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm">
                {idx + 1}. {contributor.name}
              </span>
              <span className="text-xs text-gray-600">
                {contributor.posts} posts, {contributor.comments} comments
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
