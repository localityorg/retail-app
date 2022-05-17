import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import {
	View,
	Text,
	BoldTextInput,
	TextInput,
	BoldText,
} from "./Common/Themed";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { units } from "../constants/Units";
import { Ionicons } from "@expo/vector-icons";

interface ProductValueCardProps {
	productValue: any;
	setProductValue: any;
	editMode: boolean;
	quantityState: any;
	setQuantityState: any;
	addToInventory: any;
}

interface SetQuantityModalProps {
	bottomSheetModalRef: any;
	snapPoints: any;
	handleSheetChanges: any;
	productValue: any;
	setProductValue: any;
	setQuantityState: any;
	quantityState: any;
}

interface ActionsOnProductProps {
	productValue: any;
	setProductValue: any;
	onPressAddToInventory: any;
}

function ActionsOnProduct(props: ActionsOnProductProps) {
	return (
		<View style={styles.actionContainer}>
			<View style={styles.productCount}>
				<TouchableOpacity
					disabled={
						parseFloat(props.productValue.itemQuantity) >= 500
					}
					delayPressIn={0}
					onPress={() =>
						props.setProductValue({
							...props.productValue,
							itemQuantity: (
								parseFloat(props.productValue.itemQuantity) + 1
							).toString(),
						})
					}
				>
					<Ionicons
						name="add-outline"
						size={25}
						color={
							parseFloat(props.productValue.itemQuantity) >= 0
								? "#777"
								: "#111"
						}
					/>
				</TouchableOpacity>
				<Text style={styles.count}>
					{parseFloat(props.productValue.itemQuantity)}
				</Text>
				<TouchableOpacity
					delayPressIn={0}
					disabled={parseFloat(props.productValue.itemQuantity) <= 0}
					onPress={() =>
						props.setProductValue({
							...props.productValue,
							itemQuantity: (
								parseFloat(props.productValue.itemQuantity) - 1
							).toString(),
						})
					}
				>
					<Ionicons name="remove-outline" size={25} color="#111" />
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				style={{
					...styles.actionBtn,
					flex: 1,
					backgroundColor:
						parseFloat(props.productValue.itemQuantity) <= 0
							? "#ddd"
							: "#1ea472",
				}}
				activeOpacity={0.8}
				disabled={parseFloat(props.productValue.itemQuantity) <= 0}
				onPress={props.onPressAddToInventory}
			>
				<Text style={styles.actionBtnText}>Add to Inventory</Text>
			</TouchableOpacity>
		</View>
	);
}

