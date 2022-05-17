import { gql } from "@apollo/client";

export const ADD_RUNNING_ACCOUNT = gql`
	mutation Mutation($addToRunningAccountInput: RunningStoreInput) {
		addToRunningAccount(addToRunningAccountInput: $addToRunningAccountInput)
	}
`;

export const CLOSE_RUNNING_ACCOUNT = gql`
	mutation Mutation(
		$id: String!
		$transactionId: String
		$transactionType: String!
	) {
		closeRunningAccount(
			id: $id
			transactionId: $transactionId
			transactionType: $transactionType
		)
	}
`;

export const FETCH_DETAILS = gql`
	query FetchAccountDetails($id: String) {
		fetchRunningAccount(id: $id) {
			data {
				address {
					line1
					line2
				}
				contact {
					ISD
					number
				}
			}
			error
			message
		}
	}
`;

export const FETCH_ORDER_PRODUCTS = gql`
	query OrderProducts($orderId: String!) {
		getOrder(orderId: $orderId) {
			products {
				id
				brand
				name
				totalPrice
				imageUrl
				itemQuantity
				quantity {
					count
					type
				}
			}
		}
	}
`;

export const SEND_CLOSING_REQUEST = gql`
	query SendRequest($id: String) {
		sendClosingRequest(id: $id) {
			error
			message
		}
	}
`;

export const EDIT_RUNNING_ACCOUNT_AMOUNT = gql`
	mutation EditRunningAccountAmount($amount: String!, $id: String!) {
		editRunningAmount(amount: $amount, id: $id)
	}
`;

const ACCOUNTS_FRAGMENT = gql`
	fragment AccountDetail on UserAccounts {
		data {
			id
			name
			closed
			totalAmount
			settledAmount
			orders {
				orderId
				amount
				paid
			}
			address {
				line1
				line2
			}
			private
		}
	}
`;

export const GET_ACCOUNTS_UPDATE = gql`
	subscription Subscription($contact: ContactInput, $storeId: String) {
		accountsUpdate(contact: $contact, storeId: $storeId) {
			data {
				id
				name
				closed
				totalAmount
				settledAmount
				orders {
					orderId
					amount
					paid
				}
				address {
					line1
					line2
				}
				private
			}
		}
	}
`;

export const FETCH_RUNNINGACCOUNTS = gql`
	query FetchAccounts {
		fetchRunningAccounts {
			data {
				id
				name
				closed
				totalAmount
				settledAmount
				orders {
					orderId
					amount
					paid
				}
				address {
					line1
					line2
				}
				private
			}
		}
	}
`;
