import React, { useEffect, useMemo, useState } from "react";

import { TouchableOpacity } from "react-native";

import { ImageLoader } from "react-native-image-fallback";
import { BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { AntDesign } from "@expo/vector-icons";

import { CustomBackdrop, CustomBackground } from "./ModalStyle";
import { BoldText, View, Text } from "./Themed";

import { ICON_URI, IMG_URI } from "../../constants/Urls";
import { getCount } from "../../util/getCount";
import { CommonStyles, LoadingContainer } from "./Elements";
import { useDispatch, useSelector } from "react-redux";
import { addToICart, removeFromICart } from "../../redux/actions";

interface ProductSkuModalProps {
	data: any;
	bottomSheetModalRef: any;
	handleSheetChanges: any;
	discardProduct: any;
}

interface SkuTileProps {
	item: any;
	cart: any;
}

function SkuCount(props: SkuTileProps) {
	const [count, setCount] = useState<number>(
		getCount(props.cart, props.item)
	);

	const dispatch = useDispatch();

	useEffect(() => {
		setCount(
			parseFloat(
				props.cart.find((e: any) => e.id === props.item.id)
					?.itemQuantity || "0"
			)
		);
	}, [props.item]);

	return (
		<View>
			{count > 0 ? (
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						borderWidth: 1,
						borderRadius: 5,
						padding: 10,
					}}
				>
					<TouchableOpacity
						onPress={() => {
							setCount(count - 1);
							dispatch(removeFromICart(props.item));
						}}
						style={{
							borderRadius: 20,
						}}
						delayPressIn={0}
						disabled={count < 1}
					>
						<AntDesign name="minus" size={23} color="#111" />
					</TouchableOpacity>

					<BoldText
						style={{
							fontSize: 16,
							marginHorizontal: 15,
						}}
					>
						{count}
					</BoldText>

					<TouchableOpacity
						onPress={() => {
							setCount(count + 1);
							dispatch(addToICart(props.item));
						}}
						delayPressIn={0}
					>
						<AntDesign name="plus" size={23} color="#1ea472" />
					</TouchableOpacity>
				</View>
			) : (
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => {
						setCount(count + 1);
						dispatch(addToICart(props.item));
					}}
					delayPressIn={0}
					style={{ marginRight: 10 }}
				>
					<AntDesign name="plus" size={23} color="#1ea472" />
				</TouchableOpacity>
			)}
		</View>
	);
}

export default function ProductSkuModal(props: ProductSkuModalProps) {
	const [product, setProduct] = useState<any>(props.data);

	const { cart } = useSelector((state: any) => state.iCartReducer);

	const snapPoints = useMemo(() => [100 * product.skus.length + 170], []);

	return (
		<BottomSheetModal
			ref={props.bottomSheetModalRef}
			index={0}
			snapPoints={snapPoints}
			onChange={props.handleSheetChanges}
			style={{
				borderRadius: 20,
				shadowColor: "#000",
				shadowOffset: {
					width: 0,
					height: 2,
				},
				shadowOpacity: 0.35,
				shadowRadius: 3.8,
				elevation: 10,
			}}
			key={111304929}
			onDismiss={() => {
				props.discardProduct();
			}}
			android_keyboardInputMode="adjustPan"
			keyboardBehavior="extend"
			keyboardBlurBehavior="restore"
			backdropComponent={CustomBackdrop}
			backgroundComponent={CustomBackground}
		>
			{product.skus !== null ? (
				<BottomSheetFlatList
					style={{
						width: "90%",
						flex: 1,
						paddingBottom: 20,
						flexDirection: "column",
						alignSelf: "center",
						marginBottom: "5%",
					}}
					key={1221223419}
					data={product.skus}
					showsVerticalScrollIndicator={false}
					keyExtractor={(e: any) => e.id.toString()}
					ListHeaderComponent={
						<View style={CommonStyles.header}>
							<TouchableOpacity
								onPress={() => props.discardProduct()}
							>
								<AntDesign name="back" size={25} color="#111" />
							</TouchableOpacity>

							<BoldText
								style={{
									fontSize: 25,
									marginLeft: 10,
									width: "75%",
								}}
								numberOfLines={1}
							>
								{product.skus[0].name}
							</BoldText>
						</View>
					}
					renderItem={({ item }) => (
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 5,
							}}
						>
							<View
								style={{
									flex: 1,
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: "transparent",
								}}
							>
								<ImageLoader
									source={`${IMG_URI}${item?.imageUrl}.jpg`}
									fallback={[`${ICON_URI}imagedefault.png`]}
									style={{
										height: 80,
										width: 80,
										borderRadius: 10,
										marginRight: 10,
									}}
								/>
								<View
									style={{
										flexDirection: "column",
										alignItems: "flex-start",
										backgroundColor: "transparent",
									}}
								>
									<BoldText
										style={{
											color: "#666",
											marginBottom: 5,
										}}
									>
										{item.quantity.count}{" "}
										{item.quantity.type}
									</BoldText>
									<BoldText
										style={{ fontSize: 16, lineHeight: 18 }}
									>
										₹ {item?.price.mrp}/-
									</BoldText>
								</View>
							</View>
							<SkuCount item={item} cart={cart} />
						</View>
					)}
				/>
			) : (
				<LoadingContainer />
			)}
		</BottomSheetModal>
	);
}
