'use strict';

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    // const mockUsers = [
    //   {
    //     firstName: 'Vlad',
    //     lastName: 'Dimisca',
    //     email: 'abc@gmail.com',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ] 

      const mockUsers = [];
      for(let i = 0; i <= 100; i++) {
        mockUsers.push({
          email: faker.internet.email(),
          password: 'testuts',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }

    await queryInterface.bulkInsert('Users', mockUsers, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Users', null, {});
  }
};
