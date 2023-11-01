const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, Sequelize } = require('../../db/models');
const router = express.Router();



//Get all the spots
router.get('/',
	async (req, res) => {
		try {

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
			const spots = await Spot.findAll({
				// * upon spot igm iteration: preview prop omit completely or preview img null
				raw: true,
				attributes: {},
				include: {
					model: Review,
					attributes: ['stars']
				},
				where: {},
				...pagination,
			})

			const avgRatings = await Review.findAll({
				attributes: ['spotId', [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']], //built in sequelize fxn
				group: ['spotId'] // group the results by Spot.id to get the average rating for each spot separately.
			})

			for (const spot of spots){

				const spotId = spot.id;
				const avgRating = avgRatings.find(avg => avg.spotId === spotId);
				if (avgRating) {
					spot.dataValues.avgRating = avgRating.getDataValue('avgRating');
				} else {
					spot.dataValues.avgRating = null;
				}
			}

			// });
			// all the games where we can get the ratings of each


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


			return res.json({
				spots: spots
			});
		} catch (error) {
			console.error('Error fetching spots and average ratings: ', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}

)

// Check out all the spots owned (created) by the current user
router.get(
	'/current',
	async (req, res) => {

	}
)











module.exports = router;
