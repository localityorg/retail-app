import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { BoldText, Text } from "../Common/Themed";
import { Ionicons } from "@expo/vector-icons";

import {
	acceptOrder as approveOrder,
	cancelOrder as rejectOrder,
} from "../../redux/actions";

import moment from "moment";

import { useSelector } from "react-redux";

interface AcceptRejectProps {
	id: string;
	dispatch: any;
	setLiveData: any;
	userOrders?: any;
}

function AcceptRejectOrder(props: AcceptRejectProps) {
	const btnAction = ({ confirm }: any) => {
		confirm ? acceptOrder() : cancelOrder();
		if (confirm) {
			props.dispatch(approveOrder(props.id));
		} else {
			props.dispatch(rejectOrder(props.id));
		}
	};

	const ACCEPT_ORDER = gql`
		mutation Mutation($orderId: String!) {
			confirmOrder(orderId: $orderId)
		}
	`;

	const CANCEL_ORDER = gql`
		mutation CancelOrderMutation($orderId: String!) {
			cancelOrder(orderId: $orderId)
		}
	`;

	const [acceptOrder, { loading: acceptLoading }] = useMutation(
		ACCEPT_ORDER,
		{
			variables: {
				orderId: props.id,
			},
			onCompleted(data) {
				data.confirmOrder &&
					props.setLiveData(
						props.userOrders[
							props.userOrders.findIndex(
								(e: any) => e.id === props.id
							)
						]
					);
			},
		}
	);
	const [cancelOrder, { loading: rejectedLoading }] = useMutation(
		CANCEL_ORDER,
		{
			variables: {
				orderId: props.id,
			},
		}
	);

	if (acceptLoading || rejectedLoading) {
		return (
			<View
				style={{
					padding: 10,
					width: "100%",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<ActivityIndicator
					size="large"
					color={rejectedLoading ? "#dd0000" : "#1ea472"}
				/>
			</View>
		);
	}
	return (
		<View style={styles.actionContainer}>
			<TouchableOpacity
				style={{
					...styles.actionBtn,
					backgroundColor: "#d25e7b",
				}}
				onPress={() => btnAction({ confirm: false })}
			>
				<Ionicons name="close-sharp" color="#fff" size={25} />
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					...styles.actionBtn,
					backgroundColor: "#1ea472",
				}}
				onPress={() => btnAction({ confirm: true })}
			>
				<Ionicons name="checkmark-sharp" color="#fff" size={25} />
			</TouchableOpacity>
		</View>
	);
}

