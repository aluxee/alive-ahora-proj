import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const LOAD_CURRENT_SPOTS = 'spots/LOAD_CURRENT_SPOTS';
export const LOAD_SPOT_IMAGES = 'spots/LOAD_SPOT_IMAGES';
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT';
export const ADD_IMAGE = 'spots/ADD_IMAGE';
export const POST_SPOT = 'spots/POST_SPOT';
export const UPDATE_SPOTS = 'spots/UPDATE_SPOTS';
export const REMOVE_SPOTS = 'spots/REMOVE_SPOTS';

// /**  Action Creators: */
// SN: will not change multiple spots (spots) to spotsData for easier visibility
export const loadSpots = (spots) => ({
	type: LOAD_SPOTS,
	spots
});

export const loadCurrentSpots = (spots) => ({
	type: LOAD_CURRENT_SPOTS,
	spots
});

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



//* receive a spot
export const thunkReceiveSpot = (spotId) => async (dispatch) => {

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

// ! IMAGE ADD HERE
//* add image
export const thunkAddImage = (image, spotId) => async dispatch => {
	console.log("🚀 %c ~ file: spot.js:141 ~ INSIDE OF THUNKADDIMAGE thunkAddImage ~ images:", "color: red; font-size: 25px", image) // undefined

	console.log("🚀 %c ~ file: spot.js:92 ~ thunkAddImage ~ image:", "color: red; font-size: 25px", spotId)


	// for (let image of images) { // ! images are not iterable
		if (image) {
			// maybe its the response?
			const response = await csrfFetch(`/api/spots/${spotId}/images`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ image })
			});

			if (response.ok) {
				const imageData = await response.json();
				console.log("🚀 ~ file: spot.js:158 ~ thunkAddImage ~ imageData:", imageData)
				dispatch(addSpotImage(imageData, spotId))
			} else {
				const errorResponse = await response.json();
				return errorResponse;
			}
		}
	// }


	console.log("🚀 ~ file: spot.js:117 ~ thunkAddImage ~ thunkAddImage:", thunkAddImage)
};


//* create / post a spot
export const thunkCreateSpot = (spotData) => async (dispatch) => {
	console.log("🚀 ~ file: spot.js:207 ~ thunkCreateSpot ~ spotData:", spotData)



	const response = await csrfFetch('/api/spots', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(spotData)
	})
	// may need to change the json body from spotData to spotData.Spot

	if (response.ok) {
		const data = await response.json();
		console.log("this response is rendering in thunkCreateSpot; here's the data: ", data)
		await dispatch(createSpot(data))
		// dispatch the images with it's given data, use param of spotData's images key (used SpotImages, may need to be Images?), which is an empty array; use the id that will be made from this thunk
		await dispatch(thunkAddImage(spotData.Images, data.id))
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

		case RECEIVE_SPOT: {
			console.log("🚀 %c ~ file: spot.js:221 ~ spotsReducer ~ ACTION: (receive_spot)", "color: orange; font-size: 25px", action, "action spot in spot id: ", action.spotData.Spot.id, "action.spot.Spot: ", action.spotData.Spot);
			let spotState = { ...state, [action.spotData.Spot.id]: action.spotData.Spot };
			return spotState;
		}


		case POST_SPOT: {
			let newSpotState = { ...state }
			console.log("🚀 ~ file: spot.js:293 ~ spotsReducer ~ newSpotState:", newSpotState)
			let newSpot = { ...action.spotData, SpotImages: [], Owner: {} }
			console.log("🚀 ~ file: spot.js:295 ~ spotsReducer ~ newSpot:", newSpot)
			newSpotState[action.spotData.id] = { ...state[action.spotData.id], ...newSpot }
			return newSpotState;
		}

		case ADD_IMAGE: {
			console.log("%c initialState (case of ADD_IMAGE): ", "color: cyan; font-size: 30px", initialState)
			// adding images, need new ref in memory
			let spotImageState = { ...state };
			console.log("🚀 ~ file: spot.js:278 ~ spotsReducer ~ spotState:", spotImageState)
			//need to manipulate copied state to add fetched image to previewImage of spot
			let spot = spotImageState[action.spotData.id];
			console.log("%c WHAT IS THE ACTION IN ADD_IMAGE?: ", "color: white; font-size: 25px", action);
			console.log("🚀 ~ file: spot.js:286 ~ spotsReducer ~ spot:", spot)

			if (action.image.preview === true) {
				spot.previewImage = action.image.url
			}

			spotImageState[action.spotData.id] = { ...state[action.spotData.id], ...spot }

			return spotImageState;
		}

		default:
			return state;
	}

}


export default spotsReducer;
