import 'dotenv/config';
import { supabase } from '../shared/db/supabase.js';

const demoUsers = [
  {
    email: 'demo-business@echox.app',
    password: 'demo123',
    role: 'Business',
  },
  {
    email: 'demo-influencer@echox.app',
    password: 'demo123',
    role: 'Influencer',
  },
  {
    email: 'demo-admin@echox.app',
    password: 'demo123',
    role: 'Admin',
  },
  {
    email: 'demo-manager@echox.app',
    password: 'demo123',
    role: 'Manager',
  },
];

async function registerSupabaseDemoUsers() {
  console.log('🚀 Registering demo users in Supabase Auth...\n');

  for (const user of demoUsers) {
    try {
      console.log(`📝 Registering: ${user.email} (${user.role})`);

      // Check if user already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const userExists = existingUser?.users?.some((u) => u.email === user.email);

      if (userExists) {
        console.log(`   ⚠️  User already exists in Supabase Auth, skipping...`);
        continue;
      }

      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          emailRedirectTo: undefined,
          data: {
            role: user.role,
          },
        },
      });

      if (error) {
        console.error(`   ❌ Error: ${error.message}`);

        // If it's a "User already registered" error, that's okay
        if (error.message.includes('already registered')) {
          console.log(`   ✅ User exists (continuing)`);
        }
      } else {
        console.log(`   ✅ Successfully registered in Supabase Auth`);
        console.log(`   📧 User ID: ${data.user?.id}`);
      }
    } catch (error: any) {
      console.error(`   ❌ Unexpected error: ${error.message}`);
    }

    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Demo users registration complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📋 Demo Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  demoUsers.forEach((user) => {
    console.log(`Email: ${user.email}`);
  });
  console.log('Password: demo123 (for all accounts)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

registerSupabaseDemoUsers()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
