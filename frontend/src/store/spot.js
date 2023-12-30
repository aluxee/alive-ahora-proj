import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const LOAD_CURRENT_SPOTS = 'spots/LOAD_CURRENT_SPOTS';
export const LOAD_SPOT_IMAGES = 'spots/LOAD_SPOT_IMAGES';
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT';
export const ADD_IMAGE = 'spots/ADD_IMAGE';
export const POST_SPOT = 'spots/POST_SPOT';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const REMOVE_SPOT = 'spots/REMOVE_SPOT';

// /**  Action Creators: */
// SN: will not change multiple spots (spots) to spotsData for easier visibility
export const loadSpots = (spots) => ({
	type: LOAD_SPOTS,
	spots
});

export const loadCurrentSpots = (spots) => {
	console.log("🚀 ~ file: spot.js:21 ~ loadCurrentSpots ~ spots:", spots)
	return {

		type: LOAD_CURRENT_SPOTS,
		spots
	}
};


export const loadImagesForSpot = (spotData) => ({
	type: LOAD_SPOT_IMAGES,
	spotData
});

export const receiveSpot = (spotData) => ({
	//create custom obj prior to dispatch***
	type: RECEIVE_SPOT,
	spotData
});

export const addSpotImage = (image, spotId) => {
	console.log("Inside addSpotImage action creator: ", image);
	return {
		type: ADD_IMAGE,
		image,
		spotId
	}
};

export const createSpot = (spotData) => ({
	type: POST_SPOT,
	spotData
});


// export const editSpot = (spot) => ({
// 	type: UPDATE_SPOTS,
// 	spot
// });


export const removeSpot = (id) => {
	return {
		type: REMOVE_SPOT,
		id
	}
};

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
		const imagesData = await response.json();
		// console.log("🚀 ~ file: spot.js:55 ~ thunkLoadSpotImages ~ data:", data)
		dispatch(loadImagesForSpot(imagesData))
		return imagesData;
	} else {
		const errorResponse = await response.json();
		return errorResponse;
	}
};


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

//* load current spots
export const thunkLoadCurrentSpots = () => async dispatch => {

	const response = await csrfFetch('/api/spots/current');

	if (response.ok) {
		const spotsCurrentData = await response.json();
		console.log("🚀 ~ file: spot.js:131 ~ thunkLoadCurrentSpots ~ spotsCurrentData:", spotsCurrentData)
		dispatch(loadCurrentSpots(spotsCurrentData))
		return spotsCurrentData;

	} else {
		const errorResponse = await response.json();
		return errorResponse;
	}

}

//* receive a spot
export const thunkReceiveSpot = (spotId) => async (dispatch) => {

	const response = await fetch(`/api/spots/${spotId}`, {
		method: 'GET',
		headers: {
			"Content-Type": "application/json"
		}
	})
	if (response.ok) {
		const data = await response.json()
		dispatch(receiveSpot(data))
		return data
	} else {
		const errorResponse = await response.json()
		return errorResponse;
	}
};

// for adding an image by post: a separate a/c not necessary thus a/c and it's thunk or additional portion to reducer is not required

//* create / post a spot
export const thunkCreateSpot = (spotData, images) => async (dispatch) => {
	console.log("🚀 %c ~ file: spot.js:178 ~ thunkCreateSpot ~ images:", "color: yellow; font-size: 32px", images)
	console.log("🚀 %c ~ file: spot.js:178 ~ thunkCreateSpot ~ spotData:", "color: yellow; font-size: 32px", spotData)

	const response = await csrfFetch('/api/spots', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(spotData.Spot)
	})
	// may need to change the json body from spotData to spotData.Spot

	if (response.ok) {

		const data = await response.json();

		console.log(" %c this response is rendering in thunkCreateSpot; here's the data: ", "color: white; font-size: 32px", data);

		// dispatch the images with it's given data, use param of spotData's images key (used SpotImages, may need to be Images?), which is an empty array; use the id that will be made from this thunk
		for (let image of images) {

			const response = await csrfFetch(`/api/spots/${data.id}/images`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(image)

			})
			console.log("RESPONSE: ", response)
		}

		console.log("🚀 %c~ file: spot.js:217 ~ thunkCreateSpot ~ data: PRIOR TO RETURN", "color: white; font-size: 32px", data)
		await dispatch(createSpot(data))
		return data

	} else {
		const errorResponse = await response.json()
		return errorResponse
	}
}

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


