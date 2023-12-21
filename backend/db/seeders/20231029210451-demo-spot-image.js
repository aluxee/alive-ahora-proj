'use strict';

const { SpotImage } = require('../models');
;
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://i.imgur.com/OJkgHbF.png',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/JI7YHkY.png',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/A88bfyT.png',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/XXe7q.png',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/Fol9IbU.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/HCjamvj.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/NJs94rn.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/8rpGibn.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/nEboj.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/bUc5CnG.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://imgur.com/gwhB2Wg.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://imgur.com/8PE0day.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/D2StPP2.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/R5tfvOP.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://imgur.com/DFj4cTM.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/N5DIm78.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/Osc3728.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/q70guJ9.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/F93jFut.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://i.imgur.com/nxOngak.png',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://imgur.com/6jE1tvN.png',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://imgur.com/NdYldeJ.png',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://imgur.com/IEkw2ap.png',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://imgur.com/68smVXz.png',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://imgur.com/GhRbVPK.png',
        preview: true
      },

      {
        spotId: 6,
        url: 'https://imgur.com/igpIFvq.png',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://imgur.com/ox0Lszh.png',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://imgur.com/buFOFNY.png',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://imgur.com/4JgGgwJ.png',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://imgur.com/70w5MbG.png',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://imgur.com/7PTrs9t.png',
        preview: true
      }

    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8] }
    }, {});
  }
};
