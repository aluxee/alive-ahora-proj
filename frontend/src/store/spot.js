
/** Action Type Constants: */
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
// export const RECEIVE_SPOTS = 'spots/RECEIVE_SPOTS';
// export const UPDATE_SPOTS = 'spots/UPDATE_SPOTS';
export const REMOVE_SPOTS = 'spots/REMOVE_SPOTS';

// /**  Action Creators: */
export const loadSpots = (spots) => ({
	type: LOAD_SPOTS,
	spots
});

// export const receiveSpot = (spot) => ({
// 	type: RECEIVE_SPOTS,
// 	spot
// });

// createSpot => *special*
// export const editSpot = (spot) => ({
// 	type: UPDATE_SPOTS,
// 	spot
// });

export const removeSpot = (spotId) => ({
	type: REMOVE_SPOTS,
	spotId
});

// /** Thunk Action Creators: */

// // not gonna show anything unless we extract from back end which is where the thunk comes in
export const thunkLoadSpots = () => async dispatch => {
	// 	// get request: not likely to pass anything in but can throw props if you want but that's just a placeholder if inserted, prob not gonna use in the function

	// 	// fetch response

	const response = await fetch('/api/spots', {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	});

	// response display spots to be useable in below dispatch

	//note:  .then for throw res; for error handling use either then or await async
	console.log("(spot.js) thunkLoadSpots response: ", response);
	if (response.ok) {
		const spots = await response.json()


		dispatch(loadSpots(spots))
	} else {
		const errorResponse = await response.json()
		return errorResponse
	}
}

const initialState = {};
const spotsReducer = (state = initialState, action) => {

	// spots are an object of array of objects
	// const cpSpotId = action.id;
	switch (action.type) {
		case LOAD_SPOTS: {
			const allSpotsState = {...state};
			action.spots.Spots.forEach(spot => {
				allSpotsState[spot.id] = spot
			})
			return allSpotsState;
		}
		default:
			return state;
	}

}


export default spotsReducer;
