const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, sequelize } = require('../../db/models');
const { Sequelize, DataTypes } = require('sequelize');
const review = require('../../db/models/review');

const router = express.Router();

// in order to update, it needs authorization
// in order to handle validations, use on post and get accordingly

const validateBody = [
	check('address')
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("Street address is required"),
	check('city')
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("City is required"),
	check('state')
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("State is required"),
	check('country')
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("Country is required"),
	check('lat')
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("Latitude is not valid"),
	check('lng')
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("Longitude is not valid"),
	check('name')
		.exists({ checkFalsy: true })
		.notEmpty()
		.isLength({ max: 50 })
		.withMessage("Name must be less than 50 characters"),
	check('description')
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("Description is required"),
	check('price')
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("Price per day is required"),
	handleValidationErrors
]

const validateCreateBooking = [
	check('startDate')
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("Start date conflicts with an existing booking"),
	check('endDate')
		.exists({ checkFalsy: true })
		.notEmpty()
		.withMessage("End date conflicts with an existing booking"),
	handleValidationErrors


]


// return all reviews that belong to a spot by id
router.get('/:spotId/reviews', async (req, res) => {
	const { spotId } = req.params
	const spot = await Spot.findByPk(spotId);

	const reviews = await Review.findAll({
		where: {
			spotId: spotId
		},
		include: [
			{
				model: ReviewImage,
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'reviewId']
				}
			}
		]

	})

	if (!spot) {
		return res
			.status(404)
			.json({
				"message": "Spot couldn't be found",
				statusCode: 404
			})
	}
	const reviewPayload = [];


	// const allReviews = await Review.findAll({
	// 	attributes: {}
	// })
	// const reviewsDataValues = allReviews.map((review) => review.dataValues);


	// console.log("spot-pot", spot);
	//add category called "review images" to reviews

	for (let review of reviews) {
		review = review.toJSON();
		const user = await User.findByPk(review.userId);
		const img = await ReviewImage.findByPk(review.id)
		// const image = reviewImages.toJSON()
		console.log("CONSOLE: ", review.id, img)
		review.User = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName
		}
		// const reviewImage = await ReviewImage.findByPk(review.reviewId);
		// console.log("review", review)
		// console.log("---------------");
		// console.log(await ReviewImage.findByPk(review.userId))
		// review.ReviewImages = {
		// 	id: reviewImage.reviewId,
		// 	url: reviewImage.url
		reviewPayload.push(review)
	}
	// console.log(review.id)



	res.json({
		Reviews: reviewPayload
	})



})


//Create and return a new review for a spot specified by id
router.post('/:spotId/reviews', handleValidationErrors, requireAuth, async (req, res) => {
	const { spotId } = req.params;
	// const spot = await Spot.findByPk(spotId)
	// const { review, stars } = req.body;
	const spot = await Spot.findByPk(spotId);
	console.log("spot", spot)
	const { review, stars } = req.body
	const reviewPost = await Review.findOne({
		where: {
			spotId: req.params.spotId,
			userId: req.user.id

		},

	})


	if (!spot) {
		return res
			.status(404)
			.json({
				"message": "Spot couldn't be found",
				statusCode: 404
			})
	}
	if (reviewPost) {
		return res
			.status(500)
			.json({
				"message": "User already has a review for this spot",
				statusCode: 500

			})
	}
	try {
		const reviewCreated = await Review.create({
			userId: req.user.id,
			spotId: req.params.spotId,
			review,
			stars
		})

		return res
			.status(201)
			.json({
				reviewCreated,
				"statusCode": 201
			})

	} catch (error) {
		res
			.status(400)
			.json({
				"message": "Bad Request",
				"errors": {
					"review": "Review text is required",
					"stars": "Stars must be an integer from 1 to 5",
					"statusCode": 400
				}
			})
	}



})



