import React, {
	useEffect,
	useState,
	useCallback,
	useContext,
	useRef,
	useMemo,
} from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	TextInput,
	FlatList,
	Linking,
	Alert,
	BackHandler,
} from "react-native";

import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";

import DynamicStatusBar from "../../components/Common/StatusBar";
import Logo from "../../components/Common/Logo";
import { BoldText, Text } from "../../components/Common/Themed";
import {
	CommonStyles,
	LoadingContainer,
} from "../../components/Common/Elements";

import {
	setInventory as setInventoryRedux,
	setStore,
	setUser,
} from "../../redux/actions";

import { AuthContext } from "../../context/auth";

import {
	CREATE_INVENTORY,
	GET_INVENTORY,
	INVENTORY_STATUS,
} from "../../graphql/inventorydefs";
import { GET_STORE, STORE_UPDATE } from "../../graphql/storedefs";
import { LOGIN_USER } from "../../graphql/userdefs";
import { FETCH_TODAYSTAT } from "../../graphql/statdefs";

import { ICON_URI, IMG_URI } from "../../constants/Urls";

import { RootTabScreenProps } from "../../types";
import { CustomBackdrop } from "../../components/Common/ModalStyle";

interface InventoryCardProps {
	data: any;
}

function InventoryCard(props: InventoryCardProps) {
	const [cardState, setCardState] = useState(false);
	const { store } = useSelector((state: any) => state.storeReducer);
	const navigation: any = useNavigation();

	return (
		<View style={styles.inventoryProduct}>
			<View style={styles.rowContainer}>
				<View
					style={{
						flex: 1,
						flexDirection: "column",
						alignItems: "flex-start",
					}}
				>
					<BoldText style={styles.productName}>
						{props.data.name}
					</BoldText>
				</View>
				<View
					style={{
						flexDirection: "column",
						alignItems: "flex-end",
						marginLeft: 10,
					}}
				>
					<BoldText style={styles.productName}>
						₹ {props.data.price.mrp}
					</BoldText>
				</View>
				{!cardState && (
					<View
						style={{
							marginLeft: 15,
							padding: 10,
							backgroundColor: "#eee",
						}}
					>
						<Text>{props.data.itemQuantity}</Text>
					</View>
				)}
				<TouchableOpacity
					style={{ marginLeft: 10 }}
					onPress={() => setCardState(!cardState)}
				>
					<Ionicons
						name={cardState ? "chevron-up" : "chevron-down"}
						size={23}
						color="#888"
					/>
				</TouchableOpacity>
			</View>
			{cardState && (
				<>
					<View style={styles.seperator} />
					<View style={styles.rowContainer}>
						<View
							style={{
								...styles.actionBtnContainer,
								borderRadius: 10,
								overflow: "hidden",
							}}
						>
							<TouchableOpacity
								style={styles.cardactionBtn}
								onPress={() =>
									navigation.navigate("ProductInfo", {
										storeId: store?.id,
										productBarcode: props.data.barcode,
										id: props.data.id,
									})
								}
							>
								<Ionicons
									name="add-outline"
									size={23}
									color="#111"
								/>
							</TouchableOpacity>
							<Text style={styles.quantityText}>
								{props.data.itemQuantity}
							</Text>
							<TouchableOpacity
								style={styles.cardactionBtn}
								onPress={() =>
									navigation.navigate("ProductInfo", {
										storeId: store?.id,
										productBarcode: props.data.barcode,
										id: props.data.id,
									})
								}
							>
								<Ionicons
									name="remove-outline"
									size={23}
									color="#111"
								/>
							</TouchableOpacity>
						</View>
						<TouchableOpacity
							style={styles.actionBtn2}
							onPress={() => {
								props.data.vendor.vendorNumber
									? Linking.canOpenURL(
											`tel:${props.data.vendor.vendorNumber}`
									  ).then((supported: any) => {
											if (!supported) {
												Alert.alert(
													"Number is not valid",
													"Check/Edit Vendor Details"
												);
											} else {
												return Linking.openURL(
													`tel:${props.data.vendor.vendorNumber}`
												);
											}
									  })
									: navigation.navigate("ProductInfo", {
											storeId: store?.id,
											productBarcode: props.data.barcode,
											id: props.data.id,
									  });
							}}
						>
							{props.data.vendor.vendorNumber ? (
								<Ionicons
									name="call-outline"
									size={23}
									color="#1ea472"
								/>
							) : (
								<Ionicons
									name="add-outline"
									size={23}
									color="#1ea472"
								/>
							)}
							<Text style={{ marginLeft: 10, color: "#1ea472" }}>
								{props.data.vendor.vendorNumber
									? "Call "
									: "Edit "}
								Vendor
							</Text>
						</TouchableOpacity>
					</View>
				</>
			)}
		</View>
	);
}

