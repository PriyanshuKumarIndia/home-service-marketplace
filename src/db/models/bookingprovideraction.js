'use strict';
const {
  Model
} = require('sequelize');
const bookingprovideraction = (sequelize, DataTypes) => {
  class BookingProviderAction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingProviderAction.belongsTo(models.Booking, {
      foreignKey: 'booking_id',
      as: 'booking',
    });

    BookingProviderAction.belongsTo(models.User, {
      foreignKey: 'provider_id',
      as: 'provider',
    });
    }
  }
  BookingProviderAction.init({
    booking_id: DataTypes.INTEGER,
    provider_id: DataTypes.INTEGER,
    action: DataTypes.ENUM('ACCEPTED', 'REJECTED', 'COMPLETED')
  }, {
    sequelize,
    modelName: 'BookingProviderAction',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return BookingProviderAction;
};
module.exports = bookingprovideraction;