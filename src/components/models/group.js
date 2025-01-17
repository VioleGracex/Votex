const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  dashboardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Dashboards',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // If privacy is "password-protected", this can be set
  },
  privacy: {
    type: DataTypes.ENUM('public', 'private', 'password-protected'),
    defaultValue: 'public',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Group;
