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
        address: "Outside City Hall",
        city: "Paris",
        state: "France",
        country: "Europe",
        lat: 48.85717,
        lng: 2.3414,
        name: "The Hot Spot de la Piscine",
        description: "Relax like you're at a french resort!",
        price: 155
      },
      {
        ownerId: 3,
        address: "Tip of Marsh Harbour",
        city: "Central Abaco",
        state: "Bahamas",
        country: "Bahamas",
        lat: 18.34342,
        lng: -64.75528,
        name: "Waterfront Villa",
        description: "Soak the sun directly by the ocean on patio or deck.",
        price: 689
      },
      {
        ownerId: 3,
        address: "Near Menaggio Ferry",
        city: "San Siro",
        state: "Italy",
        country: "Europe",
        lat: 46.05474,
        lng: 9.25891,
        name: "Vintage Luxury Villa Condo",
        description: "Private perfect haven with a 180 panoramic majestic lake view!",
        price: 2154
      },
      {
        ownerId: 3,
        address: "Few minutes from Hamamatsucho Station",
        city: "Minato City",
        state: "Japan",
        country: "East Asia",
        lat: 35.65802,
        lng: 139.75155,
        name: "Comfy&Cozy Breeze Studio",
        description: "Edge of Minato City close to sea views!",
        price: 107
      },
      {
        ownerId: 3,
        address: "Less than mile from Tunnels Beach",
        city: "Hanalei",
        state: "Hawaii",
        country: "United States",
        lat: 22.20309,
        lng: -159.49575,
        name: "Secluded Beachfront Paradise",
        description: "Near most secluded beaches of Na Pali Coast",
        price: 457
      }
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      state: { [Op.in]: ['France', 'Bahamas', 'Italy', 'Japan', 'Hawaii'] }
    }, {});
  }
};
