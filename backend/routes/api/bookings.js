const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, authorization } = require('../../utils/auth');
const { Spot, SpotImage, Booking } = require('../../db/models');




const router = express.Router();



//Return all the bookings that the current user has made
router.get('/current', requireAuth, async (req, res) => {
	// no body
	// req authentication
	const { user } = req;
	// const userId = user.id;
	const bookings = await Booking.findAll({
		where: {
			userId: user.id
		},
		include: [
			{
				model: Spot,
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'description']
				}
			}
		]
	})


	const bookingsPayload = await Promise.all(bookings.map(async (booking) => {

		const spotId = booking.spotId;
		const bookingData = booking.toJSON();
		const spot = await Spot.findByPk(spotId)
		const spotData = booking.Spot.toJSON();
		spotData.previewImage = null;


		// lazy loading the images
		const spotImages = await spot.getSpotImages({ // lazy loading using built-in association methods for current spot; w/ specified conditions, it only fetches one image
			where: {
				[Op.and]: [
					{ spotId: spotId },
					{ preview: true }
				]
			},
			attributes: ['url'],
			limit: 1
		})
		spotImages.length > 0 ? spotData.previewImage = spotImages[0].url : '';

		bookingData.Spot = spotData;

		return bookingData
	}))

	res.json({
		Bookings: bookingsPayload
	})

})


router.put('/:bookingId', requireAuth, authorization, async (req, res) => {

	// same idea as line 380 of spots/booking in spots
	const { user } = req;
	const { bookingId } = req.params;
	const booking = await Booking.findByPk(bookingId);
	const { startDate, endDate } = req.body;
	const bookStartCreated = new Date(startDate);
	const bookEndCreated = new Date(endDate);
	const start = Date.now();
	const currentDate = new Date(start);

	const existingBookingsOfUser = await Booking.findAll({
		where: {
			userId: user.id
		}
	})

	// * begin double checking here

	if (bookStartCreated >= bookEndCreated) {
		res
			.status(400)
			.json({
				"message": "Bad Request",
				"errors": {
					"endDate": "endDate cannot come before startDate"
				}
			})
	}

	if (currentDate > booking.endDate) { // comparing against the user provided end date instead of the requested booking's current end date
		res
			.status(403)
			.json({
				"message": "Past bookings can't be modified"
			})
	}


	for (let booking of existingBookingsOfUser) {

		const bookingStartExists = new Date(booking.startDate);
		const bookingEndExists = new Date(booking.endDate);

		if (
			(bookStartCreated >= bookingStartExists && bookStartCreated <= bookingEndExists) ||
			(bookEndCreated > bookingStartExists && bookEndCreated <= bookingEndExists) ||
			(bookStartCreated <= bookingStartExists && bookEndCreated >= bookingEndExists)

		) {
			return res
				.status(403)
				.json({
					"message": "Sorry, this spot is already booked for the specified dates",
					"errors": {
						"startDate": "Start date conflicts with an existing booking",
						"endDate": "End date conflicts with an existing booking"
					}
				})
		}

	}


	booking.startDate = startDate
	booking.endDate = endDate

	await booking.save()

	res.json(booking)

})

//Delete an existing booking
router.delete('/:bookingId', requireAuth, async (req, res) => {

	const { user } = req;
	const { bookingId } = req.params;

	const spot = await Spot.findOne({
		where: {
			ownerId: user.id
		}
	})

	const booking = await Booking.findByPk(bookingId, {
		where: {
			[Op.or]: [
				{ spotId: spot.ownerId },
				{ userId: user.id }
			]
		}
	})

	// console.log(booking)


	if (!booking) {
		return res
			.status(404)
			.json({
				"message": "Booking couldn't be found"
			})
	}

	// console.log("booking here: ", booking)

	const startDate = booking.startDate

	// console.log("startDate:", booking.startDate)

	const bookingStartExists = new Date(startDate);
	const booked = bookingStartExists.getTime();

	// console.log(startDate, bookingStartExists, booked)

	const current = Date.now();

	// console.log(booked < current)

	if (booked < current) {
		return res
			.status(403)
			.json({
				"message": "Bookings that have been started can't be deleted"
			})
	}

	// console.log("booking as JSON: ", booking)

	await booking.destroy();

	res.json({
		"message": "Successfully deleted"
	})

})














module.exports = router;
