// Script to clear old push tokens from database
// Run with: node clear_old_tokens.js

import mongoose from 'mongoose';
import { config } from 'dotenv';

config({ path: './config/.env' });

const TokenSchema = new mongoose.Schema({
  partnerId: String,
  token: String,
}, { timestamps: true });

const Token = mongoose.model('Token', TokenSchema);

async function clearOldTokens() {
  try {
    await mongoose.connect(process.env.DB);
    console.log('Connected to MongoDB');

    const result = await Token.deleteMany({});
    console.log(`Deleted ${result.deletedCount} old push tokens`);
    
    console.log('\n✅ All old tokens cleared!');
    console.log('Users will receive fresh tokens when they log in again.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearOldTokens();
