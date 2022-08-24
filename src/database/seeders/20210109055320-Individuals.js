'use strict';

import { v4 as uuidV4 } from 'uuid';
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
    await queryInterface.bulkInsert('Individuals', [{
      id: uuidV4(),
      user_type: 'Individual',
      individuals_fName: 'John',
      individuals_lName: 'Doe',
      individuals_email: 'john_doe@gmail.com',
      individuals_phone: '08033407000',
      individuals_password: bcrypt.hashSync('password123', 10),
      individuals_gender: 'Male',
      individuals_DOB: '1990-01-10T12:29:13.202Z',
      individuals_age: 31,
      individuals_address: '54 Masha Road Surulere Lagos.',
      individuals_city: 'Surulere',
      individuals_state: 'Lagos',
      individuals_country: 'Nigeria',
      individuals_height: 180,
      individuals_weight: 72,
      individuals_avatar: 'https://www.clipartmax.com/png/middle/27-271750_pix-for-woman-face-clipart-woman-images-clip-art.png',
      purpose_for_treatment: 'Blood Pressure',
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
    await queryInterface.bulkDelete('Individuals', null, {});
  }
};

