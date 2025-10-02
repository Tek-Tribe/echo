# Echo Platform - Complete Database & API Setup Guide

This comprehensive guide covers the complete setup and usage of the Echo influencer marketing platform, including database schema, user registration, and all core functionalities.

## 🎯 Platform Overview

Echo is an influencer marketing platform that connects businesses with Instagram influencers for story and post reshare campaigns.

### User Types & Capabilities
- **💼 Business Users**: Create campaigns, manage budgets, review bids, make payments
- **👑 Influencers**: Browse campaigns, submit bids, complete work, earn money
- **⚙️ Admins**: Platform management, user verification, system oversight

### Campaign Types
- **📱 story_reshare**: Instagram story reshare campaigns
- **📸 post_reshare**: Instagram post reshare campaigns

### Database Schema

#### Core Tables

1. **users** - Main user table for all user types
2. **platforms** - Supported social media platforms (Instagram initially)
3. **influencer_profiles** - Extended profile data for influencers
4. **business_profiles** - Extended profile data for businesses
5. **campaigns** - Marketing campaigns created by businesses
6. **bids** - Bids submitted by influencers for campaigns
7. **payments** - Payment records for completed campaigns
8. **evidence_submissions** - Proof of campaign completion
9. **notifications** - User notifications

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account and project created
- Database connection credentials

### Environment Setup

1. Create a `.env` file in the root directory:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_connection_string
```

### Database Setup

1. Install dependencies:
```bash
npm install
```

2. Set up the database schema:
```bash
npm run db:setup
```

3. Alternative: Run SQL migration manually in Supabase dashboard:
   - Copy the contents of `database/migrations/001_initial_schema.sql`
   - Run it in the SQL editor of your Supabase dashboard

### Development Commands

```bash
# Validate environment and database setup
npm run validate

# Generate Drizzle migrations (updated for v0.31.5)
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio (database browser)
npm run db:studio

# Run complete API test suite
npm run test:api

# Start development server
npm run dev
```

## ✅ **UPDATED DEPENDENCIES** (January 2025)

**All breaking changes and security vulnerabilities have been resolved!**

- **Drizzle ORM**: Updated to v0.36.4 (stable)
- **Drizzle Kit**: Updated to v0.31.5 (latest)
- **Security**: esbuild vulnerabilities fixed
- **Configuration**: Updated for new Drizzle API

**For detailed update information, see `SETUP_FIXED.md`**

## 🚀 Complete User Registration & Management

### Business Registration
Register a business account with company details:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "business@example.com",
    "password": "securepassword123",
    "userType": "business",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1-555-0123",
    "profileData": {
      "companyName": "TechCorp Inc",
      "companyWebsite": "https://techcorp.com",
      "industry": "Technology",
      "description": "Leading technology company specializing in AI solutions"
    }
  }'
```

### Influencer Registration
Register an influencer account with social media details:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "influencer@example.com",
    "password": "securepassword123",
    "userType": "influencer",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+1-555-0124",
    "profileData": {
      "instagramHandle": "@janedoe_official",
      "instagramFollowers": 50000,
      "engagementRate": 4.5,
      "bio": "Lifestyle blogger and fashion enthusiast",
      "niche": "Fashion & Lifestyle",
      "location": "New York, NY",
      "ratePerStory": 150.00,
      "ratePerPost": 300.00
    }
  }'
```

### User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "business@example.com",
    "password": "securepassword123"
  }'
```

## 📋 Complete API Reference

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|-----------------|
| POST | `/api/auth/register` | Register new user | email, password, userType, firstName, lastName |
| POST | `/api/auth/login` | User login | email, password |
| GET | `/api/auth/profile/:userId` | Get user profile | userId (param) |

### 🏢 Business Functionality

#### Campaign Management
| Method | Endpoint | Description | Business Use Case |
|--------|----------|-------------|-------------------|
| POST | `/api/campaigns` | Create new campaign | Launch marketing campaign |
| GET | `/api/campaigns/business/:businessId` | Get your campaigns | View campaign portfolio |
| GET | `/api/campaigns/:campaignId` | Get campaign details | Review specific campaign |
| PUT | `/api/campaigns/:campaignId` | Update campaign | Modify campaign details |
| PATCH | `/api/campaigns/:campaignId/status` | Change status | Activate/pause campaigns |

