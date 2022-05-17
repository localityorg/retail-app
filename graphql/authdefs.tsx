import { gql } from "@apollo/client";

export const TWOFACTOR_AUTH = gql`
	query Query($contact: String!, $newAcc: Boolean!) {
		twoFactorAuth(contact: $contact, newAcc: $newAcc) {
			date
			error
			message
		}
	}
`;

export const CHECK_AUTH = gql`
	query Query($contact: String!, $secureCode: String!) {
		checkAuth(contact: $contact, secureCode: $secureCode) {
			error
			status
			errorMsg
		}
	}
`;

export const SET_ACCESS_PIN = gql`
	mutation Mutation($accessPin: String!) {
		setAccessPin(accessPin: $accessPin)
	}
`;
