import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	ActivityIndicator,
	FlatList,
	Linking,
	Alert,
} from "react-native";

import { useMutation, useLazyQuery } from "@apollo/client";
import { ImageLoader } from "react-native-image-fallback";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";

import {
	CartSheetStyles,
	CommonStyles,
} from "../../components/Common/Elements";
import DisplayImg from "../../components/DisplayImg";
import { BoldText, Text } from "../../components/Common/Themed";
import DynamicStatusBar from "../../components/Common/StatusBar";
import { CustomBackdrop } from "../../components/Common/ModalStyle";

import { RootTabScreenProps } from "../../types";
import {
	CLOSE_RUNNING_ACCOUNT,
	EDIT_RUNNING_ACCOUNT_AMOUNT,
	FETCH_ORDER_PRODUCTS,
	SEND_CLOSING_REQUEST,
} from "../../graphql/accountdefs";

import { ICON_URI, IMG_URI } from "../../constants/Urls";

function ShowToast(message1: string, message2: string, type: number) {
	return Toast.show({
		type: type === 1 ? "success" : "error",
		text1: message1,
		text2: message2,
	});
}

function OrderDetails({ item }: any) {
	const [products, setProducts] = useState<any>(null);

	const [fetchDetails, { loading }] = useLazyQuery(FETCH_ORDER_PRODUCTS, {
		variables: {
			orderId: item.orderId,
		},
		onCompleted(data) {
			setProducts(data.getOrder.products);
		},
		onError() {
			ShowToast(
				"Error faced!",
				"Cannot products for this order! Try again in some time",
				0
			);
		},
	});

	return (
		<View
			style={{
				padding: 10,
				width: "100%",
				marginBottom: 10,
				paddingBottom: 0,
				flexDirection: "column",
				alignItems: "flex-start",
				justifyContent: "flex-start",
				borderWidth: products ? 0 : 1,
				borderRadius: products ? 10 : 5,
				borderColor: products ? "#1ea47222" : "#ededed",
				backgroundColor: products ? "#1ea47222" : "#ededed",
			}}
		>
			<TouchableOpacity
				onPress={() => fetchDetails()}
				disabled={products !== null}
				style={{
					paddingBottom: 10,
					flexDirection: "row",
					alignItems: "flex-start",
					justifyContent: "space-between",
				}}
			>
				<View
					style={{
						flex: 1,
						flexDirection: "column",
						alignItems: "flex-start",
					}}
				>
					<BoldText>#loc{item.orderId.toString().slice(16)}</BoldText>
					<BoldText>₹ {item.amount}/-</BoldText>
				</View>
				<View>
					<Text style={{ color: item.paid ? "#111" : "#1ea472" }}>
						{item.paid ? "paid" : "unpaid"}
					</Text>
				</View>
			</TouchableOpacity>

			{products !== null && (
				<FlatList
					key={1004032123}
					data={products}
					style={{ paddingBottom: 5, width: "100%" }}
					keyExtractor={(e) => e.id.toString()}
					renderItem={({ item }: any) => (
						<View style={CartSheetStyles.inventoryProduct}>
							<View style={CartSheetStyles.rowContainer}>
								<ImageLoader
									source={`${IMG_URI}${item?.imageUrl}.jpg`}
									fallback={[`${ICON_URI}imagedefault.png`]}
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
									<Text style={CartSheetStyles.productMeta}>
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
			)}
		</View>
	);
}

function KhataItem({ khata, store, onComplete }: any) {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => [300], []);
	const handleSheetChanges = useCallback(() => {}, []);

	const [open, setOpen] = useState(false);
	const [amount, setAmount] = useState(khata.amount);
	const [transactionId, setTransactionId] = useState("");
	const [payments, setPayments] = useState<boolean>(false);
	const [paymentMode, setPaymentMode] = useState<string | null>(null);

	const [closeAcc, { loading: closing }] = useMutation(
		CLOSE_RUNNING_ACCOUNT,
		{
			variables: {
				id: khata.id,
				transactionId: "",
				transactionType: paymentMode,
			},
			onCompleted(data) {
				if (data.closeRunningAccount) {
					setOpen(false);
					setPaymentMode(null);
					ShowToast(
						"Account Closed",
						`You closed ${khata.name}'s account.`,
						1
					);
					onComplete();
				}
			},
			onError() {
				ShowToast(
					"Error Occured",
					`We're facing some issue closing this account.`,
					0
				);
			},
		}
	);

	const [editRunningAccountAmount, { loading: editingAmount }] = useMutation(
		EDIT_RUNNING_ACCOUNT_AMOUNT,
		{
			variables: {
				amount: amount,
				id: khata.id,
			},
		}
	);

	const [sendPaymentRequest, { loading: sendingRequest }] = useLazyQuery(
		SEND_CLOSING_REQUEST,
		{
			variables: {
				id: khata.id,
			},
			onCompleted(data) {
				ShowToast(
					data.sendClosingRequest.error
						? "Error Occured"
						: "Request Successful",
					`${data.sendClosingRequest.message}`,
					data.sendClosingRequest.error ? 0 : 1
				);
			},
			onError() {
				ShowToast(
					"Error requesting",
					`We're facing some issue. Try again later`,
					0
				);
			},
		}
	);

	// TODO: Inefficient
	useEffect(() => {
		if (paymentMode !== null) {
			closeAcc();
		}
	}, [paymentMode]);

	const getMessageUri = (item: any) => {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, "0");
		var mm = String(today.getMonth() + 1).padStart(2, "0");
		var yyyy = today.getFullYear();

		const uri = `Message from ${store.name}\nYour payment of *₹${
			item.total_amount
		}/-* is remaining as of ${
			dd + "/" + mm + "/" + yyyy
		}.\n\nKindly pay with cash in store or via upi.`;
		return [encodeURIComponent(uri), uri];
	};

	const handleMessage = () => {
		if (khata.contact.number) {
			return Linking.openURL(
				`https://wa.me/${khata.contact.ISD}${
					khata.contact.number
				}?text=${getMessageUri(khata)[0]}`
			);
		} else {
			return Linking.openURL(
				`https://wa.me/?text=${getMessageUri(khata)[0]}`
			);
		}
	};

	function handleSMS() {
		sendPaymentRequest({
			variables: {
				id: khata.id,
			},
		});
		bottomSheetModalRef.current?.close();
	}

	console.log(khata);

	return (
		<>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				key={13599123993}
				snapPoints={snapPoints}
				backdropComponent={CustomBackdrop}
				onChange={handleSheetChanges}
				style={{
					borderRadius: 20,
				}}
			>
				<View
					style={{
						...CommonStyles.mainContainer,
						alignSelf: "center",
					}}
				>
					<View style={CommonStyles.header}>
						<TouchableOpacity
							onPress={() => bottomSheetModalRef.current?.close()}
						>
							<AntDesign name="back" size={25} color="#111" />
						</TouchableOpacity>

						<BoldText
							style={{
								fontSize: 25,
								marginLeft: 10,
							}}
							numberOfLines={1}
						>
							Request payment
						</BoldText>
					</View>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: "5%",
						}}
					>
						<TouchableOpacity
							onPress={() => handleSMS()}
							style={{
								height: 50,
								flex: 1,
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								marginRight: 5,
								backgroundColor: "#ddd",
							}}
						>
							{sendingRequest ? (
								<ActivityIndicator color="#111" />
							) : (
								<>
									<AntDesign
										name="message1"
										size={23}
										color="#111"
									/>
									<BoldText style={{ marginLeft: 8 }}>
										Send Request
									</BoldText>
								</>
							)}
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleMessage()}
							style={{
								width: "48%",
								height: 50,
								flex: 1,
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								marginLeft: 5,
								backgroundColor: khata.private
									? "#f2f2f2"
									: "#ddd",
							}}
							disabled={khata.private}
						>
							<Ionicons
								name="logo-whatsapp"
								size={23}
								color={khata.private ? "#888" : "#111"}
							/>
							<BoldText
								style={{
									marginLeft: 8,
									color: khata.private ? "#888" : "#111",
								}}
								numberOfLines={2}
							>
								Custom Text
							</BoldText>
						</TouchableOpacity>
					</View>
					<View
						style={{
							marginBottom: "5%",
						}}
					>
						<Text style={{ color: "#555" }}>
							Request will be sent by us by choosing 'Send
							Request'.
						</Text>
						<Text style={{ color: "#555" }}>
							If the user has decided to share their number with
							your store, you can choose 'Custom Text'.
						</Text>
					</View>
				</View>
			</BottomSheetModal>
			<View
				style={{
					width: "100%",
					flexDirection: "column",
					borderWidth: 1,
					borderRadius: 10,
					borderColor: open || payments ? "#111" : "#eee",
				}}
			>
				<View style={CommonStyles.section}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						<DisplayImg
							name={khata.name}
							size={35}
							off={khata.closed}
						/>
						<View
							style={{
								flexDirection: "column",
								alignItems: "flex-start",
								marginLeft: 10,
							}}
						>
							<Text style={{ fontSize: 18 }}>{khata.name}</Text>
							<BoldText style={{ fontSize: 20 }}>
								₹ {khata.totalAmount}/-
							</BoldText>
						</View>
					</View>
				</View>

				<View style={CommonStyles.section}>
					{/* <BoldText style={CommonStyles.sectionHeader}>
						Actions
					</BoldText> */}
					<View
						style={{ flexDirection: "row", alignItems: "center" }}
					>
						<TouchableOpacity
							onPress={() =>
								bottomSheetModalRef.current?.present()
							}
							style={{
								height: 50,
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
								marginRight: 5,
								backgroundColor: "#ddd",
							}}
						>
							<Text>Request</Text>
						</TouchableOpacity>
						{/* <TouchableOpacity
							onPress={() =>
								bottomSheetModalRef.current?.present()
							}
							style={{
								height: 50,
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
								marginHorizontal: 5,
								backgroundColor: "#ddd",
							}}
						>
							<Text>Edit</Text>
						</TouchableOpacity> */}
						<TouchableOpacity
							onPress={() =>
								Alert.alert(
									`Close account of ${khata.name}`,
									`This action is irreversible. Make sure you recieved ₹ ${khata.totalAmount}/-`,
									[
										{
											text: "UPI Payment",
											style: "destructive",
											onPress: () =>
												closeAcc({
													variables: {
														id: khata.id,
														transactionId: "",
														transactionType: "UPI",
													},
												}),
										},
										{
											text: "Paid via Cash",
											style: "destructive",
											onPress: () =>
												closeAcc({
													variables: {
														id: khata.id,
														transactionId: "",
														transactionType: "CASH",
													},
												}),
										},
									],
									{ cancelable: true }
								)
							}
							style={{
								flex: 1,
								height: 50,
								marginLeft: 5,
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: "#dd000088",
							}}
							disabled={closing}
						>
							{closing ? (
								<ActivityIndicator color={"#fff"} />
							) : (
								<Text style={{ color: "#fff" }}>Close</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>

				<View style={CommonStyles.section}>
					<BoldText style={CommonStyles.sectionHeader}>
						Orders
					</BoldText>

					<FlatList
						data={khata.orders}
						keyExtractor={(e) => e.orderId}
						renderItem={({ item }) => <OrderDetails item={item} />}
					/>
				</View>
			</View>
		</>
	);
}

