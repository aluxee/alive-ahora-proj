'use strict';

const { ReviewImage } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {

    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'https://i.imgur.com/JI7YHkY.png'
      },
      {
        reviewId: 2,
        url: 'https://i.imgur.com/NJs94rn.png'
      },
      {
        reviewId: 3,
        url: 'https://i.imgur.com/8rpGibn.png'
      },
      {
        reviewId: 4,
        url: 'https://i.imgur.com/nEboj.png'
      },
      {
        reviewId: 5,
        url: 'https://i.imgur.com/bUc5CnG.png'
      },
      {
        reviewId: 6,
        url: 'https://i.imgur.com/D2StPP2.png'
      },
      {
        reviewId: 7,
        url: 'https://i.imgur.com/NCa79sE.png'
      },
      {
        reviewId: 8,
        url: 'https://i.imgur.com/y3QIHSh.png'
      },
      {
        reviewId: 9,
        url: 'https://i.imgur.com/R5tfvOP.png'
      },
      {
        reviewId: 10,
        url: 'https://i.imgur.com/fUIPgLY.png'
      },
      {
        reviewId: 11,
        url: 'https://i.imgur.com/N5DIm78.png'
      },
      {
        reviewId: 12,
        url: 'https://i.imgur.com/Osc3728.png'
      },
      {
        reviewId: 13,
        url: 'https://i.imgur.com/q70guJ9.png'
      },
      {
        reviewId: 14,
        url: 'https://i.imgur.com/F93jFut.png'
      },
      {
        reviewId: 15,
        url: 'https://i.imgur.com/nxOngak.png'
      },
      {
        reviewId: 16,
        url: 'https://i.imgur.com/GiMfAr3.png'
      },
      {
        reviewId: 17,
        url: 'https://i.imgur.com/SrydAAY.png'
      },
      {
        reviewId: 18,
        url: 'https://i.imgur.com/X7dHrAN.png'
      },
      {
        reviewId: 19,
        url: 'https://i.imgur.com/6n4ngcq.png'
      },
      {
        reviewId: 20,
        url: 'https://i.imgur.com/Ycuuk2G.png'
      }
    ], options, {validate: true});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] }
    }, {})
  }
};
