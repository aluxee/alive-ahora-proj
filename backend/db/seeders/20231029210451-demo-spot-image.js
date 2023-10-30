'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    // return queryInterface.bulkInsert('SpotImages', [
    //   {
    //     spotId: 1,
    //     url: 'https://i.imgur.com/OJkgHbF.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 1,
    //     url: 'https://i.imgur.com/JI7YHkY.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 1,
    //     url: 'https://i.imgur.com/A88bfyT.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 1,
    //     url: 'https://i.imgur.com/XXe7q.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 1,
    //     url: 'https://i.imgur.com/Fol9IbU.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 2,
    //     url: 'https://i.imgur.com/HCjamvj.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 2,
    //     url: 'https://i.imgur.com/NJs94rn.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 2,
    //     url: 'https://i.imgur.com/8rpGibn.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 2,
    //     url: 'https://i.imgur.com/nEboj.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 2,
    //     url: 'https://i.imgur.com/bUc5CnG.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 3,
    //     url: 'https://i.imgur.com/D2StPP2.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 3,
    //     url: 'https://i.imgur.com/NCa79sE.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 3,
    //     url: 'https://i.imgur.com/y3QIHSh.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 3,
    //     url: 'https://i.imgur.com/R5tfvOP.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 3,
    //     url: 'https://i.imgur.com/fUIPgLY.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 4,
    //     url: 'https://i.imgur.com/N5DIm78.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 4,
    //     url: 'https://i.imgur.com/Osc3728.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 4,
    //     url: 'https://i.imgur.com/q70guJ9.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 4,
    //     url: 'https://i.imgur.com/F93jFut.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 4,
    //     url: 'https://i.imgur.com/nxOngak.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 5,
    //     url: 'https://i.imgur.com/GiMfAr3.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 5,
    //     url: 'https://i.imgur.com/SrydAAY.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 5,
    //     url: 'https://i.imgur.com/X7dHrAN.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 5,
    //     url: 'https://i.imgur.com/6n4ngcq.png',
    //     preview: true
    //   },
    //   {
    //     spotId: 5,
    //     url: 'https://i.imgur.com/Ycuuk2G.png',
    //     preview: true
    //   }
    // ], options)
  },

  async down (queryInterface, Sequelize) {
    // options.tableName = 'SpotImages'
    // return queryInterface.bulkDelete(options, {
    //   // spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }
    // }, {});
  }
};
