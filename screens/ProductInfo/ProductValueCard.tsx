import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Counter } from "../../components/Common/Counter";

import {
	View,
	Text,
	BoldTextInput,
	TextInput,
} from "../../components/Common/Themed";

interface ProductValueCardProps {
	productValue: any;
	setProductValue: any;
	editMode: boolean;
	bottomSheetModalRef: any;
}

export function ProductValueCard(props: ProductValueCardProps) {
	return (
		<View
			style={{
				...styles.productNamePriceContainer,
				flexDirection: props.editMode ? "column" : "row",
			}}
		>
			<View style={styles.productNameContainer}>
				{props.editMode && (
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
						editable={props.editMode}
					/>
				)}
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
					style={{ fontSize: 25 }}
					editable={props.editMode}
				/>
			</View>
			{props.editMode ? (
				<View
					style={{
						width: "100%",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						marginTop: 10,
					}}
				>
					<Counter
						number={props.productValue.price.mrp}
						preText={"₹"}
						onChange={(text: string) => {
							props.setProductValue({
								...props.productValue,
								price: {
									...props.productValue.price,
									mrp: text,
								},
							});
						}}
						onPressAdd={() => {
							props.setProductValue({
								...props.productValue,
								price: {
									...props.productValue.price,
									mrp: (
										parseFloat(
											props.productValue.price.mrp
										) + 1
									).toString(),
								},
							});
						}}
						onPressMinus={() => {
							if (
								parseFloat(props.productValue.price.mrp) - 1 >
								0
							) {
								props.setProductValue({
									...props.productValue,
									price: {
										...props.productValue.price,
										mrp: (
											parseFloat(
												props.productValue.price.mrp
											) - 1
										).toString(),
									},
								});
							}
						}}
					/>
					<Counter
						number={props.productValue.quantity.count}
						onChange={(text: string) => {
							props.setProductValue({
								...props.productValue,
								quantity: {
									...props.productValue.quantity,
									count: text,
								},
							});
						}}
						postText={props.productValue.quantity.type}
						onPressPost={() =>
							props.bottomSheetModalRef.current?.present()
						}
						onPressAdd={() => {
							props.setProductValue({
								...props.productValue,
								quantity: {
									...props.productValue.quantity,
									count: (
										parseFloat(
											props.productValue.quantity.count
										) + 1
									).toString(),
								},
							});
						}}
						onPressMinus={() =>
							props.setProductValue({
								...props.productValue,
								quantity: {
									...props.productValue.quantity,
									count: (
										parseFloat(
											props.productValue.quantity.count
										) - 1
									).toString(),
								},
							})
						}
					/>
				</View>
			) : (
				<View
					style={{
						flexDirection: "column",
						alignItems: "flex-end",
						width: "25%",
					}}
				>
					<TextInput
						placeholder="₹"
						value={props.productValue.price.mrp}
						style={styles.price}
						onChangeText={(text) =>
							props.setProductValue({
								...props.productValue,
								price: {
									...props.productValue.price,
									mrp: text,
								},
							})
						}
						editable={props.editMode}
					/>

					<TouchableOpacity
						disabled={!props.editMode}
						onPress={() =>
							props.bottomSheetModalRef.current?.present()
						}
					>
						<Text style={styles.quantity}>
							{props.productValue.quantity.count
								? `${props.productValue.quantity.count} ${props.productValue.quantity.type}`
								: `X mg`}
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
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
	quantity: {
		marginTop: 12,
		color: "#555",
		textAlign: "right",
	},
});