export default function Accounts({
	navigation,
}: RootTabScreenProps<"Accounts">) {
	const [activeItem, setActiveItem] = useState<any>(null);

	const { store } = useSelector((state: any) => state.storeReducer);
	const { accounts } = useSelector((state: any) => state.storeReducer);

	useEffect(() => {
		activeItem &&
			setActiveItem(
				accounts.find((e: any) => e.data.id === activeItem.id).data
			);
	}, [accounts]);

	if (activeItem) {
		return (
			<>
				<DynamicStatusBar />
				<View style={CommonStyles.container}>
					<View style={CommonStyles.mainContainer}>
						<View style={CommonStyles.header}>
							<TouchableOpacity
								onPress={() => setActiveItem(null)}
							>
								<AntDesign
									name="back"
									size={25}
									color={"#111"}
								/>
							</TouchableOpacity>
							<View style={CommonStyles.screenTitle}>
								<BoldText style={CommonStyles.title}>
									{activeItem.name}
								</BoldText>
							</View>
						</View>
						{/* Actions on Account */}
						<KhataItem
							khata={activeItem}
							store={store}
							onComplete={() => setActiveItem(null)}
						/>
						{/* ------------------ */}
					</View>
				</View>
			</>
		);
	}

	return (
		<>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<TouchableOpacity
							onPress={() => navigation.navigate("ProfileScreen")}
						>
							<AntDesign name="back" size={25} color={"#111"} />
						</TouchableOpacity>
						<View style={CommonStyles.screenTitle}>
							<BoldText style={CommonStyles.title}>
								Accounts
							</BoldText>
						</View>
					</View>

					<Text style={styles.sectionText}>
						<Text style={{ color: "#1ea472" }}>Store Accounts</Text>{" "}
						are managed here.
					</Text>

					{accounts.length !== 0 ? (
						<View style={{ flex: 1, width: "100%" }}>
							<FlatList
								// onRefresh={() => refetch}
								// refreshing={
								// 	networkStatus === NetworkStatus.refetch
								// }
								key={9980234599}
								keyExtractor={(e: any) => e.data.id.toString()}
								data={accounts}
								renderItem={({ item }) => (
									<TouchableOpacity
										style={styles.khataRow}
										onPress={() => setActiveItem(item.data)}
									>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<DisplayImg
												name={item.data.name}
												size={30}
												off={item.data.closed}
											/>

											<BoldText
												style={{
													paddingLeft: 10,
													fontSize: 16,
												}}
											>
												{item.data.name}
											</BoldText>
										</View>
										<View
											style={{
												flexDirection: "column",
												alignItems: "flex-start",
											}}
										>
											<BoldText>
												₹ {item.data.totalAmount}/-
											</BoldText>
											<BoldText
												style={{
													color: item.data.closed
														? "#111"
														: "#1ea472",
												}}
											>
												{item.data.closed
													? "closed"
													: "open"}
											</BoldText>
										</View>
									</TouchableOpacity>
								)}
							/>
						</View>
					) : (
						<View
							style={{
								...CommonStyles.loadingContainer,
								marginBottom: 70,
							}}
						>
							<BoldText style={{ fontSize: 18 }}>
								<BoldText style={{ color: "#1ea472" }}>
									Your Store
								</BoldText>{" "}
								currently has no open accounts
							</BoldText>
						</View>
					)}
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	sectionText: { fontSize: 18, marginBottom: 10, width: "100%" },
	actionBtn: {
		height: 30,
		width: 30,
		marginLeft: 15,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	khataRow: {
		width: "100%",
		padding: 10,
		paddingLeft: 0,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	iconBtn: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});
