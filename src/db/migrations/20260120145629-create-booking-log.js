'use strict';
/** @type {import('sequelize-cli').Migration} */
const bookingStatuses = require('../../constants/bookingStatus.constant');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BookingLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id'
        }
      },
      log: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      changed_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BookingLogs');
  }
};