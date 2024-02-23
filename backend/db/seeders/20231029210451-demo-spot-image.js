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
        url: 'https://imgur.com/0R32WpE.png',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://imgur.com/vWO6l5q.png',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://imgur.com/DhpCfhb.png',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/41ybMsE.png',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://imgur.com/OpwzUIP.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://imgur.com/2wv4Ucx.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://imgur.com/44WzEsO.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://imgur.com/YIMOdsP.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://imgur.com/oFwUD9R.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://imgur.com/rnrBzFU.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://imgur.com/FYo1VXM.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://imgur.com/R9cqk3T.png',
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
        url: 'https://imgur.com/YcHc1Rc.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://imgur.com/Kc2JIUD.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://imgur.com/r9EKtYt.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://imgur.com/ExkrTid.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://imgur.com/NZGtEIe.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://imgur.com/QyVK9Ci.png',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://imgur.com/bl7cAVf.png',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://imgur.com/hbtTFWm.png',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://imgur.com/FdnjM6n.png',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://imgur.com/EnCqyHA.png',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://imgur.com/m6XJlD6.png',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://imgur.com/ZMnEK4G.png',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://imgur.com/ccTiQmJ.png',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://imgur.com/sJL6EDG.png',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://imgur.com/BrqVjUc.png',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://imgur.com/mq24SUN.png',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://imgur.com/TOebfxg.png',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://imgur.com/mi1kb7C.png',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://imgur.com/npMKLRn.png',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://imgur.com/5PJiGf0.png',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://imgur.com/Kw2RCkP.png',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://imgur.com/T1ueHq2.png',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://imgur.com/DjMpqK9.png',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://imgur.com/ml08zUq.png',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://imgur.com/kpBKXfg.png',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://imgur.com/7MgBgdS.png',
        preview: true
      },

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
