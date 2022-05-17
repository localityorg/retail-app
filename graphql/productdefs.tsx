import { gql } from "@apollo/client";

const PRODUCT_FRAGMENT = gql`
	fragment ProductDetails on Product {
		id
		brand
		name
		skus {
			id
			name
			brand
			price {
				mrp
				sale
			}
			barcode
			imageUrl
			quantity {
				count
				type
			}
		}
	}
`;

export const GET_PRODUCT_INFO = gql`
	query GetProductByBarcode($barcode: String!, $productId: String) {
		getProductByBarcode(barcode: $barcode, productId: $productId) {
			id
			name
			brand
			barcode
			price {
				mrp
				sale
			}
			imageUrl
			quantity {
				count
				type
			}
		}
	}
`;

export const FETCH_PRODUCT_BARCODE = gql`
	query FetchProductByBarcode(
		$barcode: String!
		$storeId: String!
		$productId: String
	) {
		fetchProductByBarcode(
			barcode: $barcode
			storeId: $storeId
			productId: $productId
		) {
			error
			message
			data {
				id
				name
				brand
				price {
					mrp
					sale
				}
				barcode
				imageUrl
				quantity {
					type
					count
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

// TODO: Delete this in final prod release
export const GET_PRODUCT_CATEGORIES = gql`
	query ProductCategories {
		productCategories
	}
`;

export const GET_PRODUCTS_FROM_COLLECTION = gql`
	query getProducts(
		$name: String!
		$category: Boolean!
		$limit: Int!
		$offset: Int!
	) {
		getProducts(
			name: $name
			category: $category
			limit: $limit
			offset: $offset
		) {
			id
			brand
			name
			skus {
				id
				name
				brand
				price {
					mrp
					sale
				}
				barcode
				imageUrl
				quantity {
					count
					type
				}
			}
		}
	}
`;

export const EDIT_PRODUCT_MUTATION = gql`
	mutation EditProductMutation($editProductInput: EditProductInput) {
		editProduct(editProductInput: $editProductInput) {
			error
			message
		}
	}
`;

export const GET_PRODUCTS = gql`
	query GetProductsQuery(
		$name: String!
		$storeId: String!
		$limit: Int!
		$offset: Int!
	) {
		getAllProducts(
			name: $name
			storeId: $storeId
			limit: $limit
			offset: $offset
		) {
			id
			brand
			name
			skus {
				id
				name
				brand
				price {
					mrp
					sale
				}
				barcode
				imageUrl
				quantity {
					count
					type
				}
			}
		}
	}
`;
