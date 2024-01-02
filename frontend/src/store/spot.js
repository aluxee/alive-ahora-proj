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
	// console.log("🚀 ~ file: spot.js:21 ~ loadCurrentSpots ~ spots:", spots)
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
	// console.log("Inside addSpotImage action creator: ", image);
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


export const editSpot = (spot) => ({
	type: UPDATE_SPOT,
	spot
});


export const removeSpot = (spotId) => {
	return {
		type: REMOVE_SPOT,
		spotId
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
		// console.log("🚀 ~ file: spot.js:131 ~ thunkLoadCurrentSpots ~ spotsCurrentData:", spotsCurrentData)
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
	// console.log("🚀 %c ~ file: spot.js:178 ~ thunkCreateSpot ~ images:", "color: yellow; font-size: 32px", images)
	// console.log("🚀 %c ~ file: spot.js:178 ~ thunkCreateSpot ~ spotData:", "color: yellow; font-size: 32px", spotData)

	const response = await csrfFetch('/api/spots', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(spotData.Spot)
	})
	// may need to change the json body from spotData to spotData.Spot

	if (response.ok) {

		const spot = await response.json();

		// console.log(" %c this response is rendering in thunkCreateSpot; here's the spot: ", "color: white; font-size: 32px", spot);

		// dispatch the images with it's given data, use param of spotData's images key (used SpotImages, may need to be Images?), which is an empty array; use the id that will be made from this thunk
		for (let image of images) {

			const response = await csrfFetch(`/api/spots/${spot.id}/images`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(image)

			})
			// console.log("RESPONSE: ", response)
		}

		// console.log("🚀 %c~ file: spot.js:217 ~ thunkCreateSpot ~ spot: PRIOR TO RETURN", "color: white; font-size: 32px", spot)
		await dispatch(createSpot(spot))
		return spot

	} else {
		const errorResponse = await response.json()
		return errorResponse
	}
}

//! edit a spot
export const thunkEditSpot = (id, spot) => async (dispatch) => {

	// console.log("%c 🚀 ~ file: spot.js:213 ~ thunkEditSpot ~ id: ", "color: cyan; font-size: 25px", id)

	const spotId = Number(id);

	// console.log("%c 🚀 ~ file: spot.js:213 ~ thunkEditSpot ~ spot: ", "color: cyan; font-size: 25px", spot, "spotid versus spot.id", spot.id, spotId)

	// see sc for mdn times and sorts
	const response = await csrfFetch(`/api/spots/${spotId}`, {
		method: 'PUT',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(spot)
	})
	if (response.ok) {
		const data = await response.json();

		if (data) {
			dispatch(editSpot(data))
		}
		return data

	} else {
		const errorResponse = await response.json()

		return errorResponse
	}
}


//* delete/remove a spot
export const thunkRemoveSpot = (spot) => async dispatch => {

	// console.log("%c 🚀 ~ file: spot.js:233 ~ thunkRemoveSpot ~ spot:", "color: red; font-size: 25px", spot)
	// console.log("🚀 ~ file: spot.js:234 ~ thunkRemoveSpot ~ spotId:", id); // gives direct #; but upon submission of actually clicking the button it turns back into an object-- changing param into spot and keying in...
	// console.log("thunk remove spot: THE SPOT PARAM CHANGES", spot, spot.id); // gives direct #


	const response = await csrfFetch(`/api/spots/${spot.id}`, {
		method: 'DELETE',
		headers: {
			"Content-Type": "application/json"
		}
	});

	if (response.ok) { // removed data and replaced it with id
		// console.log("Inside response.ok of spot.js line 246")
		dispatch(removeSpot(spot.id))
		// console.log("a console.log right after the dispatch of removeSpot by spot.id in spot.js line 248")
		return spot.id
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
			// console.log("%c initialState (case of LOAD_SPOT_IMAGES): ", "color: cyan; font-size: 30px", initialState, action.spotData.Spot.SpotImages, action.spotData)
			let spotImageState = { ...state };
			// console.log("🚀 ~ file: spot.js:269 ~ spotsReducer ~ spotImageState:", spotImageState)

			return spotImageState;
		}

		case LOAD_CURRENT_SPOTS: {
			const currentSpotsState = { ...state };
			// console.log("🚀 %c~ file: spot.js:278 ~ spotsReducer ~ currentSpotsState:", "color: orange; font-size: 30px", currentSpotsState) // an object within an object with it's own key (normalized)

			action.spots.Spots.forEach(spot => {
				const newSpotState = { ...spot }
				// console.log("🚀 %c ~ file: spot.js:281 ~ spotsReducer ~ newSpotState:", "color: orange; font-size: 25px", newSpotState)
				currentSpotsState[spot.id] = { ...state[spot.id], ...newSpotState };
				// console.log("🚀 ~ file: spot.js:284 ~ spotsReducer ~ newSpotState: (AFTER)", newSpotState)

			}
			)
			return currentSpotsState;
		}

		case RECEIVE_SPOT: {
			// console.log("🚀 %c ~ file: spot.js:221 ~ spotsReducer ~ ACTION: (receive_spot)", "color: orange; font-size: 25px", action, "action spot in spot id: ", action.spotData.Spot.id, "action.spot.Spot: ", action.spotData.Spot);
			const spotState = { ...state, [action.spotData.Spot.id]: action.spotData.Spot };
			return spotState;
		}


		case POST_SPOT: {
			const newSpotState = { ...state }

			// console.log("🚀 ~ file: spot.js:293 ~ spotsReducer ~ newSpotState:", newSpotState)

			const newSpot = { ...action.spotData, SpotImages: [], Owner: {} }

			// console.log("🚀 ~ file: spot.js:295 ~ spotsReducer ~ newSpot:", newSpot)

			newSpotState[action.spotData.id] = {
				...newSpot
			}

			return newSpotState;
		}

		case UPDATE_SPOT: {
			const updatedSpotState = { ...state }

			// console.log("%c 🚀 ~ file: spot.js:321 ~ spotsReducer ~ updatedSpotState: ", "color: pink; font-size: 25px", updatedSpotState);
			// console.log("INSIDE UPDATE_ SPOT: ", action)
			const newSpot = { ...action.spot, SpotImages: [], Owner: {} }

			updatedSpotState[newSpot.id] = {
				...state, [action.spot.id]: {
					Owner: {}, SpotImages: [], ...newSpot
				}
			}

			return updatedSpotState;
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
