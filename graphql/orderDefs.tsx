import { gql } from "@apollo/client";

const ORDER_FRAGMENT = gql`
	fragment OrderDetails on Order {
		id
		meta {
			isLinked
			linkedOrder
		}
		payment {
			paid
			transactionType
			isRefund
			deliveryAmount
			grandTotal
			totalAmount
		}
		products {
			id
			brand
			name
			totalPrice
			imageUrl
			quantity {
				count
				type
			}
			itemQuantity
		}
		linkedOrders {
			orderId
		}
		state {
			isConfirmed
			isReturned
			isCancelled
		}
		rating
		delivery {
			isDelivered
			deliveryDate
			deliverBy
			isDelivery
			deliveryAddress {
				line1
				line2
			}
			isDispatched
			dispatchDate
		}
		error {
			isError
			message
		}
		date
	}
`;

export const CREATE_ORDER = gql`
	mutation CreateNewOrderMutation($createOrderInput: CreateOrderInput) {
		createNewOrder(createOrderInput: $createOrderInput) {
			id
		}
	}
`;

export const GET_ORDERS = gql`
	query Query {
		getOrders {
			id
			meta {
				isLinked
				linkedOrder
			}
			payment {
				paid
				transactionType
				isRefund
				deliveryAmount
				grandTotal
				totalAmount
			}
			products {
				id
				brand
				name
				totalPrice
				imageUrl
				quantity {
					count
					type
				}
				itemQuantity
			}
			linkedOrders {
				orderId
			}
			state {
				isConfirmed
				isReturned
				isCancelled
			}
			rating
			delivery {
				isDelivered
				deliveryDate
				deliverBy
				isDelivery
				deliveryAddress {
					line1
					line2
				}
				isDispatched
				dispatchDate
			}
			error {
				isError
				message
			}
			date
		}
	}
`;

export const GET_NEW_ORDER = gql`
	subscription Subscription($id: String!) {
		newOrder(id: $id) {
			id
			meta {
				isLinked
				linkedOrder
			}
			payment {
				paid
				transactionType
				isRefund
				deliveryAmount
				grandTotal
				totalAmount
			}
			products {
				id
				brand
				name
				totalPrice
				imageUrl
				quantity {
					count
					type
				}
				itemQuantity
			}
			linkedOrders {
				orderId
			}
			state {
				isConfirmed
				isReturned
				isCancelled
			}
			rating
			delivery {
				isDelivered
				deliveryDate
				deliverBy
				isDelivery
				deliveryAddress {
					line1
					line2
				}
				isDispatched
				dispatchDate
			}
			error {
				isError
				message
			}
			date
		}
	}
`;

export const DISPATCH_ORDER = gql`
	mutation Mutation($orderId: String!) {
		dispatchOrder(orderId: $orderId)
	}
`;

export const DELIVERED_ORDER = gql`
	mutation Mutation($orderId: String!, $coordinates: CoordinateInput) {
		deliveredOrder(orderId: $orderId, coordinates: $coordinates)
	}
`;

export const CANCEL_ORDER = gql`
	mutation Mutation($orderId: String!) {
		cancelOrder(orderId: $orderId)
	}
`;

export const GET_PAYMENT_OPTIONS = gql`
	query PaymentOptions {
		getPaymentOptions {
			title
			subtext
			data {
				mode
				uri
				uri1
				type
				pre
				text
				active
			}
		}
	}
`;
