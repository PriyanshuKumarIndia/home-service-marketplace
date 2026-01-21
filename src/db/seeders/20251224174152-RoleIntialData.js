"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Roles",
      [
        {
          name: "SUPER ADMIN",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "ADMIN",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "SERVICE PROVIDER",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "USER",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
