const express = require('express');

const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { SpotImage } = require('../../db/models');


const router = express.Router();






router.delete('/:imageId', requireAuth, async (req, res) => {

	const { imageId } = req.params;
	const img = await SpotImage.findByPk(imageId);

	if (!img) {
		res
			.status(404)
			.json({
				"message": "Spot Image couldn't be found",
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
