import { gql } from "@apollo/client";

const USER_FRAGMENT = gql`
	fragment UserDetails on User {
		id
		vendor
		name
		contact {
			ISD
			number
		}
		upiAddress
		token
		refreshToken
	}
`;

export const REGISTER_USER = gql`
	${USER_FRAGMENT}
	mutation register(
		$name: String!
		$ISD: String!
		$number: String!
		$vendor: Boolean!
		$coordinates: CoordinateInput
	) {
		register(
			registerInput: {
				name: $name
				ISD: $ISD
				number: $number
				vendor: $vendor
				coordinates: $coordinates
			}
		) {
			...UserDetails
		}
	}
`;

export const LOGIN_USER = gql`
	${USER_FRAGMENT}

	mutation login($contact: String!) {
		login(contact: $contact) {
			...UserDetails
		}
	}
`;

export const EDIT_PROFILE = gql`
	mutation Mutation($editProfileInput: EditProfileInput) {
		editProfile(editProfileInput: $editProfileInput)
	}
`;

export const SET_ADDRESS = gql`
	mutation Mutation($address: String!) {
		editUpi(address: $address)
	}
`;

export const DELETE_ACCOUNT = gql`
	mutation DeleteAccount {
		deleteAccount
	}
`;
