import { gql } from "@apollo/client";

const STORE_FRAGMENT = gql`
	fragment StoreDetails on Store {
		id
		name
		vendor {
			vendorName
		}
		address {
			name
			shopNumber
			line1
			line2
			pincode
			coordinates {
				latitude
				longitude
			}
		}
		accessPin
		orders {
			orderId
		}
		local
		licenseNumber
		meta {
			isFlagged
			isVerified
			status
			isEdible
			categoryName
		}
		date
	}
`;

export const GET_STORE = gql`
	${STORE_FRAGMENT}
	query getUserStore {
		getUserStore {
			...StoreDetails
		}
	}
`;

export const STORE_UPDATE = gql`
	${STORE_FRAGMENT}
	subscription StoreUpdate($id: String) {
		storeUpdate(id: $id) {
			...StoreDetails
		}
	}
`;

export const CREATE_STORE = gql`
	${STORE_FRAGMENT}
	mutation Mutation($registerStoreInput: RegisterStoreInput) {
		registerStore(registerStoreInput: $registerStoreInput) {
			...StoreDetails
		}
	}
`;

export const EDIT_STORE = gql`
	mutation Mutation($editStoreInput: RegisterStoreInput) {
		editStore(editStoreInput: $editStoreInput)
	}
`;

export const GET_SUMMARIES = gql`
	query StoreSummary {
		getSummaries {
			monthId
			month
		}
	}
`;

export const CREATE_SUMMARY = gql`
	mutation CreateSummary($monthId: String, $type: String) {
		createSummary(monthId: $monthId, type: $type) {
			error
			message
			monthId
			url
		}
	}
`;
