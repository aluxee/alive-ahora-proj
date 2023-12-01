const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, authorization } = require('../../utils/auth');
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


//Deletes an existing spot
router.delete('/:spotId', requireAuth, authorization, async (req, res) => {

	const { spotId } = req.params;
	const userId = req.user.id;

	// no body
	const spot = await Spot.findByPk(spotId, {
		where: {
			ownerId: userId
		}
	})
	// insert error
	if (!spot) {
		return res
			.status(404)
			.json({
				statusCode: 404,
				message: "Spot couldn't be found"
			})
	}
	// destroy the spot that belongs to the user
	// console.log(userId, spot)

	await spot.destroy();

	res
		.status(200)
		.json({
			"message": "Successfully deleted"
		})

})

// Check out all the spots owned (created) by the current user
router.get('/current', requireAuth, async (req, res) => {

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
			ownerId: req.user.id
		},

	})

	// console.log('spots', spots);


	const spotsPayload = await Promise.all(spots.map(async (spot) => {
		const spotData = spot.toJSON()
		spotData.previewImage = null;

		const reviews = await Review.count(
			{
				where: {
					[Op.and]:
						{ spotId: spot.id }
				}
			});
		const totalStars = await Review.sum('stars', {
			where: {
				[Op.and]:
					{ spotId: spot.id }
			}
		})

		if (reviews && totalStars) {

			spotData.avgRating = Number((totalStars / reviews).toFixed(1));
		} else {
			spotData.avgRating = null;
		}

		const spotImages = await spot.getSpotImages({
			where: {
				[Op.and]: [
					{ spotId: spot.id },
					{ preview: true }
				]
			},
			attributes: ['url'],
			limit: 1
		})
		spotImages.length > 0 ? spotData.previewImage = spotImages[0].url : ''

		return spotData

	}))

	res.json({
		Spots: spotsPayload
	})

})



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
				model: User,
				attributes: ['id', 'firstName', 'lastName']
			},
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
	const reviewPayload = reviews.map((review) => {
		const user = review.User.toJSON();
		const reviewData = review.toJSON();

		reviewData.User = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName
		}

		return reviewData
	})


	res.json({
		Reviews: reviewPayload
	})

})


//Create and return a new review for a spot specified by id
router.post('/:spotId/reviews', handleValidationErrors, requireAuth, async (req, res) => {

	const { spotId } = req.params;
	const { user } = req;
	const spot = await Spot.findByPk(spotId);
	const { review, stars } = req.body

	const reviewPost = await Review.findOne({
		where: {
			spotId: spotId,
			userId: user.id
		},
	})


	if (!spot) {
		return res
			.status(404)
			.json({
				"message": "Spot couldn't be found"
			})
	}

	if (reviewPost) {
		return res
			.status(500)
			.json({
				"message": "User already has a review for this spot"

			})
	}

	try {
		const reviewCreated = await Review.create({
			userId: user.id,
			spotId: spot.id,
			review,
			stars
		})

		return res
			.status(201)
			.json(reviewCreated)

	} catch (error) {
		res
			.status(400)
			.json({
				"message": "Bad Request",
				"errors": {
					"review": "Review text is required",
					"stars": "Stars must be an integer from 1 to 5"
				}
			})
	}

})



