import { SET_STORE, SET_RUNNING_ACCOUNTS } from "./actions";

var storeState = {
	store: null,
	accounts: null,
};

export function storeReducer(state = storeState, action) {
	switch (action.type) {
		case SET_STORE:
			return { ...state, store: action.payload };
		case SET_RUNNING_ACCOUNTS:
			return { ...state, accounts: action.payload };
		default:
			return state;
	}
}