function SetQuantityModal(props: SetQuantityModalProps) {
	return (
		<BottomSheetModal
			ref={props.bottomSheetModalRef}
			index={0}
			key={13599123993}
			snapPoints={props.snapPoints}
			onChange={props.handleSheetChanges}
			style={{
				borderRadius: 20,
			}}
		>
			<View
				style={{
					width: "90%",
					alignSelf: "center",
					justifyContent: "center",
					flex: 1,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						width: "20%",
						marginVertical: 10,
						alignSelf: "center",
						borderBottomWidth: 2,
						borderBottomColor: "#333",
					}}
				>
					<TextInput
						style={{
							fontSize: 23,
							width: "90%",
							textAlign: "center",
						}}
						autoFocus={true}
						keyboardType="phone-pad"
						value={props.productValue.quantity}
						onChangeText={(text) =>
							props.setProductValue({
								...props.productValue,
								quantity: text,
							})
						}
					/>
					<Text
						style={{
							fontSize: 23,
							marginLeft: 8,
							alignSelf: "flex-end",
						}}
					>
						{props.productValue.quantityType}
					</Text>
				</View>

				<View style={styles.categories}>
					{units.map((obj) => (
						<TouchableOpacity
							key={obj.id}
							onPress={() => {
								props.setQuantityState(obj);
								props.setProductValue({
									...props.productValue,
									quantityType: obj.unit,
								});
							}}
							style={{
								backgroundColor:
									obj.id === props.quantityState.id
										? "#ddd"
										: "transparent",
								padding: 10,
								marginRight: 5,
							}}
						>
							<Text>{obj.name}</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>
			<TouchableOpacity
				style={{
					...styles.vendorActionBtn,
					width: "90%",
					alignSelf: "center",
					marginBottom: "5%",
					backgroundColor: "#111",
				}}
				onPress={() => props.bottomSheetModalRef.current?.close()}
			>
				<Text style={{ fontSize: 16, color: "#fff" }}>Confirm</Text>
			</TouchableOpacity>
		</BottomSheetModal>
	);
}

export default function ProductValueCard(props: ProductValueCardProps) {
	const bottomSheetQuantityModalRef = useRef<BottomSheetModal>(null);

	// snap points
	const snapPoints = useMemo(() => ["50%"], []);

	// callbacks
	const handleSheetChanges = useCallback(() => {}, []);
	return (
		<>
			<SetQuantityModal
				bottomSheetModalRef={bottomSheetQuantityModalRef}
				snapPoints={snapPoints}
				handleSheetChanges={handleSheetChanges}
				productValue={props.productValue}
				setProductValue={props.setProductValue}
				setQuantityState={props.setQuantityState}
				quantityState={props.quantityState}
			/>
			<View style={styles.productNamePriceContainer}>
				<View style={styles.productNameContainer}>
					<BoldTextInput
						style={styles.brand}
						value={props.productValue.brand}
						placeholder="Product Brand"
						onChangeText={(text) =>
							props.setProductValue({
								...props.productValue,
								brand: text,
							})
						}
						autoCorrect={false}
						editable={props.editMode}
					/>
					<TextInput
						placeholder="Product Name"
						value={props.productValue.name}
						onChangeText={(text) =>
							props.setProductValue({
								...props.productValue,
								name: text,
							})
						}
						multiline={true}
						textAlignVertical="top"
						autoCorrect={false}
						style={{ fontSize: 25 }}
						editable={props.editMode}
					/>
				</View>
				<View
					style={{
						flexDirection: "column",
						alignItems: "flex-end",
						width: "25%",
					}}
				>
					<TextInput
						placeholder="₹"
						value={props.productValue.price}
						style={styles.price}
						onChangeText={(text) =>
							props.setProductValue({
								...props.productValue,
								price: text,
							})
						}
						editable={props.editMode}
					/>

					<TouchableOpacity
						disabled={!props.editMode}
						onPress={() =>
							bottomSheetQuantityModalRef.current?.present()
						}
					>
						<Text style={styles.quantity}>
							{props.productValue.quantity
								? `${props.productValue.quantity} ${props.productValue.quantityType}`
								: `X mg`}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View
				style={{
					width: "100%",
					flexDirection: "row",
					alignItems: "flex-start",
					justifyContent: "space-between",
					marginTop: 10,
				}}
			>
				<Text style={{ width: "80%" }}>
					<BoldText>Is the item loose?</BoldText> (eg: Dal, Wheat
					Grains) <BoldText>If Yes</BoldText> then mention price per
					kg/grams/L/ml above
				</Text>
				<TouchableOpacity
					onPress={() =>
						props.setProductValue({
							...props.productValue,
							divisible: !props.productValue.divisible,
						})
					}
				>
					<Ionicons
						name="checkbox"
						size={25}
						color={
							props.productValue.divisible ? "#1ea472" : "#888"
						}
					/>
				</TouchableOpacity>
			</View>
			<ActionsOnProduct
				productValue={props.productValue}
				setProductValue={props.setProductValue}
				onPressAddToInventory={props.addToInventory}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	productNamePriceContainer: {
		marginTop: 10,
		flexDirection: "row",
		alignItems: "flex-start",
		width: "100%",
	},
	productNameContainer: {
		flex: 1,
		width: "100%",
		flexDirection: "column",
	},
	price: {
		fontSize: 25,
		textAlign: "right",
	},
	brand: {
		fontSize: 30,
	},
	productName: {
		fontSize: 25,
	},
	quantity: {
		marginTop: 12,
		color: "#555",
		textAlign: "right",
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
	categories: {
		marginVertical: 10,
		flexDirection: "row",
		flexWrap: "wrap",
		width: "100%",
	},
	actionContainer: {
		width: "100%",
		flexDirection: "row",
		backgroundColor: "transparent",
		alignItems: "center",
		justifyContent: "space-evenly",
		paddingBottom: 10,
		marginVertical: 10,
	},
	productCount: {
		width: "40%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
		marginTop: 10,
		height: 50,
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 10,
		marginRight: "5%",
	},
	count: {
		fontSize: 16,
	},
	actionBtn: {
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
		height: 50,
		backgroundColor: "#1ea372",
		borderRadius: 10,
	},
	actionBtnText: {
		color: "#fff",
		fontSize: 16,
	},
});
