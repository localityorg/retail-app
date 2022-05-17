import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	StyleSheet,
	StatusBar,
	TouchableOpacity,
	RefreshControl,
	ScrollView,
	ActivityIndicator,
	FlatList,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import Toast from "react-native-toast-message";

import {
	CategoryBtn,
	CategoryBtnText,
	CommonStyles,
	LoadingContainer,
} from "../../components/Common/Elements";
import { SearchList } from "./SearchList";
import { ScanBarcode } from "./ScanBarcode";
import { ProductValueCard } from "./ProductValueCard";
import { EditVendorScreen } from "./EditVendorScreen";
import { SetQuantityModal } from "./SetQuantityModal";
import { ActionsOnProduct } from "./ActionsOnProduct";
import { ProductInfoToast } from "./ProductToastInput";
import { VendorDetailsCard } from "./VendorDetailsCard";
import { BoldText, View, Text } from "../../components/Common/Themed";

import {
	ADD_TO_INVENTORY,
	GET_PRODUCT_FROM_INVENTORY,
} from "../../graphql/inventorydefs";
import {
	EDIT_PRODUCT_MUTATION,
	FETCH_PRODUCT_BARCODE,
	GET_PRODUCT_CATEGORIES,
	GET_PRODUCT_INFO,
} from "../../graphql/productdefs";

import { units } from "../../constants/Units";

import { RootTabScreenProps } from "../../types";
import DynamicStatusBar from "../../components/Common/StatusBar";

interface ScannedText {
	type: string;
	data: string;
}

