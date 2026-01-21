'use strict';
const {
  Model
} = require('sequelize');
const bookingStatuses = require('../../constants/bookingStatus.constant');

const booking = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, { foreignKey: 'customer_id', as: 'customer' });
      Booking.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
      Booking.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
    }
  }
  Booking.init({
    customer_id: DataTypes.INTEGER,
    provider_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    scheduled_date: DataTypes.DATE,
    status: DataTypes.ENUM(...Object.keys(bookingStatuses)),
    price: DataTypes.DECIMAL(10, 2),
    reason: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Booking;
};
module.exports = booking;