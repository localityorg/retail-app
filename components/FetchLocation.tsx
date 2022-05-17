import React, { useState, useEffect } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

import { View } from "./Common/Themed";
import { setUserLocation } from "../redux/actions";

export default function FetchLocationButton() {
	const dispatch = useDispatch();
	const [location, setLocation] = useState({
		latitude: "",
		longitude: "",
	});
	const [loading, setLoading] = useState(false);

	const [locationPermission, setLocationPermission] = useState<string | null>(
		null
	);
	const { location: locationState } = useSelector(
		(state: any) => state.locationReducer
	);

	const askForLocationPermission = () => {
		setLoading(true);
		(async () => {
			const { status } =
				await Location.requestForegroundPermissionsAsync();

			setLocationPermission(status ? "granted" : "denied");

			if (status === "granted") {
				let aqlocation: any = await Location.getCurrentPositionAsync(
					{}
				);
				setLocation({
					latitude: aqlocation.coords.latitude.toString(),
					longitude: aqlocation.coords.longitude.toString(),
				});
			}
		})();
		setLoading(false);
	};

	useEffect(() => {
		askForLocationPermission();
	}, []);

	useEffect(() => {
		location && dispatch(setUserLocation(location));
	}, [location]);

	useEffect(() => {
		locationState && setLocation(locationState);
	}, [locationState]);

	return locationPermission !== "granted" ? (
		<TouchableOpacity
			onPress={() => askForLocationPermission()}
			disabled={loading}
		>
			{loading ? (
				<ActivityIndicator color="#1ea472" />
			) : (
				<Ionicons name="location-outline" size={20} color="#1ea472" />
			)}
		</TouchableOpacity>
	) : (
		<View />
	);
}
