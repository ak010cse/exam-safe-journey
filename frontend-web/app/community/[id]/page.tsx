'use client';

import React from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PostWithComments } from '@/app/components/CommunityComponents';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params?.id as string;

  if (!postId) {
    return <div className="py-8">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Link */}
        <Link href="/community" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Community
        </Link>

        {/* Post Content */}
        <PostWithComments postId={postId} />
      </div>
    </div>
  );
}
