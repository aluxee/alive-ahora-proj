const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser); // global middleware, want to ensure everything that we add from here on is added after this

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.post('/test', (req, res) => { // * don't touch, leave this in place until at least after mod 5, could be handy
	res.json({ requestBody: req.body });
});

module.exports = router;
