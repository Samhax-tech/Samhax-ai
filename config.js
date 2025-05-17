import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const toBool = (val) => val === 'true';
const normalize = (val) => (val || '').trim();

export default {
  VERSION: '4.0.0',
  ENV: process.env.NODE_ENV || 'development',
  
  // WhatsApp Config
  SESSION_ID: normalize(process.env.SESSION_ID),
  PREFIX: normalize(process.env.PREFIX || '!'),
  BAILEYS_LOG_LEVEL: normalize(process.env.BAILEYS_LOG_LEVEL || 'silent'),
  
  // Database
  DATABASE_CONFIG: {
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: false,
    ...(process.env.DB_DIALECT === 'postgres' && {
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
    })
  },
  
  // Features
  AUTO_UPDATE: toBool(process.env.AUTO_UPDATE),
  CMD_REACTION: toBool(process.env.CMD_REACTION),
  
  // Security
  SUDO: normalize(process.env.SUDO),
  WARN_LIMIT: parseInt(process.env.WARN_LIMIT || '3')
};