export default function ProductInfo({
	route,
	navigation,
}: RootTabScreenProps<"ProductInfo">) {
	const { storeId, productBarcode, id }: any = route.params;

	const [scanned, setScanned] = useState<boolean>(
		productBarcode === null ? false : true
	);
	const [text, setText] = useState<any>(
		productBarcode !== null ? productBarcode : null
	);
	const [loadingFlag, setLoadingFlag] = useState(true);
	const [productId, setProductId] = useState(id || null);
	// const [editProductBool, setEditProductBool] = useState(false);

	const [fetchedCategories, setFetchedCategories] = useState([]);
	const [categories, setCategories] = useState([]);
	const [message, setMessage] = useState({
		displayMessage: "",
		displaySubMessage: "",
		inventory: true,
	});
	const [vendorDetails, setVendorDetails] = useState<any>({
		name: null,
		contact: {
			ISD: null,
			number: null,
		},
	});
	const [editMode, setEditMode] = useState(false);
	const [editVendor, setEditVendor] = useState(false);
	const [productValue, setProductValue] = useState({
		id: "",
		brand: "",
		name: "",
		barcode: "",
		imageUrl: "",
		itemQuantity: "0",
		price: {
			mrp: "0",
			sale: "",
		},
		quantity: {
			count: "0",
			type: "ml",
		},
	});
	const [quantityState, setQuantityState] = useState(units[0]);

	const handleBarCodeScanned = (props: ScannedText) => {
		setScanned(true);
		setText(props.data);
	};

	// bottom sheet references
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ["50%"], []);
	const handleSheetChanges = useCallback(() => {}, []);

	// search bottom sheet
	const bottomSheetSearchModalRef = useRef<BottomSheetModal>(null);
	const snapSearchPoints = useMemo(() => ["70%"], []);
	const handleSearchSheetChanges = useCallback(() => {}, []);

	const _ = useQuery(GET_PRODUCT_CATEGORIES, {
		onCompleted(data) {
			setFetchedCategories(data.productCategories);
		},
		onError(err) {
			console.log(err);
		},
	});

	function showToast(message1: string, message2: string, num: number) {
		Toast.show({
			type: num === 1 ? "success" : "error",
			text1: message1,
			text2: message2,
		});
	}

	const [editProduct, { loading: editingProduct }] = useMutation(
		EDIT_PRODUCT_MUTATION,
		{
			variables: {
				editProductInput: {
					productValue,
					categories,
					barcode: text,
					productId,
				},
			},
			onCompleted(data) {
				if (!data.editProduct.error) {
					setProductValue({
						...productValue,
						id: data.editProduct.message,
					});
					showToast(
						"Success",
						`Product has been edited & can be added to inventory`,
						1
					);
				}
			},
			onError(err) {
				console.log(err);
				showToast(
					"Error",
					`Product ${productValue.name} cannot be edited`,
					0
				);
			},
		}
	);

	const [addToInventory, { loading: addLoading }] = useMutation(
		ADD_TO_INVENTORY,
		{
			variables: {
				inventoryProductInput: {
					productValue,
					contact: vendorDetails,
					barcode: text,
				},
				storeId,
			},
			onCompleted(data) {
				if (data?.addToInventory) {
					setCategories([]);
					setVendorDetails({
						name: null,
						contact: { ISD: null, number: null },
					});
					setMessage({
						displayMessage: "",
						displaySubMessage: "",
						inventory: true,
					});
					setProductId(null);
					setProductValue({
						id: "",
						brand: "",
						name: "",
						barcode: "",
						imageUrl: "",
						price: {
							mrp: "0",
							sale: "",
						},
						itemQuantity: "0",
						quantity: {
							count: "0",
							type: "ml",
						},
					});
					setScanned(false);
					navigation.navigate("Store");
				}
			},
			onError(err) {
				showToast(
					"Error Occured",
					"Recheck values and try submitting again!",
					0
				);
				console.log({
					productValue,
					contact: vendorDetails,
					barcode: text,
				});
				console.log(err);
			},
		}
	);

	const [fetchProduct, { loading, refetch, networkStatus }] = useLazyQuery(
		FETCH_PRODUCT_BARCODE,
		{
			variables: {
				barcode: text || "",
				productId: productId || "",
				storeId,
			},
			fetchPolicy: "no-cache",
			notifyOnNetworkStatusChange: true,
			onCompleted(data) {
				setEditMode(data.fetchProductByBarcode.error);
				if (data.fetchProductByBarcode.data) {
					const productExistInInventory =
						data.fetchProductByBarcode.data;
					setProductValue({
						id: productExistInInventory.id,
						name: productExistInInventory.name,
						brand: productExistInInventory.brand,
						imageUrl: productExistInInventory.imageUrl,
						itemQuantity:
							productExistInInventory.itemQuantity || "0",
						quantity: productExistInInventory.quantity,
						barcode: text,
						price: productExistInInventory.price,
					});
					if (!data.fetchProductByBarcode.error) {
						setVendorDetails({
							name: productExistInInventory.vendor.name,
							contact: productExistInInventory.vendor.contact,
						});
					}
				}
				setLoadingFlag(false);
				setMessage({
					...message,
					displayMessage: data.fetchProductByBarcode.message,
				});
			},
			onError(err) {
				showToast(
					"Error Occured",
					"Could not fetch product details.",
					0
				);
				console.log(err);
				navigation.navigate("Store");
			},
		}
	);

	function handleSearchProductPress(item: any) {
		setProductId(item.id);
		setProductValue({ ...item, itemQuantity: "0" });
	}

	function handleCategories(obj: any) {
		const ctgs: any = [...categories];
		const ctg = ctgs.findIndex((e: any) => e === obj);
		if (ctg > -1) {
			ctgs.splice(ctg, 1);
		} else {
			ctgs.push(obj);
		}
		setCategories(ctgs);
	}

	useEffect(() => {
		if (text !== null || productId !== null) {
			fetchProduct();
		}
	}, [text]);

	if (editVendor) {
		return (
			<EditVendorScreen
				editVendor={editVendor}
				setEditVendor={setEditVendor}
				setVendorDetails={setVendorDetails}
				vendorDetails={vendorDetails}
			/>
		);
	}

	if (!scanned && productBarcode === null) {
		return (
			<ScanBarcode
				scanned={scanned}
				handleBarCodeScanned={handleBarCodeScanned}
			/>
		);
	}

	if (loadingFlag) {
		return (
			<>
				<DynamicStatusBar />
				<LoadingContainer />
			</>
		);
	}

	return (
		<>
			<SearchList
				bottomSheetSearchModalRef={bottomSheetSearchModalRef}
				snapSearchPoints={snapSearchPoints}
				handleSearchSheetChanges={handleSearchSheetChanges}
				onPressClose={() => bottomSheetModalRef.current?.close()}
				onPressName={(item: any) => handleSearchProductPress(item)}
			/>
			<SetQuantityModal
				bottomSheetModalRef={bottomSheetModalRef}
				handleSheetChanges={handleSheetChanges}
				snapPoints={snapPoints}
				productValue={productValue}
				setProductValue={setProductValue}
				setQuantityState={setQuantityState}
				quantityState={quantityState}
			/>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<ScrollView
						style={{ flex: 1, paddingBottom: 70 }}
						refreshControl={
							<RefreshControl
								refreshing={networkStatus === 4 || loading}
								onRefresh={refetch}
							/>
						}
					>
						<View style={CommonStyles.header}>
							<TouchableOpacity
								onPress={() => navigation.navigate("Store")}
							>
								<AntDesign name="back" size={25} color="#222" />
							</TouchableOpacity>
							<View
								style={{
									...CommonStyles.screenTitle,
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "flex-end",
								}}
							>
								<BoldText style={CommonStyles.title}>
									Product
								</BoldText>
								<TouchableOpacity
									onPress={() => {
										setScanned(false);
										setText(null);
									}}
									style={{
										marginLeft: "7%",
									}}
								>
									<AntDesign
										name="reload1"
										color="#111"
										size={25}
									/>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={() => {
										bottomSheetSearchModalRef.current?.present();
									}}
									style={{
										marginLeft: "7%",
									}}
								>
									<AntDesign
										name="tago"
										color="#111"
										size={25}
									/>
								</TouchableOpacity>
							</View>
						</View>

						<View
							style={{
								flex: 1,
							}}
						>
							<ProductValueCard
								productValue={productValue}
								setProductValue={setProductValue}
								editMode={editMode}
								bottomSheetModalRef={bottomSheetModalRef}
							/>
							{/* <View
								style={{
									width: "100%",
									flexDirection: "row",
									alignItems: "flex-start",
									justifyContent: "space-between",
								}}
							>
								<Text style={{ width: "80%" }}>
									Is the item loose? (eg: Dal, Wheat Grains)
									If Yes then mention price per kg/grams/L/ml
									above
								</Text>
								<TouchableOpacity
									onPress={() =>
										setProductValue({
											...productValue,
											divisible: !productValue.divisible,
										})
									}
									disabled={!editMode}
								>
									<Ionicons
										name="checkbox"
										size={25}
										color={
											!productValue.divisible
												? "#888"
												: "#1ea472"
										}
									/>
								</TouchableOpacity>
							</View> */}
							<View style={styles.separator} />
							<FlatList
								data={fetchedCategories}
								listKey="9008594321"
								numColumns={4}
								keyExtractor={(e) => e}
								extraData={categories}
								renderItem={({ item }) => (
									<CategoryBtn
										active={
											categories.find((e) => e === item)
												? true
												: false
										}
										onPress={() => handleCategories(item)}
									>
										<CategoryBtnText
											active={
												categories.find(
													(e) => e === item
												)
													? true
													: false
											}
										>
											{item}
										</CategoryBtnText>
									</CategoryBtn>
								)}
								ListFooterComponent={
									<>
										<View style={styles.separator} />
										{vendorDetails.contact.number ? (
											<>
												<VendorDetailsCard
													editVendor={editVendor}
													vendorDetails={
														vendorDetails
													}
													setEditVendor={
														setEditVendor
													}
													setVendorDetails={
														setVendorDetails
													}
												/>
												<View
													style={styles.separator}
												/>
											</>
										) : (
											<TouchableOpacity
												style={{
													...styles.vendorActionBtn,
													backgroundColor: "#111111",
													width: "100%",
													marginBottom: 10,
												}}
												onPress={() =>
													setEditVendor(!editVendor)
												}
											>
												<Text
													style={{
														...styles.vendorActionBtnText,
														color: "#eee",
													}}
												>
													Add Vendor
												</Text>
											</TouchableOpacity>
										)}

										<ActionsOnProduct
											productValue={productValue}
											setProductValue={setProductValue}
											addLoading={addLoading}
											onPressAddToInventory={() =>
												addToInventory()
											}
										/>

										<TouchableOpacity
											style={{
												...styles.vendorActionBtn,
												backgroundColor: "#1ea47222",
												width: "100%",
												marginBottom: 10,
											}}
											onPress={() => editProduct()}
										>
											{editingProduct ? (
												<ActivityIndicator color="#111" />
											) : (
												<Text
													style={{
														...styles.vendorActionBtnText,
														color: "#111",
													}}
												>
													Edit Product
												</Text>
											)}
										</TouchableOpacity>
									</>
								}
							/>
						</View>

						{!message.inventory && (
							<ProductInfoToast message={message} />
						)}
					</ScrollView>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	separator: {
		height: 1,
		width: "100%",
		alignSelf: "center",
		backgroundColor: "#11111122",
		marginVertical: 20,
	},
	statusBar: {
		marginBottom: 10,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	scannedText: {
		fontSize: 18,
		margin: 10,
	},
	cameraSwitch: {
		marginVertical: 10,
		backgroundColor: "#111",
		padding: 10,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
	cameraSwitchText: {
		color: "#fff",
	},
	vendorActionBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
		padding: 10,
	},
	vendorActionBtnText: {
		marginLeft: 10,
		fontSize: 16,
	},
});
