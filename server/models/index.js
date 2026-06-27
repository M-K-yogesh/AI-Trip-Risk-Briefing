const sequelize = require('../config/database');
const User = require('./user');
const Generation = require('./generation');
const Feedback = require('./feedback');
const Template = require('./template');

// Associations
User.hasMany(Generation, { foreignKey: 'userId', as: 'generations' });
Generation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Generation.hasOne(Feedback, { foreignKey: 'generationId', as: 'feedback' });
Feedback.belongsTo(Generation, { foreignKey: 'generationId', as: 'generation' });

module.exports = {
  sequelize,
  User,
  Generation,
  Feedback,
  Template
};
