#!/usr/bin/env node

/**
 * Test script to verify Neon database connection
 * Run this script to test if your Neon database is properly configured
 */

const { neon } = require('@neondatabase/serverless');

async function testNeonConnection() {
  console.log('🔍 Testing Neon database connection...\n');
  
  // Check environment variables
  const postgresUrl = process.env.POSTGRES_PRISMA_URL;
  const postgresUrlNoSsl = process.env.POSTGRES_URL_NO_SSL;
  
  console.log('Environment Variables:');
  console.log(`- POSTGRES_PRISMA_URL: ${postgresUrl ? '✅ Set' : '❌ Not set'}`);
  console.log(`- POSTGRES_URL_NO_SSL: ${postgresUrlNoSsl ? '✅ Set' : '❌ Not set'}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'undefined'}\n`);
  
  if (!postgresUrl) {
    console.error('❌ POSTGRES_PRISMA_URL is not set!');
    console.log('💡 Make sure you have pulled the latest environment variables from Vercel:');
    console.log('   vercel env pull .env.development.local');
    process.exit(1);
  }
  
  try {
    // Test connection using Neon serverless driver
    console.log('🔌 Testing connection with Neon serverless driver...');
    const sql = neon(postgresUrl);
    
    // Simple query to test connection
    const result = await sql`SELECT 1 as test, NOW() as current_time`;
    console.log('✅ Connection successful!');
    console.log('📊 Test query result:', result[0]);
    
    // Test if we can access the users table (if it exists)
    try {
      const userCount = await sql`SELECT COUNT(*) as count FROM users`;
      console.log(`👥 Users table exists with ${userCount[0].count} records`);
    } catch (error) {
      if (error.message.includes('relation "users" does not exist')) {
        console.log('📝 Users table does not exist yet (this is normal for new databases)');
      } else {
        console.log('⚠️  Could not access users table:', error.message);
      }
    }
    
    console.log('\n🎉 Neon database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure your Neon database is running');
    console.log('2. Check that your connection string is correct');
    console.log('3. Verify your database credentials');
    console.log('4. Ensure your IP is whitelisted (if required)');
    process.exit(1);
  }
}

// Run the test
testNeonConnection().catch(console.error);
