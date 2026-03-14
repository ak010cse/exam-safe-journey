'use client';

import React, { useState } from 'react';
import { CommunityPostList, CreatePostForm } from '@/app/components/CommunityComponents';

export default function CommunityPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'trending' | 'popular'>('newest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const commonTags = ['UPSC', 'GATE', 'JEE', 'NEET', 'tips', 'study', 'exam'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Forum</h1>
          <p className="text-gray-600">Share experiences, ask questions, and help fellow exam aspirants</p>
        </div>

        {/* Create Post Button */}
        {!showCreateForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              + Create New Post
            </button>
          </div>
        )}

        {/* Create Post Form */}
        {showCreateForm && (
          <div className="mb-6">
            <CreatePostForm onSuccess={() => setShowCreateForm(false)} />
            <button
              onClick={() => setShowCreateForm(false)}
              className="mt-2 text-center w-full text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Filters and Sorting */}
        <div className="bg-white border rounded-lg p-4 mb-6 space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">Sort By</h3>
            <div className="flex gap-2">
              {(['newest', 'trending', 'popular'] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-2 rounded text-sm font-medium transition ${
                    sortBy === sort
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Filter by Tags</h3>
            <div className="flex gap-2 flex-wrap">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter((t) => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  className={`px-3 py-1 rounded text-sm transition ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts List */}
        <CommunityPostList sortBy={sortBy} tags={selectedTags} />
      </div>
    </div>
  );
}
