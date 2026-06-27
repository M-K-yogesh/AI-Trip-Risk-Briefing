const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'outstation_trip_risk_db',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Set to console.log to debug SQL queries
    define: {
      timestamps: true,
      underscored: true, // Use snake_case for column names in the DB
    },
    dialectOptions: {
      // For Cloud MySQL connections like PlanetScale/Railway (if SSL is required)
      ssl: process.env.MYSQL_SSL === 'true' ? {
        rejectUnauthorized: false
      } : false
    }
  }
);

module.exports = sequelize;
