const inventoryCheck = (inventory: any, checklimit: string) => {
	var count = 0;
	inventory.forEach((obj: any) => {
		if (parseFloat(obj.itemQuantity) <= parseFloat(checklimit)) {
			count = count + 1;
		}
	});

	return {
		status: count > 0 ? 1 : 0,
		count: count,
	};
};

module.exports.inventoryCheck = inventoryCheck;
