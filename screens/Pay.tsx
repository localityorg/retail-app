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
	Alert,
	FlatList,
} from "react-native";

import Toast from "react-native-toast-message";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation, useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { ImageLoader } from "react-native-image-fallback";

import {
	ActionBtn,
	ActionBtnText,
	CartSheetStyles,
	CommonStyles,
} from "../components/Common/Elements";
import { BoldText, Text, TextInput } from "../components/Common/Themed";
import DynamicStatusBar from "../components/Common/StatusBar";
import SelectContact from "../components/Common/Contacts";
import KhataModal from "../components/Profile/KhataModal";
import QRModal from "../components/QuickBill/QRModal";

import { emptyICart, setRunningAccounts } from "../redux/actions";

import { modes } from "../constants/Modes";
import { CREATE_ORDER } from "../graphql/orderDefs";
import { ADD_RUNNING_ACCOUNT } from "../graphql/accountdefs";

import { RootTabScreenProps } from "../types";
import { ICON_URI, IMG_URI } from "../constants/Urls";
import { GET_PAYMENT_OPTIONS } from "../graphql/orderDefs";
import { Counter } from "../components/Common/Counter";

export default function Pay({ navigation }: RootTabScreenProps<"Pay">) {
	const dispatch = useDispatch();
	const [delivery, setDelivery] = useState<any>({
		contact: "",
		bool: false,
		address: {
			coordinates: {
				latitude: "",
				longitude: "",
			},
			name: "",
			line1: "",
			line2: "",
			pincode: "",
		},
	});
	const [newRunningAccount, setNewRunningAccount] = useState({
		name: "",
		line1: "",
		line2: "",
		contact: {
			ISD: "+91",
			number: "",
		},
		private: false,
	});

	const [totalAmount, setTotalAmount] = useState<string>("0");
	const [methodType, setMethodType] = useState<any>(null);
	const [payment, setPayment] = useState<any>({});
	const [paymentUri, setPaymentUri] = useState<string>("");

	// redux stores
	const { cart } = useSelector((state: any) => state.iCartReducer);
	const { user } = useSelector((state: any) => state.userReducer);
	const { store } = useSelector((state: any) => state.storeReducer);

	// bottom sheet references
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const bottomSheetContactModalRef = useRef<BottomSheetModal>(null);
	const bottomSheetKhataModalRef = useRef<BottomSheetModal>(null);

	// snap points
	const snapPoints = useMemo(() => ["50%"], []);
	const largeSnapPoints = useMemo(() => ["50%", "75%"], []);

	// callbacks
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
	const handleSheetChanges = useCallback(() => {}, []);
	const handlePresentKhataModalPress = useCallback(() => {
		bottomSheetKhataModalRef.current?.present();
	}, []);

	// variables
	const transactionId = "PDS.1234-5678-9012-3456";
	const message = `LocShop Payment `;
	const currency = "INR";
	const mc = "";

	function handleClearStates() {
		setNewRunningAccount({
			name: "",
			line1: "",
			line2: "",
			contact: {
				ISD: "+91",
				number: "",
			},
			private: false,
		});
		setMethodType(null);
		setPaymentUri("");
		setTotalAmount("");
	}

	function showToast(message1: string, message2: string) {
		Toast.show({
			type: "success",
			text1: message1,
			text2: message2,
		});
	}

	const [createOrder, { data, loading: creating }] = useMutation(
		CREATE_ORDER,
		{
			variables: {
				createOrderInput: {
					products: cart,
					totalAmount: totalAmount,
					deliveryAmount: "0",
					convenienceFee: "0",
					grandTotal: totalAmount,
					transactionType: methodType?.type,
					storeId: store.id,
					transactionId: "",
					paid: methodType?.type === "KHATA" ? false : true,
					payOnDelivery: false,
					paymentDate: new Date().toISOString(),
					isDelivery: delivery.bool,
					deliveryAddress: delivery.address,
				},
			},
			onCompleted(data) {
				if (data.createNewOrder) {
					showToast(
						"Order Confirmed",
						`Refer to loc${data.createNewOrder.id.slice(
							16
						)} in All Orders panel`
					);
					if (methodType?.type === "KHATA") {
						handlePresentKhataModalPress();
					} else if (methodType?.type === "UPI") {
						handlePresentModalPress();
					} else {
						dispatch(emptyICart([]));
						navigation.navigate("QuickBill");
					}
				}
			},
			onError(err) {
				Alert.alert("Wait !!!", `${err}. Check order, try again!`);
				console.log(err);
			},
		}
	);

	const [addNewRunningAccount, { loading: addingAccount }] = useMutation(
		ADD_RUNNING_ACCOUNT,
		{
			variables: {
				addToRunningAccountInput: {
					...newRunningAccount,
					orderId: data?.createNewOrder.id.toString(),
				},
			},
			onCompleted(data) {
				if (data.addToRunningAccount) {
					dispatch(
						setRunningAccounts(
							data.addToRunningAccount.runningAccounts
						)
					);
					bottomSheetKhataModalRef.current?.close();
					bottomSheetModalRef.current?.close();
					handleClearStates();
					dispatch(emptyICart([]));
					navigation.navigate("QuickBill");
				}
			},
			onError(err) {
				console.log({
					...newRunningAccount,
					orderId: data?.createNewOrder.id.toString(),
				});
				console.log(err);
			},
		}
	);

	const { data: options, loading: gettingPaymentOptions } = useQuery(
		GET_PAYMENT_OPTIONS,
		{
			onCompleted(data) {
				setMethodType(data?.getPaymentOptions[0].data[1]);
			},
			onError(err) {
				console.log(err);
			},
		}
	);

	useEffect(() => {
		var tempAmount = 0;
		if (cart.length >= 0) {
			cart.forEach((element: any) => {
				tempAmount += parseFloat(element.totalPrice);
			});
		}
		setTotalAmount(tempAmount.toString());

		setPaymentUri(
			`upi://pay?pa=${user?.upiAddress}&pn=${user?.name}&tr=${
				data?.createNewOrder ? data.createNewOrder.id : transactionId
			}&mc=${mc}&tn=${
				message + data?.createNewOrder.id
			}&am=${tempAmount.toString()}&cu=${currency}`
		);
	}, [cart, data]);

	if (cart.length < 1) {
		return (
			<View style={CommonStyles.container}>
				<View style={CommonStyles.loadingContainer}>
					<BoldText style={CommonStyles.title}>
						Redirecting...
					</BoldText>
				</View>
			</View>
		);
	}

	function handlePaymentOption(data: any) {
		if (data.type === "UPI") {
			if (user.upiAddress === null) {
				navigation.navigate("ManagePayment");
			}
		} else {
			setMethodType(data);
		}
	}

	return (
		<>
			<SelectContact
				contactValue={newRunningAccount}
				onSelectValue={setNewRunningAccount}
				bottomSheetModalRef={bottomSheetContactModalRef}
				snapPoints={largeSnapPoints}
				handleSheetChanges={handleSheetChanges}
			/>
			<QRModal
				paymentUri={paymentUri}
				bottomSheetModalRef={bottomSheetModalRef}
				snapPoints={snapPoints}
				handleSheetChanges={handleSheetChanges}
				closeQR={() => {
					bottomSheetModalRef.current?.close();
					handleClearStates();
					dispatch(emptyICart([]));
					navigation.navigate("QuickBill");
				}}
				key={94938418384}
			/>
			<KhataModal
				bottomSheetContactModalRef={bottomSheetContactModalRef}
				bottomSheetKhataModalRef={bottomSheetKhataModalRef}
				handleSheetChanges={handleSheetChanges}
				addNewRunningAccount={() => addNewRunningAccount()}
				largeSnapPoints={largeSnapPoints}
				addingAccount={addingAccount}
				newRunningAccount={newRunningAccount}
				setNewRunningAccount={setNewRunningAccount}
				key={94243431}
			/>

			{/* Main Screen */}
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<TouchableOpacity
							onPress={() => navigation.navigate("QuickBill")}
						>
							<AntDesign name="back" size={25} color="#222" />
						</TouchableOpacity>
						<View style={CommonStyles.screenTitle}>
							<BoldText style={CommonStyles.title}>
								Checkout
							</BoldText>
						</View>
					</View>

					<View style={CommonStyles.section}>
						<BoldText style={CommonStyles.sectionHeader}>
							Order Items
						</BoldText>
						<FlatList
							data={cart}
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
												style={
													CartSheetStyles.productMeta
												}
											>
												{item.quantity.count}
												{item.quantity.type} x{" "}
												{item.itemQuantity}
											</Text>
										</View>

										<Text
											style={{
												...CartSheetStyles.productName,
												textAlign: "right",
											}}
										>
											₹ {item.totalPrice}/-
										</Text>
									</View>
								</View>
							)}
						/>
					</View>

					<View style={CommonStyles.seperator} />

					<View style={{ ...CommonStyles.section, marginBottom: 0 }}>
						<View style={CommonStyles.sectionRow}>
							<BoldText style={CommonStyles.sectionHeader}>
								Grand Total
							</BoldText>
							<Counter
								number={totalAmount}
								onChange={(text: string) =>
									setTotalAmount(text)
								}
								preText="₹"
								onPressAdd={() =>
									setTotalAmount(
										(parseFloat(totalAmount) + 1).toString()
									)
								}
								onPressMinus={() =>
									setTotalAmount(
										(parseFloat(totalAmount) - 1).toString()
									)
								}
								fontSize={18}
							/>
						</View>
					</View>

					<View style={CommonStyles.seperator} />

					<View style={CommonStyles.section}>
						<BoldText style={CommonStyles.sectionHeader}>
							Method of Payment
						</BoldText>
						{options && (
							<View style={styles.optionsContainer}>
								{options?.getPaymentOptions.map((obj: any) =>
									obj.data.map((payobj: any) => (
										<TouchableOpacity
											onPress={() =>
												handlePaymentOption(payobj)
											}
											style={{
												flex:
													methodType?.type ===
													payobj.type
														? 1
														: 0,
												height: 50,
												flexDirection: "row",
												alignItems: "center",
												justifyContent:
													methodType?.type ===
													payobj.type
														? "flex-start"
														: "center",
												backgroundColor:
													methodType?.type ===
													payobj.type
														? "#111"
														: "transparent",
												borderRadius: 5,
												paddingHorizontal: 10,
											}}
										>
											<ImageLoader
												source={`${ICON_URI}${
													methodType?.type ===
													payobj.type
														? payobj?.uri1
														: payobj?.uri
												}`}
												fallback={[
													`${ICON_URI}imagedefault.png`,
												]}
												style={{
													height: 30,
													width: 30,
												}}
											/>
											{methodType?.type ===
												payobj.type && (
												<BoldText
													style={{
														marginLeft: 10,
														color: "#fff",
													}}
												>
													{payobj.mode}
												</BoldText>
											)}
										</TouchableOpacity>
									))
								)}
							</View>
						)}
					</View>
				</View>
				<View
					style={{
						width: "90%",
						marginBottom: "5%",
						alignSelf: "center",
					}}
				>
					<ActionBtn
						disabled={methodType === null ? true : false}
						disable={methodType === null ? true : false}
						onPress={() => createOrder()}
					>
						{creating ? (
							<ActivityIndicator color="#fff" />
						) : (
							<ActionBtnText>Confirm Order</ActionBtnText>
						)}
					</ActionBtn>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	optionsContainer: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		marginTop: 5,
	},
	optionBtn: {
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		justifyContent: "flex-start",
		padding: 10,
		borderWidth: 1,
		borderColor: "#888",
		borderRadius: 5,
		marginBottom: 5,
	},
	optionText: { fontSize: 18, marginLeft: 10 },
	rowContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});
