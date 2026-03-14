import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get auth token from localStorage
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== COMMUNITY POST HOOKS =====

export const useGetCommunityPosts = (
  page: number = 1,
  limit: number = 20,
  sortBy: 'newest' | 'trending' | 'popular' = 'newest',
  tags?: string[]
): UseQueryResult => {
  return useQuery({
    queryKey: ['community', 'posts', page, limit, sortBy, tags],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
      });
      if (tags?.length) {
        params.append('tags', tags.join(','));
      }
      const res = await api.get(`/api/v1/community/posts?${params}`);
      return res.data;
    },
  });
};

export const useGetCommunityPostById = (postId: string | null): UseQueryResult => {
  return useQuery({
    queryKey: ['community', 'posts', postId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/community/posts/${postId}`);
      return res.data;
    },
    enabled: !!postId,
  });
};

export const useSearchCommunityPosts = (
  query: string,
  page: number = 1,
  limit: number = 20
): UseQueryResult => {
  return useQuery({
    queryKey: ['community', 'posts', 'search', query, page, limit],
    queryFn: async () => {
      const res = await api.get(`/api/v1/community/posts/search`, {
        params: { query, page, limit },
      });
      return res.data;
    },
    enabled: !!query,
  });
};

export const useCreateCommunityPost = (): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: { title: string; content: string; tags: string[] }) => {
      const res = await api.post('/api/v1/community/posts', data);
      return res.data;
    },
  });
};

export const useUpdateCommunityPost = (postId: string): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: { title?: string; content?: string; tags?: string[] }) => {
      const res = await api.put(`/api/v1/community/posts/${postId}`, data);
      return res.data;
    },
  });
};

export const useDeleteCommunityPost = (postId: string): UseMutationResult => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/api/v1/community/posts/${postId}`);
      return res.data;
    },
  });
};

export const useLikePost = (postId: string): UseMutationResult => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post(`/api/v1/community/posts/${postId}/like`);
      return res.data;
    },
  });
};

export const useGetUserPosts = (userId: string, page: number = 1, limit: number = 10): UseQueryResult => {
  return useQuery({
    queryKey: ['community', 'user', userId, 'posts', page, limit],
    queryFn: async () => {
      const res = await api.get(`/api/v1/community/users/${userId}/posts`, {
        params: { page, limit },
      });
      return res.data;
    },
    enabled: !!userId,
  });
};

// ===== COMMENT HOOKS =====

export const useGetPostComments = (
  postId: string,
  sortBy: 'newest' | 'oldest' = 'newest',
  page: number = 1,
  limit: number = 20
): UseQueryResult => {
  return useQuery({
    queryKey: ['community', 'comments', postId, sortBy, page, limit],
    queryFn: async () => {
      const res = await api.get(`/api/v1/community/posts/${postId}/comments`, {
        params: { sortBy, page, limit },
      });
      return res.data;
    },
    enabled: !!postId,
  });
};

export const useCreateComment = (postId: string): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: { content: string }) => {
      const res = await api.post(`/api/v1/community/posts/${postId}/comments`, data);
      return res.data;
    },
  });
};

export const useUpdateComment = (commentId: string): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: { content: string }) => {
      const res = await api.put(`/api/v1/community/comments/${commentId}`, data);
      return res.data;
    },
  });
};

export const useDeleteComment = (commentId: string): UseMutationResult => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/api/v1/community/comments/${commentId}`);
      return res.data;
    },
  });
};

export const useGetUserComments = (userId: string, page: number = 1, limit: number = 20): UseQueryResult => {
  return useQuery({
    queryKey: ['community', 'user', userId, 'comments', page, limit],
    queryFn: async () => {
      const res = await api.get(`/api/v1/community/users/${userId}/comments`, {
        params: { page, limit },
      });
      return res.data;
    },
    enabled: !!userId,
  });
};

// ===== JOURNEY PARTNER HOOKS =====

export const useGetPartnerMatches = (limit: number = 10): UseQueryResult => {
  return useQuery({
    queryKey: ['partners', 'matches', limit],
    queryFn: async () => {
      const res = await api.get(`/api/v1/partners/matches`, {
        params: { limit },
      });
      return res.data;
    },
  });
};

export const useGetPartnerProfile = (): UseQueryResult => {
  return useQuery({
    queryKey: ['partners', 'profile'],
    queryFn: async () => {
      const res = await api.get(`/api/v1/partners/profile`);
      return res.data;
    },
  });
};

export const useCreatePartnerProfile = (): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: {
      examType: string;
      examDate?: string;
      destination: string;
      budget?: string;
      preferences: string[];
    }) => {
      const res = await api.post(`/api/v1/partners/profile`, data);
      return res.data;
    },
  });
};

export const useUpdatePartnerProfile = (): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put(`/api/v1/partners/profile`, data);
      return res.data;
    },
  });
};

export const useBrowsePartners = (
  examType?: string,
  location?: string,
  page: number = 1,
  limit: number = 20
): UseQueryResult => {
  return useQuery({
    queryKey: ['partners', 'browse', examType, location, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (examType) params.append('examType', examType);
      if (location) params.append('location', location);
      const res = await api.get(`/api/v1/partners/browse?${params}`);
      return res.data;
    },
  });
};

export const useGetPartnerById = (partnerId: string | null): UseQueryResult => {
  return useQuery({
    queryKey: ['partners', partnerId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/partners/${partnerId}`);
      return res.data;
    },
    enabled: !!partnerId,
  });
};

export const useTogglePartnerStatus = (): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: { isActive: boolean }) => {
      const res = await api.put(`/api/v1/partners/profile/toggle`, data);
      return res.data;
    },
  });
};

