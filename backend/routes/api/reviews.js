const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Review, Spot, SpotImage, ReviewImage, User, sequelize } = require('../../db/models');
const { handle } = require('express/lib/router');
const review = require('../../db/models/review');

const router = express.Router();

const validateReview = [
	check('review')
		.exists({ checkFalsy: true })
		.notEmpty()
		.isLength({ min: 3 })
		.withMessage("Review text is required"),
	check('stars')
		.exists({ checkFalsy: true })
		.notEmpty()
		.isInt({ min: 1, max: 5 })
		.withMessage("Stars must be an integer from 1 to 5"),
	handleValidationErrors
]

//Create and return a new image for a review specified by id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
	const { url } = req.body;
	const { user } = req;

	const { reviewId } = req.params;
	const userReview = await Review.findByPk(reviewId);

	if (!userReview) {
		return res
			.status(404)
			.json({
				"message": "Review couldn't be found",
				statusCode: 404
			})
	}

	if(userReview.userId !== user.id){
		return res.status(403).json({
			"message": "Permission denied",
			statusCode: 403
		});
	}



	const existingImages = await ReviewImage.findAll({
		attributes: ['id', 'url'],
		where: {
			reviewId
		}
	})

	if (existingImages.length >= 10) {
		return res
			.status(403)
			.json({
				"message": "Maximum number of images for this resource was reached",
				statusCode: 403
			})
	}


	const createImage = await ReviewImage.create({
		reviewId,
		url
	})

	const imageRes = {
		id: createImage.id,
		url: createImage.url
	}
existingImages.push(imageRes)

	res.json(imageRes)
})



// get reviews written by the current user
router.get('/current', handleValidationErrors, requireAuth, async (req, res) => {

	// no req body

	// any owner/ user id?

	const reviews = await Review.findAll({
		where: {
			userId: req.user.id
		},
		include: [
			{
				model: User,
				attributes: ['id', 'firstName', 'lastName'],
				where: {
					id: req.user.id
				}
			},
			{
				model: Spot,
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'description']
				},
				// include: {
				// 	model: SpotImage,
				// 	where:
				// 		{ preview: true },
				// 	attributes: ['url']

				// }
			},
			{
				model: ReviewImage,
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'reviewId']
				}
			}
		]
	});
	console.log("REVIEWS: ", reviews)
	const reviewPayload = [];


	let spot = await Spot.findByPk(req.user.id, {
		attributes: {
			exclude: ['createdAt', 'updatedAt', 'description']
		}
	})
	spot = spot.toJSON();

	for (let review of reviews) {
		review = review.toJSON();


		const img = await SpotImage.findByPk(req.user.id, {
			where: {
				[Op.and]: [
					{ spotId: review.id },
					{ preview: true }
				],
				attributes: {
					exclude: 'url'
				}
			}
		})
		img ? spot.previewImage = img.url : '';
		!img ? spot.previewImage = null : '';
		review.Spot = spot;
		reviewPayload.push(review)

	}
	res.json({
		Reviews: reviewPayload
	})

})




router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {

	const { review, stars } = req.body
	const { reviewId } = req.params
	const reviewUpdate = await Review.findByPk(reviewId, {
		attribute: {
			exclude: []
		}
	})

	if (!reviewId) {
		res
			.status(404)
			.json({
				message: "Review couldn't be found",
				statusCode: 404
			})
	}

	try {
		reviewUpdate.review = review
		reviewUpdate.stars = stars

		await reviewUpdate.save();

		res.json({
			reviewUpdate
		})

	} catch (error) {
		if (!Number(reviewUpdate.stars)) {
			next(error)
		} else if (!reviewUpdate.review) {
			next(error)
		}
	}
})

router.delete('/:reviewId', async (req, res) => {
	const { reviewId } = req.params
	const review = await Review.findByPk(reviewId)

	if (!review) {
		res
			.status(404)
			.json({
				"message": "Review couldn't be found",
				statusCode: 404
			})
	}
	review.destroy()

	res.json({
		"message": "Successfully deleted",
		statusCode: 200
	})

})







module.exports = router;
