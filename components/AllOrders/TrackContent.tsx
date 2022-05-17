import React, { useState, useEffect } from "react";
import {
	FlatList,
	Image,
	StyleSheet,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from "react-native";

import * as Location from "expo-location";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@apollo/client";
import { ImageLoader } from "react-native-image-fallback";

import { BoldText, Text, View } from "../Common/Themed";
import { CartSheetStyles, CommonStyles } from "../Common/Elements";

import { DELIVERED_ORDER, DISPATCH_ORDER } from "../../graphql/orderDefs";
import { ICON_URI, IMG_URI } from "../../constants/Urls";

function DispatchButton({ id }: any) {
	const [dispatchOrder, { loading }] = useMutation(DISPATCH_ORDER, {
		variables: { orderId: id },
	});
	return (
		<TouchableOpacity
			style={{
				...trackStyles.actionbtn,
				flex: 1,
				borderWidth: 1,
				borderColor: loading ? "#888" : "#333",
			}}
			disabled={loading}
			onPress={() => dispatchOrder()}
		>
			{loading ? (
				<ActivityIndicator color={"#111"} />
			) : (
				<BoldText style={trackStyles.actiontext}>
					Order Dispatched
				</BoldText>
			)}
		</TouchableOpacity>
	);
}

function DeliveredButton({ id, location }: any) {
	const [deliveredOrder, { loading }] = useMutation(DELIVERED_ORDER, {
		variables: {
			orderId: id,
			coordinates: location,
		},
		onError(err) {
			Alert.alert("Cannot update delivery status", `${err}`, [
				{ style: "default", text: "Okay" },
			]);
		},
	});
	return (
		<TouchableOpacity
			style={{
				...trackStyles.actionbtn,
				flex: 1,
				borderWidth: 1,
				borderColor: loading ? "#555" : "#1ea472",
				backgroundColor: loading ? "#555" : "#1ea472",
			}}
			disabled={loading}
			onPress={() => deliveredOrder()}
		>
			{loading ? (
				<ActivityIndicator color={"#fff"} />
			) : (
				<BoldText style={{ ...trackStyles.actiontext, color: "#fff" }}>
					Order Delivered
				</BoldText>
			)}
		</TouchableOpacity>
	);
}

export default function TrackContent({ data }: any) {
	const [mapView, setMapView] = useState<boolean>(false);
	const [confirmTimer, setConfirmTimer] = useState<number>(1);
	const [timer, setTimer] = useState({
		over: false,
		hour: 0,
		min: 0,
		sec: 0,
	});

	// location
	const [userLocation, setUserLocation] = useState<object | null>(null);

	// manners, bleh
	const [locationPermission, setLocationPermission] = useState<string | null>(
		null
	);

	useEffect(() => {
		if (!data.delivery.isDelivered) {
			confirmTimer > 0 &&
				setTimeout(() => setConfirmTimer(confirmTimer + 1), 1000);

			let currentTime = new Date();
			let expireTime = new Date(data.delivery.deliverBy);

			setTimer({
				over: currentTime > expireTime ? true : false,
				hour: Math.abs(
					moment(expireTime).diff(currentTime, "hours") % 24
				),
				min: Math.abs(
					moment(expireTime).diff(currentTime, "minutes") % 60
				),
				sec: Math.abs(
					moment(expireTime).diff(currentTime, "seconds") % 60
				),
			});
		}
		askForLocationPermission();
	}, [confirmTimer, data]);

	const askForLocationPermission = () => {
		(async () => {
			const { status } =
				await Location.requestForegroundPermissionsAsync();

			setLocationPermission(status ? "granted" : "denied");

			if (status === "granted") {
				let location = await Location.getCurrentPositionAsync({});
				setUserLocation({
					latitude: location.coords.latitude.toString(),
					longitude: location.coords.longitude.toString(),
				});
			}
		})();
	};

	if (locationPermission === null) {
		return (
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<BoldText style={CommonStyles.title}>
						Requesting location permissions to track delivery.
					</BoldText>
				</View>
			</View>
		);
	}

	if (locationPermission !== "granted") {
		return (
			<View style={CommonStyles.loadingContainer}>
				<BoldText style={CommonStyles.title}>
					Location permission denied!
				</BoldText>
				<Text style={{ fontSize: 16, color: "#fff" }}>
					Enable location services to continue.
				</Text>
				<TouchableOpacity
					style={trackStyles.refreshLocationBtn}
					onPress={() => askForLocationPermission()}
				>
					<Ionicons name="refresh-sharp" size={24} color="#111" />
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={{ ...CommonStyles.container, marginTop: 0 }}>
			<View style={CommonStyles.mainContainer}>
				{/* delivery status */}
				<View
					style={{
						...CartSheetStyles.rowContainer,
						marginBottom: 10,
					}}
				>
					<BoldText style={{ fontSize: 20 }}>
						#loc
						{data.id.toString().slice(16)}
					</BoldText>
					{data.state.isCancelled ? (
						<View
							style={{
								...trackStyles.statusContainer,
								borderColor: "#aa3315",
							}}
						>
							<Text style={{ color: "#aa3315" }}>Cancelled</Text>
						</View>
					) : (
						<View
							style={{
								...trackStyles.statusContainer,
								borderColor: data.state.isConfirmed
									? "#1ea472"
									: "#636363",
							}}
						>
							<Text
								style={{
									color: data.state.isConfirmed
										? "#1ea472"
										: "#636363",
								}}
							>
								{data.state.isConfirmed
									? "Confirmed"
									: "Not Confirmed"}
							</Text>
						</View>
					)}
				</View>
				{!data.delivery.isDelivered && (
					<View style={CommonStyles.section}>
						<View style={CartSheetStyles.rowContainer}>
							<BoldText style={CommonStyles.sectionHeader}>
								{timer.over ? "Order late by" : "Delivering in"}
							</BoldText>
						</View>
						<BoldText
							style={{
								...trackStyles.timeText,
								color: timer.over ? "#dd0000" : "#111",
								marginBottom: 0,
							}}
						>
							{timer.hour > 0 && (
								<>
									{timer.hour}{" "}
									<Text style={trackStyles.timeUnit}>hr</Text>{" "}
								</>
							)}
							{timer.min}{" "}
							<Text style={trackStyles.timeUnit}>m</Text>{" "}
							{timer.sec}{" "}
							<Text style={trackStyles.timeUnit}>s</Text>
						</BoldText>
					</View>
				)}
				{/* cart items */}

				<View style={CommonStyles.section}>
					<BoldText style={CommonStyles.sectionHeader}>
						Order Items
					</BoldText>
					<FlatList
						data={data.products}
						showsVerticalScrollIndicator={false}
						keyExtractor={(e: any) => e.id}
						initialNumToRender={1}
						renderItem={({ item }: any) => (
							<View style={CartSheetStyles.inventoryProduct}>
								<View style={CartSheetStyles.rowContainer}>
									<ImageLoader
										source={`${IMG_URI}${item?.imageUrl}.jpg`}
										fallback={[
											`${ICON_URI}imagedefault.png`,
										]}
										style={{
											height: 40,
											width: 40,
											marginRight: 10,
										}}
									/>
									<View
										style={{
											flex: 1,
											flexDirection: "column",
											alignItems: "flex-start",
										}}
									>
										<BoldText
											style={{
												...CartSheetStyles.productName,
												width: "90%",
											}}
											numberOfLines={1}
										>
											{item.name}
										</BoldText>
										<Text
											style={CartSheetStyles.productMeta}
										>
											{item.quantity.count}
											{item.quantity.type} x{" "}
											{item.itemQuantity}
										</Text>
									</View>

									<BoldText
										style={{
											...CartSheetStyles.productName,
											textAlign: "right",
										}}
									>
										₹ {item.totalPrice}/-
									</BoldText>
								</View>
							</View>
						)}
					/>
				</View>

				{/* delivery details */}

				{data.delivery.isDelivery && (
					<View style={CommonStyles.section}>
						<BoldText style={CommonStyles.sectionHeader}>
							Delivery Details
						</BoldText>
						<View
							style={{
								...CartSheetStyles.rowContainer,
								alignItems: "flex-start",
							}}
						>
							<Text>Address</Text>
							<BoldText
								style={trackStyles.unitText}
								numberOfLines={2}
							>
								{data.delivery.deliveryAddress.line1},{" "}
								{data.delivery.deliveryAddress.line2}
							</BoldText>
						</View>
						{data.delivery.isDispatched && (
							<View style={CartSheetStyles.rowContainer}>
								<Text>Dispatched</Text>
								<BoldText style={trackStyles.unitText}>
									{moment(data.delivery.dispatchDate).format(
										"ddd, hh:mm A"
									)}
								</BoldText>
							</View>
						)}
						{data.delivery.isDelivered && (
							<View style={CartSheetStyles.rowContainer}>
								<Text>Delivered at</Text>
								<BoldText style={trackStyles.unitText}>
									{moment(data.delivery.deliveryDate).format(
										"ddd, hh:mm A"
									)}
								</BoldText>
							</View>
						)}
					</View>
				)}

				{/* payment details */}

				<View style={CommonStyles.section}>
					<BoldText style={CommonStyles.sectionHeader}>
						Payment
					</BoldText>
					{/* <View style={CartSheetStyles.rowContainer}>
						<BoldText>Payment Status</BoldText>
						<BoldText style={trackStyles.unitText}>
							{data.payment.paid ? "Paid" : "Not Paid"}
						</BoldText>
					</View> */}
					<View style={CartSheetStyles.rowContainer}>
						<BoldText>Grand Total</BoldText>
						<BoldText style={trackStyles.unitText}>
							₹ {data.payment.grandTotal}
						</BoldText>
					</View>
				</View>

				{/* <View style={{ ...CommonStyles.section, borderWidth: 0 }}>
					<TouchableOpacity onPress={() => console.log("")}>
						<Text
							style={{
								color: "#444",
								textDecorationLine: "underline",
							}}
						>
							Need Help? Click here for delivery assistance
						</Text>
					</TouchableOpacity>
				</View> */}

				{/* action container  */}
				{!data.delivery.isDelivered && (
					<View style={trackStyles.actions}>
						{!data.delivery.isDispatched && (
							<TouchableOpacity
								style={{
									...trackStyles.actionbtn,
									marginRight: 10,
									backgroundColor: timer.over
										? "#555"
										: "#dd0000",
								}}
								onPress={() =>
									timer.over
										? Alert.alert(
												"Too late to cancel",
												`Order can only be cancelled within delivery time. Expected time to deliver this order was before ${moment(
													data.delivery.deliverBy
												).format("ddd, hh:mm A")}`,
												[
													{
														text: "Okay",
														style: "cancel",
													},
												]
										  )
										: Alert.alert(
												"Cancel Confirmation",
												`User will be notified order #loc
						${data.id.toString().slice(16)} is cancelled.`,
												[
													{
														style: "default",
														text: "Okay",
													},
												]
										  )
								}
							>
								<Ionicons
									name="close-outline"
									color="#fff"
									size={25}
								/>
							</TouchableOpacity>
						)}
						{data.delivery.isDispatched ? (
							<DeliveredButton
								id={data.id.toString()}
								location={userLocation}
							/>
						) : (
							<DispatchButton id={data.id.toString()} />
						)}
					</View>
				)}
			</View>
		</View>
	);
}

const trackStyles = StyleSheet.create({
	refreshLocationBtn: {
		marginVertical: 10,
		borderRadius: 100,
		alignItems: "center",
		justifyContent: "center",
		height: 50,
		width: 50,
		backgroundColor: "#eeeeee22",
	},
	statusContainer: {
		borderWidth: 1,
		borderRadius: 5,
		padding: 5,
	},
	unitText: { width: "50%", textAlign: "right" },
	timeText: { fontSize: 40 },
	timeUnit: { fontSize: 40, color: "#888" },
	time: {},
	actions: {
		position: "absolute",
		bottom: 0,
		width: "95%",
		alignSelf: "center",
		marginBottom: "5%",
		flexDirection: "row",
		alignItems: "center",
	},
	actionbtn: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 5,
		padding: 15,
	},
	actiontext: {
		textTransform: "uppercase",
		fontSize: 16,
		color: "#111",
	},
});
