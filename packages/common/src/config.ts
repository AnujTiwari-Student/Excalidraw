// config.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from monorepo root
dotenv.config({ 
  path: path.resolve(__dirname, '../.env')  // Adjust path to your .env location
});

export const JWT_SECRET = process.env.JWT_SECRET;

// Add validation
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is required');
  console.error('Looking for .env at:', path.resolve(__dirname, '../.env'));
  process.exit(1);
}

console.log('✅ JWT_SECRET loaded from config.ts');
