import { supabase } from '../db/supabase';

// Use relative API path so dev server proxy or same-origin deployments work without CORS
const API_BASE_URL = '/api';

// API client utility
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (err) {
      // Network or CORS error
      throw new Error(`Network error: ${(err as Error).message}`);
    }

    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const errorData = await response.clone().json();
        if (errorData?.error) {
          message = errorData.error;
        } else if (errorData?.message) {
          message = errorData.message;
        }
      } catch {
        const text = await response.text().catch(() => '');
        if (text) {
          message = text;
        }
      }
      throw new Error(message);
    }

    try {
      return await response.json();
    } catch {
      return {} as any;
    }
  }

  // Auth endpoints
  auth = {
    register: (data: {
      email: string;
      password: string;
      userType: 'influencer' | 'business';
      firstName: string;
      lastName: string;
      profileData?: any;
    }) => this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    login: (email: string, password: string) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    getProfile: (userId: string) =>
      this.request(`/auth/profile/${userId}`),
  };

  // Campaign endpoints
  campaigns = {
    create: (data: {
      businessId: string;
      title: string;
      description?: string;
      campaignType: 'story_reshare' | 'post_reshare';
      budget: number;
      contentUrl?: string;
      requirements?: string;
      targetAudience?: string;
      startDate?: string;
      endDate?: string;
    }) => this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    getActive: () => this.request('/campaigns/active'),

    getByBusiness: (businessId: string) =>
      this.request(`/campaigns/business/${businessId}`),

    getById: (campaignId: string) =>
      this.request(`/campaigns/${campaignId}`),

    update: (campaignId: string, data: any) =>
      this.request(`/campaigns/${campaignId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    updateStatus: (campaignId: string, status: string) =>
      this.request(`/campaigns/${campaignId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  };

  // Bid endpoints
  bids = {
    create: (data: {
      campaignId: string;
      influencerId: string;
      proposedRate: number;
      message?: string;
    }) => this.request('/bids', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    getByInfluencer: (influencerId: string) =>
      this.request(`/bids/influencer/${influencerId}`),

    getByCampaign: (campaignId: string) =>
      this.request(`/bids/campaign/${campaignId}`),

    updateStatus: (bidId: string, status: 'accepted' | 'rejected', businessId: string) =>
      this.request(`/bids/${bidId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, businessId }),
      }),

    complete: (bidId: string, influencerId: string) =>
      this.request(`/bids/${bidId}/complete`, {
        method: 'PATCH',
        body: JSON.stringify({ influencerId }),
      }),
  };
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types for better TypeScript support
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type User = {
  id: string;
  email: string;
  userType: 'influencer' | 'business' | 'admin';
  firstName: string;
  lastName: string;
  phone?: string;
  profileImageUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Campaign = {
  id: string;
  businessId: string;
  platformId: string;
  title: string;
  description?: string;
  campaignType: 'story_reshare' | 'post_reshare';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget: number;
  contentUrl?: string;
  requirements?: string;
  targetAudience?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type Bid = {
  id: string;
  campaignId: string;
  influencerId: string;
  proposedRate: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  submittedAt: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
};
