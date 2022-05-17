import { gql } from "@apollo/client";

const INVENTORY_FRAGMENT = gql`
	fragment InventoryDetails on Inventory {
		id
		storeId
		products {
			id
			price {
				mrp
				sale
			}
			vendor {
				contact {
					ISD
					number
				}
				name
			}
			itemQuantity
		}
	}
`;

export const GET_INVENTORY = gql`
	query Query {
		getInventory {
			id
			storeId
			products {
				id
				name
				price {
					mrp
					sale
				}
				vendor {
					contact {
						ISD
						number
					}
					name
				}
				itemQuantity
			}
		}
	}
`;

export const INVENTORY_STATUS = gql`
	subscription Subscription($id: String!) {
		inventoryStatus(id: $id) {
			id
			storeId
			products {
				id
				name
				price {
					mrp
					sale
				}
				vendor {
					contact {
						ISD
						number
					}
					name
				}
				itemQuantity
			}
		}
	}
`;

export const CREATE_INVENTORY = gql`
	mutation CreateInventory($createInventoryInput: CreateInventoryInput) {
		createInventory(createInventoryInput: $createInventoryInput) {
			id
		}
	}
`;

export const ADD_TO_INVENTORY = gql`
	mutation Mutation(
		$storeId: String!
		$inventoryProductInput: InventoryProductInput
	) {
		addToInventory(
			storeId: $storeId
			inventoryProductInput: $inventoryProductInput
		)
	}
`;

export const ADD_PRODUCTS_TO_INVENTORY = gql`
	mutation Mutation($storeId: String!, $products: String!) {
		addFromCollection(storeId: $storeId, products: $products)
	}
`;

export const GET_PRODUCT_FROM_INVENTORY = gql`
	query GetProductFromInventory(
		$barcode: String!
		$storeId: String!
		$productId: String!
	) {
		getProductFromInventory(
			barcode: $barcode
			storeId: $storeId
			productId: $productId
		) {
			id
			brand
			name
			imageUrl
			vendor {
				contact {
					number
					ISD
				}
				name
			}
			price {
				mrp
				sale
			}
			itemQuantity
			quantity {
				count
				type
			}
		}
	}
`;
