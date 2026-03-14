'use client';

import React, { useState } from 'react';
import {
  AdminDashboard,
  UserManagementPanel,
  ContentModerationPanel,
} from '@/app/components/AdminComponents';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'moderation'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 pt-6">
        <h2 className="px-6 text-xl font-bold mb-8 text-gray-900">Admin Panel</h2>
        <nav className="space-y-2 px-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-2 rounded transition ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-2 rounded transition ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            👥 User Management
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`w-full text-left px-4 py-2 rounded transition ${
              activeTab === 'moderation'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            🛡️ Content Moderation
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'users' && <UserManagementPanel />}
        {activeTab === 'moderation' && <ContentModerationPanel />}
      </div>
    </div>
  );
}
