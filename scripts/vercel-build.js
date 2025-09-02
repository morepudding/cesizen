#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Vercel Build: Starting custom build script...');

try {
  console.log('📋 Step 1: Cleaning up...');
  execSync('rm -rf node_modules/.prisma || true', { stdio: 'inherit' });
  
  console.log('🔄 Step 2: Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('🏗️ Step 3: Building Next.js app...');
  execSync('npx next build', { stdio: 'inherit' });
  
  console.log('✅ Vercel Build: Completed successfully!');
} catch (error) {
  console.error('❌ Vercel Build: Failed', error);
  process.exit(1);
}
