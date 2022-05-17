import React, {
	useState,
	useEffect,
	useCallback,
	useRef,
	useMemo,
} from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";

import Toast from "react-native-toast-message";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";

import { addToICart, emptyICart, setItemQuantity } from "../../redux/actions";
import { RootTabScreenProps } from "../../types";

import AddToInventory from "../../components/AddToInventory";
import BarcodeScanner from "../../components/Common/BarcodeScanner";
import DynamicStatusBar from "../../components/Common/StatusBar";
import { CommonStyles } from "../../components/Common/Elements";
import { BoldText, Text, TextInput } from "../../components/Common/Themed";
import { CustomBackdrop } from "../../components/Common/ModalStyle";
import { ProductTile } from "../../components/QuickBill/ProductTile";
import { FETCH_PRODUCT_BARCODE, GET_PRODUCTS } from "../../graphql/productdefs";
import { useLazyQuery } from "@apollo/client";
import ProductItem from "../../components/Common/ProductItem";
import SearchList from "../../components/QuickBill/SearchList";

export default function QuickBill({
	navigation,
}: RootTabScreenProps<"QuickBill">) {
	// trigger when barcode is scanned
	const [scanned, setScanned] = useState<boolean>(false);

	const [text, setText] = useState<string>("");
	const [listSwitch, setListSwitch] = useState<boolean>(false);
	const [bound, setBound] = useState<boolean>(false);
	const [focus, setFocus] = useState<boolean>(false);
	const [total_amount, setTotal_Amount] = useState<string>("0");

	const dispatch = useDispatch();

	// redux store values
	const { inventory } = useSelector((state: any) => state.inventoryReducer);
	const { cart } = useSelector((state: any) => state.iCartReducer);
	const { store } = useSelector((state: any) => state.storeReducer);

	// hot add
	const [search, setSearch] = useState("");
	const [fetchedProducts, setFetchedProducts] = useState<any>(null);
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [product, setProduct] = useState<any>();
	// sku item modal
	const bottomSheetSkuModalRef = useRef<BottomSheetModal>(null);
	const skuModalSnapPoints = useMemo(() => ["45%"], []);
	const handleSkuModalSheetChanges = useCallback(() => {}, []);

	// snap points
	const snapPoints = useMemo(() => ["50%", "70%"], []);

	// callbacks
	const handleSheetChanges = useCallback(() => {}, []);

	useEffect(() => {
		setListSwitch(!listSwitch);
	}, [cart, inventory]);

	function showToast(message1: string, message2: string, type: number) {
		Toast.show({
			type: type === 1 ? "success" : "error",
			text1: message1,
			text2: message2,
		});
	}

	const [
		searchProducts,
		{ data, loading: fetchingProducts, refetch: refetchProducts },
	] = useLazyQuery(GET_PRODUCTS, {
		variables: { name: search, storeId: store.id, limit: 0, offset: 20 },
		notifyOnNetworkStatusChange: true,
		fetchPolicy: "no-cache",
		onCompleted(data) {
			const cntx: any = [];
			data?.getAllProducts
				?.filter((e: any) =>
					e.name
						.toLowerCase()
						.includes(
							search.trim().length !== 0
								? search
								: e.name.toLowerCase()
						)
				)
				.forEach((obj: any) => {
					cntx.push(obj);
				});
			setFetchedProducts(cntx);
		},
		onError(err) {
			console.log(err);
		},
	});

	const [fetchProduct, { loading, refetch, networkStatus }] = useLazyQuery(
		FETCH_PRODUCT_BARCODE,
		{
			variables: {
				barcode: text || "",
				productId: "",
				storeId: store.id,
			},
			fetchPolicy: "no-cache",
			notifyOnNetworkStatusChange: true,
			onCompleted(data) {
				if (data.fetchProductByBarcode.data) {
					const product = data.fetchProductByBarcode.data;
					handleBarCodeScanned(product);
				}
			},
			onError(err) {
				showToast(
					"Error Occured",
					"Could not fetch product details.",
					0
				);
				console.log(err);
				// navigation.navigate("Store");
			},
		}
	);

	// when barcode is scanned
	const handleBarCodeScanned = async (data: any) => {
		if (inventory?.products) {
			const inventoryProducts = inventory.products;
			const scannedProduct = inventoryProducts.find(
				(e: any) => e.id === data.id
			);
			const cartProduct = cart.find((e: any) => e.id === data.id);

			if (scannedProduct) {
				const updatedProduct = {
					...scannedProduct,
					barcode: data.barcode,
					quantity: data.quantity,
					brand: data.brand,
				};

				if (cart.length === 0 || cartProduct === undefined) {
					if (!scannedProduct.divisible) {
						dispatch(addToICart(updatedProduct));
					} else {
						dispatch(
							setItemQuantity({
								product: updatedProduct,
								quantity: scannedProduct.itemQuantity,
							})
						);
					}
				} else {
					const q1 = parseFloat(scannedProduct.itemQuantity);
					const q2 = parseFloat(cartProduct?.itemQuantity);
					if (q1 >= q2 + 1) {
						if (!scannedProduct.divisible) {
							dispatch(addToICart(updatedProduct));
						} else {
							dispatch(
								setItemQuantity({
									product: updatedProduct,
									quantity: q1,
								})
							);
						}
					} else {
						showToast(
							"Attention!",
							"Cannot add to cart. Item out of stock now.",
							0
						);
					}
				}
			} else {
				showToast(
					"Cannot add to cart.",
					"Item not in inventory. Search and add.",
					0
				);
				bottomSheetModalRef.current?.present();
			}
		}
	};

	function handleFetchProduct({ data }: any) {
		setText(data);
		setScanned(true);
		fetchProduct({
			variables: {
				barcode: data,
				productId: "",
				storeId: store.id,
			},
		});
	}

	// whenever the function above is called and cart changes, change bill total
	useEffect(() => {
		var tempAmount = 0;
		if (cart.length >= 0) {
			cart.forEach((element: any) => {
				tempAmount += parseFloat(element.totalPrice);
			});
		}
		setTotal_Amount(tempAmount.toString());
		cart.length === 0 && setScanned(false);
	}, [cart]);

	function RenderItem({ item }: any) {
		return (
			<ProductItem
				data={item}
				fullScreen={false}
				onPress={(item: any) => {
					dispatch(addToICart(item));
					bottomSheetModalRef.current?.close();
				}}
			/>
		);
	}

	const memoizedValue = useMemo(() => RenderItem, [data?.fetchedProducts]);

	useEffect(() => {
		if (search.length !== 0) {
			searchProducts({
				variables: {
					storeId: store.id,
					name: search,
					limit: 0,
					offset: 20,
				},
			});
		}
	}, [search]);

	if (!store || !inventory) {
		return (
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.loadingContainer}>
						<BoldText style={{ fontSize: 25 }}>
							<BoldText style={{ color: "#1ea472" }}>
								Register your Store
							</BoldText>{" "}
							then{" "}
							<BoldText style={{ color: "#1ea472" }}>
								create your inventory
							</BoldText>{" "}
							to start making reciepts
						</BoldText>
					</View>
				</View>
			</View>
		);
	}

	return (
		<>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={1}
				key={5006003001}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				style={{
					borderRadius: 20,
				}}
				backdropComponent={CustomBackdrop}
				onDismiss={() => setScanned(false)}
			>
				<View
					style={{
						width: "90%",
						alignSelf: "center",
					}}
				>
					<View style={styles.search}>
						<Ionicons
							name="search-outline"
							color="#111"
							size={20}
						/>
						<TextInput
							style={styles.searchInput}
							value={search}
							onChangeText={(text) => setSearch(text)}
							placeholder="Search products"
						/>
						<TouchableOpacity
							onPress={() => {
								setSearch("");
							}}
							delayPressIn={0}
						>
							<Ionicons
								name="close-outline"
								color="#111"
								size={20}
							/>
						</TouchableOpacity>
					</View>

					<BottomSheetFlatList
						data={fetchedProducts}
						renderItem={memoizedValue}
						keyExtractor={(e: any) => e.id.toString()}
					/>
				</View>
			</BottomSheetModal>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View
						style={{
							...CommonStyles.screenTitle,
							width: "100%",
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<BoldText
							style={{ ...CommonStyles.title, color: "#666" }}
						>
							Reciept
						</BoldText>
						<BoldText style={CommonStyles.title}>
							₹ {cart.length >= 0 ? total_amount : "0"}/-
						</BoldText>
					</View>
					{focus ? (
						<View style={{ width: "100%" }}>
							<SearchList
								focus={focus}
								setFocus={setFocus}
								fullScreen={false}
								onPressItem={(item: any) =>
									handleBarCodeScanned(item)
								}
							/>
						</View>
					) : (
						<View style={styles.barcodeScannerContainer}>
							<View style={styles.barcodebox}>
								<BarcodeScanner
									height={620}
									width={620}
									scanned={scanned}
									handleBarCodeScanned={handleFetchProduct}
									revertPath="QuickBill"
								/>
							</View>
						</View>
					)}
					<FlatList
						renderItem={({ item }) => (
							<ProductTile
								data={item}
								maxQuant={
									parseFloat(
										inventory.products?.find(
											(e: any) => e.id === item.id
										)?.itemQuantity
									) || 100
								}
							/>
						)}
						keyExtractor={(e) => e.id}
						data={cart}
						extraData={listSwitch}
						style={{ width: "100%" }}
					/>
				</View>
				<View style={styles.actions}>
					{/* TODO: CASH or UPI Screen on confirmation, then create reciept */}
					<TouchableOpacity
						style={{
							...styles.actionBtn,
							backgroundColor:
								cart.length === 0 ? "#555" : "#1ea472",
						}}
						onPress={() => navigation.navigate("Pay")}
						disabled={cart.length === 0}
						activeOpacity={0.8}
					>
						<Text style={styles.actionBtnText}>Confirm Bill</Text>
					</TouchableOpacity>

					<View
						style={{
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<TouchableOpacity
							onPress={() => dispatch(emptyICart([]))}
							disabled={cart.length <= 0}
							activeOpacity={0.8}
							delayPressIn={0}
							style={{
								borderColor:
									cart.length <= 0 ? "#888" : "#ee0000",
								borderRadius: 30,
								borderWidth: 1,
								padding: 10,
							}}
						>
							<Ionicons
								name="trash-outline"
								color={cart.length <= 0 ? "#888" : "#ee0000"}
								size={25}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => setFocus(!focus)}
							activeOpacity={0.8}
							delayPressIn={0}
							style={{
								borderColor: "#111",
								borderRadius: 30,
								borderWidth: 1,
								padding: 10,
								marginTop: 20,
							}}
						>
							<AntDesign
								name={focus ? "scan1" : "search1"}
								color="#111"
								size={25}
							/>
						</TouchableOpacity>

						{scanned && (
							<TouchableOpacity
								onPress={() => setScanned(false)}
								activeOpacity={0.8}
								delayPressIn={0}
								style={{
									borderColor: "#111",
									backgroundColor: "#111",
									borderRadius: 30,
									borderWidth: 1,
									padding: 10,
									marginTop: 20,
								}}
							>
								<Ionicons
									name="add-sharp"
									color="#fff"
									size={25}
								/>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	barcodeScannerContainer: {
		flexDirection: "column",
		alignItems: "center",
	},
	barcodebox: {
		width: 350,
		height: 250,
		backgroundColor: "#111",
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
		borderRadius: 10,
	},
	actions: {
		position: "absolute",
		bottom: 0,
		zIndex: 1,
		right: 0,
		marginRight: 20,
		marginBottom: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		width: "90%",
		alignSelf: "center",
	},
	actionBtn: {
		height: 50,
		paddingHorizontal: 20,
		backgroundColor: "#1ea472",
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	actionBtnText: {
		fontSize: 18,
		color: "#eee",
	},
	search: {
		flex: 1,
		backgroundColor: "#e9e9e9",
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		marginBottom: 10,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		marginLeft: 10,
	},
});
