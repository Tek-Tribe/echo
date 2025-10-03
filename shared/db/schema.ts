import {
  pgTable,
  text,
  uuid,
  varchar,
  boolean,
  timestamp,
  decimal,
  integer,
  pgEnum,
  jsonb,
  unique,
} from 'drizzle-orm/pg-core';

// Enums
export const userTypeEnum = pgEnum('user_type', ['influencer', 'business', 'admin', 'manager']);
export const campaignTypeEnum = pgEnum('campaign_type', ['story_reshare', 'post_reshare']);
export const platformTypeEnum = pgEnum('platform_type', ['instagram']);
export const campaignStatusEnum = pgEnum('campaign_status', [
  'draft',
  'active',
  'paused',
  'completed',
  'cancelled',
]);
export const bidStatusEnum = pgEnum('bid_status', ['pending', 'accepted', 'rejected', 'completed']);
export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
]);

// Email verification codes table
export const emailVerificationCodes = pgTable('email_verification_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  isUsed: boolean('is_used').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  userType: userTypeEnum('user_type').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  profileImageUrl: text('profile_image_url'),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Platforms table
export const platforms = pgTable('platforms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  iconUrl: text('icon_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Influencer profiles table
export const influencerProfiles = pgTable('influencer_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  instagramHandle: varchar('instagram_handle', { length: 100 }),
  instagramFollowers: integer('instagram_followers').default(0),
  engagementRate: decimal('engagement_rate', { precision: 5, scale: 2 }).default('0.00'),
  bio: text('bio'),
  niche: varchar('niche', { length: 100 }),
  location: varchar('location', { length: 100 }),
  ratePerStory: decimal('rate_per_story', { precision: 10, scale: 2 }).default('0.00'),
  ratePerPost: decimal('rate_per_post', { precision: 10, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Business profiles table
export const businessProfiles = pgTable('business_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  companyName: varchar('company_name', { length: 200 }).notNull(),
  companyWebsite: varchar('company_website', { length: 255 }),
  industry: varchar('industry', { length: 100 }),
  companyLogoUrl: text('company_logo_url'),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Campaigns table
export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  platformId: uuid('platform_id')
    .references(() => platforms.id, { onDelete: 'restrict' })
    .notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  campaignType: campaignTypeEnum('campaign_type').notNull(),
  status: campaignStatusEnum('status').default('draft'),
  budget: decimal('budget', { precision: 10, scale: 2 }).notNull(),
  contentUrl: text('content_url'),
  requirements: text('requirements'),
  targetAudience: text('target_audience'),
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Bids table
export const bids = pgTable(
  'bids',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    campaignId: uuid('campaign_id')
      .references(() => campaigns.id, { onDelete: 'cascade' })
      .notNull(),
    influencerId: uuid('influencer_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    proposedRate: decimal('proposed_rate', { precision: 10, scale: 2 }).notNull(),
    message: text('message'),
    status: bidStatusEnum('status').default('pending'),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
    respondedAt: timestamp('responded_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    uniqueCampaignInfluencer: unique().on(table.campaignId, table.influencerId),
  }),
);

// Payments table
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  bidId: uuid('bid_id')
    .references(() => bids.id, { onDelete: 'restrict' })
    .notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR'),
  status: paymentStatusEnum('status').default('pending'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentGatewayId: varchar('payment_gateway_id', { length: 255 }),
  paymentGatewayResponse: jsonb('payment_gateway_response'),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Evidence submissions table
export const evidenceSubmissions = pgTable('evidence_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  bidId: uuid('bid_id')
    .references(() => bids.id, { onDelete: 'cascade' })
    .notNull(),
  evidenceUrl: text('evidence_url').notNull(),
  evidenceType: varchar('evidence_type', { length: 50 }).notNull(),
  description: text('description'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  isApproved: boolean('is_approved'),
  reviewerNotes: text('reviewer_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  isRead: boolean('is_read').default(false),
  relatedId: uuid('related_id'),
  relatedType: varchar('related_type', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Types for TypeScript inference
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Platform = typeof platforms.$inferSelect;
export type NewPlatform = typeof platforms.$inferInsert;

export type InfluencerProfile = typeof influencerProfiles.$inferSelect;
export type NewInfluencerProfile = typeof influencerProfiles.$inferInsert;

export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type NewBusinessProfile = typeof businessProfiles.$inferInsert;

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;

export type Bid = typeof bids.$inferSelect;
export type NewBid = typeof bids.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type EvidenceSubmission = typeof evidenceSubmissions.$inferSelect;
export type NewEvidenceSubmission = typeof evidenceSubmissions.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export type EmailVerificationCode = typeof emailVerificationCodes.$inferSelect;
export type NewEmailVerificationCode = typeof emailVerificationCodes.$inferInsert;