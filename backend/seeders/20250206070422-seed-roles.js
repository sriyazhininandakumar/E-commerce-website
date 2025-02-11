'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', [
      { roleName: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { roleName: 'Customer', createdAt: new Date(), updatedAt: new Date() },
      { roleName: 'Manufacturer', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
