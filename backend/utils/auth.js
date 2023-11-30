const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => { // using to generate and set our tokens to log in oor sign up our user
	// Create the token.
	const safeUser = {
		id: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		username: user.username,
	};
	const token = jwt.sign(
		{ data: safeUser },
		secret,
		{ expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
	);

	const isProduction = process.env.NODE_ENV === "production";

	// Set the token cookie
	res.cookie('token', token, {
		maxAge: expiresIn * 1000, // maxAge in milliseconds
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction && "Lax"
	});

	return token;
};

const restoreUser = (req, res, next) => { // global middleware
	// token parsed from cookies
	const { token } = req.cookies;
	req.user = null;

	return jwt.verify(token, secret, null, async (err, jwtPayload) => {
		if (err) { // means user has not logged in/user is logged out
			return next();
		}
		// however, if we do have a token ...
		try {
			const { id } = jwtPayload.data;
			req.user = await User.findByPk(id, { // we are querying for that user and what were doing with that response of the query is assigning object to our request object; creating a property called user on the request object and setting that property to the return value of our query
				// * anytime we want access to log in user info, key into req.user
				attributes: {
					include: ['email', 'createdAt', 'updatedAt'] // overriding the properties in the user.js query so that all that is actually excluded is the hashedPassword
				}
			});
		} catch (e) { // prob only occur if we somehow  we delete a user while token still active on client; so in that event well remove token and let req continue on as log out req
			res.clearCookie('token');
			return next();
		}

		if (!req.user) res.clearCookie('token');

		return next();
	});
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) { // middleware that is not global and only applied to specific endpoints
	if (req.user) return next(); // if verify JWT and decode JWT payload finding related user in req.user as smooth process, then requireAuth identify log in user and allow erq to move on to whatever endpoint this middlewares protecting

	const err = new Error('Authentication required');
	err.title = 'Authentication required';
	err.errors = { message: 'Authentication required' }; // user has to be logged in to access endpoint and throws error
	err.status = 401;
	return next(err);
}

// if there is a current user but they are not authorized
const authorization = async function (req, res, next) {

	const { user } = req;
	const { spotId, spotImageId, reviewId, reviewImageId, bookingId } = req.params;

	if (spotId) {
		const spot = await Spot.findByPk(spotId);
		if (!spot || user.id !== spot.ownerId) return handleUnauthorized(res);
	}
	if (spotImageId) {
		const spot = await Spot.findByPk(spotId);
		const spotImage = await SpotImage.findByPk(spotId);

		if (!spotImage || !spot || user.id !== spot.ownerId) return handleUnauthorized(res);
	}

	if (reviewId) {
		const review = await Review.findByPk(reviewId);
		if (!review){
			return res
				.status(404)
				.json({
					message: "Review couldn't be found"
				})
		}
			if(user.id !== review.userId) return handleNotAuthenticated(res);
	}
	if (reviewImageId) {
		const review = await Review.findByPk(reviewId);
		const reviewImage = await ReviewImage.findByPk(reviewId);

		if (!reviewImage || !review ) return handleUnauthorized(res);
		if (user.id !== review.userId) return handleNotAuthenticated(res)

	};

	if (bookingId) {
		const booking = await Booking.findByPk(bookingId);

		if (!booking) {
			res
				.status(404)
				.json({
					"message": "Booking couldn't be found"
				})
		}

		if (booking.userId !== null && user.id !== booking.userId) return handleUnauthorized(res);
	}

	// const err = new Error('Forbidden');
	// if(process.env.NODE_ENV !== "production"){
	// 	err.title = 'Authentication required'
	// 	err.errors = {
	// 		message: 'Authentication required'
	// 	}
	// }

	// If the user is authorized, continue to the next middleware or route handler
	next();

}

function handleUnauthorized(res) {
	const err = new Error('Forbidden');
	if (process.env.NODE_ENV !== "production") {
		err.title = 'Authorization required';
		err.errors = {
			message: 'Authorization required',
		};
	}
	err.status = 404;
	return res
		.status(404)
		.json({
			message: 'Permission denied',
		});
}

function handleNotAuthenticated(res){
	const err = new Error('Forbidden');
	if (process.env.NODE_ENV !== "production") {
		err.title = 'Authentication required';
		err.errors = {
			message: 'Authentication required',
		};
	}
	err.status = 403;
	return res
		.status(403)
		.json({
			message: 'Permission denied',
		});
}

module.exports = { setTokenCookie, restoreUser, requireAuth, authorization };
