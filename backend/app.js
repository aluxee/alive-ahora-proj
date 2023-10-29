const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');


const { environment } = require('./config');
const isProduction = environment === 'production';
const routes = require('./routes');

const app = express();



app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
	// enable cors only in development
	app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
	helmet.crossOriginResourcePolicy({
		policy: "cross-origin"
	})
);

// Set the _csrf token and create req.csrfToken method
app.use(
	csurf({
		cookie: {
			secure: isProduction,
			sameSite: isProduction && "Lax",
			httpOnly: true
		}
	})
);


app.use(routes); // connects all the routes, needs to pass thru all the middleware, so goes at the bottom of all the middleware




app.use((_req, _res, next) => {
	const err = new Error("The requested resource couldn't be found.");
	err.title = "Resource Not Found";
	err.errors = ["The requested resource could not be found."];
	err.status = 404;
	next(err);
}); // if a req gets to this point we make new obj and give it a new title where we catch it and process thru this middleware

app.use((err, _req, _res, next) => {
	// check if error is a Sequelize error:
	if (err instanceof ValidationError) {
		let errors = {};
		for (let error of err.errors) {
			errors[error.path] = error.message;
		}
		err.title = 'Validation error';
		err.errors = errors;
	}
	next(err);
});


app.use((err, _req, res, _next) => {
	res.status(err.status || 500);
	console.error(err);
	res.json({
		title: err.title || 'Server Error',
		message: err.message,
		errors: err.errors,
		stack: isProduction ? null : err.stack // stack in response IF were not in production
	});
});














module.exports = app;
