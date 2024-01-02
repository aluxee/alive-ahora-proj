import { csrfFetch } from "./csrf";

/** Action Type Constants: */

export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
export const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
export const DELETE_REVIEW = 'reviews/DELETE_REVIEW';


// /**  Action Creators: */
// SN: will not change multiple spots (spots) to spotsData for easier visibility

export const loadAllReviews = (reviews) => ({
	type: LOAD_REVIEWS,
	reviews
})



export const createReview = (review) => {

	// console.log("%c 🚀 ~ file: review.js:22 ~ createReview ~ review: ", "color: pink; font-size: 30px", review)

	return {
		type: CREATE_REVIEW,
		review
	}

}


export const removeReview = (reviewId) => {

	return {
		type: DELETE_REVIEW,
		reviewId
	}

}





// /** Thunk Action Creators: */


// * load reviews
export const thunkLoadAllReviews = (spotId) => async dispatch => {

	// console.log("%c 🚀 ~ file: review.js:81 ~ thunkLoadAllReviews ~ spotId: ", "color: green; font-size: 25px", spotId)

	const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

	if (response.ok) {
		const reviewsData = await response.json();
		dispatch(loadAllReviews(reviewsData))

		return reviewsData;

	} else {
		const errorResponse = await response.json();

		return errorResponse;
	}
}

// * create review
export const thunkCreateReview = (spotId, user, review) => async dispatch => {

	// console.log("%c 🚀 ~ file: review.js:69 ~ thunkCreateReview ~ user: ", "color: cyan; font-size: 25px", user)

	// console.log("%c 🚀 ~ file: review.js:69 ~ thunkCreateReview ~ review: ", "color: cyan; font-size: 25px", review)

	// console.log("%c 🚀 ~ file: review.js:69 ~ thunkCreateReview ~ spotId: ", "color: cyan; font-size: 30px", spotId)
	const idSpot = parseInt(spotId);

	// console.log("%c 🚀 ~ file: review.js:75 ~ thunkCreateReview ~ idSpot: ", "color: red; font-size: 25px", idSpot, "spotId: ", spotId)


	const response = await csrfFetch(`/api/spots/${idSpot}/reviews`, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(review)
	})

	// console.log("%c 🚀 ~ file: review.js:79 ~ thunkCreateReview ~ response: ", "color: cyan; font-size: 25px", response)

	if (response.ok) {
		const review = await response.json();

		// console.log("%c 🚀 ~ file: review.js:90 ~ thunkCreateReview ~ review: ", "color: orange; font-size: 25px", review)

		review.User = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName
		}

		dispatch(createReview({ ...review, User: user }));
		// dispatch(loadAllReviews(idSpot));

		return review;

	} else {
		const errorResponse = await response.json();
		return errorResponse;
	}
}

// * delete review

export const thunkRemoveReview = (review) => async dispatch => {

	const response = await csrfFetch(`/api/reviews/${review.id}`, {
		method: 'DELETE',
		headers: {
			"Content-Type": "application/json"
		}
	})

	if (response.ok) {
		dispatch(removeReview(review.id))
		return review.id
	}

}
//  __________________________________________reducer____________________________________________________
const initialState = {}
const reviewsReducer = (state = initialState, action) => {

	// spots are an object of array of objects
	// const cpSpotId = action.id;
	switch (action.type) {
		case LOAD_REVIEWS: {
			// const allReviews = {state} // best to not bring this back
			const allReviews = {};

			// console.log("%c 🚀 ~ file: review.js:125 ~ reviewsReducer ~ allReviews: ", "color: magenta; font-size: 30px", "BEFORE", allReviews)
			// action.reviews.Reviews.forEach(review => {
			// 	let loadedReviewState = { ...review }
			// 	allReviews[review.id] = loadedReviewState;

			// })
			for (let review of action.reviews.Reviews) {
				allReviews[review.id] = review
			}
			// console.log("%c 🚀 ~ file: review.js:130 ~ reviewsReducer ~ allReviews: ", "color: magenta; font-size: 25px", "AFTER", allReviews);


			return { ...allReviews };

		}
		case CREATE_REVIEW: {

			const reviewState = { ...state.spot, [action.review.id]: action.review }
			// return {...state, ...reviewState}
			return reviewState
		}

		case DELETE_REVIEW: {
			const reviewState = { ...state}

			// console.log("%c 🚀 ~ file: review.js:166 ~ reviewsReducer ~ reviewState: ", "color: red; font-size: 35px", reviewState)

			delete reviewState[action.reviewId]
			return reviewState

		}
		default:
			return state;
	}

}


export default reviewsReducer;