//Return all the bookings for a spot specified by id.
router.get('/:spotId/bookings', requireAuth, async (req, res) => {


	const { spotId } = req.params;
	let spot = await Spot.findByPk(spotId)
	// spot = spot.toJSON();

	if (!spot) {
		return res
			.status(404)
			.json({
				"message": "Spot couldn't be found",
				statusCode: 404
			})
	}
	if (req.user.id !== spot.ownerId) {
		const bookings = await Booking.findAll({
			where: {
				spotId: spot.id
			},
			attributes: ['spotId', 'startDate', 'endDate']
		})
		return res.json({
			Bookings: bookings
		})
	} else if (req.user.id === spot.ownerId) {


		const bookings = await Booking.findAll({
			where: {
				spotId: spot.id
			},
			include: {
				model: User,
				attributes: ['id', 'firstName', 'lastName']
			}
		})


		return res.json({
			Bookings: bookings
		})
	}

})


router.post('/:spotId/bookings', requireAuth, validateCreateBooking, async (req, res, next) => {
	const { spotId } = req.params;
	let spot = await Spot.findByPk(spotId)
	const { startDate, endDate } = req.body


	const bookings = await Booking.findAll({
		where: {
			spotId: spot.id
		}
	})
	if (!spot) {
		res
			.status(404)
			.json({
				"message": "Spot couldn't be found",
				statusCode: 404
			})
	}


	try {

		const createBooking = await Booking.create({
			spotId: spot.id,
			userId: req.user.id,
			startDate: startDate,
			endDate: endDate
		})
		res.json(createBooking)

	} catch (error) {
		if (startDate >= endDate) {
			res
				.status(400)
				.json({
					"message": "Bad Request",
					"errors": {
						"endDate": "endDate cannot be on or before startDate"
					}
				})
		}

		for (let booking of bookings) {
			//compare to existing booking

			// else if(booking){
			// 	res
			// 	.status(404)
			// 	.json({
			// 		'message': 'this request already exists',
			// 		'statusCode': 404
			// 	})
			// }
			if ( //base rejects
				!startDate ||
				!endDate
			)
				next(error)
			else if (
				// same booking date, all directions of start to end in comparisons
				booking.startDate >= startDate && booking.endDate <= endDate ||
				booking.startDate >= startDate &&
				booking.endDate >= endDate ||
				booking.startDate <= startDate &&
				booking.endDate <= endDate ||
				booking.startDate <= startDate &&
				booking.endDate >= endDate
			)
				next(error)
		}

	}


});


router.delete('/:spotId', requireAuth, async (req, res) => {

	const { spotId } = req.params
	const spot = await Spot.findByPk(spotId)

	// no body

	// insert error
	if (!spot) {
		res
			.status(404)
			.json({
				statusCode: 404,
				message: "Spot couldn't be found"
			})
	}

	//destroy
	spot.destroy()
	//res.json

	res.json({
		"message": "Successfully deleted",
		statusCode: 200
	})

})

// Check out all the spots owned (created) by the current user
router.get('/current', requireAuth, async (req, res) => {
	const { user } = req
	const ownerId = user.id;
	// console.log('currentRoute');
	const spots = await Spot.findAll({

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
		where: {
			ownerId: ownerId
		},

	})

	// console.log('spots', spots);


	const spotsPayload = [];
	for (let spot of spots) {
		spot = spot.toJSON()
		spotsPayload.push(spot);
		const reviews = await Review.count(
			{
				where: {
					spotId: spot.id
				}
			});
		const totalStars = await Review.sum('stars', {
			where: {
				spotId: spot.id
			}
		})

		console.log(reviews, totalStars, spot.id);
		if (reviews && totalStars) {

			spot.avgRating = Number((totalStars / reviews).toFixed(1));
		} else {
			spot.avgRating = null;
		}

		// console.log(spot)
		const img = await SpotImage.findOne({

			where: {
				[Op.and]: [
					{ spotId: spot.id },
					{ preview: true }
				]
			}

		})
		img ? spot.previewImage = img.url : ''
		!img ? spot.previewImage = null : ''
	}
	// console.log(spotsPayload)
	res.json({
		Spots: spotsPayload,
	})
})

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
		const spots = await Spot.findAll({

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

		const spotPayload = []
		for (let spot of spots) {

			const spotId = spot.id;
			spot = spot.toJSON();

			let img = await SpotImage.findByPk(spotId, {
				where: {
					preview: true
				}
			})
			if(img !== null){
				img = img.toJSON()
				// console.log("img", img)

				spot.previewImage = img.url
			}

			spotPayload.push(spot)
		}

		return res.json({
			Spots: spotPayload,
			page,
			size
		});


	}
)

