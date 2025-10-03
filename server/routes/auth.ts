import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../../shared/db/supabase';
import { userQueries, influencerQueries, businessQueries, verificationQueries } from '../../shared/db/queries';
import { sendVerificationCode } from '../email';

// Generate a 6-digit verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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

    // Create user (unverified - will verify on first login)
    const user = await userQueries.create({
      email,
      passwordHash,
      userType,
      firstName,
      lastName,
      isVerified: false,
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
    } else if (userType === 'admin' || userType === 'manager') {
      // Admin and manager users don't need a profile
      profile = null;
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

    // Check if user is verified - if not, send verification code
    if (!user.isVerified) {
      // Generate verification code
      const verificationCode = generateVerificationCode();

      // Store verification code (expires in 10 minutes)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await verificationQueries.create({
        email,
        code: verificationCode,
        expiresAt,
      });

      // Send verification email
      try {
        await sendVerificationCode(email, verificationCode);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        return res.status(500).json({
          error: 'Failed to send verification email. Please try again.'
        });
      }

      // Return response indicating verification is required
      return res.status(403).json({
        requiresVerification: true,
        message: 'Email verification required. A verification code has been sent to your email.',
        email: user.email,
        userId: user.id,
      });
    }

    // Sign in with Supabase Auth (optional)
    let authData = null;
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.warn('Supabase auth login failed:', authError.message);
        // Continue without Supabase auth - this is optional
      } else {
        authData = data;
      }
    } catch (supabaseError: any) {
      console.warn('Supabase auth error (continuing without it):', supabaseError.message);
      // Continue without Supabase auth - login can still succeed with custom DB
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

// Verify email with code on first login
export const verifyEmailOnLogin = async (req: Request, res: Response) => {
  try {
    const { email, code, userId } = req.body;

    // Validate required fields
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    // Get verification code from database
    const verificationCode = await verificationQueries.getValidCode(email, code);

    if (!verificationCode) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    // Check if code has expired
    if (new Date() > new Date(verificationCode.expiresAt)) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Get user
    const user = await userQueries.getByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    // Mark verification code as used
    await verificationQueries.markAsUsed(verificationCode.id);

    // Update user to verified
    const updatedUser = await userQueries.update(user.id, { isVerified: true });

    // Sign in with Supabase Auth (optional)
    let authData = null;
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: req.body.password || '', // Password already verified in login
      });

      if (authError) {
        console.warn('Supabase auth login failed:', authError.message);
      } else {
        authData = data;
      }
    } catch (supabaseError: any) {
      console.warn('Supabase auth error (continuing without it):', supabaseError.message);
    }

    // Get user profile data
    let profileData = null;
    if (updatedUser.userType === 'influencer') {
      profileData = await influencerQueries.getByUserId(updatedUser.id);
    } else if (updatedUser.userType === 'business') {
      profileData = await businessQueries.getByUserId(updatedUser.id);
    }

    // Return user data (without password hash) and profile
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json({
      user: userWithoutPassword,
      profile: profileData,
      token: authData?.session?.access_token,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Resend verification code
export const resendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const existingUser = await userQueries.getByEmail(email);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already verified
    if (existingUser.isVerified) {
      return res.status(400).json({ error: 'User is already verified' });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();

    // Store verification code (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await verificationQueries.create({
      email,
      code: verificationCode,
      expiresAt,
    });

    // Send verification email
    try {
      await sendVerificationCode(email, verificationCode);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({
        error: 'Failed to send verification email. Please try again.'
      });
    }

    res.status(200).json({
      message: 'Verification code sent to your email',
    });
  } catch (error) {
    console.error('Resend verification code error:', error);
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