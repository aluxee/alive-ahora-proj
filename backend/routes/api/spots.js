const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');
const { Sequelize, DataTypes } = require('sequelize');
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

				raw: true,
				attributes: [
					'id',
					'ownerId',
					'address',
					'city',
					'state',
					'country',
					'lat',
					'lng',
					'name',
					'description',
					'price',
					'createdAt',
					'updatedAt',
				],
				order: ['id'],
				where: {},
				...pagination,
			})


			//lazy loading
			const allReviews = await Review.findAll({
				attributes: {}
			})
			const reviewsDataValues = allReviews.map((review) => review.dataValues);

			//extract all the spot images of a spot
			const spotImages = await SpotImage.findAll({
				attributes: {}
			})

			const allSpotImages = spotImages.map((spotImage) =>
				spotImage.dataValues);

			// * do not delete data variable
			const data = { // assemble all necessary attributes in one object named data
				Reviews: reviewsDataValues,
				Spots: spots,
				SpotImages: allSpotImages
			};

			const reviewCountPerSpot = {};
			const totalStarsPerSpot = {};

			data.Reviews.forEach((review) => { // iterate thru the reviews section of the data object
				const spotId = review.spotId;
				const stars = review.stars;

				if (!review) {
					const err = new Error('The review does not exist.')
					err.status = 404;
					res.json({
						message: err.message,
						code: err.status
					})
				} else { // if the review does exist, we are going to find the total count

					if (reviewCountPerSpot[spotId]) { // if there is a review for that specific spot, count it
						reviewCountPerSpot[spotId]++
					} else { // if it's counted, don't add to it
						reviewCountPerSpot[spotId] = 1
					}
					if (!totalStarsPerSpot[spotId]) {
						totalStarsPerSpot[spotId] = stars; // initialize for the first
					} else {
						totalStarsPerSpot[spotId] += stars;
					}
				}
			})

			const img = {};
			data.SpotImages.forEach(spotImage => {
				// const spotId = spotImage.spotId;
				const id = spotImage.id;
				if (spotImage.preview === true) {
					img[id] = spotImage.url
				} else if (spotImage.preview === false || !spotImage.preview) {
					spotImage.url = null
				}
			})
			data.Spots.forEach(spot => {
				//account for error

				if (!spot) {
					const err = new Error('This spot does not exist.')
					err.status = 404;
					res.json({
						message: err.message,
						code: err.status
					})
				} else {
					//variable for the id of spot
					const spotId = spot.id;
					//variable for reviewCount, taking in the reviewCount or 0
					const reviewCount = reviewCountPerSpot[spotId] || 0;
					// console.log(`Spot ID ${spotId}: Name = ${spot.name}, Review Count = ${reviewCount}`);
					if (reviewCount > 0) { // if there are reviews
						const totalStars = totalStarsPerSpot[spotId] || 0;
						let avgRating = (totalStars / reviewCount).toFixed(1);
						//create the added attribute under Spots:
						spot.avgRating = avgRating;
					}

					if (img[spotId]) {
						spot.previewImage = img[spotId];
					}
				}
			})

			return res.json({
				spots: spots,
				page,
				size
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
