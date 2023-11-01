const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');
const router = express.Router();



//Get all the spots
router.get('/',
	async (req, res) => {

		// show all results of spots ; use pagination
		//	-	utilizing query instead of simple body, thus use let and refer to all variables(page, size + all agg variables)
		// list requests of queries
		let { page, size, } = req.query; // adding page, size, etc. as keys to req.query

		// change page and size to numbers
		page = parseInt(page);
		size = parseInt(size);

		!page ? page = 1 : '';
		!size ? size = 20 : '';
		page > 10 ? page = 10 : '';
		size > 20 ? size = 20 : '';

		let pagination = {};

		page >= 1 && size >= 1 ? function () {
			pagination.limit = size;
			pagination.offset = size * (page - 1);
		}() : ''

		// enter aggregate data here? avgRating => all the ratings applied to one spot divided by the number of ratings
		// let avgRating = await Rating.findAll({});


// all the games where we can get the ratings of each
		const spots = await Spot.findAll({
			// * upon spot igm iteration: preview prop omit completely or preview img null
			raw: true,
			attributes: {},
			include: {
				model: Review,
				attributes: ['stars']
			}



			// 	'id',
			// 	'ownerId',
			// 	'address',
			// 	'city',
			// 	'state',
			// 	'country',
			// 	'lat',
			// 	'lng',
			// 	'name',
			// 	'description',
			// 	'price',
			// 	'createdAt',
			// 	'updatedAt'


			// where: {
			// 	id,
			// 	ownerId
			// }
			// others that need to show; avgRating and previewImg
		}

		)
		console.log(' THIS IS AN ARRAY!!!!', spots.length)
		console.log('HOW CAN WE KEY INTO THIS?', await Spot.findAll({ attributes: { exclude: ['id'] } }))

		// for all the spots (loop), show an image WHERE we're looking at TWO criteria: to ensure preview is true AND to show that specific spot (spotId)
		for (let spot of spots) {
			// console.log('Will this show? ', spot); // this provides every spot's following info by id: dataValues (all dataValues of the spot), _previousDataValues(same info as prior, just not shown when req data), uniqueNo: 1, _changed:, _options:, isNewRecord(boolean))


			//define image
			const spotImage = await SpotImage.findOne({
				where: {
					[Op.and]: [
						{ preview: true },
						{ spotId: spot.id }
					]
				},

			})
			//what if there is no image? account for there to always be something

			// 		if (! spotImage) {
			// 			spot.spotImage = 'https://i.imgur.com/OtDlhCI.png'
			// 		} else {
			// 			spot.preview = spotImage.url
			// 		}
		};


		// const hotSpot = {
		// 	id: spots.id,
		// 	ownerId: spots.ownerId,
		// 	address: spots.address,
		// 	city: spots.city,
		// 	state: spots.state,
		// 	country: spots.country,
		// 	lat: spots.lat,
		// 	lng: spots.lng,
		// 	name: spots.name,
		// 	description: spots.description,
		// 	price: spots.price
		// }
		// console.log(address);
		// console.log(spots.attributes);
		return res.json({
			spots
		});
	}

)

// Check out all the spots owned (created) by the current user
router.get(
	'/current',
	async (req, res) => {

	}
)











module.exports = router;