//Return all the bookings for a spot specified by id.
router.get('/:spotId/bookings', requireAuth, async (req, res) => {

	const { user } = req;
	const { spotId } = req.params;
	const spot = await Spot.findByPk(spotId)
	// spot = spot.toJSON();
	if (spotId) {
		if (!spot) {
			return res
				.status(404)
				.json({
					"message": "Spot couldn't be found"
				})
		}
	}
	// if the user requesting the booking is NOT the owner
	if (user.id !== spot.ownerId) {
		const bookings = await Booking.findAll({
			where: {
				spotId: spotId
			},
			attributes: ['startDate', 'endDate']
		})
		return res.json({
			Bookings: bookings
		})
	} else if (user.id === spot.ownerId) {
		//	 if the user requesting the booking IS the owner

		const bookings = await Booking.findAll({
			where: {
				[Op.and]: [
					{ spotId: spotId },
					{ userId: user.id }
				]
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


router.post('/:spotId/bookings', requireAuth, validateCreateBooking, async (req, res) => {
	// will not pass authorization middleware here as wires can get crossed

	const { user } = req; // extract the user from the request
	const { spotId } = req.params; // extract spotId from the params
	const { startDate, endDate } = req.body; // extract the user startDate and endDate from the request body
	const spot = await Spot.findByPk(spotId); // create spot variable for specific spotId
	const currentDate = Date.now()

	// take care of the errors
	if (!spot) {
		return res
			.status(404)
			.json({
				"message": "Spot couldn't be found"
			})
	}
	if (user.id === spot.ownerId) {
		return res
			.status(403)
			.json(
				{
					"message": "Forbidden request"
				}
			)
	}

	const bookStart = new Date(startDate);
	const bookStartCreated = bookStart.getTime(); // user request to create a booking start date
	const bookEnd = new Date(endDate);
	const bookEndCreated = bookEnd.getTime(); // user request to create a booking end date


	// console.log("start created:bookStartCreated)
	// if the startDate is past the endDate of booking
	if (bookStartCreated >= bookEndCreated) {
		return res
			.status(400)
			.json(
				{
					"message": "Bad Request",
					"errors": {
						"endDate": "endDate cannot be on or before startDate"
					}
				}
			)
	}

	const existingBookings = await Booking.findAll({
		where: {
			spotId: spot.id
		},
		include: [
			{
				model: User,
				attributes: ['id']
			}
		]
	})



	for (let booking of existingBookings) {

		const bookingStart = new Date(booking.startDate);
		const bookingStartExists = bookingStart.getTime(); // existing/already booked booking start date
		const bookingEnd = new Date(booking.endDate);
		const bookingEndExists = bookingEnd.getTime(); // existing/already booked booking end date

		// if there are start and end dates that conflict with existing ones
		if (
			//				11/30					11/29
			// 			(bookStartCreated >= bookingStartExists &&
			// //				11/30						12/1
			// 			bookStartCreated < bookingEndExists) ||

			// 			(bookEndCreated > bookingStartExists && bookEndCreated <= bookingEndExists) ||

			// 			(bookStartCreated <= bookingStartExists && bookEndCreated >= bookingEndExists) ||

			// (bookStartCreated === bookingEndExists || bookEndCreated === bookingStartExists) ||

			// // existing; 12/3 - 12/5, created: 12/1-12/6
			// (bookStartCreated < bookingStartExists && bookEndCreated > bookingEndExists) ||

			// // existing: 12/3 - 12/5, created: 12/1-12/4
			// (bookStartCreated < bookingStartExists && bookEndCreated < bookingEndExists) ||
			// // existing: 12/3 - 12/5, created: 12/4-12/9
			// (bookStartCreated > bookingStartExists && bookEndCreated > bookingEndExists) ||
			// // same dates
			// (bookStartCreated === bookingStartExists || bookEndCreated === bookingEndExists) ||
			// // existing: 12/3 - 12/6, created: 12/4 - 12/5
			// (bookStartCreated > bookingStartExists && bookEndCreated < bookingEndExists)

			(bookStartCreated >= bookingStartExists && bookStartCreated < bookingEndExists) ||
			(bookEndCreated > bookingStartExists && bookEndCreated <= bookingEndExists) ||
			(bookStartCreated < bookingStartExists && bookEndCreated > bookingEndExists) ||
			(bookStartCreated < bookingStartExists && bookEndCreated < bookingEndExists) ||
			(bookStartCreated > bookingStartExists && bookEndCreated > bookingEndExists) ||
			(bookStartCreated === bookingStartExists || bookEndCreated === bookingEndExists) ||
			(bookStartCreated === bookingEndExists || bookEndCreated === bookingStartExists)

		) {
			return res
				.status(403)
				.json({
					message: "Sorry, this spot is already booked for the specified dates",
					errors: {
						startDate: "Start date conflicts with an existing booking",
						endDate: "End date conflicts with an existing booking"
					}
				});
		}
	}

	const createBooking = await Booking.create({
		spotId: spot.id,
		userId: user.id,
		startDate: startDate,
		endDate: endDate
	})

	return res
		.status(200)
		.json(createBooking);
});


//Create and return a new image for a spot specified by id
router.post('/:spotId/images', requireAuth, authorization, async (req, res) => {

	const { url, preview } = req.body;
	const { spotId } = req.params;

	const spot = await Spot.findByPk(spotId);

	if (!spot) {
		return res
			.status(404)
			.json({
				"message": "Spot couldn't be found"
			})
	}

	const spotImage = await SpotImage.create({
		spotId: parseInt(spotId),
		url,
		preview: preview
	})

	res
		.status(200)
		.json({
			id: spotImage.id,
			url: spotImage.url,
			preview: spotImage.preview
		})
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

// edit a spot
router.put('/:spotId', requireAuth, authorization, async (req, res) => {

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

		res.json(spot)

	} catch (err) {

		return res
			.status(400)
			.json({
				"message": "Bad Request", // (or "Validation error" if generated by Sequelize),
				"errors": {
					"address": "Street address is required",
					"city": "City is required",
					"state": "State is required",
					"country": "Country is required",
					"lat": "Latitude is not valid",
					"lng": "Longitude is not valid",
					"name": "Name must be less than 50 characters",
					"description": "Description is required",
					"price": "Price per day is required"
				}
			})

	}
})




//Get all the spots
router.get('/',
	async (req, res) => {

		try {
			const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query; // extracting keywords of query from request

			const parsedMinLat = minLat ? parseFloat(minLat) : undefined;
			const parsedMaxLat = maxLat ? parseFloat(maxLat) : undefined;
			const parsedMinLng = minLng ? parseFloat(minLng) : undefined;
			const parsedMaxLng = maxLng ? parseFloat(maxLng) : undefined;
			const parsedMinPrice = minPrice ? parseFloat(minPrice) : undefined;
			const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;

			// defining initialization of query object
			let query = {
				where: {},
				include: []
			}

			// define page and size, change page and size to numbers
			const page = req.query.page === undefined ? 1 : parseInt(req.query.page); // defined page, set as an integer, setting default
			const size = req.query.size === undefined ? 20 : parseInt(req.query.size); // defined size, set aas an integer, setting default

			// Validate query parameters
			if (Object.keys(req.query).length > 0) { // returns an array containing the keys of the requested property names
				if (
					isNaN(page) || isNaN(size) || page < 1 || page > 10 || size < 1 || size > 20 ||
					(parsedMinLat && (isNaN(parsedMinLat) || parsedMinLat < -90 || parsedMinLat > 90)) ||
					(parsedMaxLat && (isNaN(parsedMaxLat) || parsedMaxLat < -90 || parsedMaxLat > 90)) ||
					(parsedMinLng && (isNaN(parsedMinLng) || parsedMinLng < -180 || parsedMinLng > 180)) ||
					(parsedMaxLng && (isNaN(parsedMaxLng) || parsedMaxLng < -180 || parsedMaxLng > 180)) ||
					(parsedMinPrice && (isNaN(parsedMinPrice) || parsedMinPrice < 0)) ||
					(parsedMaxPrice && (isNaN(parsedMaxPrice) || parsedMaxPrice < 0))
				) {
					return res
						.status(400)
						.json({
							"message": "Bad Request",
							"errors": {
								"page": "Page must be greater than or equal to 1",
								"size": "Size must be greater than or equal to 1",
								"maxLat": "Maximum latitude is invalid",
								"minLat": "Minimum latitude is invalid",
								"minLng": "Maximum longitude is invalid",
								"maxLng": "Minimum longitude is invalid",
								"minPrice": "Minimum price must be greater than or equal to 0",
								"maxPrice": "Maximum price must be greater than or equal to 0"
							}
						})
				}
			}

			if (parsedMinLat) {
				query.where.lat = {
					[Op.gte]: parsedMinLat
				}
			}
			if (parsedMaxLat) {
				query.where.lat = {
					[Op.lte]: parsedMaxLat
				}
			}
			if (parsedMinLng) {
				query.where.lng = {
					[Op.gte]: parsedMinLng
				}
			}
			if (parsedMaxLng) {
				query.where.lng = {
					[Op.lte]: parsedMaxLng
				}
			}
			if (parsedMinPrice) {
				query.where.price = {
					[Op.gte]: parsedMinPrice
				}
			}
			if (parsedMaxPrice) {
				query.where.price = {
					[Op.lte]: parsedMaxPrice
				}
			}

			const spotsResult = await Spot.findAndCountAll({

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
				...query, // Spread the query obj to include limit and offset
				limit: size,
				offset: size * (page - 1)

			})

			const spots = spotsResult.rows; // using row property to utilize the array

			if (!Array.isArray(spots)) {
				// if spots is not an array, error handle it
				throw new Error('Spots data is not in the expected format');
			}

			const spotPayload = await Promise.all(spots.map(async (spot) => { // iterate thru array/mapping thru using promise to asynchronously fetch spots to load the images
				const spotData = spot.toJSON(); // change spot toJSON to make more changes as a plain JS object
				spotData.previewImage = null; // initializing the spotData.previewImages to null

				const reviews = await Review.count(
					{
						where: {
							[Op.and]:
								{ spotId: spot.id }
						}
					});
				const totalStars = await Review.sum('stars', {
					where: {
						[Op.and]:
							{ spotId: spot.id }
					}
				})

				// console.log(reviews, totalStars, spot.id);

				if (reviews && totalStars) {

					spotData.avgRating = Number((totalStars / reviews).toFixed(1));
				} else {
					spotData.avgRating = null;
				}

				// lazy loading the images
				const spotImages = await spot.getSpotImages({ // lazy loading using built-in association methods for current spot; w/ specified conditions, it only fetches one image
					where: {
						preview: true
					},
					attributes: ['url'],
					limit: 1
				})

				spotImages.length > 0 ? spotData.previewImage = spotImages[0].url : ''; // if there is at least one spotImage associated with the spot, use that one image
				return spotData // returning modified spotData object of each spot after mapping
			}))

			return res.json({
				Spots: spotPayload,
				page,
				size
			});

		} catch (error) {
			console.error('Error: ', error.message);

			return res
				.status(500)
				.json({
					message: 'Internal Server Error',
					error: error.message
				})
		}
	}
)


router.post('/', requireAuth, async (req, res) => {

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
		return res
			.status(201)
			.json(
				spot
			)

	} catch (err) {
		res
			.status(400)
			.json({
				"message": "Bad Request", // (or "Validation error" if generated by Sequelize),

				"errors": {
					"address": "Street address is required",
					"city": "City is required",
					"state": "State is required",
					"country": "Country is required",
					"lat": "Latitude is not valid",
					"lng": "Longitude is not valid",
					"name": "Name must be less than 50 characters",
					"description": "Description is required",
					"price": "Price per day is required"
				}
			})
	}

})



module.exports = router;
