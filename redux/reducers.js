import {
	DELIVERY_TYPE,
	ADD_TO_CART,
	REMOVE_FROM_CART,
	EMPTY_CART,
	SET_CART,
	SET_USER_LOCATION,
	SET_USER_ORDERS,
	UPDATE_ALL_ORDERS,
	UPDATE_ORDER,
	ACCEPT_ORDER,
	CANCEL_ORDER,
} from "./actions";

var deliveryState = {
	delivery: {},
};

var cartState = {
	tempCart: [],
	cart: [],
};

var userOrderState = {
	userOrders: [],
};

const sortCart = (cart) => {
	var tempArray = [];
	var sortedCart = [];
	cart?.forEach((item) => {
		var i = tempArray.findIndex((x) => x.id == item.id);
		if (i <= -1) {
			tempArray.push(item);
		}
	});

	tempArray.map((obj) => {
		const count = cart.filter((e) => e.id === obj.id).length;

		const totalItemPrice = count * parseFloat(obj.price);
		sortedCart.push({
			...obj,
			itemQuantity: count.toString(),
			totalPrice: totalItemPrice.toString(),
		});
	});
	return sortedCart;
};

function addToCart(fetchedData) {
	const itemToAdd = {
		id: fetchedData.id,
		name: fetchedData.name,
		brand: fetchedData.brand,
		quantity: fetchedData.quantity,
		imageUrl: fetchedData.imageUrl,
		price: fetchedData.price,
	};
	cartState.tempCart.push(itemToAdd);
	const cart = [...cartState.tempCart];
	return sortCart(cart);
}

function removeFromCart(fetchedData) {
	const itemToRemove = fetchedData;
	const cart = [...cartState.tempCart];
	if (cart.filter((e) => e.id === itemToRemove.id) !== []) {
		const indEx = cart.indexOf(itemToRemove);
		cart.splice(indEx, 1);
		cartState.tempCart = cart;
	}
	return sortCart(cart);
}

export function deliveryReducer(state = deliveryState, action) {
	switch (action.type) {
		case DELIVERY_TYPE:
			return { ...state, delivery: action.payload };
		default:
			return state;
	}
}

export function cartReducer(state = cartState, action) {
	switch (action.type) {
		case SET_CART:
			const cartValue = sortCart(action.payload);
			return { ...state, cart: cartValue };
		case ADD_TO_CART:
			const updatedCart = addToCart(action.payload);
			return { ...state, cart: updatedCart };
		case REMOVE_FROM_CART:
			const newItemCart = removeFromCart(action.payload);
			return { ...state, cart: newItemCart };
		case EMPTY_CART:
			// AsyncStorage.setItem("cart", JSON.stringify([]));
			return { ...state, cart: [] };
		default:
			return state;
	}
}

export function ordersReducer(state = userOrderState, action) {
	switch (action.type) {
		case SET_USER_ORDERS:
			return { ...state, userOrders: action.payload };
		case ACCEPT_ORDER:
			const idToAccept = action.payload;

			// array of all orders
			let stateBeforeAccepting = [...state.userOrders];

			const indexOfOrderToAccept = stateBeforeAccepting.findIndex(
				(e) => e.id === idToAccept
			);

			stateBeforeAccepting[indexOfOrderToAccept] = {
				...stateBeforeAccepting[indexOfOrderToAccept],
				state: {
					...stateBeforeAccepting[indexOfOrderToAccept].state,
					isConfirmed: true,
				},
			};

			return { ...state, userOrders: stateBeforeAccepting };
		case CANCEL_ORDER:
			const idToCancel = action.payload;

			let stateAfterCancelling = [...state.userOrders];

			const indexOfOrderToCancel = stateAfterCancelling.findIndex(
				(e) => e.id === idToCancel
			);

			stateAfterCancelling[indexOfOrderToCancel] = {
				...stateAfterCancelling[indexOfOrderToCancel],
				state: {
					...stateAfterCancelling[indexOfOrderToCancel].state,
					isCancelled: true,
				},
			};

			return { ...state, userOrders: stateAfterCancelling };
		case UPDATE_ALL_ORDERS:
			let stateAfterUpdating = [...state.userOrders];
			stateAfterUpdating.push(action.payload);
			return {
				...state,
				userOrders: stateAfterUpdating,
			};
		default:
			return state;
	}
}
