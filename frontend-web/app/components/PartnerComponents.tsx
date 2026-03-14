import React, { useState } from 'react';
import {
  useGetPartnerMatches,
  useGetPartnerProfile,
  useCreatePartnerProfile,
  useBrowsePartners,
  useSendConnectionRequest,
} from '@/lib/hooks';
import { formatDistanceToNow } from 'date-fns';

interface Partner {
  id: string;
  userId: string;
  examType: string;
  examDate?: string;
  destination: string;
  budget?: string;
  preferences: string[];
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  createdAt: string;
}

interface MatchedPartner extends Partner {
  score?: number;
}

export const PartnerMatchResults: React.FC = () => {
  const [limit, setLimit] = useState(10);
  const { data, isLoading, error } = useGetPartnerMatches(limit);

  if (isLoading) {
    return <div className="flex justify-center py-8">Finding your matches...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">Error loading matches</div>;
  }

  const matches: MatchedPartner[] = data?.data || [];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Perfect Matches</h2>

      {matches.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-blue-50 rounded-lg p-6">
          <p>No matches found yet. Create your partner profile to get started!</p>
        </div>
      ) : (
        <>
          {matches.map((match: MatchedPartner) => (
            <PartnerCard key={match.id} partner={match} showScore={true} score={match.score} />
          ))}
        </>
      )}
    </div>
  );
};

export const PartnerCard: React.FC<{
  partner: Partner;
  showScore?: boolean;
  score?: number;
}> = ({ partner, showScore = false, score = 0 }) => {
  const [sending, setSending] = useState(false);
  const { mutate: sendConnection } = useSendConnectionRequest(partner.id);

  const handleSendRequest = async () => {
    setSending(true);
    sendConnection(
      { message: `Hi! I'm interested in connecting for ${partner.examType} exam prep.` },
      {
        onSuccess: () => {
          setSending(false);
          alert('Connection request sent!');
        },
        onError: () => {
          setSending(false);
          alert('Failed to send connection request');
        },
      }
    );
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition bg-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">
            {partner.user?.firstName} {partner.user?.lastName}
          </h3>
          <p className="text-sm text-gray-600">{partner.user?.email}</p>
        </div>
        {showScore && (
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{score}/100</div>
            <p className="text-xs text-gray-500">Match Score</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <p className="text-gray-600">Exam Type</p>
          <p className="font-semibold text-blue-600">{partner.examType}</p>
        </div>
        <div>
          <p className="text-gray-600">Destination</p>
          <p className="font-semibold">{partner.destination}</p>
        </div>
        <div>
          <p className="text-gray-600">Budget Level</p>
          <p className="font-semibold capitalize">{partner.budget || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-gray-600">Updated</p>
          <p className="font-semibold text-xs">
            {formatDistanceToNow(new Date(partner.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {partner.preferences && partner.preferences.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Preferences:</p>
          <div className="flex gap-2 flex-wrap">
            {partner.preferences.map((pref: string) => (
              <span key={pref} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {pref}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSendRequest}
        disabled={sending}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-semibold"
      >
        {sending ? 'Sending...' : 'Connect & Share Journey'}
      </button>
    </div>
  );
};

export const PartnerProfileForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [examType, setExamType] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('MEDIUM');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [prefInput, setPrefInput] = useState('');
  const [error, setError] = useState('');

  const { mutate, isPending } = useCreatePartnerProfile();

  const EXAM_TYPES = ['UPSC', 'GATE', 'JEE', 'NEET', 'CAT', 'CLAT'];
  const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Kolkata', 'Chennai', 'Pune'];

  const handleAddPreference = () => {
    if (prefInput.trim() && !preferences.includes(prefInput.trim())) {
      setPreferences([...preferences, prefInput.trim()]);
      setPrefInput('');
    }
  };

  const handleRemovePreference = (pref: string) => {
    setPreferences(preferences.filter((p) => p !== pref));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!examType) {
      setError('Please select an exam type');
      return;
    }

    if (!destination) {
      setError('Please select a destination');
      return;
    }

    mutate(
      {
        examType,
        destination,
        budget,
        preferences,
      },
      {
        onSuccess: () => {
          setExamType('');
          setDestination('');
          setBudget('MEDIUM');
          setPreferences([]);
          onSuccess?.();
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || 'Failed to create profile');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-6 bg-white space-y-4 max-w-lg">
      <h2 className="text-xl font-bold mb-4">Create Your Journey Partner Profile</h2>

      {error && <div className="bg-red-100 text-red-800 p-3 rounded text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-2">Exam Type</label>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="w-full border rounded px-3 py-2"
          disabled={isPending}
        >
          <option value="">Select exam type</option>
          {EXAM_TYPES.map((exam) => (
            <option key={exam} value={exam}>
              {exam}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Destination City</label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border rounded px-3 py-2"
          disabled={isPending}
        >
          <option value="">Select destination</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Budget Level</label>
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full border rounded px-3 py-2"
          disabled={isPending}
        >
          <option value="LOW">Low Budget</option>
          <option value="MEDIUM">Medium Budget</option>
          <option value="HIGH">High Budget</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Preferences (optional)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={prefInput}
            onChange={(e) => setPrefInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && (e.preventDefault(), handleAddPreference())
            }
            placeholder="e.g., Study in groups, Early morning prep"
            className="flex-1 border rounded px-3 py-2 text-sm"
            disabled={isPending}
          />
          <button
            type="button"
            onClick={handleAddPreference}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            disabled={isPending}
          >
            Add
          </button>
        </div>
        {preferences.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {preferences.map((pref) => (
              <span
                key={pref}
                className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
              >
                {pref}
                <button
                  type="button"
                  onClick={() => handleRemovePreference(pref)}
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
        {isPending ? 'Creating Profile...' : 'Create Profile'}
      </button>
    </form>
  );
};

export const BrowsePartners: React.FC = () => {
  const [examType, setExamType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useBrowsePartners(examType || undefined, location || undefined, page, 20);

  const EXAM_TYPES = ['UPSC', 'GATE', 'JEE', 'NEET', 'CAT', 'CLAT'];
  const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Kolkata', 'Chennai', 'Pune'];

  const partners: Partner[] = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-lg">Filter Partners</h3>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={examType}
            onChange={(e) => {
              setExamType(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">All Exams</option>
            {EXAM_TYPES.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>

          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setPage(1);
            }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">All Cities</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">Loading partners...</div>
      ) : partners.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-blue-50 rounded-lg p-6">
          <p>No partners found with your filters</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>

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
        </>
      )}
    </div>
  );
};
