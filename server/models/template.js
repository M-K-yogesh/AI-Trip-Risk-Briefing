const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  templateName: {
    type: DataTypes.STRING,
    field: 'template_name',
    allowNull: false
  },
  routeFrom: {
    type: DataTypes.STRING,
    field: 'route_from',
    allowNull: false
  },
  routeTo: {
    type: DataTypes.STRING,
    field: 'route_to',
    allowNull: false
  },
  season: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vehicleType: {
    type: DataTypes.STRING,
    field: 'vehicle_type',
    allowNull: false
  }
}, {
  tableName: 'templates'
});

module.exports = Template;
