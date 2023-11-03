const express = require('express');

const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { ReviewImage } = require('../../db/models');


const router = express.Router();






router.delete('/:imageId', requireAuth, async (req, res) => {
	const { imageId } = req.params;
	const img = await ReviewImage.findByPk(imageId);

	if (!img) {
		res
			.status(404)
			.json({
				"message": "Review Image couldn't be found",
				"statusCode": 404
			})


	}

	await img.destroy();

	res.json({
		"message": "Successfully deleted",
		"statusCode": 200
	})
})























module.exports = router;
