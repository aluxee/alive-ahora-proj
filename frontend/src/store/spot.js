
/** Action Type Constants: */
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const LOAD_SPOT_IMAGES = 'spots/LOAD_SPOT_IMAGES';
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT';
// export const POST_SPOTS = 'spots/POST_SPOTS';
// export const UPDATE_SPOTS = 'spots/UPDATE_SPOTS';
export const REMOVE_SPOTS = 'spots/REMOVE_SPOTS';

// /**  Action Creators: */
export const loadSpots = (spots) => ({
	type: LOAD_SPOTS,
	spots
});

export const loadImagesFromSpot = (spots) => ({
	type: LOAD_SPOT_IMAGES,
	spots
});

export const receiveSpot = (spot) => ({
	//create custom obj prior to dispatch***
	type: RECEIVE_SPOT,
	spot
});


// export const createSpot = ( *special* ) => ({
// 	type: POST_SPOTS,
// 	spots
// })



// export const editSpot = (spot) => ({
// 	type: UPDATE_SPOTS,
// 	spot
// });

export const removeSpot = (spotId) => ({
	type: REMOVE_SPOTS,
	spotId
});

// /** Thunk Action Creators: */

//* load images
export const thunkLoadSpotImages = (spotId) => async dispatch => {
	// console.log("🚀 ~ file: spot.js:39 ~ thunkLoadSpotImages ~ spot's id:", spotId)

	// const imageUrl = spot.previewImage;
	// console.log("🚀 ~ file: spot.js:42 ~ thunkLoadSpotImages ~ imageUrl:", imageUrl)


	const response = await fetch(`/api/spots/${spotId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	// console.log("🚀 ~ file: spot.js:49 ~ thunkLoadSpotImages ~ response:", response)

	if (response.ok) {
		const data = await response.json();
		// console.log("🚀 ~ file: spot.js:55 ~ thunkLoadSpotImages ~ data:", data)
		dispatch(loadImagesFromSpot(data))
		return data;
	} else {
		const errorResponse = await response.json();
		return errorResponse;
	}


}


//* load all spots
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



// custom

//* receive a spot
export const thunkReceiveSpot = (spotId) => async (dispatch) => {
	// ! renders the spotId on the backend as undefined
	const res = await fetch(`/api/spots/${spotId}`, {
		method: 'GET',
		headers: {
			"Content-Type": "application/json"
		}
	})
	if (res.ok) {
		const data = await res.json()
		dispatch(receiveSpot(data))
		return data
	} else {
		const errorResponse = await res.json()
		return errorResponse;
	}
};




//* delete/remove a spot
// export const thunkRemoveSpot = (spotId) => async dispatch => {

// 	console.log("REPORT (props): ", spotId) // came back as undefined; changed from props to removeId


// 	const response = await fetch(`/api/spots/${spotId}`, {
// 		method: 'DELETE',
// 		headers: {
// 			"Content-Type": "application/json"
// 		},

// 	});
// 	// is the body above correct if we're deleting?


// 	if (response.ok) {
// 		dispatch(removeSpot(spotId))
// 		return { 'valid': 'data' }
// 	} else {
// 		const errorResponse = await res.json()
// 		return errorResponse
// 	}
// }


//* create / post a spot
// export const thunkCreateSpot = (spot) => async (dispatch) => {
// 	const res = await fetch(`api/spots`, {
// 		method: 'POST',
// 		headers: {
// 			"Content-Type": "application/json",
// 			body: JSON.stringify(spot)
// 		}
// 	})
// 	if (res.ok) {
// 		const data = await res.json()
// 		dispatch(receiveSpot(data))
// 		return data
// 	} else {
// 		const errorResponse = await res.json()
// 		return errorResponse
// 	}
// }


//* edit a spot
// export const thunkEditSpot = (spot) => async (dispatch) => {
// 	const res = await fetch(`api/spots/${spot.id}`, {
// 		method: 'PUT',
// 		headers: {
// 			"Content-Type": "application/json",
// 			body: JSON.stringify(spot)
// 		}
// 	})
// 	if (res.ok) {
// 		const data = await res.json()
// 		dispatch(receiveSpot(data))
// 		return data
// 	} else {
// 		const errorResponse = await res.json()
// 		return errorResponse
// 	}
// }


//  __________________________________________reducer____________________________________________________
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
		case RECEIVE_SPOT: {
			console.log("🚀 %c ~ file: spot.js:221 ~ spotsReducer ~ ACTION: (receive_spot)", "color: orange; font-size: 25px", action, "action spot in spot id: ", action.spot.Spot.id, "action.spot.Spot: ", action.spot.Spot );

			return { ...state, [action.spot.Spot.id]: action.spot.Spot };
		}
		default:
			return state;
	}

}


export default spotsReducer;
