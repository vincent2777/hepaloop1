'use strict';

import {v4 as uuidV4} from "uuid";
import bcrypt from 'bcryptjs'

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
    await queryInterface.bulkInsert('Hospitals', [{
      id: uuidV4(),
      user_type: 'Hospital',
      hospitals_name: 'Avon Clinic',
      hospitals_email: 'avon_clinic@gmail.com',
      hospitals_phone: '08033407000',
      hospitals_password: bcrypt.hashSync('password123', 10),
      hospitals_address: '54 James Robertson street, Mashs Surulere, Lagos, Nigeria.',
      hospitals_city: 'Surulere',
      hospitals_state: 'Lagos',
      hospitals_country: 'Nigeria',
      hospitals_logo: 'https://www.eatlogos.com/health_logos/png/logo_for_hospitel_plus_design.png',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Hospitals', null, {});
  }
};
