# 🔧 Manual Database Setup (Alternative Method)

## ❌ Network Connection Issue

The automatic database setup is failing because it can't connect to:
`db.orhmoxuzmpmwyuirwxbu.supabase.co`

This could be due to:
- Network connectivity issues
- Supabase project might be paused/inactive
- Firewall blocking the connection

## ✅ **SOLUTION: Manual Setup via Supabase Dashboard**

### **Step 1: Go to Supabase Dashboard**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `orhmoxuzmpmwyuirwxbu`
3. Click on **SQL Editor** in the sidebar

### **Step 2: Copy the Database Schema**
Copy this entire SQL script and paste it into the SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_type AS ENUM ('influencer', 'business', 'admin');
CREATE TYPE campaign_type AS ENUM ('story_reshare', 'post_reshare');
CREATE TYPE platform_type AS ENUM ('instagram');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type user_type NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create platforms table (master table for supported platforms)
CREATE TABLE platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create influencer_profiles table
CREATE TABLE influencer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    instagram_handle VARCHAR(100),
    instagram_followers INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0.00,
    bio TEXT,
    niche VARCHAR(100),
    location VARCHAR(100),
    rate_per_story DECIMAL(10,2) DEFAULT 0.00,
    rate_per_post DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create business_profiles table
CREATE TABLE business_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    company_website VARCHAR(255),
    industry VARCHAR(100),
    company_logo_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES platforms(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    campaign_type campaign_type NOT NULL,
    status campaign_status DEFAULT 'draft',
    budget DECIMAL(10,2) NOT NULL,
    content_url TEXT,
    requirements TEXT,
    target_audience TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bids table
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    proposed_rate DECIMAL(10,2) NOT NULL,
    message TEXT,
    status bid_status DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one bid per influencer per campaign
    UNIQUE(campaign_id, influencer_id)
);

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID REFERENCES bids(id) ON DELETE RESTRICT,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_gateway_id VARCHAR(255),
    payment_gateway_response JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create evidence_submissions table (for proof of campaign completion)
CREATE TABLE evidence_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID REFERENCES bids(id) ON DELETE CASCADE,
    evidence_url TEXT NOT NULL,
    evidence_type VARCHAR(50) NOT NULL, -- 'screenshot', 'video', 'link'
    description TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    is_approved BOOLEAN,
    reviewer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'bid_received', 'bid_accepted', 'payment_completed', etc.
    is_read BOOLEAN DEFAULT FALSE,
    related_id UUID, -- Can reference campaigns, bids, etc.
    related_type VARCHAR(50), -- 'campaign', 'bid', 'payment', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_influencer_profiles_user_id ON influencer_profiles(user_id);
CREATE INDEX idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX idx_campaigns_business_id ON campaigns(business_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_bids_campaign_id ON bids(campaign_id);
CREATE INDEX idx_bids_influencer_id ON bids(influencer_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_payments_bid_id ON payments(bid_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_evidence_submissions_bid_id ON evidence_submissions(bid_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Insert default platform (Instagram)
INSERT INTO platforms (name, display_name, icon_url, is_active)
VALUES ('instagram', 'Instagram', NULL, TRUE);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_influencer_profiles_updated_at BEFORE UPDATE ON influencer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON business_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Step 3: Run the SQL Script**
1. Paste the entire script above into the SQL Editor
2. Click **Run** or press `Ctrl+Enter`
3. Wait for it to complete (should take a few seconds)

### **Step 4: Verify Tables Were Created**
Run this query to check all tables were created:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

You should see these 9 tables:
- ✅ bids
- ✅ business_profiles
- ✅ campaigns
- ✅ evidence_submissions
- ✅ influencer_profiles
- ✅ notifications
- ✅ payments
- ✅ platforms
- ✅ users

### **Step 5: Start Your Application**
Now you can start your Echo Platform:
```bash
npm run dev
```

## 🎯 **Testing Your Setup**

### Test API Health:
```bash
curl http://localhost:3000/api/ping
```

### Test Business Registration:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "business@test.com",
    "password": "test123",
    "userType": "business",
    "firstName": "John",
    "lastName": "Smith",
    "profileData": {
      "companyName": "Test Company"
    }
  }'
```

### Test Influencer Registration:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "influencer@test.com",
    "password": "test123",
    "userType": "influencer",
    "firstName": "Jane",
    "lastName": "Doe",
    "profileData": {
      "instagramHandle": "@janedoe",
      "instagramFollowers": 5000,
      "ratePerStory": 50.00,
      "ratePerPost": 100.00
    }
  }'
```

## ✅ **Your Echo Platform Will Be Fully Functional**

After completing the manual database setup, your platform will have:
- ✅ User authentication and registration
- ✅ Business and influencer profiles
- ✅ Campaign creation and management
- ✅ Bidding system
- ✅ Payment tracking
- ✅ Evidence submission system
- ✅ Notifications system

**Your Echo Platform is ready for connecting businesses with influencers! 🚀**