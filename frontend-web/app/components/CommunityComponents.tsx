import React, { useState } from 'react';
import { useGetCommunityPosts, useCreateCommunityPost } from '@/lib/hooks';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  tags: string[];
  likes?: number;
  views?: number;
  _count?: {
    comments: number;
    likes: number;
  };
  createdAt: string;
}

export const CommunityPostList: React.FC<{
  sortBy?: 'newest' | 'trending' | 'popular';
  tags?: string[];
}> = ({ sortBy = 'newest', tags = [] }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetCommunityPosts(page, 20, sortBy, tags);

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">Error loading posts</div>;
  }

  const posts = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No posts found</div>
      ) : (
        posts.map((post: Post) => (
          <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600">
                  by {post.author.firstName} {post.author.lastName} •{' '}
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-pointer hover:bg-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-4 text-sm text-gray-600">
              <span>👁️ {post.views || 0} views</span>
              <span>💬 {post._count?.comments || 0} comments</span>
              <span>❤️ {post._count?.likes || 0} likes</span>
            </div>
          </div>
        ))
      )}

      {pagination.pages && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
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

export const CreatePostForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const { mutate, isPending } = useCreateCommunityPost();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || title.length < 5 || title.length > 200) {
      setError('Title must be between 5 and 200 characters');
      return;
    }

    if (!content.trim() || content.length < 10 || content.length > 5000) {
      setError('Content must be between 10 and 5000 characters');
      return;
    }

    mutate(
      { title: title.trim(), content: content.trim(), tags },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setTags([]);
          onSuccess?.();
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || 'Failed to create post');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-6 bg-white space-y-4">
      <h2 className="text-xl font-bold mb-4">Create New Post</h2>

      {error && <div className="bg-red-100 text-red-800 p-3 rounded text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title (5-200 characters)"
          className="w-full border rounded px-3 py-2"
          disabled={isPending}
        />
        <p className="text-xs text-gray-500 mt-1">{title.length} / 200</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter post content (10-5000 characters)"
          rows={5}
          className="w-full border rounded px-3 py-2"
          disabled={isPending}
        />
        <p className="text-xs text-gray-500 mt-1">{content.length} / 5000</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Add tag and press Enter"
            className="flex-1 border rounded px-3 py-2"
            disabled={isPending}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={isPending}
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
};

export const PostWithComments: React.FC<{ postId: string }> = ({ postId }) => {
  const { data: post, isLoading: postLoading } = useGetCommunityPostById(postId);

  if (postLoading) return <div className="py-8">Loading post...</div>;
  if (!post?.data) return <div className="py-8">Post not found</div>;

  const postData: Post = post.data;

  return (
    <div className="max-w-2xl">
      <div className="border rounded-lg p-6 bg-white mb-6">
        <h1 className="text-2xl font-bold mb-2">{postData.title}</h1>
        <div className="text-sm text-gray-600 mb-4">
          Posted by {postData.author.firstName} {postData.author.lastName} •{' '}
          {formatDistanceToNow(new Date(postData.createdAt), { addSuffix: true })}
        </div>

        {postData.tags && postData.tags.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {postData.tags.map((tag: string) => (
              <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose max-w-none mb-4">{postData.content}</div>

        <div className="flex gap-4 text-sm text-gray-600 pt-4 border-t">
          <span>👁️ {postData.views || 0} views</span>
          <span>💬 {postData._count?.comments || 0} comments</span>
          <span>❤️ {postData._count?.likes || 0} likes</span>
        </div>
      </div>

      <CommentSection postId={postId} />
    </div>
  );
};

export const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetCommunityPostById(postId);

  if (isLoading) return <div className="py-4">Loading comments...</div>;

  return (
    <div className="border rounded-lg p-6 bg-white">
      <h3 className="text-lg font-bold mb-4">Comments</h3>
      {/* Comment components will be added here */}
      <p className="text-gray-500">Comments section coming soon</p>
    </div>
  );
};
