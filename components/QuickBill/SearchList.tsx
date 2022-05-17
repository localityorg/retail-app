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
	Keyboard,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLazyQuery } from "@apollo/client";
import { useSelector } from "react-redux";

import { LoadingContainer } from "../Common/Elements";
import { TextInput } from "../Common/Themed";
import ProductSkuModal from "../Common/ProductSkuModal";
import ProductItem from "../Common/ProductItem";

import { GET_PRODUCTS } from "../../graphql/productdefs";

interface SearchListProps {
	fullScreen: boolean;
	onPressItem: any;
	setFocus?: any;
	focus?: boolean;
	navigation?: any;
}

export default function SearchList(props: SearchListProps) {
	const [search, setSearch] = useState("");

	const [fetchedProducts, setFetchedProducts] = useState<any>(null);
	const [product, setProduct] = useState<any>(null);

	const { store } = useSelector((state: any) => state.storeReducer);

	// sku item modal
	const bottomSheetSkuModalRef = useRef<BottomSheetModal>(null);
	const skuModalSnapPoints = useMemo(() => ["45%"], []);
	const handleSkuModalSheetChanges = useCallback(() => {}, []);

	const [searchProducts, { data, loading: fetchingProducts, networkStatus }] =
		useLazyQuery(GET_PRODUCTS, {
			variables: {
				name: search,
				storeId: store.id,
				offset: 0,
				limit: 10,
			},
			notifyOnNetworkStatusChange: true,
			fetchPolicy: "no-cache",
			onCompleted(data) {
				setFetchedProducts(data?.getAllProducts);
			},
			onError(err) {
				console.log(err);
			},
		});

	function RenderItem({ item }: any) {
		return item.skus.length > 0 ? (
			<ProductItem
				data={item}
				fullScreen={props.fullScreen}
				onPress={(item: any) => {
					Keyboard.dismiss();
					setProduct(item);
				}}
			/>
		) : (
			<View />
		);
	}

	const memoizedValue = useMemo(() => RenderItem, [data?.getAllProducts]);

	useEffect(() => {
		if (search?.trim().length !== 0) {
			searchProducts({
				variables: {
					storeId: store.id,
					name: search,
					offset: 0,
					limit: 10,
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
			{product && (
				<ProductSkuModal
					data={product}
					bottomSheetModalRef={bottomSheetSkuModalRef}
					discardProduct={() => setProduct(null)}
					handleSheetChanges={handleSkuModalSheetChanges}
				/>
			)}
			<View
				style={{
					flex: props.fullScreen ? 1 : 0,
					width: "100%",
					borderWidth: props.fullScreen ? 0 : 1,
					borderColor: "#ddd",
					borderRadius: 5,
					padding: props.fullScreen ? 0 : 5,
					flexDirection: "column",
				}}
			>
				<View style={styles.actionContainer}>
					<View
						style={{
							...styles.search,
							borderRadius: props.fullScreen ? 10 : 5,
						}}
					>
						<Ionicons
							name="search-outline"
							color="#111"
							size={20}
						/>
						<TextInput
							style={styles.searchInput}
							onBlur={() => props.setFocus(true)}
							value={search}
							onChangeText={(text) => setSearch(text)}
							placeholder="Search products"
						/>
						<TouchableOpacity
							onPress={() => {
								setSearch("");
								props.setFocus(false);
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
				</View>
				{fetchingProducts ? (
					<View style={{ height: props.fullScreen ? "90%" : 200 }}>
						<LoadingContainer />
					</View>
				) : (
					<View style={{ width: "100%", height: 200 }}>
						<FlatList
							data={data?.getAllProducts}
							refreshing={networkStatus === 4}
							keyExtractor={(e) => e.id}
							initialNumToRender={10}
							showsVerticalScrollIndicator={false}
							renderItem={memoizedValue}
						/>
					</View>
				)}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	search: {
		flex: 1,
		backgroundColor: "#e9e9e9",
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
		marginBottom: 5,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});
