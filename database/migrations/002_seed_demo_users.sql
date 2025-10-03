DO $$
DECLARE
  demo_password_hash TEXT := '$2b$10$yl9MwWsc5FuF8kEAV5IkIe/nYIkkcWiezHfUgAgq6.3741lzdwL4e';
BEGIN
  -- Business demo user
  WITH upsert_business AS (
    INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone, profile_image_url, is_verified, is_active, created_at, updated_at)
    VALUES (
      'demo-business@echox.app',
      demo_password_hash,
      'business',
      'EchoX',
      'Business',
      NULL,
      NULL,
      TRUE,
      TRUE,
      NOW(),
      NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      user_type = EXCLUDED.user_type,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      is_verified = TRUE,
      is_active = TRUE,
      updated_at = NOW()
    RETURNING id
  )
  INSERT INTO business_profiles (user_id, company_name, company_website, industry, company_logo_url, description, created_at, updated_at)
  SELECT
    id,
    'EchoX Demo Business',
    'https://echox.app',
    'Marketing',
    NULL,
    'Demo business account for exploring the EchoX platform features.',
    NOW(),
    NOW()
  FROM upsert_business
  ON CONFLICT (user_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    company_website = EXCLUDED.company_website,
    industry = EXCLUDED.industry,
    description = EXCLUDED.description,
    updated_at = NOW();

  -- Influencer demo user
  WITH upsert_influencer AS (
    INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone, profile_image_url, is_verified, is_active, created_at, updated_at)
    VALUES (
      'demo-influencer@echox.app',
      demo_password_hash,
      'influencer',
      'EchoX',
      'Influencer',
      NULL,
      NULL,
      TRUE,
      TRUE,
      NOW(),
      NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      user_type = EXCLUDED.user_type,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      is_verified = TRUE,
      is_active = TRUE,
      updated_at = NOW()
    RETURNING id
  )
  INSERT INTO influencer_profiles (
    user_id,
    instagram_handle,
    instagram_followers,
    engagement_rate,
    bio,
    niche,
    location,
    rate_per_story,
    rate_per_post,
    created_at,
    updated_at
  )
  SELECT
    id,
    'echox.demo',
    15000,
    3.75,
    'Demo influencer account showcasing EchoX collaboration campaigns.',
    'Lifestyle',
    'Global',
    50.00,
    120.00,
    NOW(),
    NOW()
  FROM upsert_influencer
  ON CONFLICT (user_id) DO UPDATE SET
    instagram_handle = EXCLUDED.instagram_handle,
    instagram_followers = EXCLUDED.instagram_followers,
    engagement_rate = EXCLUDED.engagement_rate,
    bio = EXCLUDED.bio,
    niche = EXCLUDED.niche,
    location = EXCLUDED.location,
    rate_per_story = EXCLUDED.rate_per_story,
    rate_per_post = EXCLUDED.rate_per_post,
    updated_at = NOW();

  -- Admin demo user
  INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone, profile_image_url, is_verified, is_active, created_at, updated_at)
  VALUES (
    'demo-admin@echox.app',
    demo_password_hash,
    'admin',
    'EchoX',
    'Admin',
    NULL,
    NULL,
    TRUE,
    TRUE,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    user_type = EXCLUDED.user_type,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    is_verified = TRUE,
    is_active = TRUE,
    updated_at = NOW();
END;
$$;