interface StoreProps {
	navigation: any;
	refetch: any;
	storeStat: any;
	statFetch: any;
	loadingInventory: any;
	networkStatus: any;
	refetchStore: any;
	storeNetworkStatus: any;
	createInventory: any;
}

function Inventory(props: StoreProps) {
	const [categoryId, setCategoryId] = useState(null);
	const [search, setSearch] = useState("");
	const [products, setProducts] = useState<any>([]);

	const { inventory } = useSelector((state: any) => state.inventoryReducer);
	const { store } = useSelector((state: any) => state.storeReducer);

	const navigation: any = useNavigation();

	//
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ["25%"], []);
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
	const handleSheetChanges = useCallback(() => {}, []);

	//
	useEffect(() => {
		const cntx: any = [];
		inventory?.products
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

		return setProducts(cntx);
	}, [search]);

	//
	useEffect(() => {
		inventory && setProducts(inventory.products);
	}, [inventory]);

	return (
		<>
			<TouchableOpacity
				style={styles.stats}
				onPress={() => {
					props.refetchStore();
					navigation.navigate("Stats");
				}}
			>
				<View style={styles.statContainer}>
					<Text style={styles.statTitle}>Orders today</Text>
					<BoldText style={styles.statNumber}>
						{props.storeStat.count}
					</BoldText>
				</View>

				<View style={styles.statSeperator} />

				<View style={styles.statContainer}>
					<Text style={styles.statTitle}>Amount Recieved</Text>
					<BoldText style={styles.statNumber}>
						₹ {props.storeStat.total_amount}/-
					</BoldText>
				</View>
			</TouchableOpacity>
			{/* search bar */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					width: "100%",
				}}
			>
				<View style={styles.search}>
					{search.trim().length === 0 && (
						<Ionicons
							name="search-outline"
							color="#888"
							size={20}
						/>
					)}
					<TextInput
						style={styles.searchInput}
						value={search}
						onChangeText={(text) => setSearch(text)}
						placeholder="Search in inventory"
					/>
					{search.trim().length === 0 ? (
						<TouchableOpacity
							onPress={() => {
								setSearch("");
								props.navigation.navigate("ProductInfo", {
									storeId: store?.id,
									productBarcode: null,
									id: null,
								});
							}}
							style={{
								backgroundColor: "#888",
								borderRadius: 10,
								padding: 5,
							}}
						>
							<Ionicons name="scan" color="#fff" size={20} />
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							onPress={() => {
								setSearch("");
							}}
							style={{
								backgroundColor: "#888",
								borderRadius: 10,
								padding: 5,
							}}
						>
							<Ionicons
								name="close-outline"
								color="#fff"
								size={20}
							/>
						</TouchableOpacity>
					)}
				</View>

				<TouchableOpacity
					style={{ marginBottom: 10 }}
					onPress={handlePresentModalPress}
				>
					<Ionicons name={"filter-outline"} size={23} color="#222" />
				</TouchableOpacity>

				<TouchableOpacity
					style={{ marginBottom: 10, marginLeft: "5%" }}
					onPress={() => navigation.navigate("Selection")}
				>
					<Ionicons name={"add-outline"} size={23} color="#222" />
				</TouchableOpacity>
			</View>

			{/* categories */}
			{/* <ScrollView
				horizontal={true}
				showsHorizontalScrollIndicator={false}
			>
				<View style={styles.categories}>
					{[1, 2, 3, 4, 5].map((obj) => (
						<CategoryBtn
							key={obj}
							active={false}
							onPress={() => console.log("Category")}
						>
							<CategoryBtnText active={false}>
								Category
							</CategoryBtnText>
						</CategoryBtn>
					))}
				</View>
			</ScrollView> */}

			{/* filters */}
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				key={3040304}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				backdropComponent={CustomBackdrop}
				style={{ borderRadius: 20 }}
			>
				<View
					style={{
						width: "90%",
						alignSelf: "center",
						flexDirection: "column",
						borderRadius: 10,
						marginBottom: 10,
					}}
				>
					<BoldText style={{ fontSize: 18, marginBottom: 10 }}>
						Filters
					</BoldText>
					<BoldText
						style={{
							fontSize: 16,
						}}
					>
						Currently App being in Beta State, some functionalities
						may not be available. We're working on it!
					</BoldText>

					<TouchableOpacity
						style={{ alignSelf: "center", marginTop: 20 }}
					>
						<Text>
							<Text style={{ textDecorationLine: "underline" }}>
								Get in touch
							</Text>{" "}
							for further help
						</Text>
					</TouchableOpacity>
					{/* <TouchableOpacity
						style={styles.filterItem}
						onPress={() => bottomSheetModalRef.current?.close()}
					>
						<BoldText style={{ fontSize: 16 }}>
							Items to restock
						</BoldText>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.filterItem}
						onPress={() => bottomSheetModalRef.current?.close()}
					>
						<BoldText style={{ fontSize: 16 }}>
							Sort by New items
						</BoldText>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.filterItem}
						onPress={() => bottomSheetModalRef.current?.close()}
					>
						<BoldText style={{ fontSize: 16 }}>
							Sort by Vendors
						</BoldText>
					</TouchableOpacity> */}
				</View>
			</BottomSheetModal>

			{/* <BottomModal /> */}

			{inventory !== null ? (
				<FlatList
					keyExtractor={(e) => e.name}
					contentContainerStyle={{
						paddingBottom: 70,
						flex: 1,
					}}
					renderItem={({ item }) => <InventoryCard data={item} />}
					refreshing={
						props.loadingInventory || props.networkStatus === 4
					}
					showsVerticalScrollIndicator={false}
					onRefresh={() => {
						props.refetch();
						props.statFetch();
					}}
					data={products}
				/>
			) : (
				<LoadingContainer />
			)}
		</>
	);
}

