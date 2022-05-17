// all user
export const SET_USER = "SET_USER";
export const REMOVE_USER = "REMOVE_USER";
export const SET_USER_LOCATION = "SET_USER_LOCATION";

// all user orders
export const SET_USER_ORDERS = "SET_USER_ORDERS";
export const UPDATE_ORDER = "UPDATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const ACCEPT_ORDER = "ACCEPT_ORDER";
export const UPDATE_ALL_ORDERS = "UPDATE_ALL_ORDERS";

// set inventory
export const SET_INVENTORY = "SET_INVENTORY";

// set inventory
export const SET_STORE = "SET_STORE";
export const SET_RUNNING_ACCOUNTS = "SET_RUNNING_ACCOUNTS";
export const EDIT_STORE = "EDIT_STORE";

// icart to update
export const ADD_TO_ICART = "ADD_TO_ICART";
export const REMOVE_FROM_ICART = "REMOVE_FROM_ICART";
export const DELETE_FROM_ICART = "DELETE_FROM_ICART";
export const SET_ITEM_QUANTITY = "SET_ITEM_QUANTITY";
export const EMPTY_ICART = "EMPTY_ICART";
export const SET_ICART = "SET_ICART";

// settings
export const SET_ASKPIN = "SET_ASKPIN";
export const SET_PINSTATE = "SET_PINSTATE";

export const setUser = (user) => (dispatch) => {
	dispatch({
		type: SET_USER,
		payload: user,
	});
};

export const setUserLocation = (location) => (dispatch) => {
	dispatch({
		type: SET_USER_LOCATION,
		payload: location,
	});
};

export const removeUser = (user) => (dispatch) => {
	dispatch({
		type: REMOVE_USER,
		payload: user,
	});
};

export const setUserOrders = (orders) => (dispatch) => {
	dispatch({
		type: SET_USER_ORDERS,
		payload: orders,
	});
};

export const updateOrder = (fields) => (dispatch) => {
	dispatch({
		type: UPDATE_ORDER,
		payload: fields,
	});
};

export const acceptOrder = (order) => (dispatch) => {
	dispatch({
		type: ACCEPT_ORDER,
		payload: order,
	});
};
export const cancelOrder = (order) => (dispatch) => {
	dispatch({
		type: CANCEL_ORDER,
		payload: order,
	});
};

export const updateAllOrders = (newOrder) => (dispatch) => {
	dispatch({
		type: UPDATE_ALL_ORDERS,
		payload: newOrder,
	});
};

export const setInventory = (inventory) => (dispatch) => {
	dispatch({
		type: SET_INVENTORY,
		payload: inventory,
	});
};

export const setICart = (cart) => (dispatch) => {
	dispatch({
		type: SET_ICART,
		payload: cart,
	});
};

export const addToICart = (itemToAdd) => (dispatch) => {
	dispatch({
		type: ADD_TO_ICART,
		payload: itemToAdd,
	});
};

export const removeFromICart = (itemToRemove) => (dispatch) => {
	dispatch({
		type: REMOVE_FROM_ICART,
		payload: itemToRemove,
	});
};

export const deleteFromICart = (itemToDelete) => (dispatch) => {
	dispatch({
		type: DELETE_FROM_ICART,
		payload: itemToDelete,
	});
};

export const setItemQuantity = (item) => (dispatch) => {
	dispatch({
		type: SET_ITEM_QUANTITY,
		payload: item,
	});
};

export const emptyICart = (cart) => (dispatch) => {
	dispatch({
		type: EMPTY_ICART,
		payload: cart,
	});
};

export const setStore = (store) => (dispatch) => {
	dispatch({
		type: SET_STORE,
		payload: store,
	});
};

export const setRunningAccounts = (runningAccounts) => (dispatch) => {
	dispatch({
		type: SET_RUNNING_ACCOUNTS,
		payload: runningAccounts,
	});
};

export const editStore = (store) => (dispatch) => {
	dispatch({
		type: EDIT_STORE,
		payload: store,
	});
};

export const setAskPin = (bool) => (dispatch) => {
	dispatch({
		type: SET_ASKPIN,
		payload: bool,
	});
};

export const setPinState = (state) => (dispatch) => {
	dispatch({
		type: SET_PINSTATE,
		payload: state,
	});
};