router.post('/', validateBody, async (req, res, next) => {

	const { address, city, state, country, lat, lng, name, description, price } = req.body;

	try {
		const spot = await Spot.create({

			ownerId: req.user.id,
			address,
			city,
			state,
			country,
			lat,
			lng,
			name,
			description,
			price

		})
		res.json({
			spot
		})

	} catch (err) {

		next(err)
	}
})

router.post('/:spotId/images', handleValidationErrors, requireAuth, async (req, res) => {

	const { url } = req.body;
	const spot = await Spot.findByPk(req.params.spotId)

	try {
		const spotImage = await SpotImage.create({
			spotId: parseInt(req.params.spotId),
			url: url,
			preview: true
		})

		res.json({
			id: spotImage.id,
			url: spotImage.url,
			preview: spotImage.preview
		})

	} catch (err) {
		if (!spot) {
			return res
				.status(404)
				.json({
					"message": "Spot couldn't be found",
					// "error": " Couldn’t find a Spot with the specified id"
				})
		}
	}
})

router.put('/:spotId', requireAuth, async (req, res, next) => {

	const { address, city, state, country, lat, lng, name, description, price } = req.body
	const { spotId } = req.params
	const spot = await Spot.findByPk(spotId)

	try {
		spot.address = address,
			spot.city = city,
			spot.state = state,
			spot.country = country,
			spot.lat = lat,
			spot.lng = lng,
			spot.name = name,
			spot.description = description,
			spot.price = price
		await spot.save()

		res.json({
			spot
		})

	} catch (err) {
		if (!spot) {
			return res
				.status(404)
				.json({
					// statusCode: 404,
					message: "Spot couldn't be found",
					// "error": "Couldn’t find a Spot with the specified id"
				})
		}
		next(err)
	}
})




//Returns the details of a spot specified by its id
router.get('/:spotId', async (req, res) => {
	// * will need to change formatting of created and updated at
	const { spotId } = req.params;
	// console.log("SPOT ID", spotId)
	const spot = await Spot.findByPk(spotId, {

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
	})

	if (!spot) {

		return res
			.status(404)
			.json({
				"message": "Spot couldn't be found",
				// "error": "Couldn’t find a Spot with the specified id",
			})
	}
	const rezSpot = spot.toJSON();
	// console.log(rezSpot)

	let avgRating;

	const reviews = await Review.count(
		{
			where: {
				spotId: spotId
			}
		}) || 0;
	const totalStars = await Review.sum('stars',
		{
			where: {
				spotId: spotId
			}
		}) || 0;
	avgRating = (totalStars / reviews).toFixed(1);

	// console.log("THE JSON", spot.toJSON())
	const spotImage = await SpotImage.findAll({

		where: { spotId: spotId },
		attributes: ['id', 'url', 'preview']
	})
	const owner = await User.findByPk(spot.ownerId, {
		attributes: ['id', 'firstName', 'lastName']
	})
	rezSpot.avgRating = avgRating;
	rezSpot.numReviews = reviews;
	rezSpot.SpotImages = spotImage;
	rezSpot.Owner = owner;
	res.json({
		Spot: rezSpot
	})
})



module.exports = router;