function Store(props: StoreProps) {
	const { inventory } = useSelector((state: any) => state.inventoryReducer);
	const { store } = useSelector((state: any) => state.storeReducer);

	return (
		<View style={CommonStyles.mainContainer}>
			<View
				style={{
					...CommonStyles.screenTitle,
					justifyContent: "flex-start",
					flexDirection: "column",
					width: "100%",
				}}
			>
				<Logo onPress={props.refetchStore} />
				<BoldText style={CommonStyles.title}>
					{store ? store?.name : "Add your store"}
				</BoldText>
			</View>
			{inventory ? (
				<Inventory {...props} />
			) : (
				<TouchableOpacity
					style={CommonStyles.loadingContainer}
					onPress={() => props.createInventory()}
				>
					<BoldText style={{ fontSize: 25 }}>
						Almost done! Tap here to{" "}
						<BoldText style={{ color: "#1ea472" }}>
							create inventory
						</BoldText>{" "}
						and start managing {store?.name} online!
					</BoldText>
				</TouchableOpacity>
			)}
		</View>
	);
}

export default function StoreScreen({
	navigation,
}: RootTabScreenProps<"Store">) {
	// credential context
	const context: any = useContext(AuthContext);

	// stat state
	const [storeStat, setStoreStat] = useState<any>({
		total_amount: "0",
		count: "0",
		error: false,
		errorMessage: "",
	});

	// as implied, whole inventory. this is where whole inventory is stored.
	const [inventory, setInventory] = useState<any>(null);

	// store from redux 'store'
	const { store } = useSelector((state: any) => state.storeReducer);
	const { user } = useSelector((state: any) => state.userReducer);

	const dispatch = useDispatch();

	function showToast(message1: string, message2: string) {
		Toast.show({
			type: "error",
			text1: message1,
			text2: message2,
		});
	}

	const [loginUser] = useMutation(LOGIN_USER, {
		variables: { contact: context?.user?.contact || null },
		onError() {
			showToast("Error occured!", "Try signing in again");
			context.logout();
		},
		onCompleted(data) {
			if (data.login.id !== context.user.id) {
				context.logout();
			} else {
				dispatch(setUser(data.login));
				context.login({
					id: data.login.id,
					vendor: data.login.vendor,
					token: data.login.token,
					refreshToken: data.login.refreshToken,
				});
			}
		},
	});

	const [fetchStat, { loading: statLoading, refetch: refetchStat }] =
		useLazyQuery(FETCH_TODAYSTAT, {
			onError(err) {
				console.log(err);
			},
			fetchPolicy: "no-cache",
			notifyOnNetworkStatusChange: true,
			onCompleted(data) {
				if (!data.getTodayStats.error) {
					setStoreStat(data.getTodayStats);
				} else {
					Alert.alert(
						"Cant fetch statistics!",
						data.getTodayStats.errorMessage
					);
				}
			},
		});

	// Fetching store details with refetch and saving search with inMemoryCache
	const {
		loading: storeDataLoading,
		refetch: refetchStore,
		networkStatus: storeNetworkStatus,
		subscribeToMore: subscribeToStore,
	} = useQuery(GET_STORE, {
		fetchPolicy: "no-cache",
		onCompleted(data) {
			// When store details data is available, store it in redux 'store'
			dispatch(setStore(data.getUserStore));
			fetchStat();
		},
		onError(err) {
			console.log(err);
		},
	});

	useEffect(() => {
		const unsubscribe = subscribeToStore({
			document: STORE_UPDATE,
			variables: { id: store?.id },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const updatedQueryData = subscriptionData.data.storeUpdate;
				dispatch(setStore(updatedQueryData));
				return Object.assign({}, prev, {
					getUserStore: updatedQueryData,
				});
			},
		});
		return unsubscribe;
	}, [store]);

	// Create inventory if store does not have inventory yet
	const [createInventory] = useMutation(CREATE_INVENTORY, {
		variables: {
			createInventoryInput: {
				storeId: store?.id,
			},
		},
		onCompleted() {
			refetch();
		},
	});

	// Fetch entire inventory and store it in local state.
	const {
		loading: loadingInventory,
		subscribeToMore,
		refetch,
		networkStatus,
	} = useQuery(GET_INVENTORY, {
		fetchPolicy: "no-cache",
		notifyOnNetworkStatusChange: true,
		onError(err) {
			console.log(err);
		},
		onCompleted(data) {
			dispatch(setInventoryRedux(data.getInventory));
		},
	});

	// get new creds when user isnt present
	useEffect(() => {
		if (!user?.id) {
			loginUser();
			refetchStore();
		}
	}, [user]);

	// handle back press
	useEffect(() => {
		navigation.addListener("beforeRemove", () => {
			BackHandler.exitApp();
		});
	}, [navigation]);

	// update localstate whenever store from redux 'store' changes
	// useEffect(() => {
	// 	store && setStoreDetails(store);
	// }, [store]);

	// Listen to changes in inventory.
	useEffect(() => {
		subscribeToMore({
			document: INVENTORY_STATUS,
			variables: { id: context?.user?.id },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const updatedQueryData = subscriptionData.data.inventoryStatus;
				var updatedProducts = updatedQueryData.products;
				setInventory({
					...inventory,
					products: updatedProducts,
				});
				dispatch(setInventoryRedux(updatedQueryData));
				return Object.assign({}, prev, {
					getInventory: updatedQueryData,
				});
			},
		});
	}, []);

	if (storeDataLoading || statLoading) {
		return (
			<>
				<DynamicStatusBar />
				<LoadingContainer />
			</>
		);
	}

	return (
		<>
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				{store ? (
					<Store
						refetch={() => refetch()}
						storeStat={storeStat}
						statFetch={() => refetchStat}
						refetchStore={refetchStore}
						storeNetworkStatus={storeNetworkStatus}
						loadingInventory={loadingInventory}
						networkStatus={networkStatus}
						navigation={navigation}
						createInventory={createInventory}
					/>
				) : (
					<View style={CommonStyles.mainContainer}>
						<View style={CommonStyles.screenTitle}>
							<BoldText style={CommonStyles.title}>
								Add your store
							</BoldText>
						</View>

						<TouchableOpacity
							style={CommonStyles.loadingContainer}
							onPress={() => navigation.navigate("EditStore")}
						>
							<BoldText style={{ fontSize: 25 }}>
								Tap here to{" "}
								<BoldText style={{ color: "#1ea472" }}>
									Register your Store
								</BoldText>{" "}
								then create your inventory to start managing
							</BoldText>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: "pink",
	},
	actionBtn: {
		position: "absolute",
		bottom: 0,
		zIndex: 1,
		height: 50,
		paddingHorizontal: 15,
		right: 0,
		backgroundColor: "#1ea472",
		borderRadius: 40,
		marginRight: 20,
		marginBottom: 20,
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
		marginBottom: 15,
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		marginRight: "5%",
		// marginTop: 150,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		marginLeft: 10,
	},
	categories: {
		flexDirection: "row",
		flexWrap: "wrap",
		width: "100%",
		marginBottom: 15,
		paddingBottom: 10,
	},
	category: {
		borderRadius: 10,
		borderColor: "#1ea472",
		borderWidth: 1,
		padding: 3,
		paddingHorizontal: 5,
		marginRight: 5,
		marginBottom: 5,
	},
	categoryText: {
		color: "#1ea472",
	},
	inventoryProduct: {
		padding: 10,
		width: "100%",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 5,
		borderBottomWidth: 1,
		borderBottomColor: "#00555511",
		borderRadius: 15,
	},
	rowContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	actionBtnContainer: {
		width: "45%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	cardactionBtn: {
		padding: 3,
		width: "25%",
		alignItems: "center",
		justifyContent: "center",
	},
	actionBtn2: {
		padding: 3,
		paddingHorizontal: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderRadius: 25,
		alignSelf: "flex-end",
		borderColor: "#1ea472",
	},
	quantityText: {
		marginHorizontal: 15,
	},
	seperator: {
		marginVertical: 5,
		width: "90%",
		alignSelf: "center",
		backgroundColor: "#999",
	},
	filterItem: {
		width: "100%",
		paddingVertical: 10,
	},
	productName: {
		color: "#222",
	},
	productMeta: {
		color: "#444",
	},
	singleBtnContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	card: {
		width: "100%",
		padding: 10,
		alignItems: "center",
	},
	addInventoryBtn: {
		alignItems: "center",
		borderRadius: 20,
		padding: 10,
		alignSelf: "center",
		backgroundColor: "#1ea472",
	},
	addInventoryBtnText: {
		color: "#fff",
		fontSize: 16,
	},
	stats: {
		width: "100%",
		padding: 10,
		marginBottom: 15,
		flexDirection: "row",
		alignItems: "center",
	},
	statContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	statTitle: {
		fontSize: 16,
	},
	statNumber: {
		fontSize: 20,
	},
	statSeperator: {
		height: "90%",
		width: 1,
	},
});
