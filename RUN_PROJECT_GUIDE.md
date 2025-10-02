# 🚀 Echo Platform - Complete Running Guide

## ⚡ Quick Start (5 Steps)

### Step 1: Get Your Supabase Database Password

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `orhmoxuzmpmwyuirwxbu`
3. Go to **Settings** → **Database**
4. Copy the **Connection String** (looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.orhmoxuzmpmwyuirwxbu.supabase.co:5432/postgres
   ```
5. **Important**: If you don't see the password, click "Reset Database Password"

### Step 2: Update Your .env File

Replace the `DATABASE_URL` in your `.env` file with the actual connection string:

```env
# Keep these as they are
REACT_APP_SUPABASE_URL=https://orhmoxuzmpmwyuirwxbu.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yaG1veHV6bXBtd3l1aXJ3eGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTk4MDUsImV4cCI6MjA2ODI5NTgwNX0.7cGseOslc8nDluBLWE9K_uiPhptZBQU9KXNdQk819LE

SUPABASE_URL=https://orhmoxuzmpmwyuirwxbu.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yaG1veHV6bXBtd3l1aXJ3eGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTk4MDUsImV4cCI6MjA2ODI5NTgwNX0.7cGseOslc8nDluBLWE9K_uiPhptZBQU9KXNdQk819LE

# 🔥 REPLACE THIS WITH YOUR ACTUAL DATABASE CONNECTION STRING
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.orhmoxuzmpmwyuirwxbu.supabase.co:5432/postgres
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Setup Database

```bash
# This will create all the tables in your Supabase database
npm run db:setup
```

### Step 5: Start the Project

```bash
# Start the development server
npm run dev
```

Your Echo Platform will be running at `http://localhost:5173` (frontend) and API at `http://localhost:3000` (backend).

## 🧪 Test Your Setup

### Test 1: Register a Business User
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
      "companyName": "Test Company",
      "industry": "Technology",
      "description": "A test technology company"
    }
  }'
```

### Test 2: Register an Influencer
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
      "instagramFollowers": 10000,
      "engagementRate": 3.5,
      "niche": "Fashion",
      "ratePerStory": 100.00,
      "ratePerPost": 200.00
    }
  }'
```

### Test 3: Run Complete Test Suite
```bash
npm run test:api
```

## 🔧 Troubleshooting

### Issue: "DATABASE_URL not found"
**Solution**: Make sure your `.env` file has the correct DATABASE_URL with your actual password.

### Issue: "Connection failed"
**Solutions**:
1. Check your internet connection
2. Verify your Supabase project is active
3. Confirm the DATABASE_URL password is correct
4. Try resetting your database password in Supabase

### Issue: "Tables don't exist"
**Solution**: Run the database setup:
```bash
npm run db:setup
```

### Issue: npm audit warnings
**Solution**: The warnings are for development dependencies only and don't affect your app's security. You can safely ignore them or run:
```bash
npm audit fix
```

## 📊 Available Commands

```bash
# Development
npm run dev              # Start development servers
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:setup         # Create database tables
npm run db:studio        # Open database browser
npm run validate         # Check setup

# Testing
npm run test:api         # Test all API endpoints
npm run test             # Run unit tests
npm run typecheck        # Check TypeScript types
```

## 🎯 What You Can Do Now

### For Business Users:
1. **Register** business account with company details
2. **Create campaigns** for Instagram story/post reshares
3. **Set budgets** and campaign requirements
4. **Review bids** from influencers
5. **Accept/reject bids** and manage campaigns

### For Influencer Users:
1. **Register** with Instagram profile data
2. **Browse active campaigns**
3. **Submit bids** with your rates
4. **Track bid status** (pending/accepted/rejected)
5. **Complete work** and mark as done

### Database Features:
- User authentication with secure password hashing
- Profile management for businesses and influencers
- Campaign lifecycle management
- Bidding system with notifications
- Payment tracking
- Evidence submission system

## 🚀 Production Deployment

When ready for production:

1. **Set environment variables** in your hosting platform
2. **Run build command**: `npm run build`
3. **Deploy** the `dist` folder to your hosting service
4. **Set up your production database** connection

---

## 📞 Need Help?

1. **Environment Issues**: Run `npm run validate`
2. **Database Issues**: Check your DATABASE_URL in `.env`
3. **API Issues**: Run `npm run test:api` to diagnose
4. **General Issues**: Check the logs when running `npm run dev`

**Your Echo Platform is ready to connect businesses with influencers! 🎉**