export const useSendConnectionRequest = (partnerId: string): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: { message?: string }) => {
      const res = await api.post(`/api/v1/partners/${partnerId}/connect`, data);
      return res.data;
    },
  });
};

// ===== Q&A HOOKS =====

export const useGetQAQuestions = (
  page: number = 1,
  limit: number = 20,
  sortBy: 'newest' | 'trending' | 'unanswered' = 'newest'
): UseQueryResult => {
  return useQuery({
    queryKey: ['qa', 'questions', page, limit, sortBy],
    queryFn: async () => {
      const res = await api.get(`/api/v1/qa/questions`, {
        params: { page, limit, sortBy },
      });
      return res.data;
    },
  });
};

export const useGetQAQuestion = (questionId: string | null): UseQueryResult => {
  return useQuery({
    queryKey: ['qa', 'questions', questionId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/qa/questions/${questionId}`);
      return res.data;
    },
    enabled: !!questionId,
  });
};

export const useSearchQA = (query: string, category?: string, page: number = 1, limit: number = 20): UseQueryResult => {
  return useQuery({
    queryKey: ['qa', 'search', query, category, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        query,
        page: page.toString(),
        limit: limit.toString(),
      });
      if (category) params.append('category', category);
      const res = await api.get(`/api/v1/qa/search?${params}`);
      return res.data;
    },
    enabled: !!query,
  });
};

export const useCreateQAQuestion = (): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: { title: string; content: string; category: string }) => {
      const res = await api.post(`/api/v1/qa/questions`, data);
      return res.data;
    },
  });
};

export const usePostQAAnswer = (questionId: string): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: { content: string }) => {
      const res = await api.post(`/api/v1/qa/questions/${questionId}/answers`, data);
      return res.data;
    },
  });
};

export const useMarkAnswerHelpful = (answerId: string): UseMutationResult => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post(`/api/v1/qa/answers/${answerId}/helpful`);
      return res.data;
    },
  });
};

export const useGetQACategories = (): UseQueryResult => {
  return useQuery({
    queryKey: ['qa', 'categories'],
    queryFn: async () => {
      const res = await api.get(`/api/v1/qa/categories`);
      return res.data;
    },
  });
};

// ===== ADMIN HOOKS =====

export const useGetAllUsers = (
  page: number = 1,
  limit: number = 20,
  search?: string,
  status?: string,
  role?: string
): UseQueryResult => {
  return useQuery({
    queryKey: ['admin', 'users', page, limit, search, status, role],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (role) params.append('role', role);
      const res = await api.get(`/api/v1/admin/users?${params}`);
      return res.data;
    },
  });
};

export const useGetUserDetails = (userId: string | null): UseQueryResult => {
  return useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/admin/users/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
};

export const useUpdateUserRole = (): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: { userId: string; role: 'USER' | 'MODERATOR' | 'ADMIN' }) => {
      const res = await api.put(`/api/v1/admin/users/${data.userId}/role`, data);
      return res.data;
    },
  });
};

export const useBanUser = (): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: { userId: string; reason: string }) => {
      const res = await api.post(`/api/v1/admin/users/${data.userId}/ban`, data);
      return res.data;
    },
  });
};

export const useUnbanUser = (userId: string): UseMutationResult => {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post(`/api/v1/admin/users/${userId}/unban`);
      return res.data;
    },
  });
};

export const useGetFlaggedContent = (
  page: number = 1,
  limit: number = 20,
  status?: string,
  contentType?: string
): UseQueryResult => {
  return useQuery({
    queryKey: ['admin', 'flagged-content', page, limit, status, contentType],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (status) params.append('status', status);
      if (contentType) params.append('contentType', contentType);
      const res = await api.get(`/api/v1/admin/flagged-content?${params}`);
      return res.data;
    },
  });
};

export const useModerateContent = (flagId: string): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: { action: 'APPROVE' | 'REJECT' | 'DELETE'; reason?: string }) => {
      const res = await api.put(`/api/v1/admin/flagged-content/${flagId}`, data);
      return res.data;
    },
  });
};

export const useGetDashboardStats = (): UseQueryResult => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: async () => {
      const res = await api.get(`/api/v1/admin/dashboard/stats`);
      return res.data;
    },
  });
};

export const useGetUserGrowth = (days: number = 30): UseQueryResult => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'user-growth', days],
    queryFn: async () => {
      const res = await api.get(`/api/v1/admin/analytics/user-growth`, {
        params: { days },
      });
      return res.data;
    },
  });
};

export const useGetEngagementMetrics = (): UseQueryResult => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'engagement'],
    queryFn: async () => {
      const res = await api.get(`/api/v1/admin/analytics/engagement`);
      return res.data;
    },
  });
};

export const useGetActivityLog = (
  page: number = 1,
  limit: number = 50,
  userId?: string
): UseQueryResult => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'activity-log', page, limit, userId],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (userId) params.append('userId', userId);
      const res = await api.get(`/api/v1/admin/analytics/activity-log?${params}`);
      return res.data;
    },
  });
};

export const useGetSystemHealth = (): UseQueryResult => {
  return useQuery({
    queryKey: ['admin', 'system', 'health'],
    queryFn: async () => {
      const res = await api.get(`/api/v1/admin/system/health`);
      return res.data;
    },
  });
};

export const useGetModeratorStats = (): UseQueryResult => {
  return useQuery({
    queryKey: ['admin', 'system', 'moderators'],
    queryFn: async () => {
      const res = await api.get(`/api/v1/admin/system/moderators`);
      return res.data;
    },
  });
};

export const useCreateModerator = (): UseMutationResult => {
  return useMutation({
    mutationFn: async (data: { userId: string }) => {
      const res = await api.post(`/api/v1/admin/system/moderators`, data);
      return res.data;
    },
  });
};
