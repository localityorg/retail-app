import React, { useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useDispatch } from "react-redux";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import {
	addToICart,
	removeFromICart,
	deleteFromICart,
} from "../../redux/actions";

import { BoldText, Text } from "../../components/Common/Themed";

interface ProductTileProps {
	data: any;
	maxQuant: number;
}

export function ProductTile(props: ProductTileProps) {
	// as implied, state of the card prop. left right or mid
	const [swipeState, setSwipeState] = useState("mid");
	// const colorScheme = useColorScheme();

	const quant = parseFloat(props.data.itemQuantity);

	const bottomSheetProductModalRef = useRef<BottomSheetModal>(null);

	const dispatch = useDispatch();
	// snap points
	// const productSnapPoints = useMemo(() => ["25%", "50%"], []);

	// callbacks
	// const handleProductSheetChanges = useCallback(() => {}, []);

	// remove the item from list
	const LeftActions = (progress: any, dragX: any) => {
		const scale = dragX.interpolate({
			inputRange: [0, 60],
			outputRange: [0, 1],
			extrapolate: "clamp",
		});
		return (
			<Animated.View
				style={{
					justifyContent: "center",
					alignItems: "center",
					alignSelf: "center",
					height: 50,
					width: 50,
					borderRadius: 10,
					backgroundColor: "#900",
					overflow: "hidden",
					transform: [{ scale }],
				}}
			>
				<TouchableOpacity
					style={ProductTileStyles.cardactionBtn}
					onPress={() => dispatch(deleteFromICart(props.data))}
				>
					<Ionicons name="trash-outline" size={25} color="#fff" />
				</TouchableOpacity>
			</Animated.View>
		);
	};

	// add more or deduct item from list
	const RightActions = (progress: any, dragX: any) => {
		const scale = dragX.interpolate({
			inputRange: [-160, 0],
			outputRange: [1, 0],
			extrapolate: "clamp",
		});
		return (
			<Animated.View
				style={{
					height: 50,
					width: 150,
					marginLeft: 15,
					flexDirection: "row",
					alignItems: "center",
					alignSelf: "center",
					justifyContent: "space-evenly",
					backgroundColor: "#111",
					borderRadius: 10,
					overflow: "hidden",
					transform: [{ scale }],
				}}
			>
				{props.data.divisible ? (
					<>
						<TouchableOpacity
							style={ProductTileStyles.cardactionBtn}
							onPress={() =>
								bottomSheetProductModalRef.current?.present()
							}
						>
							<BoldText style={ProductTileStyles.quantityText}>
								{props.data.itemQuantity}{" "}
								{props.data.quantity.type}
							</BoldText>
						</TouchableOpacity>
					</>
				) : (
					<>
						<TouchableOpacity
							style={ProductTileStyles.cardactionBtn}
							onPress={() => {
								if (quant <= props.maxQuant) {
									dispatch(addToICart(props.data));
								}
							}}
							disabled={quant >= props.maxQuant}
						>
							<Ionicons
								name="add-outline"
								size={23}
								color={
									quant < props.maxQuant ? "#d3c8c8" : "#111"
								}
							/>
						</TouchableOpacity>
						<BoldText style={ProductTileStyles.quantityText}>
							{props.data.itemQuantity}
						</BoldText>
						<TouchableOpacity
							style={ProductTileStyles.cardactionBtn}
							onPress={() => {
								dispatch(removeFromICart(props.data));
							}}
						>
							<Ionicons
								name="remove-outline"
								size={23}
								color="#fff"
							/>
						</TouchableOpacity>
					</>
				)}
			</Animated.View>
		);
	};
	return (
		<>
			{/* Open to edit divisible item quantity */}
			{/* <BottomSheetModal
				ref={bottomSheetProductModalRef}
				index={1}
				snapPoints={productSnapPoints}
				onChange={handleProductSheetChanges}
				style={{
					borderRadius: 20,
				}}
			>
				<View
					style={{
						width: "90%",
						alignSelf: "center",
						justifyContent: "center",
						alignItems: "center",
					}}
				></View>
			</BottomSheetModal> */}
			<Swipeable
				renderLeftActions={LeftActions}
				renderRightActions={RightActions}
				onSwipeableRightOpen={() => setSwipeState("right")}
				onSwipeableLeftOpen={() => setSwipeState("left")}
				onSwipeableClose={() => setSwipeState("mid")}
			>
				<View style={ProductTileStyles.inventoryProduct}>
					<View style={ProductTileStyles.rowContainer}>
						<View
							style={{
								flex: 1,
								flexDirection: "column",
								alignItems: "flex-start",
							}}
						>
							<BoldText
								style={{
									...ProductTileStyles.productName,
									width: "95%",
								}}
								numberOfLines={1}
							>
								{props.data.brand} {props.data.name}
							</BoldText>
							{props.data.divisible ? (
								<Text style={ProductTileStyles.productMeta}>
									{props.data.itemQuantity}
									{props.data.quantity.type}
								</Text>
							) : (
								<Text style={ProductTileStyles.productMeta}>
									{props.data.quantity.count}
									{props.data.quantity.type} x{" "}
									{props.data.itemQuantity}
								</Text>
							)}
						</View>
						{swipeState === "left" ||
							(swipeState === "mid" && (
								<View style={ProductTileStyles.itemQuantity}>
									{!props.data.divisible ? (
										<BoldText style={{ color: "#fff" }}>
											x{props.data.itemQuantity}
										</BoldText>
									) : (
										<BoldText style={{ color: "#fff" }}>
											{props.data.itemQuantity}
											{props.data.quantity.type}
										</BoldText>
									)}
								</View>
							))}
						<BoldText
							style={{
								...ProductTileStyles.productName,
								width: "25%",
								textAlign: "right",
							}}
						>
							₹ {props.data.totalPrice}/-
						</BoldText>
					</View>
				</View>
			</Swipeable>
		</>
	);
}

const ProductTileStyles = StyleSheet.create({
	inventoryProduct: {
		padding: 10,
		width: "100%",
		alignSelf: "center",
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
	cardactionBtn: {
		padding: 3,
		paddingHorizontal: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	quantityText: {
		color: "#fff",
		marginHorizontal: 10,
	},
	productName: {
		color: "#222",
	},
	productMeta: {
		color: "#444",
	},
	itemQuantity: {
		marginLeft: 15,
		height: 40,
		width: 40,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#111",
	},
});
