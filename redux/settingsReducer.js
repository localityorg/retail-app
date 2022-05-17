import { SET_ASKPIN, SET_PINSTATE } from "./actions";

var settingsState = {
	settings: {
		askPin: true,
		pinState: false,
	},
};

export function settingsReducer(state = settingsState, action) {
	switch (action.type) {
		case SET_ASKPIN:
			return {
				...state,
				settings: { ...state.settings, askPin: action.payload },
			};
		case SET_PINSTATE:
			return {
				...state,
				settings: { ...state.settings, pinState: action.payload },
			};
		default:
			return state;
	}
}
