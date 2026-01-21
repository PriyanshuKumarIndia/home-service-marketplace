"use strict";
require("dotenv").config();
const bcrypt = require("bcrypt");
const { Role, User } = require("../../db/models");
const role = require("../models/role");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const hashedPassword = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 10);      

      const adminRole = await Role.findOne({
        where: { name: "SUPER ADMIN" }, transaction
      });

      if(!adminRole) {
        throw new Error("SUPER ADMIN role not found. Please run RoleInitialData seeder first.");
      }

      const admin = await User.create(
        {
          name: process.env.SUPERADMIN_NAME,
          email: process.env.SUPERADMIN_EMAIL,
          password: hashedPassword,
          role_id: adminRole.id,
          isActive: true,
        },
        { transaction }
      );
      if(!admin) {
        throw new Error("Failed to create SUPER ADMIN user.");
      }

      await transaction.commit();
    } catch (error) {
      transaction.rollback();
      console.error("error in the superadmin seeder=> ", error);
    }
  },

  async down(queryInterface, Sequelize) {
    const adminRole = await Role.findOne({
        where: { name: "SUPER ADMIN" }, transaction
      });

    await queryInterface.bulkDelete('Users', { role_id: adminRole.id });
  },
};
