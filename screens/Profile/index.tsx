import React, { useState, useEffect, useContext } from "react";
import {
	View,
	Linking,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";

import { Fontisto, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import {
	CommonStyles,
	LoadingContainer,
} from "../../components/Common/Elements";
import DisplayImg from "../../components/DisplayImg";
import { Text, BoldText } from "../../components/Common/Themed";
import DynamicStatusBar from "../../components/Common/StatusBar";

import Colors from "../../constants/Colors";
import { HELP_URL } from "../../constants/Urls";

import { AuthContext } from "../../context/auth";
import useColorScheme from "../../hooks/useColorScheme";

import {
	setICart,
	setStore,
	setAskPin,
	setInventory,
	setRunningAccounts,
} from "../../redux/actions";

import { RootTabScreenProps } from "../../types";
import { useQuery } from "@apollo/client";
import {
	FETCH_RUNNINGACCOUNTS,
	GET_ACCOUNTS_UPDATE,
} from "../../graphql/accountdefs";

export default function ProfileScreen({
	navigation,
}: RootTabScreenProps<"ProfileScreen">) {
	// credentials and logout function
	const { logout }: any = useContext(AuthContext);

	const colorScheme = useColorScheme();

	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState<object | any>(null);

	const { user } = useSelector((state: any) => state.userReducer);
	const { store } = useSelector((state: any) => state.storeReducer);

	const dispatch = useDispatch();

	// set user data when available
	useEffect(() => {
		user && setUserData(user);
	}, [user]);

	const {
		loading: fetchingRunningAccounts,
		subscribeToMore,
		refetch,
	} = useQuery(FETCH_RUNNINGACCOUNTS, {
		notifyOnNetworkStatusChange: true,
		onCompleted(data) {
			dispatch(setRunningAccounts(data.fetchRunningAccounts));
		},
	});

	useEffect(() => {
		const unsubscribe = subscribeToMore({
			document: GET_ACCOUNTS_UPDATE,
			variables: { contact: user?.contact, storeId: store?.id },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const updatedQueryData = subscriptionData.data.accountsUpdate;
				const index = prev.fetchRunningAccounts.findIndex(
					(e: any) => e.data.id === updatedQueryData.data.id
				);

				var updatedAccounts = [];

				if (index <= -1) {
					updatedAccounts = [
						updatedQueryData,
						...prev.fetchRunningAccounts,
					];
				} else {
					var prevAccounts = [...prev.fetchRunningAccounts];
					prevAccounts.splice(index, 1);
					updatedAccounts = [updatedQueryData, ...prevAccounts];
				}

				dispatch(setRunningAccounts(updatedAccounts));
				return Object.assign({}, prev, {
					fetchRunningAccounts: updatedAccounts,
				});
			},
		});

		return unsubscribe;
	}, [user, store]);

	// bye
	function handleLogout() {
		setLoading(true);
		dispatch(setAskPin(true));
		dispatch(setStore(null));
		dispatch(setRunningAccounts(null));
		dispatch(setICart([]));
		dispatch(setInventory(null));
		setLoading(false);
		logout();
		// navigation.navigate("Login");
	}

	// openHelpUrl
	function handleOpenHelpUrl() {
		Linking.canOpenURL(HELP_URL)
			.then(() => {
				Linking.openURL(HELP_URL).catch((err) =>
					console.log(`Error Occured: ${err}`)
				);
			})
			.catch((err) => console.log(`Error Occured: ${err}`));
	}

	return userData ? (
		<>
			<DynamicStatusBar />
			{loading && (
				<View
					style={{
						...CommonStyles.loadingContainer,
						width: "100%",
						height: "100%",
						position: "absolute",
						zIndex: 9999,
						backgroundColor: "#11111199",
					}}
				>
					<ActivityIndicator color="#fff" size="large" />
				</View>
			)}
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<BoldText style={CommonStyles.title}>Profile</BoldText>
						<TouchableOpacity
							style={styles.logoutBtn}
							onPress={handleLogout}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator
									color="#1ea472"
									size="large"
								/>
							) : (
								<Ionicons
									name="log-out-outline"
									size={25}
									color={Colors[colorScheme].placeholder}
								/>
							)}
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						style={styles.profilePictureImgContainer}
						activeOpacity={0.8}
					>
						<DisplayImg name={userData.name} />
					</TouchableOpacity>
					<Text
						style={{
							...styles.profileName,
							color: Colors[colorScheme].text,
						}}
					>
						{userData.name}
					</Text>

					<View style={styles.settingTiles}>
						<TouchableOpacity
							style={styles.settingTile}
							onPress={() =>
								navigation.navigate("ManageInformation")
							}
						>
							<Ionicons
								name="settings-outline"
								color={Colors[colorScheme].placeholder}
								size={22}
							/>
							<Text style={styles.settingTileText}>
								Profile Information
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.settingTile}
							onPress={() => navigation.navigate("ManagePayment")}
						>
							<Ionicons
								name="cash-outline"
								size={22}
								color={Colors[colorScheme].placeholder}
							/>
							<Text style={styles.settingTileText}>
								Payment Settings
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.settingTile}
							onPress={() => navigation.navigate("EditStore")}
						>
							<Fontisto
								name="shopping-store"
								size={18}
								color={Colors[colorScheme].placeholder}
							/>
							<Text style={styles.settingTileText}>
								Edit Store
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.settingTile}
							onPress={() => navigation.navigate("Accounts")}
						>
							<Ionicons
								name="people-outline"
								size={18}
								color={Colors[colorScheme].placeholder}
							/>
							<Text style={styles.settingTileText}>
								View Accounts
							</Text>
						</TouchableOpacity>

						{/* TODO: Access Pin feature */}
						{/* {store && (
							<TouchableOpacity
								style={styles.settingTile}
								onPress={() => navigation.navigate("EditPin")}
							>
								<Ionicons
									name="keypad"
									size={18}
									color={Colors[colorScheme].placeholder}
								/>
								<Text style={styles.settingTileText}>
									Access Pin
								</Text>
							</TouchableOpacity>
						)} */}

						<TouchableOpacity
							style={styles.settingTile}
							onPress={() => navigation.navigate("Summaries")}
						>
							<Ionicons
								name="keypad"
								size={18}
								color={Colors[colorScheme].placeholder}
							/>
							<Text style={styles.settingTileText}>
								Summaries
							</Text>
						</TouchableOpacity>

						{/* <TouchableOpacity
							style={styles.settingTile}
							onPress={() => handleOpenHelpUrl()}
						>
							<Ionicons
								name="information-circle-outline"
								size={22}
								color={Colors[colorScheme].placeholder}
							/>
							<Text style={styles.settingTileText}>Help</Text>
						</TouchableOpacity> */}
					</View>
				</View>
				<TouchableOpacity>
					<Text style={styles.urlText}>
						Read Terms &amp; Conditions
					</Text>
				</TouchableOpacity>
			</View>
		</>
	) : (
		<LoadingContainer />
	);
}

const styles = StyleSheet.create({
	profilePictureImgContainer: {
		height: 160,
		width: 160,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#111",
		borderRadius: 200,
		overflow: "hidden",
		marginBottom: 10,
	},
	settingTiles: {
		flexDirection: "column",
		marginTop: 20,
		width: "100%",
	},
	settingTile: {
		width: "100%",
		marginBottom: 10,
		borderRadius: 5,
		backgroundColor: "#1ea47211",
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
	},
	profileName: {
		color: "#111",
		fontSize: 20,
	},
	logoutBtn: {
		borderRadius: 5,
		flexDirection: "row",
		alignItems: "center",
	},
	urlText: {
		fontSize: 12,
		color: "#555",
		textDecorationLine: "underline",
		marginVertical: 10,
	},
	settingTileText: {
		marginLeft: 10,
		fontSize: 16,
	},
	khataRow: {
		width: "100%",
		padding: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});
