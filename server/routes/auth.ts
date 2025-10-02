import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../../shared/db/supabase';
import { userQueries, influencerQueries, businessQueries } from '../../shared/db/queries';

// User registration
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, userType, firstName, lastName, profileData } = req.body;

    // Validate required fields
    if (!email || !password || !userType || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await userQueries.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await userQueries.create({
      email,
      passwordHash,
      userType,
      firstName,
      lastName,
    });

    // Create user profile based on user type
    let profile = null;
    if (userType === 'influencer') {
      if (profileData) {
        profile = await influencerQueries.create({
          userId: user.id,
          ...profileData,
        });
      } else {
        // Create basic influencer profile if no profile data provided
        profile = await influencerQueries.create({
          userId: user.id,
          instagramHandle: null,
          instagramFollowers: 0,
          engagementRate: 0.0,
          bio: null,
          niche: null,
          location: null,
          ratePerStory: 0.0,
          ratePerPost: 0.0,
        });
      }
    } else if (userType === 'business') {
      if (profileData && profileData.companyName) {
        profile = await businessQueries.create({
          userId: user.id,
          ...profileData,
        });
      } else {
        return res.status(400).json({
          error: 'Business registration requires profileData with companyName'
        });
      }
    }

    // Register with Supabase Auth (optional, for additional features)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.warn('Supabase auth registration failed:', authError.message);
        // Continue without Supabase auth - this is not critical
      }
    } catch (supabaseError) {
      console.warn('Supabase auth registration error:', supabaseError);
      // Continue without Supabase auth
    }

    // Return user data (without password hash) and profile
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(201).json({
      user: userWithoutPassword,
      profile,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// User login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await userQueries.getByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Sign in with Supabase Auth (optional)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.warn('Supabase auth login failed:', authError);
      // Continue without Supabase auth
    }

    // Get user profile data
    let profileData = null;
    if (user.userType === 'influencer') {
      profileData = await influencerQueries.getByUserId(user.id);
    } else if (user.userType === 'business') {
      profileData = await businessQueries.getByUserId(user.id);
    }

    // Return user data (without password hash)
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      profile: profileData,
      token: authData?.session?.access_token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId; // In production, get this from JWT token

    const user = await userQueries.getById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let profileData = null;
    if (user.userType === 'influencer') {
      profileData = await influencerQueries.getByUserId(user.id);
    } else if (user.userType === 'business') {
      profileData = await businessQueries.getByUserId(user.id);
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      profile: profileData,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};