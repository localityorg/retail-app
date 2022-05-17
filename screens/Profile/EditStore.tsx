import React, { useEffect, useState } from "react";
import {
	View,
	Alert,
	Linking,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";

import * as Location from "expo-location";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import MapView, { PROVIDER_DEFAULT, Marker } from "react-native-maps";

import {
	ActionBtn,
	ActionBtnText,
	CommonStyles,
} from "../../components/Common/Elements";
import { BoldText, Text } from "../../components/Common/Themed";
import Input from "../../components/Common/Input";
import DynamicStatusBar from "../../components/Common/StatusBar";
import AddressPicker from "../../components/Store/AddressPicker";

import { setRunningAccounts, setStore } from "../../redux/actions";
import { CREATE_STORE, EDIT_STORE } from "../../graphql/storedefs";

import { TC_URL } from "../../constants/Urls";
import { customMapStyle } from "../../constants/MapStyle";

import useColorScheme from "../../hooks/useColorScheme";

import { RootTabScreenProps } from "../../types";

export default function EditStore({
	navigation,
}: RootTabScreenProps<"EditStore">) {
	// new store location
	const [location, setLocation] = useState<any | null>({
		latitude: "",
		longitude: "",
	});

	const mapWidth = Dimensions.get("window").width * 0.9;
	const mapHeight = Dimensions.get("window").height * 0.45;

	// count of the screen we're on
	// TODO: find a better way to do this
	const [count, setCount] = useState(0);

	// confirm all details and terms & conditions
	const [confirm, setConfirm] = useState(false);

	// good manners, ask for permission
	const [locationPermission, setLocationPermission] = useState<string | null>(
		null
	);

	// when fetching store details, if found store in this local state
	const [storeValues, setStoreValues] = useState({
		name: "",
		shopNumber: "",
		line1: "",
		line2: "",
		pincode: "",
		local: false,
		licenseNumber: "",
	});

	// fetching the store
	const { store } = useSelector((state: any) => state.storeReducer);

	const dispatch = useDispatch();

	const colorScheme = useColorScheme();

	// when fetched, store details are set here
	// useEffect(() => {
	// 	store && setStoreDetails(store);
	// }, [store]);

	// when stored details are available, map them to local state value
	// TODO: find a better way to do this
	useEffect(() => {
		store &&
			setStoreValues({
				name: store?.name,
				shopNumber: store?.address[0].shopNumber,
				line1: store?.address[0].line1,
				line2: store?.address[0].line2,
				pincode: store?.address[0].pincode,
				local: false,
				licenseNumber: store?.licenseNumber,
			});
		store &&
			setLocation({
				latitude: store?.address[0].coordinates.latitude,
				longitude: store?.address[0].coordinates.longitude,
			});
	}, [store]);

	// if store isnt made, create one now
	const [createStore, { data, loading: creatingStore }] = useMutation(
		CREATE_STORE,
		{
			variables: {
				registerStoreInput: { ...storeValues, coordinates: location },
			},
			onCompleted(data) {
				dispatch(setStore(data.registerStore));
				dispatch(setRunningAccounts([]));
				navigation.navigate("Store");
			},
			onError(err) {
				console.log({ ...storeValues, coordinates: location });
			},
		}
	);

	const [editStore, { loading: editingStore }] = useMutation(EDIT_STORE, {
		variables: {
			editStoreInput: { ...storeValues, coordinates: location },
		},
		onCompleted(data) {
			if (data.editStore) {
				navigation.navigate("Store");
			}
		},
		onError(err) {
			console.log(err);
		},
	});

	// good manners
	useEffect(() => {
		askForLocationPermission();
	}, []);

	// init good manners
	const askForLocationPermission = () => {
		(async () => {
			const { status } =
				await Location.requestForegroundPermissionsAsync();

			setLocationPermission(status ? "granted" : "denied");

			if (status === "granted") {
				let location = await Location.getCurrentPositionAsync({});
				setLocation({
					latitude: location.coords.latitude.toString(),
					longitude: location.coords.longitude.toString(),
				});
			}
		})();
	};

	// make the store
	function handleCreateStore() {
		try {
			store ? editStore() : createStore();
		} catch (err) {
			console.log(err);
			Alert.alert(
				"Error occured!",
				"Please check values entered are corrent and try again."
			);
		}
	}

	// keep moving the process
	// TODO: find a better way to do this
	function nextHandler() {
		if (count < 3) {
			setCount(count + 1);
		} else {
			confirm
				? handleCreateStore()
				: Alert.alert(
						"Last step!",
						"You must confirm after going through Terms and Conditions to register your store."
				  );
		}
	}

	// vendor agrees to the terms & conditions
	function confirmAgreement() {
		setConfirm(!confirm);
	}

	// open terms & conditions
	function handleOpenTC() {
		Linking.canOpenURL(TC_URL)
			.then(() => {
				Linking.openURL(TC_URL).catch((err) =>
					console.log(`Error Occured: ${err}`)
				);
			})
			.catch((err) => console.log(`Error Occured: ${err}`));
	}

	if (data?.registerStore) {
		setTimeout(() => navigation.navigate("Store"), 2000);
		return (
			<>
				<DynamicStatusBar />
				<View style={CommonStyles.loadingContainer}>
					<ActivityIndicator color="#1ea472" size="large" />
					<BoldText style={{ fontSize: 20, marginTop: 10 }}>
						Registered successfully.
					</BoldText>
				</View>
			</>
		);
	}

	if (locationPermission !== "granted") {
		return (
			<>
				<DynamicStatusBar />
				<View
					style={{
						...CommonStyles.container,
						backgroundColor: "#171717",
					}}
				>
					<View style={CommonStyles.mainContainer}>
						<View style={CommonStyles.header}>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("ProfileScreen")
								}
							>
								<AntDesign name="back" size={25} color="#fff" />
							</TouchableOpacity>
						</View>
						<View style={CommonStyles.loadingContainer}>
							<BoldText
								style={{ ...CommonStyles.title, color: "#fff" }}
							>
								Location permission denied!
							</BoldText>
							<Text style={{ ...styles.subtitle, color: "#fff" }}>
								Enable location services to continue.
							</Text>
							<TouchableOpacity
								style={styles.refreshLocationBtn}
								onPress={() => askForLocationPermission()}
							>
								<Ionicons
									name="refresh-sharp"
									size={24}
									color="#fff"
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</>
		);
	}

	if (count === 2) {
		return (
			<AddressPicker
				address={storeValues}
				setAddress={setStoreValues}
				loading={false}
				onBack={() => setCount(1)}
				onNext={() => setCount(3)}
				location={location}
				setLocation={setLocation}
			/>
		);
	}

	return (
		<>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={{ ...CommonStyles.mainContainer, width: "100%" }}>
					<View
						style={{
							...CommonStyles.header,
							width: "90%",
							alignSelf: "center",
						}}
					>
						<TouchableOpacity
							onPress={() => navigation.navigate("ProfileScreen")}
						>
							<AntDesign name="back" size={25} color="#222" />
						</TouchableOpacity>
						<View style={CommonStyles.screenTitle}>
							<BoldText style={CommonStyles.title}>
								{store
									? "Edit Store Details"
									: "Add your store"}
							</BoldText>
						</View>
					</View>
					<View style={styles.fieldsContainer}>
						{count === 0 && (
							<View style={styles.screenview}>
								<Input
									title="Name of your Store"
									placeholder="Name of your Store"
									value={storeValues.name}
									onChange={(text: string) =>
										setStoreValues({
											...storeValues,
											name: text,
										})
									}
									autoCorrect={false}
									autoCapitalize="words"
									autoFocus={true}
									error={false}
									errorMessage=""
								/>
								<Text style={styles.fieldText}>
									Store name that you enter has to match with
									the Name of the store in your MSME License.
								</Text>
							</View>
						)}
						{count === 1 && (
							<View style={styles.screenview}>
								<Input
									placeholder="Store's license number"
									maxLength={12}
									value={storeValues.licenseNumber}
									onChange={(text: string) =>
										setStoreValues({
											...storeValues,
											licenseNumber: text,
										})
									}
									keyboardType="numeric"
									autoFocus={true}
									title="License Number"
									error={false}
									errorMessage=""
								/>
								<Text style={styles.fieldText}>
									License Number is used to verify if your
									store is registered with MSME and complies
									with rules of the same. This is kept
									confidential.
									<TouchableOpacity>
										<Text
											style={{
												...styles.fieldText,
												textDecorationLine: "underline",
												marginLeft: 8,
												marginVertical: 0,
											}}
										>
											Read More here.
										</Text>
									</TouchableOpacity>
								</Text>
							</View>
						)}
						{count === 3 && (
							<View style={styles.screenview}>
								<BoldText
									style={{
										...styles.screenViewTitle,
										fontSize: 20,
									}}
								>
									{storeValues.name}
								</BoldText>
								<Text style={styles.storeDetailsText}>
									License Number: {storeValues.licenseNumber}
								</Text>
								<MapView
									initialRegion={{
										latitude: parseFloat(
											location?.latitude
										),
										longitude: parseFloat(
											location?.longitude
										),
										latitudeDelta: 0.0011,
										longitudeDelta: 0.0018,
									}}
									provider={PROVIDER_DEFAULT}
									customMapStyle={customMapStyle}
									style={styles.smallMapStyle}
								>
									{store && (
										<Marker
											coordinate={{
												latitude: parseFloat(
													location?.latitude
												),
												longitude: parseFloat(
													location?.longitude
												),
											}}
										>
											<Ionicons
												name="location-sharp"
												color="#1ea472"
												size={35}
											/>
										</Marker>
									)}
								</MapView>
								<BoldText
									style={{
										...styles.screenViewTitle,
										marginVertical: 10,
									}}
								>
									Address
								</BoldText>
								<Text style={styles.storeDetailsText}>
									{storeValues.line1}
								</Text>
								<Text style={styles.storeDetailsText}>
									{storeValues.line2}
								</Text>
								<Text style={styles.storeDetailsText}>
									Pincode: {storeValues.pincode}
								</Text>

								{/* <TouchableOpacity
									onPress={() => handleOpenTC()}
								>
									<Text
										style={{
											...styles.fieldText,
											textDecorationLine: "underline",
											marginVertical: 0,
											marginTop: 10,
										}}
									>
										Terms, Conditions &amp; Policies
									</Text>
								</TouchableOpacity> */}
								<TouchableOpacity
									style={styles.checkboxContainer}
									onPress={confirmAgreement}
								>
									<Ionicons
										name="checkmark-circle"
										color={confirm ? "#1ea37299" : "#999"}
										size={18}
									/>
									<Text
										style={{
											...styles.checkboxText,
											color: confirm
												? "#1ea37299"
												: "#999",
										}}
									>
										I've read and agree with Terms &amp;
										Conditions.
									</Text>
								</TouchableOpacity>
							</View>
						)}
						{count === 3 && (
							<TouchableOpacity
								style={{ alignSelf: "center" }}
								onPress={() => setCount(0)}
							>
								<Text
									style={{ textDecorationLine: "underline" }}
								>
									Details Incorrect? Edit Again
								</Text>
							</TouchableOpacity>
						)}
						{count !== 2 && (
							<View style={CommonStyles.actionBtnContainer}>
								{creatingStore || editingStore ? (
									<View style={styles.activityInd}>
										<ActivityIndicator color="#1ea472" />
									</View>
								) : (
									<ActionBtn
										onPress={nextHandler}
										disabled={false}
										disable={count < 3 ? true : false}
									>
										<ActionBtnText>
											{count < 3
												? "Next"
												: "Confirm Store Details"}
										</ActionBtnText>
									</ActionBtn>
								)}
							</View>
						)}
					</View>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	screenview: {
		flex: 1,
		width: "90%",
		alignSelf: "center",
		flexDirection: "column",
		marginVertical: 10,
	},
	mapStyle: {
		alignSelf: "center",
		borderRadius: 20,
		overflow: "hidden",
	},
	smallMapStyle: {
		height: "30%",
		width: "100%",
		borderRadius: 20,
		overflow: "hidden",
		marginVertical: 10,
	},
	screenViewTitle: {
		fontSize: 18,
		marginBottom: 5,
	},
	storeDetailsText: {
		fontSize: 18,
	},
	subtitle: {
		fontSize: 25,
	},
	fieldText: {
		color: "#444",
		marginVertical: 10,
	},
	urlText: {
		textDecorationLine: "underline",
		color: "#888",
		marginLeft: 10,
	},
	inputstyle: {
		padding: 10,
		paddingHorizontal: 10,
		fontSize: 20,
		marginVertical: 5,
		borderColor: "#1ea47233",
		borderWidth: 1,
		borderRadius: 10,
	},
	inputstylev2: {
		padding: 10,
		paddingHorizontal: 10,
		fontSize: 20,
		marginVertical: 5,
		borderColor: "#1ea47255",
		borderBottomWidth: 1,
	},
	fieldsContainer: {
		flex: 1,
		width: "100%",
		flexDirection: "column",
	},
	checkboxContainer: {
		width: "100%",
		marginBottom: 5,
		paddingVertical: 10,
		flexDirection: "row",
		alignItems: "center",
	},
	checkboxText: {
		fontSize: 14,
		color: "#999",
		marginLeft: 4,
	},
	activityInd: {
		alignSelf: "center",
		height: 60,
		width: 60,
		alignItems: "center",
		justifyContent: "center",
	},
	refreshLocationBtn: {
		marginVertical: 10,
		borderRadius: 100,
		alignItems: "center",
		justifyContent: "center",
		height: 50,
		width: 50,
		backgroundColor: "#eeeeee55",
	},
	inputSubStyle: {
		flex: 1,
		marginRight: 10,
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#1ea47255",
		fontSize: 16,
	},
	inputStyle: {
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#1ea47255",
		fontSize: 16,
	},
});