//* delete/remove a spot
export const thunkRemoveSpot = (id) => async dispatch => {
console.log("🚀 ~ file: spot.js:234 ~ thunkRemoveSpot ~ id:", id)
console.log("thunk remove spot: id", id)
	const response = await csrfFetch(`/api/spots/${id}`, {
		method: 'DELETE',
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(removeSpot(data))
		return response
	} else {
		const errorResponse = await response.json()
		return errorResponse
	}
}
//  __________________________________________reducer____________________________________________________
const initialState = {}
const spotsReducer = (state = initialState, action) => {

	// spots are an object of array of objects
	// const cpSpotId = action.id;
	switch (action.type) {
		case LOAD_SPOTS: {
			const allSpotsState = { ...state };

			action.spots.Spots.forEach(spot => {
				let newSpotState = { ...spot, SpotImages: [], Owner: {} }
				allSpotsState[spot.id] = newSpotState;
			})
			return allSpotsState;
		}

		case LOAD_SPOT_IMAGES: {
			console.log("%c initialState (case of LOAD_SPOT_IMAGES): ", "color: cyan; font-size: 30px", initialState, action.spotData.Spot.SpotImages, action.spotData)
			let spotImageState = { ...state };
			console.log("🚀 ~ file: spot.js:269 ~ spotsReducer ~ spotImageState:", spotImageState)

			return spotImageState;
		}

		case LOAD_CURRENT_SPOTS: {
			const currentSpotsState = { ...state };
			console.log("🚀 %c~ file: spot.js:278 ~ spotsReducer ~ currentSpotsState:", "color: orange; font-size: 30px", currentSpotsState) // an object within an object with it's own key (normalized)

			action.spots.Spots.forEach(spot => {
				const newSpotState = { ...spot }
				console.log("🚀 %c ~ file: spot.js:281 ~ spotsReducer ~ newSpotState:", "color: orange; font-size: 25px", newSpotState)
				currentSpotsState[spot.id] = { ...state[spot.id], ...newSpotState };
				console.log("🚀 ~ file: spot.js:284 ~ spotsReducer ~ newSpotState: (AFTER)", newSpotState)

			}
			)
			return currentSpotsState;
		}

		case RECEIVE_SPOT: {
			console.log("🚀 %c ~ file: spot.js:221 ~ spotsReducer ~ ACTION: (receive_spot)", "color: orange; font-size: 25px", action, "action spot in spot id: ", action.spotData.Spot.id, "action.spot.Spot: ", action.spotData.Spot);
			const spotState = { ...state, [action.spotData.Spot.id]: action.spotData.Spot };
			return spotState;
		}


		case POST_SPOT: {
			const newSpotState = { ...state }

			console.log("🚀 ~ file: spot.js:293 ~ spotsReducer ~ newSpotState:", newSpotState)

			const newSpot = { ...action.spotData, SpotImages: [], Owner: {} }

			console.log("🚀 ~ file: spot.js:295 ~ spotsReducer ~ newSpot:", newSpot)

			newSpotState[action.spotData.id] = {
				// ...state[action.spotData.id],
				...newSpot
			}

			// console.log("🚀 ~ file: spot.js:292 ~ spotsReducer ~ newSpotState: (BEFORE RETURN)", newSpotState)

			return newSpotState;
		}
		case REMOVE_SPOT: {
			const newSpotState = { ...state };
			// console.log("%c remove_spot spot.js inside reducer: -- action -- ", "color: blue; font-size 26px", action, state, action.spots.Spots.id)
			delete newSpotState[action.id];
			return newSpotState;
		}

		default:
			return state;
	}

}


export default spotsReducer;
