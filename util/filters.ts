interface FilterOrdersProps {
	orders: any;
	filter: any;
}

module.exports.filterOrders = (props: FilterOrdersProps) => {
	var data: any = [];

	if (props.filter.id === 19349) {
		return props.orders;
	} else if (props.filter.id === 19345) {
		data = props.orders.filter((e: any) => e.delivery.isDelivered === true);
	} else if (props.filter.id === 19348) {
		data = props.orders.filter((e: any) => e.state.isConfirmed === false);
	} else if (props.filter.id === 19347) {
		data = props.orders.filter((e: any) => e.state.isConfirmed === true);
	} else if (props.filter.id === 19346) {
		data = props.orders.filter((e: any) => e.state.isCancelled === true);
	}

	return data;
};
