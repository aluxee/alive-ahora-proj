import { csrfFetch } from './csrf';

// action type constants:
const SET_USER_SESSION = '/user/SET_USER_SESSION'

const REMOVE_USER_SESSION = '/user/REMOVE_USER_SESSION'

// action creators

export const fetchUser = (user) => ({

	type: SET_USER_SESSION,
	payload: user
});

export const exitUser = () => ({
	type: REMOVE_USER_SESSION
});

// thunk action creator middleware


// * login/restore:

export const login = (user) => async dispatch => {
	const { credential, password } = user;

	const response = await csrfFetch('/api/session', {
		method: 'POST',
		body: JSON.stringify({
			credential, password
		})
	})


	if (response.ok) {
		const data = await response.json()
		dispatch(fetchUser(data.user))
		return data
	} else {
		const errorResponse = await response.json()
		return errorResponse
	}
}

export const restoreUser = () => async dispatch => {
	const response = await csrfFetch('/api/session')
	const data = await response.json()
	dispatch(fetchUser(data.user));

	return response
}


// * signup

export const signupUser = (user) => async dispatch => {
	const [userName, firstName, lastName, email, password] = user;

	const response = await csrfFetch('/api/users', {
		method: 'POST',
		body: JSON.stringify({
			userName,
			firstName,
			lastName,
			email,
			password
		})
	})

	const data = await response.json()
	dispatch(fetchUser(data.user))
	return response

}


// selectors


// reducers


const initialState = { user: null };
export const sessionReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_USER_SESSION: {
			return { ...state, user: action.payload }
		}
		case REMOVE_USER_SESSION: {
			return { ...state, user: null }
		}
		default:
			return state
	}
}

export default sessionReducer;
