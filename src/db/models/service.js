'use strict';
const {
  Model
} = require('sequelize');
const serviceTypes = require('../../constants/serviceType.constant');

const service = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Service.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    type: DataTypes.ENUM(...Object.keys(serviceTypes)),
    price: DataTypes.DECIMAL(10, 2),
    status: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Service',
    timestamps: true,
    paranoid: true, // for soft deletes
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return Service;
};
module.exports = service;