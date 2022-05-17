import React, { useEffect, useState } from "react";

import * as Location from "expo-location";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

import { customMapStyle } from "../../constants/MapStyle";
import { BoldText, Text, View } from "../Common/Themed";
import { ActionBtn, ActionBtnText, CommonStyles } from "../Common/Elements";
import DynamicStatusBar from "../Common/StatusBar";
import {
	Dimensions,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import {
	AntDesign,
	Ionicons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import Input from "../Common/Input";
import { validateStoreAddressInput } from "../../util/validators";
import { useSelector } from "react-redux";

interface PickerProps {
	onBack: any;
	address: any;
	setAddress: any;
	location: any;
	setLocation: any;
	onNext: any;
	loading: boolean;
}

export default function AddressPicker(props: PickerProps) {
	const { store } = useSelector((state: any) => state.storeReducer);

	// render map
	const [renderMap, setRenderMap] = useState<boolean>(store ? true : false);

	// manners, bleh
	const [locationPermission, setLocationPermission] = useState<string | null>(
		null
	);
	const [isValid, setIsValid] = useState<boolean>(false);

	const mapWidth = Dimensions.get("window").width * 0.9;
	const mapHeight = Dimensions.get("window").height * 0.9;

	const askForLocationPermission = () => {
		(async () => {
			const { status } =
				await Location.requestForegroundPermissionsAsync();

			setLocationPermission(status ? "granted" : "denied");

			if (status === "granted") {
				let location = await Location.getCurrentPositionAsync({});
				props.setLocation({
					latitude: location.coords.latitude.toString(),
					longitude: location.coords.longitude.toString(),
				});
			}
		})();
	};

	useEffect(() => {
		askForLocationPermission();
	}, []);

	useEffect(() => {
		const { valid } = validateStoreAddressInput({ ...props.address });
		setIsValid(valid);
	}, [props.address]);

	if (locationPermission === null) {
		return (
			<View style={CommonStyles.container}>
				<View
					style={{
						...CommonStyles.mainContainer,
						alignItems: "center",
					}}
				>
					<BoldText style={CommonStyles.title}>
						Requesting location permissions to track location
					</BoldText>
				</View>
			</View>
		);
	}

	return (
		<>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<TouchableOpacity onPress={props.onBack}>
							<AntDesign name="back" size={25} color="#222" />
						</TouchableOpacity>

						<BoldText style={CommonStyles.title}>
							New Address
						</BoldText>
					</View>

					{!renderMap ? (
						<View style={styles.inputContainer}>
							<Input
								title="Building / Block"
								placeholder="Near Bhakti Society"
								value={props.address.line1}
								autoCorrect={false}
								onChange={(text: string) =>
									props.setAddress({
										...props.address,
										line1: text,
									})
								}
							/>

							<Input
								title="Street / Road"
								placeholder="Karwe Road"
								value={props.address.line2}
								autoCorrect={false}
								onChange={(text: string) =>
									props.setAddress({
										...props.address,
										line2: text,
									})
								}
							/>

							<Input
								title="Pincode"
								placeholder="400612"
								keyboardType="phone-pad"
								value={props.address.pincode}
								onChange={(text: string) =>
									props.setAddress({
										...props.address,
										pincode: text,
									})
								}
								maxLength={6}
								autoFocus={true}
							/>

							<ActionBtn
								style={{ marginTop: 15 }}
								disable={!isValid}
								disabled={!isValid}
								onPress={() => setRenderMap(true)}
							>
								<ActionBtnText>Confirm Address</ActionBtnText>
							</ActionBtn>
						</View>
					) : (
						<View style={{ flex: 1, width: "100%" }}>
							<View
								style={{
									width: "100%",
									flexDirection: "row",
									alignItems: "center",
									padding: 10,
									shadowColor: "#000",
									shadowOffset: {
										width: 0,
										height: 2,
									},
									shadowOpacity: 0.25,
									shadowRadius: 3.84,
									elevation: 5,
									marginTop: 10,
									borderRadius: 10,
									position: "absolute",
									alignSelf: "center",
									backgroundColor: "#fff",
									zIndex: 99,
								}}
							>
								<View
									style={{
										marginHorizontal: 10,
										flex: 1,
									}}
								>
									<BoldText style={{ fontSize: 16 }}>
										{props.address.name}
									</BoldText>
									<Text numberOfLines={1}>
										{props.address.line1}{" "}
										{props.address.line2}
									</Text>
								</View>
								<TouchableOpacity
									onPress={() => setRenderMap(false)}
								>
									<MaterialCommunityIcons
										name="pencil"
										size={25}
									/>
								</TouchableOpacity>
							</View>

							<View
								style={{
									...styles.mapStyle,
									height: mapHeight,
									width: mapWidth,
								}}
							>
								<MapView
									initialRegion={{
										latitude: parseFloat(
											props.location?.latitude
										),
										longitude: parseFloat(
											props.location?.longitude
										),
										latitudeDelta: 0.0011,
										longitudeDelta: 0.0018,
									}}
									provider={PROVIDER_DEFAULT}
									customMapStyle={customMapStyle}
									style={{ flex: 1 }}
									onRegionChangeComplete={(e) => {
										props.setLocation({
											latitude: e.latitude.toString(),
											longitude: e.longitude.toString(),
										});
									}}
								/>
								<View
									style={{
										position: "absolute",
										top: "42.7%",
										left: "45%",
										backgroundColor: "transparent",
									}}
								>
									<Ionicons
										name="location-sharp"
										color="#111"
										size={35}
									/>
								</View>
							</View>

							<View
								style={{
									...CommonStyles.actionBtnContainer,
									marginBottom: 10,
									width: "100%",
									position: "absolute",
									bottom: 0,
									alignSelf: "center",
								}}
							>
								<View style={{ marginBottom: 5 }}>
									<Text>
										Move screen to place marker to point
										towards your delivery location
									</Text>
								</View>
								<ActionBtn
									disable={false}
									onPress={props.onNext}
								>
									{props.loading ? (
										<ActivityIndicator color={"#fff"} />
									) : (
										<ActionBtnText>Confirm</ActionBtnText>
									)}
								</ActionBtn>
							</View>
						</View>
					)}
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	inputContainer: {
		flex: 1,
		width: "100%",
		marginTop: 10,
	},
	mapStyle: {
		borderRadius: 20,
		overflow: "hidden",
	},
});
