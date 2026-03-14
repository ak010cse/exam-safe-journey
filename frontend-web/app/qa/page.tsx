'use client';

import React, { useState } from 'react';
import { QAQuestionList, CreateQAQuestionForm, QACategoriesBrowser } from '@/app/components/QAComponents';

export default function QAPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'trending' | 'unanswered'>('newest');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Exam Prep Q&A</h1>
          <p className="text-gray-600">
            Ask questions, get answers, and learn from the community
          </p>
        </div>

        {/* Create Question Button */}
        {!showCreateForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              + Ask a Question
            </button>
          </div>
        )}

        {/* Create Question Form */}
        {showCreateForm && (
          <div className="mb-6">
            <CreateQAQuestionForm onSuccess={() => setShowCreateForm(false)} />
            <button
              onClick={() => setShowCreateForm(false)}
              className="mt-2 text-center w-full text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
          <QACategoriesBrowser />
        </div>

        {/* Questions */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">All Questions</h2>

          {/* Sorting */}
          <div className="bg-white border rounded-lg p-4 mb-4 flex gap-2">
            {(['newest', 'trending', 'unanswered'] as const).map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  sortBy === sort
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </button>
            ))}
          </div>

          {/* Questions List */}
          <QAQuestionList sortBy={sortBy} category={selectedCategory} />
        </div>
      </div>
    </div>
  );
}