#### Bid Management for Businesses
| Method | Endpoint | Description | Business Use Case |
|--------|----------|-------------|-------------------|
| GET | `/api/bids/campaign/:campaignId` | View all bids | Review influencer proposals |
| PATCH | `/api/bids/:bidId/status` | Accept/reject bid | Choose influencers |

### 👑 Influencer Functionality

#### Campaign Discovery
| Method | Endpoint | Description | Influencer Use Case |
|--------|----------|-------------|---------------------|
| GET | `/api/campaigns/active` | Browse campaigns | Find work opportunities |
| GET | `/api/campaigns/:campaignId` | View campaign details | Understand requirements |

#### Bidding System
| Method | Endpoint | Description | Influencer Use Case |
|--------|----------|-------------|---------------------|
| POST | `/api/bids` | Submit bid | Propose your rate |
| GET | `/api/bids/influencer/:influencerId` | Your bids | Track your proposals |
| PATCH | `/api/bids/:bidId/complete` | Mark work complete | Submit finished work |

## 💼 Business User Workflow

### 1. Create a Campaign
```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "business-user-uuid",
    "title": "Summer Fashion Collection Launch",
    "description": "Promote our new summer collection with authentic lifestyle content",
    "campaignType": "story_reshare",
    "budget": 5000.00,
    "contentUrl": "https://example.com/campaign-assets",
    "requirements": "Must include brand hashtags and tag our account",
    "targetAudience": "Fashion-conscious women aged 18-35",
    "startDate": "2024-06-01",
    "endDate": "2024-06-30"
  }'
```

### 2. View Your Campaigns
```bash
curl http://localhost:3000/api/campaigns/business/your-business-uuid
```

### 3. Review Bids on Your Campaign
```bash
curl http://localhost:3000/api/bids/campaign/your-campaign-uuid
```

### 4. Accept an Influencer's Bid
```bash
curl -X PATCH http://localhost:3000/api/bids/bid-uuid/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "accepted",
    "businessId": "your-business-uuid"
  }'
```

## 👑 Influencer User Workflow

### 1. Browse Active Campaigns
```bash
curl http://localhost:3000/api/campaigns/active
```

### 2. View Campaign Details
```bash
curl http://localhost:3000/api/campaigns/campaign-uuid
```

### 3. Submit a Bid
```bash
curl -X POST http://localhost:3000/api/bids \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "campaign-uuid",
    "influencerId": "your-influencer-uuid",
    "proposedRate": 200.00,
    "message": "I love this brand and would create authentic content showcasing the summer collection to my engaged audience."
  }'
```

### 4. View Your Bids
```bash
curl http://localhost:3000/api/bids/influencer/your-influencer-uuid
```

### 5. Mark Work as Complete
```bash
curl -X PATCH http://localhost:3000/api/bids/bid-uuid/complete \
  -H "Content-Type: application/json" \
  -d '{
    "influencerId": "your-influencer-uuid"
  }'
```

## Database Features

### Security
- UUID primary keys for all tables
- Password hashing with bcrypt
- Proper foreign key constraints
- Unique constraints where needed

### Performance
- Indexes on frequently queried columns
- Proper data types for optimal storage
- Normalized schema design

### Audit Trail
- `created_at` and `updated_at` timestamps
- Automatic timestamp updates via triggers

## Sample Data Flow

1. **Business Registration**:
   - Business creates account
   - Business profile is created automatically

2. **Campaign Creation**:
   - Business creates a campaign with budget and requirements
   - Campaign is set to 'active' status

3. **Influencer Bidding**:
   - Influencers browse active campaigns
   - Submit bids with proposed rates
   - Business receives notifications

4. **Bid Management**:
   - Business reviews bids and accepts/rejects them
   - Accepted bids trigger notifications to influencers

5. **Campaign Execution**:
   - Influencer completes the work
   - Submits evidence of completion
   - Business reviews and approves
   - Payment is processed

## Technologies Used

- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth + custom JWT
- **Password Hashing**: bcrypt
- **Validation**: Zod (for API input validation)
- **Backend**: Express.js + TypeScript

## Next Steps

1. **Authentication Middleware**: Add JWT validation middleware
2. **File Upload**: Implement file upload for evidence submissions
3. **Payment Integration**: Add payment gateway integration
4. **Real-time Features**: Use Supabase real-time for live notifications
5. **Email Notifications**: Add email notification system
6. **Analytics**: Add campaign performance tracking