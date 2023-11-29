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
			userId: req.user.id
		}
	})
	const bookingsPayload = [];
	for (let booking of bookings) {

		const spotId = booking.spotId;

		booking = booking.toJSON();
		console.log("booking", booking)



		// define spot thru pk
		let spot = await Spot.findByPk(spotId, {
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'description']
			}
		})
		spot = spot.toJSON();

		// define img thru pk
		const img = await SpotImage.findByPk(spotId, {
			where: {
				[Op.and]: [
					{ spotId: spot.id },
					{ preview: true }
				]
			}
		})
		if (img) {

			spot.previewImage = img.url;
		} else {
			spot.previewImage = null;
		}
		// (bang) img ? spot.previewImage = null : '';
		// console.log("IMAGE: ", img)



		booking.Spot = spot;
		bookingsPayload.push(booking)

	}


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


	const existingBookingsOfUser = await Booking.findAll({
		where: {
			userId: user.id
		}
	})

	// * begin double checking here

	if (startDate >= endDate) {
		res
			.status(400)
			.json({
				"message": "Bad Request",
				"errors": {
					"endDate": "endDate cannot come before startDate"
				}
			})
	}

	// if (booking.startDate > booking.endDate) {
	// 	res
	// 		.status(403)
	// 		.json({
	// 			"message": "Past bookings can't be modified"
	// 		})
	// }

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
		// cant edit a booking that is past/ greater than the existing end date (?)
		if (bookingStartExists && bookingEndExists < bookStartCreated && bookEndCreated) {
			res
				.status(403)
				.json({
					"message": "Past bookings can't be modified"
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

	const { bookingId } = req.params
	let booking = await Booking.findByPk(bookingId)
	booking = booking.toJSON();
	const start = Date.now()
	const bookedDate = booking.startDate.toString()
	// console.log(booking)
	// console.log("the", booking, "vs", (booking.startDate).toString().toDateString())
	const bookedCreation = new Date(bookedDate);
	const bookedTimed = bookedCreation.getTime()
	// console.log(bookedDate, bookedCreation, bookedTimed)
	// console.log(bookedTimed, "versus", start)
	if (!booking) {
		res
			.status(404)
			.json({
				"message": "Booking couldn't be found",
				"statusCode": 404
			})
	}

	if (bookedTimed < start) {
		res
			.status(403)
			.json({
				"message": "Bookings that have been started can't be deleted",
				"statusCode": 403
			})
	}

	await booking.destroy()
	res.json({
		"message": "Successfully deleted",
		"statusCode": 200

	})
})














module.exports = router;
