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

	console.log("%c 🚀 ~ file: review.js:81 ~ thunkLoadAllReviews ~ spotId: ", "color: green; font-size: 25px", spotId)

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

	console.log("%c 🚀 ~ file: review.js:69 ~ thunkCreateReview ~ review: ", "color: cyan; font-size: 25px", review)

	console.log("%c 🚀 ~ file: review.js:69 ~ thunkCreateReview ~ user: ", "color: cyan; font-size: 25px", spotId)


	const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(review)
	})


	if (response.ok) {
		const reviewData = await response.json();


		review.User = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName
		}
		dispatch(createReview(reviewData))
		dispatch(loadAllReviews(spotId))
		return reviewData
	} else {
		const errorResponse = await response.json();
		return errorResponse;
	}
}

// * delete review

//  __________________________________________reducer____________________________________________________
const initialState = {}
const reviewsReducer = (state = initialState, action) => {

	// spots are an object of array of objects
	// const cpSpotId = action.id;
	switch (action.type) {
		case LOAD_REVIEWS: {
			const allReviews = { ...state };
			action.reviews.Reviews.forEach(review => {
				let loadedReviewState = { ...review }
				allReviews[review.id] = loadedReviewState;
			})
			return allReviews;

		}
		case CREATE_REVIEW: {
			return { [action.review.id]: { ...action.review }, ...state }
		}
		default:
			return state;
	}

}


export default reviewsReducer;
