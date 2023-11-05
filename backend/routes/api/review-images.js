const express = require('express');
const { requireAuth, authorization } = require('../../utils/auth');
const { ReviewImage, Review, User } = require('../../db/models');

const router = express.Router();




router.delete('/:imageId', requireAuth, authorization, async (req, res) => {

	const { user } = req;
	const { imageId } = req.params;
	const userId = req.user.id;

	const img = await ReviewImage.findByPk(imageId);


	if (!img) {
		return res
			.status(404)
			.json({
				"message": "Review Image couldn't be found",
				"statusCode": 404
			})
	}


	const review = await Review.findByPk(img.reviewId)

	// console.log("review", review)
if(!review || review.userId !== userId){
	return res
		.status(403)
		.json({
			"message": "Permission denied",
			"statusCode": 403
		});
}

	await img.destroy();

	res.json({
		"message": "Successfully deleted",
		"statusCode": 200
	})
})























module.exports = router;
