import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { deliveryReducer, cartReducer, ordersReducer } from "./reducers";

import { inventoryReducer, iCartReducer } from "./inventoryReducer";
import { userReducer, locationReducer } from "./userReducer";
import { storeReducer } from "./storeReducer";
import { settingsReducer } from "./settingsReducer";

const rootReducer = combineReducers({
	deliveryReducer,
	cartReducer,
	locationReducer,
	ordersReducer,
	inventoryReducer,
	iCartReducer,
	userReducer,
	storeReducer,
	settingsReducer,
});

export const Store = createStore(rootReducer, applyMiddleware(thunk));
