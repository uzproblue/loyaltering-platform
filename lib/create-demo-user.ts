/**
 * Utility script to create a demo user with hashed password
 * Run this once to generate a hashed password for the demo user
 * 
 * Usage: npx tsx lib/create-demo-user.ts
 */

import bcrypt from 'bcryptjs';

async function createDemoUser() {
  const password = 'password'; // Demo password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log('Demo User Credentials:');
  console.log('Email: demo@example.com');
  console.log('Password: password');
  console.log('\nHashed Password (use this in lib/auth.ts):');
  console.log(hashedPassword);
}

createDemoUser().catch(console.error);

