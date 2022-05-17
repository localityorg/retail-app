import {
	ADD_TO_ICART,
	REMOVE_FROM_ICART,
	EMPTY_ICART,
	SET_ICART,
	DELETE_FROM_ICART,
	SET_ITEM_QUANTITY,
	SET_INVENTORY,
} from "./actions";
import { compressedArray } from "../util/sorts";

var inventoryState = {
	inventory: null,
};

var cartState = {
	tempCart: [],
	cart: [],
	toAdd: [],
};

const editQuantity = (cart, product, quantity) => {
	const sortedCart = [...cart];
	const toActProduct = cart?.find((item) => {
		item.id === product.id;
	});
	const index = cart.indexOf((e) => e.id === product.id);
	sortedCart.splice(index, 1);

	const totalPrice = (
		(parseFloat(quantity) / parseFloat(product.quantity.count)) *
		parseFloat(product.price.mrp)
	).toFixed(2);

	const editedProduct = {
		...toActProduct,
		itemQuantity: quantity,
		totalPrice: totalPrice,
	};
	[editedProduct].concat(sortedCart);

	return sortedCart;
};

function addToCart(fetchedData) {
	const itemToAdd = {
		id: fetchedData.id,
		barcode: fetchedData.barcode,
		name: fetchedData.name,
		brand: fetchedData.brand,
		quantity: fetchedData.quantity,
		price: fetchedData.price,
	};
	cartState.tempCart.push(itemToAdd);
	const cart = [...cartState.tempCart];
	return compressedArray(cart);
}

function removeFromCart(fetchedData) {
	const cart = [...cartState.tempCart];
	if (cart.find((e) => e.id === fetchedData.id) !== undefined) {
		const indEx = cart.findIndex((e) => e.id === fetchedData.id);
		cart.splice(indEx, 1);
		cartState.tempCart = cart;
	}
	return compressedArray(cart);
}

function deleteFromCart(fetchedData) {
	const cart = [...cartState.cart];
	if (cart.find((e) => e.id === fetchedData.id) !== undefined) {
		const indEx = cart.findIndex((e) => e.id === fetchedData.id);
		cart.splice(indEx, 1);
		cartState.tempCart = cart;
	}
	return compressedArray(cart);
}

function emptyCart() {
	cartState.tempCart = [];
	return true;
}

export function iCartReducer(state = cartState, action) {
	switch (action.type) {
		case SET_ICART:
			const cartValue = compressedArray(action.payload);
			return { ...state, cart: cartValue };
		case ADD_TO_ICART:
			const updatedCart = addToCart(action.payload);
			return { ...state, cart: updatedCart };
		case REMOVE_FROM_ICART:
			const newItemCart = removeFromCart(action.payload);
			return { ...state, cart: newItemCart };
		case SET_ITEM_QUANTITY:
			const editedCart = editQuantity(
				state.cart,
				action.payload.product,
				action.payload.quantity
			);
			return { ...state, cart: editedCart };
		case DELETE_FROM_ICART:
			const deletedItemCart = deleteFromCart(action.payload);
			return { ...state, cart: deletedItemCart };
		case EMPTY_ICART:
			emptyCart();
			return { ...state, cart: action.payload };
		default:
			return state;
	}
}

export function inventoryReducer(state = inventoryState, action) {
	switch (action.type) {
		case SET_INVENTORY:
			return { ...state, inventory: action.payload };
		default:
			return state;
	}
}
