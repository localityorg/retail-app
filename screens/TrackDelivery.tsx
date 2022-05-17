import React, { useEffect, useState } from "react";
import { StyleSheet, StatusBar, View, TouchableOpacity } from "react-native";

import * as Location from "expo-location";
import {
	Ionicons,
	MaterialCommunityIcons,
	AntDesign,
} from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

import { BoldText, Text } from "../components/Common/Themed";

import { customMapStyle, darkMapStyle } from "../constants/MapStyle";

import { RootTabScreenProps } from "../types";

export default function TrackDelivery({
	navigation,
}: RootTabScreenProps<"TrackDelivery">) {
	const [userLocation, setUserLocation] = useState<object | any>(null);
	const [locationPermission, setLocationPermission] = useState<string | null>(
		null
	);
	const [rating, setRating] = useState(0);

	const askForLocationPermission = () => {
		(async () => {
			const { status } =
				await Location.requestForegroundPermissionsAsync();

			setLocationPermission(status ? "granted" : "denied");

			if (status === "granted") {
				let location = await Location.getCurrentPositionAsync({});
				setUserLocation(location.coords);
			}
		})();
	};

	useEffect(() => {
		askForLocationPermission();
	}, []);

	if (locationPermission === null) {
		return (
			<View style={styles.container}>
				<View style={styles.mainContainer}>
					<BoldText style={styles.title}>
						Requesting location permissions to track delivery.
					</BoldText>
				</View>
			</View>
		);
	}

	return (
		<>
			<StatusBar barStyle="dark-content" backgroundColor="#fff" />
			<View style={styles.container}>
				<View style={styles.mainContainer}>
					<View style={styles.header}>
						<TouchableOpacity
							onPress={() => navigation.navigate("Store")}
						>
							<AntDesign name="back" size={25} color="#222" />
						</TouchableOpacity>
						<View style={styles.screenTitle}>
							<BoldText style={styles.title}>
								Track Delivery
							</BoldText>
						</View>
					</View>
					{userLocation && (
						<View style={styles.mapStyle}>
							<MapView
								initialRegion={{
									latitude: userLocation?.latitude,
									longitude: userLocation?.longitude,
									latitudeDelta: 0.0011,
									longitudeDelta: 0.0018,
								}}
								provider={PROVIDER_DEFAULT}
								customMapStyle={darkMapStyle}
								style={{ flex: 1 }}
							/>
						</View>
					)}

					<TouchableOpacity
						style={styles.trackActionBtn}
						onPress={() => navigation.navigate("Order")}
						activeOpacity={0.8}
					>
						<View style={styles.trackActionBtnProgress}></View>
						<MaterialCommunityIcons
							color="#ddd"
							name="quadcopter"
							size={20}
						/>
						<View style={styles.trackActionBtnTextContainer}>
							<Text style={styles.trackActionBtnText}>
								View Your Order
							</Text>
							<Text style={styles.trackActionBtnText2}>
								Id: #LOCa3t74
							</Text>
						</View>
						<Ionicons
							name="chevron-forward-outline"
							size={25}
							color="white"
						/>
					</TouchableOpacity>
					<View style={styles.deliveryContainer}>
						<View style={styles.delivery}>
							<Text style={styles.deliverytitle}>
								Delivery Time
							</Text>
							<Text style={styles.deliverytime}>20 mins</Text>
						</View>
					</View>
					<View style={styles.deliveryContainer}>
						<Text style={styles.deliverytitle}>
							Delivery Rating
						</Text>
						<View style={styles.ratings}>
							{[1, 2, 3, 4, 5].map((obj) => (
								<TouchableOpacity
									key={obj}
									onPress={() => setRating(obj)}
								>
									<Ionicons
										name={
											obj <= rating
												? "star"
												: "star-outline"
										}
										size={25}
										color={
											obj <= rating
												? "#ffcc00"
												: "#cfbebe"
										}
									/>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</View>
				<View style={styles.statusBarContainer}>
					<View style={styles.statusBar}>
						<Text style={styles.statusText}>Delivery Status</Text>
						<Text style={styles.status}>On The Way</Text>
					</View>
					<View style={styles.statusBar}>
						<Text style={styles.statusText}>Actions</Text>
						<View style={styles.statusActions}>
							<TouchableOpacity style={styles.action}>
								<Ionicons name="call-outline" size={20} />
							</TouchableOpacity>

							<TouchableOpacity style={styles.action}>
								<Ionicons name="close-outline" size={25} />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#fff",
		marginTop: StatusBar.currentHeight,
	},
	mainContainer: {
		flex: 1,
		alignSelf: "center",
		width: "90%",
	},
	statusBarContainer: {
		alignSelf: "center",
		width: "90%",
		flexDirection: "column",
		marginBottom: 10,
	},
	statusBar: {
		marginBottom: 10,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	header: {
		width: "100%",
		height: 70,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	screenTitle: {
		marginBottom: 10,
	},
	title: {
		fontSize: 30,
	},
	mapStyle: {
		height: "50%",
		width: "100%",
		borderRadius: 20,
		overflow: "hidden",
	},
	statusText: {
		fontSize: 18,
	},
	status: {
		fontSize: 18,
		padding: 10,
		backgroundColor: "#ffcc00",
		borderRadius: 10,
	},
	statusActions: {
		flexDirection: "row",
		alignItems: "center",
	},
	action: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f5f5f5",
		marginLeft: 10,
		padding: 10,
		borderRadius: 10,
	},

	trackActionBtn: {
		position: "absolute",
		bottom: 0,
		zIndex: 1,
		height: 60,
		width: "100%",
		backgroundColor: "#17171755",
		borderRadius: 10,
		marginBottom: 20,
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
	},
	trackActionBtnProgress: {
		position: "absolute",
		bottom: 0,
		width: "50%",
		height: 60,
		backgroundColor: "#171717dd",
		borderRadius: 10,
		padding: 10,
	},
	trackActionBtnTextContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "flex-start",
		marginLeft: 10,
	},
	trackActionBtnText: {
		fontSize: 12,
		color: "#eee",
	},
	trackActionBtnText2: {
		fontSize: 16,
		color: "#eee",
	},
	deliveryContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	delivery: {
		alignSelf: "flex-end",
		marginLeft: "auto",
		flexDirection: "column",
		alignItems: "center",
		marginVertical: 5,
	},
	deliverytitle: {
		fontSize: 14,
	},
	deliverytime: {
		fontSize: 25,
	},
	ratings: {
		flexDirection: "row",
		alignItems: "center",
	},
});
