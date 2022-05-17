import { gql } from "@apollo/client";

export const FETCH_TODAYSTAT = gql`
	query Query {
		getTodayStats {
			total_amount
			count
			error
			errorMessage
		}
	}
`;

export const FETCH_ALLSTAT = gql`
	query GetAllStats {
		getAllStats {
			data {
				revenue {
					value
					increase
					percentage
					month {
						day
						value
					}
				}
				payments {
					total
					modes {
						Khata
						Online
						Cash
						Card
						Store
					}
				}
				count {
					value
					increase
					percentage
					month {
						day
						value
					}
				}
			}
			error
			errorMessage
		}
	}
`;
