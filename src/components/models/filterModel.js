const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Filter = sequelize.define('Filter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups',
      key: 'id',
    },
  },
  filterType: {
    type: DataTypes.ENUM('most_interactions', 'most_upvotes', 'most_downvotes'),
    allowNull: false,
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

module.exports = Filter;
