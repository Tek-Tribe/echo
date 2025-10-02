# 🚀 Echo Platform Quick Start Guide

Get your Echo influencer marketing platform up and running in 5 minutes!

## ⚡ Prerequisites

- Node.js 18+ installed
- Supabase account and project created

## 📋 Step-by-Step Setup

### 1. Get Your Supabase Credentials

From your [Supabase Dashboard](https://supabase.com/dashboard):

1. **API Credentials** (Settings > API):
   - `Project URL` - Copy this
   - `anon/public key` - Copy this

2. **Database Password** (Settings > Database):
   - Click "Reset Database Password" if you don't have it
   - Copy the connection string format

### 2. Configure Environment

Update your `.env` file with your actual credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# Replace [YOUR-PASSWORD] with your actual database password
DATABASE_URL=postgresql://postgres:your_password@db.your-project.supabase.co:5432/postgres
```

### 3. Install Dependencies & Setup Database

```bash
# Install all dependencies
npm install

# Set up the database schema
npm run db:setup

# Validate everything is working
npm run validate
```

### 4. Start Development Server

```bash
npm run dev
```

Your server will start at `http://localhost:3000` (or your configured port).

## 🧪 Test Your Setup

### Test Business Registration
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

### Test Influencer Registration
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
      "instagramFollowers": 1000,
      "ratePerStory": 50.00,
      "ratePerPost": 100.00
    }
  }'
```

### Run Complete Test Suite
```bash
npm run test:api
```

## 🔧 Troubleshooting

### Database Connection Issues
- Ensure your `DATABASE_URL` has the correct password
- Check your Supabase project is active
- Verify network connectivity

### Missing Tables Error
Run the database setup:
```bash
npm run db:setup
```

### Environment Variable Issues
Run validation to check:
```bash
npm run validate
```

## 📊 Database Management

```bash
# Open database browser
npm run db:studio

# Generate new migrations
npm run db:generate

# Apply migrations
npm run db:migrate
```

## 🎯 What's Next?

1. **Frontend Integration**: Use the API client in `shared/api/client.ts`
2. **Authentication**: Implement JWT middleware for production
3. **File Uploads**: Add image upload for evidence submissions
4. **Payment Gateway**: Integrate payment processing
5. **Email Notifications**: Add email notification system

## 📚 Documentation

- **Complete API Reference**: See `DATABASE_README.md`
- **Database Schema**: Check `database/migrations/001_initial_schema.sql`
- **API Client Usage**: Review `shared/api/client.ts`

## 🆘 Need Help?

1. Check the validation output: `npm run validate`
2. Review the logs when running `npm run dev`
3. Ensure all environment variables are correctly set
4. Verify your Supabase project is active and accessible

---

🎉 **You're all set!** Your Echo Platform is ready for influencer marketing campaigns.