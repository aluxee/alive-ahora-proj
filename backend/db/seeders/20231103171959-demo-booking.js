'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: new Date("2023-01-24"),
        endDate: new Date("2023-01-17")
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date("2023-02-13"),
        endDate: new Date("2023-02-24")
      },
      {
        spotId: 4,
        userId: 1,
        startDate: new Date("2023-05-27"),
        endDate: new Date("2023-06-04")
      },
      {
        spotId: 1,
        userId: 2,
        startDate: new Date("2023-04-11"),
        endDate: new Date("2023-04-14")
      },
      {
        spotId: 1,
        userId: 2,
        startDate: new Date("2023-07-11"),
        endDate: new Date("2023-07-18")
      },
      {
        spotId: 3,
        userId: 2,
        startDate: new Date("2023-11-03"),
        endDate: new Date("2023-11-13")
      },
      {
        spotId: 1,
        userId: 3,
        startDate: new Date("2022-01-02"),
        endDate: new Date("2022-01-09")
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date("2022-08-14"),
        endDate: new Date("2022-08-22")
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date("2022-12-23"),
        endDate: new Date("2023-01-05")
      },
      {
        spotId: 4,
        userId: 3,
        startDate: new Date("2023-03-24"),
        endDate: new Date("2023-03-27")
      },
    ], options, { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {})
  }
};
