'use strict';

const { Spot } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 3,
        address: "123 Paradise Road",
        city: "Mos Eisley",
        state: "Great Mesra Plateau",
        country: "Tatooine",
        lat: 48.85717,
        lng: 2.3414,
        name: "Too Hot Spot para la Piscine",
        description: "If you're looking for the hottest spot with the coolest resorts and lofts, this is the place to be! Just down a few paces from the Dowager Queen colony ship landmark crash!",
        price: 107
      },
      {
        ownerId: 3,
        address: "56 Blue Heart of Kachirho Street",
        city: "Kachirho",
        state: "Wawaatt Archipelago",
        country: "Kashyyyk",
        lat: 18.34342,
        lng: -64.75528,
        name: "Waterfront TreeHouse",
        description: "Soak the sun directly by the ocean or dance under the moonlight by the Wookiees.",
        price: 789
      },
      {
        ownerId: 3,
        address: "88 Jewel of the Core Road",
        city: "Imperial City",
        state: "Corusca",
        country: "Coruscant",
        lat: 46.05474,
        lng: 9.25891,
        name: "Vintage Luxury Galactia",
        description: "Private perfect haven in a secured and beautiful sector of the upper limits with a 180 panoramic majestic private lake view.",
        price: 654
      },
      {
        ownerId: 3,
        address: "402 Royal Festival of Light Ave",
        city: "Theed",
        state: "Chommell",
        country: "Naboo",
        lat: 35.65802,
        lng: 139.75155,
        name: "Waterlight Delight Studio",
        description: "Find yourself amongst the waters and the forests in Naboo and experience the delights of undersea wonders close by!",
        price: 295
      },
      {
        ownerId: 3,
        address: "75 Stone Crystal Street",
        city: "Peka",
        state: "Trilon",
        country: "Batuu",
        lat: 22.20309,
        lng: -159.49575,
        name: "Secluded Crystal Stones",
        description: "Whether it's a trail near or beyond the starlit rivers, or a hike to experience the marvels of blue crystal mountains, you'll find yourself very snug in this small habitation where comfort has no limits.",
        price: 1957
      },


      {
        ownerId: 2,
        address: "444 SnowFeather Peak",
        city: "Razhak Heights",
        state: "Seventh",
        country: "395 Kyber Mountains Ave",
        lat: 39.121680,
        lng: -122.642680,
        name: "Ice Star Space",
        description: "If you're looking for a life-changing cozy time out in the mountains where the home is warm to the core, come by to the snow-covered terrain with beautiful views of kyber crystal mountains.",
        price: 2562
      },
      {
        ownerId: 2,
        address: "29 Cloudshape Falls Street",
        city: "Aldera",
        state: "Alderaan Place",
        country: "Alderaan",
        lat: 33.545841,
        lng: -117.781731,
        name: "Laguna Comfort Lofts",
        description: "Feel the lakeside `neath your skin.",
        price: 994
      },
      {
        ownerId: 2,
        address: "6439 Peace Park",
        city: "Sundari",
        state: "Heart of Mandalore",
        country: "Mandalore",
        lat: 28.538336,
        lng: -81.379234,
        name: "City Home of Lights",
        description: "Let the history of this dome allure you and find the time to wind down in a small sector of Sundari where you'll live like royalty at an affordable price!",
        price: 537
      },
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      state: { [Op.in]: ['France', 'Bahamas', 'Italy', 'Japan', 'Hawaii', 'California', 'Florida'] }
    }, {});
  }
};
