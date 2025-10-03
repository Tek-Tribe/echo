import { eq, and, desc, asc, lt } from 'drizzle-orm';
import { db } from './connection';
import {
  users,
  influencerProfiles,
  businessProfiles,
  campaigns,
  bids,
  payments,
  evidenceSubmissions,
  notifications,
  platforms,
  emailVerificationCodes,
  type User,
  type NewUser,
  type Campaign,
  type NewCampaign,
  type Bid,
  type NewBid,
  type InfluencerProfile,
  type NewInfluencerProfile,
  type BusinessProfile,
  type NewBusinessProfile,
  type EmailVerificationCode,
  type NewEmailVerificationCode,
} from './schema';

// User queries
export const userQueries = {
  // Create a new user
  create: async (userData: NewUser): Promise<User> => {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  },

  // Get user by ID
  getById: async (id: string): Promise<User | null> => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  },

  // Get user by email
  getByEmail: async (email: string): Promise<User | null> => {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  },

  // Update user
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  // Get users by type
  getByType: async (userType: 'influencer' | 'business' | 'admin'): Promise<User[]> => {
    return db.select().from(users).where(eq(users.userType, userType));
  },
};

// Influencer profile queries
export const influencerQueries = {
  // Create influencer profile
  create: async (profileData: NewInfluencerProfile): Promise<InfluencerProfile> => {
    const [profile] = await db.insert(influencerProfiles).values(profileData).returning();
    return profile;
  },

  // Get profile by user ID
  getByUserId: async (userId: string): Promise<InfluencerProfile | null> => {
    const [profile] = await db
      .select()
      .from(influencerProfiles)
      .where(eq(influencerProfiles.userId, userId));
    return profile || null;
  },

  // Update profile
  update: async (userId: string, profileData: Partial<InfluencerProfile>): Promise<InfluencerProfile> => {
    const [profile] = await db
      .update(influencerProfiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(influencerProfiles.userId, userId))
      .returning();
    return profile;
  },

  // Get all influencers with filters
  getAll: async (filters?: {
    minFollowers?: number;
    maxFollowers?: number;
    niche?: string;
    location?: string;
  }): Promise<(InfluencerProfile & { user: User })[]> => {
    let query = db
      .select()
      .from(influencerProfiles)
      .leftJoin(users, eq(influencerProfiles.userId, users.id))
      .where(eq(users.isActive, true));

    // Apply filters if provided
    // Note: This is a simplified version. In production, you'd want more sophisticated filtering
    return query as any;
  },
};

// Business profile queries
export const businessQueries = {
  // Create business profile
  create: async (profileData: NewBusinessProfile): Promise<BusinessProfile> => {
    const [profile] = await db.insert(businessProfiles).values(profileData).returning();
    return profile;
  },

  // Get profile by user ID
  getByUserId: async (userId: string): Promise<BusinessProfile | null> => {
    const [profile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.userId, userId));
    return profile || null;
  },

  // Update profile
  update: async (userId: string, profileData: Partial<BusinessProfile>): Promise<BusinessProfile> => {
    const [profile] = await db
      .update(businessProfiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(businessProfiles.userId, userId))
      .returning();
    return profile;
  },
};

// Campaign queries
export const campaignQueries = {
  // Create campaign
  create: async (campaignData: NewCampaign): Promise<Campaign> => {
    const [campaign] = await db.insert(campaigns).values(campaignData).returning();
    return campaign;
  },

  // Get campaign by ID
  getById: async (id: string): Promise<Campaign | null> => {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || null;
  },

  // Get campaigns by business ID
  getByBusinessId: async (businessId: string): Promise<Campaign[]> => {
    return db
      .select()
      .from(campaigns)
      .where(eq(campaigns.businessId, businessId))
      .orderBy(desc(campaigns.createdAt));
  },

  // Get active campaigns
  getActiveCampaigns: async (): Promise<Campaign[]> => {
    return db
      .select()
      .from(campaigns)
      .where(eq(campaigns.status, 'active'))
      .orderBy(desc(campaigns.createdAt));
  },

  // Update campaign
  update: async (id: string, campaignData: Partial<Campaign>): Promise<Campaign> => {
    const [campaign] = await db
      .update(campaigns)
      .set({ ...campaignData, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return campaign;
  },
};

// Bid queries
export const bidQueries = {
  // Create bid
  create: async (bidData: NewBid): Promise<Bid> => {
    const [bid] = await db.insert(bids).values(bidData).returning();
    return bid;
  },

  // Get bid by ID
  getById: async (id: string): Promise<Bid | null> => {
    const [bid] = await db.select().from(bids).where(eq(bids.id, id));
    return bid || null;
  },

  // Get bids by campaign ID
  getByCampaignId: async (campaignId: string): Promise<Bid[]> => {
    return db
      .select()
      .from(bids)
      .where(eq(bids.campaignId, campaignId))
      .orderBy(desc(bids.submittedAt));
  },

  // Get bids by influencer ID
  getByInfluencerId: async (influencerId: string): Promise<Bid[]> => {
    return db
      .select()
      .from(bids)
      .where(eq(bids.influencerId, influencerId))
      .orderBy(desc(bids.submittedAt));
  },

  // Update bid status
  updateStatus: async (id: string, status: 'pending' | 'accepted' | 'rejected' | 'completed'): Promise<Bid> => {
    const [bid] = await db
      .update(bids)
      .set({
        status,
        respondedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(bids.id, id))
      .returning();
    return bid;
  },
};

// Platform queries
export const platformQueries = {
  // Get all active platforms
  getActive: async () => {
    return db.select().from(platforms).where(eq(platforms.isActive, true));
  },

  // Get platform by name
  getByName: async (name: string) => {
    const [platform] = await db.select().from(platforms).where(eq(platforms.name, name));
    return platform || null;
  },
};

// Notification queries
export const notificationQueries = {
  // Create notification
  create: async (notificationData: {
    userId: string;
    title: string;
    message: string;
    type: string;
    relatedId?: string;
    relatedType?: string;
  }) => {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  },

  // Get notifications by user ID
  getByUserId: async (userId: string, limit: number = 50) => {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    const [notification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  },

  // Mark all user notifications as read
  markAllAsRead: async (userId: string) => {
    return db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  },
};

// Email verification queries
export const verificationQueries = {
  // Create verification code
  create: async (verificationData: NewEmailVerificationCode): Promise<EmailVerificationCode> => {
    const [code] = await db.insert(emailVerificationCodes).values(verificationData).returning();
    return code;
  },

  // Get valid verification code by email and code
  getValidCode: async (email: string, code: string): Promise<EmailVerificationCode | null> => {
    const [verificationCode] = await db
      .select()
      .from(emailVerificationCodes)
      .where(
        and(
          eq(emailVerificationCodes.email, email),
          eq(emailVerificationCodes.code, code),
          eq(emailVerificationCodes.isUsed, false),
        )
      );
    return verificationCode || null;
  },

  // Mark code as used
  markAsUsed: async (id: string): Promise<EmailVerificationCode> => {
    const [code] = await db
      .update(emailVerificationCodes)
      .set({ isUsed: true })
      .where(eq(emailVerificationCodes.id, id))
      .returning();
    return code;
  },

  // Delete expired codes
  deleteExpired: async (): Promise<void> => {
    await db
      .delete(emailVerificationCodes)
      .where(lt(emailVerificationCodes.expiresAt, new Date()));
  },
};