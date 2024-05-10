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
        review: 'Remove this place, it sucks. I got attacked by a Hutt`s guardsmen.',
        stars: 2
      },
      {
        spotId: 1,
        userId: 3,
        review: 'Absolutely outstanding! This resort exceeded all my expectations! P.S., the Jawas are awesome and friendlier than one could imagine!',
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
        userId: 2,
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
        review: 'I had high hopes, but it fell short in several key ways. Maybe this place just wasn`t for me.',
        stars: 3
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Makes me feel like I`m part of the senate!',
        stars: 4
      },
      {
        spotId: 3,
        userId: 2,
        review: 'Little pricey for my taste but so worth it. Best place I have ever been in in my entire life!',
        stars: 5
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Outstanding view of the sunset from the bedroom!',
        stars: 5
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Fair price, beautiful place, could use a bit of maintenance but overall really great!',
        stars: 4
      },
      {
        spotId: 4,
        userId: 3,
        review: 'Just right.',
        stars: 4
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Quite impressive! There are a couple of areas where it could be even better though.',
        stars: 4
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Fairly relaxing! I expected more trees than water though... and where did the Wookies go?! I CAME HERE FOR THE WOOKIES.',
        stars: 3
      },
      {
        spotId: 2,
        userId: 3,
        review: 'This beautiful studio is a shining example of excellence. I`m thoroughly impressed and can`t find a single flaw to point out. Five stars without a doubt!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: 'Don`t waste your time.',
        stars: 2
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Disappointing experience.  The quality didn`t match the price and there were several issues that left me dissatisfied.',
        stars: 2
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Definitely room for improvement!',
        stars: 3
      },
      {
        spotId: 4,
        userId: 1,
        review: 'This place is perfect and everything I needed after such a stressful month! It is very comfortable.',
        stars: 5
      },
      {
        spotId: 5,
        userId: 2,
        review: 'Just kidding! Pulled your leg with my last review, this place is the definition of perfection!',
        stars: 5
      },
      {
        spotId: 5,
        userId: 3,
        review: 'Exactly what perfection should look like! 100% worth the price!',
        stars: 5
      },
      {
        spotId: 5,
        userId: 1,
        review: 'Completely home-love-struck! But I`m not sure about the price...',
        stars: 3
      },
      {
        spotId: 6,
        userId: 3,
        review: 'Super chill spot!',
        stars: 5
      },
      {
        spotId: 6,
        userId: 1,
        review: 'I love this place and I would definitely bring friends and family to come join the next time around!',
        stars: 5
      },
      {
        spotId: 7,
        userId: 3,
        review: 'I like it, very spacious and like a dream!',
        stars: 5
      },
      {
        spotId: 7,
        userId: 1,
        review: 'Far too much open space for my liking...',
        stars: 2
      },
      {
        spotId: 8,
        userId: 3,
        review: 'Interior decor like a dream but could use more color.',
        stars: 4
      },
      {
        spotId: 6,
        userId: 3,
        review: 'A truly amazing spot!',
        stars: 4
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8] }
    }, {})
  }
};
