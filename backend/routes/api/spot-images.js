const express = require('express');
const { requireAuth, authorization } = require('../../utils/auth');
const { SpotImage, Spot, User } = require('../../db/models');

const router = express.Router();




router.delete('/:imageId', requireAuth, authorization, async (req, res) => {

	const { user } = req;
	const { imageId } = req.params;
	const userId = req.user.id;

	const img = await SpotImage.findByPk(imageId);


	if (!img) {
		return res
			.status(404)
			.json({
				"message": "Spot Image couldn't be found",
				"statusCode": 404
			})

	}

	const spot = await Spot.findByPk(img.spotId)

	if (!spot || spot.ownerId !== userId) {
		return res
			.status(403)
			.json({
				"message": "Permission denied",
				"statusCode": 403
			});
	}


	await img.destroy(); // does not work when img becomes json

	// console.log("spot on json: ", spot, spotId)

	res
		.status(200)
		.json({
			"message": "Successfully deleted"
		})

})























module.exports = router;
