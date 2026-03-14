'use client';

import React, { useState } from 'react';
import { PartnerProfileForm, PartnerMatchResults, BrowsePartners } from '@/app/components/PartnerComponents';
import { useGetPartnerProfile } from '@/lib/hooks';

export default function PartnerMatchingPage() {
  const [tab, setTab] = useState<'profile' | 'matches' | 'browse'>('profile');
  const { data: profileData } = useGetPartnerProfile();

  const hasProfile = profileData?.data?.id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Journey Partner Matching</h1>
          <p className="text-gray-600">
            Find exam buddies heading to the same center with similar goals
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setTab('profile')}
            className={`px-4 py-2 font-semibold transition ${
              tab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setTab('matches')}
            disabled={!hasProfile}
            className={`px-4 py-2 font-semibold transition ${
              tab === 'matches'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 disabled:opacity-50'
            }`}
          >
            Your Matches
          </button>
          <button
            onClick={() => setTab('browse')}
            className={`px-4 py-2 font-semibold transition ${
              tab === 'browse'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Browse Partners
          </button>
        </div>

        {/* Content */}
        <div className="bg-white border rounded-lg p-6">
          {tab === 'profile' && (
            <div className="max-w-lg mx-auto">
              {hasProfile ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Your Journey Partner Profile</h2>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <span className="font-semibold">Exam Type:</span> {profileData?.data?.examType}
                    </p>
                    <p>
                      <span className="font-semibold">Destination:</span> {profileData?.data?.destination}
                    </p>
                    <p>
                      <span className="font-semibold">Budget:</span> {profileData?.data?.budget}
                    </p>
                    {profileData?.data?.preferences && (
                      <p>
                        <span className="font-semibold">Preferences:</span>{' '}
                        {profileData.data.preferences.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Create Your Partner Profile</h2>
                  <p className="text-gray-600 mb-6">
                    Set up your profile to find and connect with journey partners.
                  </p>
                  <PartnerProfileForm />
                </div>
              )}
            </div>
          )}

          {tab === 'matches' && (
            <div>
              <PartnerMatchResults />
            </div>
          )}

          {tab === 'browse' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Browse All Partners</h2>
              <BrowsePartners />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
