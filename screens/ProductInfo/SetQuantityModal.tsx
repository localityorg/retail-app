import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { View, Text, TextInput } from "../../components/Common/Themed";
import { CustomBackdrop } from "../../components/Common/ModalStyle";

import { units } from "../../constants/Units";

interface SetQuantityModalProps {
	bottomSheetModalRef: any;
	snapPoints: any;
	handleSheetChanges: any;
	productValue: any;
	setProductValue: any;
	setQuantityState: any;
	quantityState: any;
}

export function SetQuantityModal(props: SetQuantityModalProps) {
	return (
		<BottomSheetModal
			ref={props.bottomSheetModalRef}
			index={0}
			snapPoints={props.snapPoints}
			onChange={props.handleSheetChanges}
			style={{
				borderRadius: 20,
			}}
			backdropComponent={CustomBackdrop}
			key={3344543134}
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
						keyboardType="phone-pad"
						autoFocus={true}
						value={props.productValue.quantity.count}
						onChangeText={(text: string) =>
							props.setProductValue({
								...props.productValue,
								quantity: {
									...props.productValue.quantity,
									count: text,
								},
							})
						}
						placeholder="Eg. 100"
						style={{ fontSize: 23 }}
					/>
					<Text
						style={{
							fontSize: 23,
							marginLeft: 8,
							alignSelf: "flex-end",
						}}
					>
						{props.productValue.quantity.type}
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
									quantity: {
										...props.productValue.quantity,
										type: obj.unit,
									},
								});
							}}
							delayPressIn={0}
							style={{
								backgroundColor:
									props.productValue.type === obj.unit ||
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

const styles = StyleSheet.create({
	categories: {
		marginVertical: 10,
		flexDirection: "row",
		flexWrap: "wrap",
		width: "100%",
	},
	vendorActionBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
		padding: 10,
	},
});
