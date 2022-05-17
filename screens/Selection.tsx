import React, {
	useState,
	useRef,
	useMemo,
	useCallback,
	useEffect,
} from "react";
import {
	FlatList,
	StyleSheet,
	View,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";

import Toast from "react-native-toast-message";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

import {
	ActionBtn,
	ActionBtnText,
	CommonStyles,
	LoadingContainer,
} from "../components/Common/Elements";
import { TextInput, BoldText } from "../components/Common/Themed";
import DynamicStatusBar from "../components/Common/StatusBar";
import ProductSkuModal from "../components/Common/ProductSkuModal";
import ProductItem from "../components/Common/ProductItem";

import { ADD_PRODUCTS_TO_INVENTORY } from "../graphql/inventorydefs";
import { GET_PRODUCTS } from "../graphql/productdefs";

import useColorScheme from "../hooks/useColorScheme";
import { compressedArray } from "../util/sorts";

import Colors from "../constants/Colors";

import { RootTabScreenProps } from "../types";
import { CustomBackdrop } from "../components/Common/ModalStyle";
import { emptyICart } from "../redux/actions";

export default function Selection({
	navigation,
}: RootTabScreenProps<"Selection">) {
	const [search, setSearch] = useState("");

	const [fetchedProducts, setFetchedProducts] = useState<any>(null);
	const [product, setProduct] = useState<any>(null);

	const colorScheme = useColorScheme();
	const dispatch = useDispatch();

	const { store } = useSelector((state: any) => state.storeReducer);
	const { cart } = useSelector((state: any) => state.iCartReducer);

	// confirmation modal
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => ["30%"], []);
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
	const handleSheetChanges = useCallback(() => {}, []);

	// sku item modal
	const bottomSheetSkuModalRef = useRef<BottomSheetModal>(null);
	const handleSkuModalSheetChanges = useCallback(() => {}, []);

	function showToast(message1: string, message2: string, type: number) {
		Toast.show({
			type: type === 1 ? "success" : "error",
			text1: message1,
			text2: message2,
		});
	}

	const [addToInventory, { loading }] = useMutation(
		ADD_PRODUCTS_TO_INVENTORY,
		{
			variables: {
				products: JSON.stringify(compressedArray(cart)),
				storeId: store?.id,
			},
			onCompleted(data) {
				if (!data.addFromCollection.error) {
					dispatch(emptyICart());
					showToast(
						"Success!",
						`Added new item(s) to your inventory`,
						1
					);
					bottomSheetModalRef.current?.close();
					navigation.navigate("Store");
				} else {
					showToast(
						"Oops",
						"Cannot add products. Check values and try again",
						0
					);
				}
			},
			onError(err) {
				showToast(
					"Aghh!",
					"We're facing some issue. Try again later.",
					0
				);
			},
		}
	);

	const [
		searchProducts,
		{ data, loading: fetchingProducts, refetch, networkStatus },
	] = useLazyQuery(GET_PRODUCTS, {
		variables: { name: search, storeId: store.id, limit: 0, offset: 20 },
		notifyOnNetworkStatusChange: true,
		fetchPolicy: "no-cache",
		onCompleted(data) {
			const cntx = [];
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

	function RenderItem({ item }: any) {
		return (
			<ProductItem
				data={item}
				fullScreen={true}
				onPress={(item: any) => setProduct(item)}
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

	useEffect(() => {
		if (product !== null) {
			bottomSheetSkuModalRef.current?.present();
		} else {
			bottomSheetSkuModalRef.current?.close();
		}
	}, [product]);

	return (
		<>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				key={3044031091}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				style={{ borderRadius: 20 }}
				backdropComponent={CustomBackdrop}
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
						Confirmation
					</BoldText>

					<BoldText
						style={{
							fontSize: 16,
							marginBottom: 20,
							color: Colors[colorScheme].placeholder,
						}}
					>
						Confirm Adding {cart.length} new item(s) Inventory? You
						can swipe down and re check again.
					</BoldText>

					<ActionBtn
						disable={loading}
						onPress={() => addToInventory()}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<ActionBtnText>Confirm</ActionBtnText>
						)}
					</ActionBtn>
				</View>
			</BottomSheetModal>
			{product && (
				<ProductSkuModal
					data={product}
					bottomSheetModalRef={bottomSheetSkuModalRef}
					discardProduct={() => setProduct(null)}
					handleSheetChanges={handleSkuModalSheetChanges}
				/>
			)}
			<DynamicStatusBar />
			<View style={CommonStyles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<TouchableOpacity
							onPress={() => {
								setSearch("");
								navigation.navigate("Store");
							}}
						>
							<AntDesign name="back" size={25} color="#111" />
						</TouchableOpacity>
						<BoldText style={CommonStyles.title}>Search</BoldText>
					</View>
					<View style={styles.actionContainer}>
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

						{cart.length > 0 && (
							<TouchableOpacity
								onPress={() => {
									handlePresentModalPress();
								}}
								style={{
									marginLeft: "5%",
									padding: 10,
									backgroundColor: "#1ea472",
									borderRadius: 10,
								}}
								delayPressIn={0}
							>
								<Ionicons
									name="checkmark-outline"
									color="#fff"
									size={20}
								/>
							</TouchableOpacity>
						)}
					</View>
					{fetchingProducts ? (
						<LoadingContainer />
					) : (
						<View style={{ flex: 1, width: "100%" }}>
							<FlatList
								data={fetchedProducts}
								onRefresh={() => refetch()}
								refreshing={networkStatus === 4}
								keyExtractor={(e) => e.id}
								initialNumToRender={10}
								showsVerticalScrollIndicator={false}
								renderItem={memoizedValue}
							/>
						</View>
					)}
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	search: {
		flex: 1,
		backgroundColor: "#e9e9e9",
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		marginLeft: 10,
	},
	actionContainer: {
		width: "100%",
		marginVertical: 10,
		marginBottom: 5,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});
