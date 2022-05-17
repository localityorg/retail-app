import { SET_USER, REMOVE_USER, SET_USER_LOCATION } from "./actions";

var userState = {
	user: null,
};

var locationState = {
	location: {},
};

export function userReducer(state = userState, action) {
	switch (action.type) {
		case SET_USER:
			return { ...state, user: action.payload };
		case REMOVE_USER:
			return { ...state, user: {} };
		default:
			return state;
	}
}

export function locationReducer(state = locationState, action) {
	switch (action.type) {
		case SET_USER_LOCATION:
			return { ...state, location: action.payload };
		default:
			return state;
	}
}
