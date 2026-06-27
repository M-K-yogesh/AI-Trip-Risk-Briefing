const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mysql = require('mysql2/promise');

const { sequelize, Template } = require('./models');

// Routes
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const historyRoutes = require('./routes/history');
const feedbackRoutes = require('./routes/feedback');
const analyticsRoutes = require('./routes/analytics');
const templateRoutes = require('./routes/templates');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api', aiRoutes); // Contains /api/generate
app.use('/api/history', historyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/templates', templateRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Manivtha Outstation Safety Briefing Server is running.' });
});

// Seed default templates if database is empty
const defaultTemplates = [
  { templateName: 'Hyderabad ➔ Bangalore Express', routeFrom: 'Hyderabad', routeTo: 'Bangalore', season: 'Monsoon', vehicleType: 'Volvo AC Sleeper' },
  { templateName: 'Hyderabad ➔ Chennai Coastal Highway', routeFrom: 'Hyderabad', routeTo: 'Chennai', season: 'Summer', vehicleType: 'Innova Crysta SUV' },
  { templateName: 'Hyderabad ➔ Goa Ghat Route', routeFrom: 'Hyderabad', routeTo: 'Goa', season: 'Winter', vehicleType: 'Force Traveler' },
  { templateName: 'Hyderabad ➔ Mumbai Commercial Corridor', routeFrom: 'Hyderabad', routeTo: 'Mumbai', season: 'Monsoon', vehicleType: 'BharatBenz Sleeper Coach' }
];

async function ensureDatabaseExists() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || ''
    });
    
    const dbName = process.env.MYSQL_DATABASE || 'outstation_trip_risk_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();
    console.log(`Successfully verified or created database "${dbName}".`);
  } catch (err) {
    console.warn('Database auto-creation check failed (will attempt standard connection anyway):', err.message);
  }
}

async function startServer() {
  try {
    // Dynamically ensure database exists
    await ensureDatabaseExists();

    // Authenticate and sync Sequelize models
    console.log('Connecting to MySQL Database...');
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // sync tables
    await sequelize.sync({ alter: true });
    console.log('Database tables successfully synchronized.');

    // Seed default template presets if empty
    const templateCount = await Template.count();
    if (templateCount === 0) {
      await Template.bulkCreate(defaultTemplates);
      console.log('Preloaded default trip templates successfully.');
    }

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  SERVER IS RUNNING ON PORT ${PORT}`);
      console.log(`  API Base URL: http://localhost:${PORT}`);
      console.log(`====================================================`);
    });

  } catch (error) {
    console.error('Unable to connect to the database or start server:', error);
    
    // In case database connection fails, let the user know but run express in mock database mode (memory array) or exit
    console.log('Running fallback: The server requires a running MySQL database.');
    console.log('Please verify your .env settings or MySQL service status.');
    
    // Attempt starting the server anyway so the frontend has connection, but DB features will be mock
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} (Database offline mode)`);
    });
  }
}

startServer();