export default function NewOrderCard({ data, dispatch, onPress }: any) {
	const [liveData, setLiveData] = useState<any>(null);

	const { userOrders } = useSelector((state: any) => state.ordersReducer);

	useEffect(() => {
		data && setLiveData(data);
	}, []);

	if (liveData === null) {
		return <View />;
	}

	if (data.state.isCancelled) {
		return (
			<TouchableOpacity
				style={{
					...styles.orderContainer,
					backgroundColor: "transparent",
					borderColor: "#dd000055",
					padding: 10,
				}}
				activeOpacity={0.7}
				disabled={true}
			>
				<View
					style={{
						width: "100%",
						alignItems: "center",
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<Text style={{ fontWeight: "600" }}>
						<Text style={{ color: "#666" }}>Id:</Text> #loc
						{liveData.id.toString().slice(16)}
					</Text>
					<Text
						style={{
							borderRadius: 10,
							color: "#dd000055",
						}}
					>
						cancelled
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity
			style={{
				...styles.orderContainer,
				backgroundColor: "transparent",
				borderColor: liveData.delivery.isDelivered
					? "#11111111"
					: "#1ea47222",
				paddingTop: 10,
			}}
			activeOpacity={0.7}
			onPress={onPress}
		>
			<View
				style={{
					width: "100%",
					alignItems: "center",
					flexDirection: "row",
					marginBottom: 5,
					paddingHorizontal: 10,
					justifyContent: "space-between",
				}}
			>
				<View
					style={{
						alignItems: "center",
						flexDirection: "row",
					}}
				>
					<Text
						style={{
							fontWeight: "bold",
							fontSize: 14,
							color: "#888",
						}}
					>
						{moment(liveData.date.toString()).fromNow()}
					</Text>
				</View>

				<BoldText>
					{liveData.payment.paid ? "paid" : "not paid"}
				</BoldText>
			</View>
			<View
				style={{
					width: "100%",
					alignItems: "center",
					flexDirection: "row",
					paddingHorizontal: 10,
					marginBottom: 5,
					justifyContent: "space-between",
				}}
			>
				<BoldText>
					<Text style={{ color: "#666" }}>Id:</Text> #loc
					{liveData.id.toString().slice(16)}{" "}
				</BoldText>

				<View
					style={{
						backgroundColor: "#111",
						padding: 2,
						paddingHorizontal: 5,
						borderRadius: 5,
					}}
				>
					<BoldText style={{ color: "#fff" }}>
						<Text
							style={{
								textTransform: "capitalize",
								color: "#fff",
							}}
						>
							{liveData.payment.transactionType}
						</Text>{" "}
						payment
					</BoldText>
				</View>
			</View>
			<View style={styles.products}>
				{liveData.products.map((obj: any) => (
					<View style={styles.product} key={obj.id}>
						<View style={styles.productText}>
							<BoldText
								style={{
									fontSize: 15,
									color: "#555",
									width: "75%",
								}}
								numberOfLines={1}
							>
								{obj.name}
							</BoldText>
							<Text>
								{obj.itemQuantity} x {obj.quantity.count}
								{obj.quantity.type}
							</Text>
						</View>
					</View>
				))}
			</View>
			<View style={styles.seperator} />
			<View style={styles.product}>
				<View
					style={{
						...styles.productText,
						alignItems: "flex-start",
						paddingBottom: 10,
					}}
				>
					<View
						style={{
							flexDirection: "column",
							alignItems: "flex-start",
							width: "60%",
						}}
					>
						<Text
							style={{
								fontSize: 14,
								color: "#111",
								textTransform: "uppercase",
							}}
						>
							Address
						</Text>
						{liveData.delivery.isDelivery ? (
							<Text
								style={{
									textAlign: "left",
									fontWeight: "bold",
								}}
							>
								{liveData.delivery.deliveryAddress.line1},{" "}
								{liveData.delivery.deliveryAddress.line2}
							</Text>
						) : (
							<BoldText
								style={{
									paddingHorizontal: 5,
									backgroundColor: "#333",
									color: "#fff",
									borderRadius: 3,
								}}
							>
								Not for Delivery
							</BoldText>
						)}
					</View>
					<View
						style={{
							flexDirection: "column",
							alignItems: "flex-start",
							marginLeft: 10,
						}}
					>
						<Text
							style={{
								fontSize: 14,
								color: "#111",
								textTransform: "uppercase",
							}}
						>
							Grand Total
						</Text>
						<Text style={{ fontWeight: "bold", fontSize: 20 }}>
							₹ {liveData.payment.grandTotal}/-
						</Text>
					</View>
				</View>
			</View>

			{!liveData?.state.isConfirmed && (
				<AcceptRejectOrder
					id={data.id}
					dispatch={dispatch}
					userOrders={userOrders}
					setLiveData={setLiveData}
				/>
			)}

			{/* {liveData.delivery.isDelivered && (
				<View style={styles.messageContainer}>
					<Text style={styles.message}>
						Order is delivered via drone!
					</Text>
				</View>
			)} */}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	orderContainer: {
		backgroundColor: "#1ea47233",
		borderRadius: 15,
		borderColor: "#1ea47222",
		borderWidth: 2,
		width: "100%",
		marginBottom: 10,
		overflow: "hidden",
	},
	products: {
		flexDirection: "column",
	},
	product: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
	},
	productText: {
		flex: 1,
		marginVertical: 2,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	seperator: {
		width: "90%",
		alignSelf: "center",
		backgroundColor: "#ccc",
		height: 1,
		marginVertical: 10,
	},
	actionContainer: {
		flexDirection: "row",
		width: "100%",
		backgroundColor: "#f2f2f2",
	},
	actionBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		paddingVertical: 10,
		backgroundColor: "#111",
	},
	messageContainer: {
		padding: 5,
		paddingHorizontal: 10,
		backgroundColor: "#111",
		overflow: "hidden",
	},
	message: {
		color: "#fff",
	},
});
