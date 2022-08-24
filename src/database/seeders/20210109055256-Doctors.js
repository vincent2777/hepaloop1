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
    await queryInterface.bulkInsert('Doctors', [

      {
        id: uuidV4(),
        user_type: "Doctor",
        doctors_fName: "James",
        doctors_lName: "Bennet",
        doctors_email: "j_bennet@gmail.com",
        doctors_phone: "08033407000",
        doctors_password: bcrypt.hashSync('password123', 10),
        doctors_gender: "Male",
        doctors_specialty: "Surgeon",
        doctors_hospital: "Avon Clinic Masha",
        doctors_SYOP: "1990-01-10T12:29:13.202Z",
        doctors_bioInfo: "The best doctor in town.",
        doctors_address: "54 Masha Road Surulere Lagos.",
        doctors_city: "Surulere",
        doctors_state: "Lagos",
        doctors_country: "Nigeria",
        doctors_rating: '5',
        doctors_avatar: 'https://mhpdoctor.com/wp-content/sabai/File/files/l_24e839fcb31a2d2ae79861b46482a8a8.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        id: uuidV4(),
        user_type: "Doctor",
        doctors_fName: "Becky",
        doctors_lName: "Mensa",
        doctors_email: "b_mensa@gmail.com",
        doctors_phone: "08033407000",
        doctors_password: bcrypt.hashSync('password123', 10),
        doctors_gender: "Female",
        doctors_specialty: "Cardiologist",
        doctors_hospital: "Avon Clinic Masha",
        doctors_SYOP: "1990-01-10T12:29:13.202Z",
        doctors_bioInfo: "_doctorStateController.doctorsBioInfo",
        doctors_address: 'No 4 Ebony Paint Awkunanaw, Enugu.',
        doctors_city: 'Udi',
        doctors_state: 'Enugu',
        doctors_country: 'Nigeria',
        doctors_rating: '3.5',
        doctors_avatar: 'https://mhpdoctor.com/wp-content/sabai/File/files/l_24e839fcb31a2d2ae79861b46482a8a8.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        id: uuidV4(),
        user_type: "Doctor",
        doctors_fName: "Kenny",
        doctors_lName: "Robert",
        doctors_email: "k_robert@yahoo.com",
        doctors_phone: "08033407000",
        doctors_password: bcrypt.hashSync('password123', 10),
        doctors_gender: "Male",
        doctors_specialty: "Surgeon",
        doctors_hospital: "Shalom Hospital Enugu",
        doctors_SYOP: "1990-01-10T12:29:13.202Z",
        doctors_bioInfo: "The best Surgeon in town.",
        doctors_address: '2 Bassy Avenue Surulere Lagos State.',
        doctors_city: 'Surulere',
        doctors_state: 'Lagos',
        doctors_country: 'Nigeria',
        doctors_rating: '4',
        doctors_avatar: 'https://mhpdoctor.com/wp-content/sabai/File/files/l_24e839fcb31a2d2ae79861b46482a8a8.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Doctors', null, {});
  }
};
