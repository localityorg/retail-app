export const getCount = (cart: any, item: any) => {
	return cart.length > 0
		? cart.find((e: any) => e.id === item.id)?.itemQuantity
		: 0 || 0;
};
