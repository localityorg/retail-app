import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, TextInput } from "react-native";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import { ImageLoader } from "react-native-image-fallback";

import { BoldText, View, Text } from "../../components/Common/Themed";
import {
	CommonStyles,
	LoadingContainer,
} from "../../components/Common/Elements";
import { useLazyQuery } from "@apollo/client";
import { GET_PRODUCTS_FROM_COLLECTION } from "../../graphql/productdefs";
import { ICON_URI, IMG_URI } from "../../constants/Urls";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { CustomBackdrop } from "../../components/Common/ModalStyle";

interface SearchListProps {
	onPressName: any;
	onPressClose: any;
	bottomSheetSearchModalRef: any;
	snapSearchPoints: any;
	handleSearchSheetChanges: any;
}

export function SearchList(props: SearchListProps) {
	const [search, setSearch] = useState("");

	const [fetchProducts, { data, loading: fetchingProducts }] = useLazyQuery(
		GET_PRODUCTS_FROM_COLLECTION,
		{
			variables: {
				name: search,
				category: false,
				offset: 0,
				limit: 10,
			},
			fetchPolicy: "no-cache",
		}
	);

	useEffect(() => {
		if (search.length !== 0) {
			fetchProducts({
				variables: {
					name: search,
					category: false,
					offset: 0,
					limit: 10,
				},
			});
		}
	}, [search]);

	return (
		<BottomSheetModal
			ref={props.bottomSheetSearchModalRef}
			index={0}
			snapPoints={props.snapSearchPoints}
			onChange={props.handleSearchSheetChanges}
			style={{
				borderRadius: 20,
			}}
			key={2241249020}
			backdropComponent={CustomBackdrop}
		>
			<View style={styles.container}>
				<View style={CommonStyles.mainContainer}>
					<View style={CommonStyles.header}>
						<TouchableOpacity
							onPress={() => {
								setSearch("");
								props.bottomSheetSearchModalRef.current?.close();
							}}
						>
							<AntDesign name="back" size={25} color="#111" />
						</TouchableOpacity>
						<BoldText style={CommonStyles.title}>Search</BoldText>
					</View>
					<View
						style={{
							flex: 1,
							width: "100%",
							flexDirection: "column",
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
						{fetchingProducts ? (
							<LoadingContainer />
						) : (
							<View style={{ flex: 1, marginTop: 10 }}>
								<BottomSheetFlatList
									data={data?.getProducts || []}
									onRefresh={() => fetchProducts()}
									keyExtractor={(e: any) => e.productId}
									initialNumToRender={10}
									showsVerticalScrollIndicator={false}
									renderItem={({ item }) =>
										item.skus.map((obj: any) => (
											<TouchableOpacity
												style={{
													marginBottom: 5,
													padding: 5,
													paddingHorizontal: 10,
													flexDirection: "row",
													alignItems: "center",
												}}
												onPress={() => {
													props.onPressName(obj);
													props.bottomSheetSearchModalRef.current?.close();
												}}
												delayPressIn={0}
											>
												<ImageLoader
													source={`${IMG_URI}${obj?.imageUrl}.jpg`}
													fallback={[
														`${ICON_URI}imagedefault.png`,
													]}
													style={{
														marginRight: 10,
														height: 40,
														width: 40,
													}}
												/>
												<Text
													style={{ width: "80%" }}
													numberOfLines={2}
												>
													{obj.name}{" "}
													{obj.quantity.count}{" "}
													{obj.quantity.type}
												</Text>
											</TouchableOpacity>
										))
									}
								/>
							</View>
						)}
					</View>
				</View>
			</View>
		</BottomSheetModal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
	},
	search: {
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
