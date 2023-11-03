const router = require('express').Router();
const reviewImagesRouter = require('./review-images');
const spotImagesRouter = require('./spot-images');
const bookingsRouter = require('./bookings');
const reviewsRouter = require('./reviews');
const spotsRouter = require('./spots');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require("../../utils/auth.js");
const review = require('../../db/models/review');

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser); // global middleware, want to ensure everything that we add from here on is added after this

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/reviews', reviewsRouter);

router.use('/bookings', bookingsRouter);

router.use('/spot-images', spotImagesRouter);

router.use('/review-images', reviewImagesRouter);

router.post('/test', (req, res) => { // * don't touch, leave this in place until at least after mod 5, could be handy
	res.json({ requestBody: req.body });
});


module.exports = router;
