'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Services', [
      {
        name: 'Bathroom Cleaning',
        slug: 'BATHROOM_CLEANING',
        type: 'CLEANING',
        price: 349.99,
        status: true,
      },
      {
        name: 'Weekly Bathroom Cleaning',
        slug: 'WEEKLY_BATHROOM_CLEANING',
        type: 'CLEANING',
        price: 149.99,
        status: true,
      },
      {
        name: 'Kitchen Deep Cleaning',
        slug: 'KITCHEN_DEEP_CLEANING',
        type: 'CLEANING',
        price: 1049.99,
        status: true,
      },
      {
        name: 'Full Home/ Move-in Cleaning',
        slug: 'FULL_HOME_MOVE_IN_CLEANING',
        type: 'CLEANING',
        price: 1449.99,
        status: true,
      },
      {
        name: 'Sofa and Carpet Cleaning',
        slug: 'SOFA_AND_CARPET_CLEANING',
        type: 'CLEANING',
        price: 149.99,
        status: true,
      },
      {
        name: 'Cockroach, Ant & General Pest Control',
        slug: 'COCKROACH_ANT_GENERAL_PEST_CONTROL',
        type: 'PEST_CONTROL',
        price: 449.99,
        status: true,
      },
      {
        name: 'Bed Bug Treatment',
        slug: 'BED_BUG_TREATMENT',
        type: 'PEST_CONTROL',
        price: 549.99,
        status: true,
      },
      {
        name: 'Switch and Socket Installation',
        slug: 'SWITCH_AND_SOCKET_INSTALLATION',
        type: 'ELECTRICAL',
        price: 449.99,
        status: true,
      },
      {
        name: 'Light Fixture Installation',
        slug: 'LIGHT_FIXTURE_INSTALLATION',
        type: 'ELECTRICAL',
        price: 149.99,
        status: true,
      },
      {
        name: 'Ceiling Fan Installation',
        slug: 'CEILING_FAN_INSTALLATION',
        type: 'ELECTRICAL',
        price: 199.99,
        status: true,
      },
      {
        name: 'Faucet Repair & Installation',
        slug: 'FAUCET_REPAIR_AND_INSTALLATION',
        type: 'PLUMBING',
        price: 199.99,
        status: true,
      },
      {
        name: 'Leak Detection & Repair',
        slug: 'LEAK_DETECTION_AND_REPAIR',
        type: 'PLUMBING',
        price: 299.99,
        status: true,
      },
      {
        name: 'Air Conditioner Repair & Maintenance',
        slug: 'AIR_CONDITIONER_REPAIR_AND_MAINTENANCE',
        type: 'AC_AND_APPLIANCE_REPAIR',
        price: 499.99,
        status: true,
      },
      {
        name: 'Washing Machine Repair & Maintenance',
        slug: 'WASHING_MACHINE_REPAIR_AND_MAINTENANCE',
        type: 'AC_AND_APPLIANCE_REPAIR',
        price: 399.99,
        status: true,
      },
      {
        name: 'Home Painting Services',
        slug: 'HOME_PAINTING_SERVICES',
        type: 'PAINTING',
        price: 1999.99,
        status: true,
      },
      {
        name: 'Furniture Assembly & Carpentry',
        slug: 'FURNITURE_ASSEMBLY_AND_CARPENTRY',
        type: 'CARPENTRY',
        price: 299.99,
        status: true,
      },
      {
        name: 'Custom Carpentry Services',
        slug: 'CUSTOM_CARPENTRY_SERVICES',
        type: 'CARPENTRY',
        price: 499.99,
        status: true,
      }
    ].map((service) => ({ ...service, created_at: new Date(), updated_at: new Date() })), {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Services', null, {});
  }
};
