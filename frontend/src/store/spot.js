
/** Action Type Constants: */
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const LOAD_SPOT_IMAGES = 'spots/LOAD_SPOT_IMAGES';
// export const RECEIVE_SPOTS = 'spots/RECEIVE_SPOTS';
// export const UPDATE_SPOTS = 'spots/UPDATE_SPOTS';
export const REMOVE_SPOTS = 'spots/REMOVE_SPOTS';

// /**  Action Creators: */
export const loadSpots = (spots) => ({
	type: LOAD_SPOTS,
	spots
});

export const loadImagesFromSpot = (spot) => ({
	type: LOAD_SPOT_IMAGES,
	spot
})
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


export const thunkLoadSpotImages = (spotId) => async dispatch => {
	console.log("🚀 ~ file: spot.js:39 ~ thunkLoadSpotImages ~ spot's id:", spotId)

	const imageUrl = spot.previewImage;
	console.log("🚀 ~ file: spot.js:42 ~ thunkLoadSpotImages ~ imageUrl:", imageUrl)


	const response = await fetch(`/api/spots/${spot.id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	console.log("🚀 ~ file: spot.js:49 ~ thunkLoadSpotImages ~ response:", response)

	if (response.ok) {
		const data = await response.json();
		console.log("🚀 ~ file: spot.js:55 ~ thunkLoadSpotImages ~ data:", data)
		dispatch(loadImagesFromSpot(data))
		return data;
	} else {
		const errorResponse = await response.json();
		return errorResponse;
	}


}


// // not gonna show anything unless we extract from back end which is where the thunk comes in
export const thunkLoadSpots = () => async dispatch => {
	// 	// get request: not likely to pass anything in but can throw props if you want but that's just a placeholder if inserted, prob not gonna use in the function

	// 	// fetch response

	const response = await fetch('/api/spots', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	// response display spots to be useable in below dispatch

	//note:  .then for throw res; for error handling use either then or await async
	// console.log("(spot.js) thunkLoadSpots response: ", response);
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
			const allSpotsState = { ...state };
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
