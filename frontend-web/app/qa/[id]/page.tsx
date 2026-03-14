'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QAQuestionDetail } from '@/app/components/QAComponents';

export default function QAQuestionPage() {
  const params = useParams();
  const questionId = params?.id as string;

  if (!questionId) {
    return <div className="py-8">Question not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <Link href="/qa" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Q&A
        </Link>

        {/* Question Content */}
        <QAQuestionDetail questionId={questionId} />
      </div>
    </div>
  );
}
