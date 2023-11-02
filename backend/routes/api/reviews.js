const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Review } = require('../../db/models');
const { handle } = require('express/lib/router');

const router = express.Router();



router.get('/current', handleValidationErrors, async (req, res) => {

	// no req body

})





module.exports = router;
