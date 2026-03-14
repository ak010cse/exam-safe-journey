import React, { useState } from 'react';
import {
  useGetQAQuestions,
  useGetQAQuestion,
  useCreateQAQuestion,
  usePostQAAnswer,
  useGetQACategories,
} from '@/lib/hooks';
import { formatDistanceToNow } from 'date-fns';

interface QAQuestion {
  id: string;
  title: string;
  content: string;
  category?: string;
  author: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  _count?: {
    comments: number;
    likes: number;
  };
  views?: number;
  createdAt: string;
}

interface QACategory {
  name: string;
  count: number;
}

export const QAQuestionList: React.FC<{
  sortBy?: 'newest' | 'trending' | 'unanswered';
  category?: string;
}> = ({ sortBy = 'newest', category = '' }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetQAQuestions(page, 20, sortBy);

  // Filter by category if needed (client-side for now)
  const filteredQuestions = category
    ? data?.data?.filter((q: any) => q.category === category) || []
    : data?.data || [];

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading questions...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">Error loading questions</div>;
  }

  return (
    <div className="space-y-4">
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No questions found</div>
      ) : (
        filteredQuestions.map((question: QAQuestion) => (
          <QAQuestionCard key={question.id} question={question} />
        ))
      )}

      {data?.pagination?.pages && data?.pagination?.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {data?.pagination?.page} of {data?.pagination?.pages}
          </span>
          <button
            onClick={() => setPage(Math.min(data?.pagination?.pages, page + 1))}
            disabled={page === data?.pagination?.pages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export const QAQuestionCard: React.FC<{ question: QAQuestion }> = ({ question }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
            {question.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            asked by {question.author.firstName} {question.author.lastName} •{' '}
            {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
          </p>
        </div>
        {question.category && (
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded whitespace-nowrap">
            {question.category}
          </span>
        )}
      </div>

      <p className="text-gray-700 mt-3 line-clamp-2">{question.content}</p>

      <div className="flex gap-4 text-sm text-gray-600 mt-3">
        <span>👁️ {question.views || 0} views</span>
        <span>💬 {question._count?.comments || 0} answers</span>
        <span>❤️ {question._count?.likes || 0} helpful</span>
      </div>
    </div>
  );
};

export const QAQuestionDetail: React.FC<{ questionId: string }> = ({ questionId }) => {
  const { data, isLoading } = useGetQAQuestion(questionId);

  if (isLoading) return <div className="py-8">Loading question...</div>;
  if (!data?.data) return <div className="py-8">Question not found</div>;

  const question: QAQuestion = data.data;

  return (
    <div className="max-w-3xl">
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
            <div className="text-sm text-gray-600">
              asked by {question.author.firstName} {question.author.lastName} •{' '}
              {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
            </div>
          </div>
          {question.category && (
            <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded">
              {question.category}
            </span>
          )}
        </div>

        <div className="prose max-w-none mb-6">{question.content}</div>

        <div className="flex gap-4 text-sm text-gray-600 pt-4 border-t">
          <span>👁️ {question.views || 0} views</span>
          <span>💬 {question._count?.comments || 0} answers</span>
          <span>❤️ {question._count?.likes || 0} helpful votes</span>
        </div>
      </div>

      <AnswerSection questionId={questionId} />
    </div>
  );
};

export const AnswerSection: React.FC<{ questionId: string }> = ({ questionId }) => {
  const { data: question, isLoading } = useGetQAQuestion(questionId);
  const [showForm, setShowForm] = useState(false);

  if (isLoading) return <div className="py-4">Loading answers...</div>;

  const answers = question?.data?.comments || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Answers ({answers.length})
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          {showForm ? 'Cancel' : 'Post Your Answer'}
        </button>
      </div>

      {showForm && <PostAnswerForm questionId={questionId} onSuccess={() => setShowForm(false)} />}

      <div className="space-y-4">
        {answers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-blue-50 rounded-lg">
            <p>No answers yet. Be the first to help!</p>
          </div>
        ) : (
          answers.map((answer: any) => (
            <div key={answer.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-gray-600">
                  answered by {answer.author?.firstName} {answer.author?.lastName} •{' '}
                  {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                </div>
              </div>
              <p className="text-gray-700">{answer.content}</p>
              <div className="mt-3 flex gap-2">
                <button className="text-xs px-3 py-1 border rounded hover:bg-gray-100">
                  Helpful
                </button>
                <button className="text-xs px-3 py-1 border rounded hover:bg-gray-100">
                  Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const PostAnswerForm: React.FC<{ questionId: string; onSuccess?: () => void }> = ({
  questionId,
  onSuccess,
}) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const { mutate, isPending } = usePostQAAnswer(questionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim() || content.length < 10 || content.length > 5000) {
      setError('Answer must be between 10 and 5000 characters');
      return;
    }

    mutate(
      { content: content.trim() },
      {
        onSuccess: () => {
          setContent('');
          onSuccess?.();
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || 'Failed to post answer');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-gray-50 space-y-3">
      {error && <div className="bg-red-100 text-red-800 p-2 rounded text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-2">Your Answer</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your knowledge and help others..."
          rows={4}
          className="w-full border rounded px-3 py-2"
          disabled={isPending}
        />
        <p className="text-xs text-gray-500 mt-1">{content.length} / 5000</p>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
        >
          {isPending ? 'Posting...' : 'Post Answer'}
        </button>
      </div>
    </form>
  );
};

export const CreateQAQuestionForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const { data: categoriesData } = useGetQACategories();
  const { mutate, isPending } = useCreateQAQuestion();

  const categories = categoriesData?.data || [];

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

    if (!category) {
      setError('Please select a category');
      return;
    }

    mutate(
      { title: title.trim(), content: content.trim(), category },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setCategory('');
          onSuccess?.();
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || 'Failed to create question');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-6 bg-white space-y-4 max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Ask a Question</h2>

      {error && <div className="bg-red-100 text-red-800 p-3 rounded text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-2">Question Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your exam preparation question?"
          className="w-full border rounded px-3 py-2"
          disabled={isPending}
        />
        <p className="text-xs text-gray-500 mt-1">{title.length} / 200</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2"
          disabled={isPending}
        >
          <option value="">Select a category</option>
          {categories.map((cat: QACategory) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Question Details</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Provide more details about your question..."
          rows={5}
          className="w-full border rounded px-3 py-2"
          disabled={isPending}
        />
        <p className="text-xs text-gray-500 mt-1">{content.length} / 5000</p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {isPending ? 'Posting...' : 'Post Question'}
      </button>
    </form>
  );
};

export const QACategoriesBrowser: React.FC = () => {
  const { data, isLoading } = useGetQACategories();

  if (isLoading) return <div className="py-4">Loading categories...</div>;

  const categories: QACategory[] = data?.data || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category: QACategory) => (
        <div key={category.name} className="border rounded-lg p-4 hover:shadow-md transition">
          <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
          <p className="text-2xl font-bold text-blue-600">{category.count}</p>
          <p className="text-sm text-gray-500">questions</p>
          <button className="mt-3 w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Browse Questions
          </button>
        </div>
      ))}
    </div>
  );
};
