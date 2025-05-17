import { WhatsAppClient } from './lib/client.js';
import { Database } from './lib/database.js';
import config from './config.js';
import { createLogger } from './lib/logger.js';

const logger = createLogger('main');

class App {
  static async start() {
    try {
      logger.info(`Starting Levanter v${config.VERSION}`);
      
      const db = new Database(config.DATABASE_CONFIG);
      await db.connect();
      
      const whatsapp = new WhatsAppClient(config, db);
      await whatsapp.initialize();
      
      process.on('SIGINT', () => App.shutdown(whatsapp, db));
      process.on('SIGTERM', () => App.shutdown(whatsapp, db));
      
    } catch (error) {
      logger.fatal('Initialization failed:', error);
      process.exit(1);
    }
  }

  static async shutdown(whatsapp, db) {
    try {
      logger.info('Gracefully shutting down...');
      await whatsapp.disconnect();
      await db.disconnect();
      process.exit(0);
    } catch (error) {
      logger.error('Shutdown error:', error);
      process.exit(1);
    }
  }
}

App.start();
