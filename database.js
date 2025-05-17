import { Sequelize, DataTypes } from 'sequelize';
import { createLogger } from './logger.js';

const logger = createLogger('database');

export class Database {
  constructor(config) {
    this.sequelize = new Sequelize(config);
    this.models = this.defineModels();
  }

  defineModels() {
    const models = {
      User: this.sequelize.define('User', {
        jid: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false
        },
        name: DataTypes.STRING,
        warnCount: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        }
      }),
      Message: this.sequelize.define('Message', {
        key: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        data: DataTypes.JSONB,
        timestamp: DataTypes.DATE
      }),
      Group: this.sequelize.define('Group', {
        jid: {
          type: DataTypes.STRING,
          primaryKey: true
        },
        name: DataTypes.STRING,
        settings: DataTypes.JSONB
      })
    };

    // Define relationships
    models.User.hasMany(models.Message, { foreignKey: 'userJid' });
    models.Message.belongsTo(models.User, { foreignKey: 'userJid' });

    return models;
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      await this.sequelize.sync({ alter: true });
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.sequelize.close();
      logger.info('Database disconnected');
    } catch (error) {
      logger.error('Database disconnection error:', error);
      throw error;
    }
  }

  async getMessage(key) {
    return this.models.Message.findByPk(key)
      .then(message => message?.data)
      .catch(error => {
        logger.error('Failed to get message:', error);
        return null;
      });
  }
}
