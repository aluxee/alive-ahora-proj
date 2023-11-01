'use strict';

const { Review } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: 'The price exceeded my expectations in the best way! The pictures could be more updated though.',
        stars: 4
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Definition of perfection!',
        stars: 5
      },
      {
        spotId: 1,
        userId: 3,
        review: 'Absolutely outstanding! This french home-like resort exceeded all my expectations. From the exceptional quality to the impeccable customer service, I couldn`t be happier.Five stars all the way!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: 'P-A-R-A-D-I-S-E! I`ll hear nothing else of it, this place is perfect!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 4,
        review: 'This is exactly how I pictured it, a few more tweaks and it could have been beyond.',
        stars: 4
      },
      {
        spotId: 1,
        userId: 3,
        review: 'Second time around for me and it`s still just as amazing as the first time!',
        stars: 4
      },
      {
        spotId: 2,
        userId: 3,
        review: 'I had high hopes, but it fell short in several key ways. There are definite improvements needed to make it worth the investment. Two stars for effort and much needed room for enhancement.',
        stars: 2
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Remove this place from the app.',
        stars: 1
      },
      {
        spotId: 3,
        userId: 2,
        review: 'So expensive but so worth it. Best place I have ever been in in my entire life!',
        stars: 5
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Absolutely outstanding! This french home-like resort exceeded all my expectations. From the exceptional quality to the impeccable customer service, I couldn`t be happier.Five stars all the way!',
        stars: 5
      },
      {
        spotId: 3,
        userId: 4,
        review: 'Fair price, beautiful place, could use a bit of maintenance but overall really great!',
        stars: 4
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Just right!',
        stars: 3
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Quite impressive! There are a couple of areas where it could be even better',
        stars: 4
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Complete and utter trash.',
        stars: 1
      },
      {
        spotId: 2,
        userId: 3,
        review: 'This beautiful studio is a shining example of excellence. I`m thoroughly impressed and can`t find a single flaw to point out. Five stars without a doubt!',
        stars: 5
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Don`t waste your time.',
        stars: 2
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Disappointing experience.  The quality didn`t match the price, and there were several issues that left me dissatisfied.I wouldn`t recommend it, as there are better options available.',
        stars: 2
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Definitely room for improvement!',
        stars: 3
      },
      {
        spotId: 1,
        userId: 1,
        review: 'This place is perfect and everything I needed after such a stressful month!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: 'Just kidding! Pulled your leg with my last review, this place is the definition of perfection!',
        stars: 5
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 3, 5] }
    }, {})
  }
};
