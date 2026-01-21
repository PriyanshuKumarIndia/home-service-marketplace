'use strict';
const {
  Model
} = require('sequelize');

const bookingLog = (sequelize, DataTypes) => {
  class BookingLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingLog.belongsTo(models.Booking, { foreignKey: 'booking_id', as: 'booking' });
      BookingLog.belongsTo(models.User, { foreignKey: 'changed_by', as: 'changedBy' }); 
    }
  }
  BookingLog.init({
    booking_id: DataTypes.INTEGER,
    log: DataTypes.JSONB,
    changed_by: DataTypes.INTEGER,
    reason: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BookingLog',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return BookingLog;
};
module.exports = bookingLog;