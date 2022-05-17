module.exports.compressedArray = (arr: any) => {
	var tempArr: any[] = [];
	var sortedArr: any[] = [];

	arr?.forEach((item: any) => {
		var i = tempArr.findIndex((x: any) => x.id == item.id);
		if (i <= -1) {
			tempArr.push(item);
		}
	});

	tempArr.map((obj: any) => {
		const count = arr.filter((e: any) => e.id === obj.id).length;

		const totalItemPrice = count * parseFloat(obj.price.mrp);

		sortedArr.push({
			...obj,
			itemQuantity: count.toString(),
			totalPrice: totalItemPrice.toString(),
		});
	});

	return sortedArr;
};
