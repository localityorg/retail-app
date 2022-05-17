import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";

import * as Contacts from "expo-contacts";
import { BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { View, BoldText, Text } from "./Themed";
import { CommonStyles } from "./Elements";
import { CustomBackdrop } from "./ModalStyle";
import Input from "./Input";

interface selectContact {
	contactValue: any;
	onSelectValue: any;
	bottomSheetModalRef: any;
	snapPoints: any;
	handleSheetChanges: any;
}

export default function SelectContact(props: selectContact) {
	const [contacts, setContacts] = useState<any[] | null>(null);
	const [toSearch, setToSearch] = useState("");

	useEffect(() => {
		(async () => {
			const { status } = await Contacts.requestPermissionsAsync();
			if (status === "granted") {
				const { data } = await Contacts.getContactsAsync({
					fields: [
						Contacts.Fields.Name,
						Contacts.Fields.PhoneNumbers,
					],
				});
				const cntx = [];

				data.filter((e) =>
					e.name.includes(
						toSearch.trim().length !== 0 ? toSearch : e.name
					)
				).forEach((obj) => {
					const phn = obj.phoneNumbers;
					cntx.push({
						id: obj.id,
						name: obj.name,
						isd: phn[0].countryCode ? phn[0].countryCode : "+91",
						phoneNumber: phn[0].number
							?.toString()
							.replace(/\s+/g, ""),
					});
				});

				setContacts(cntx);
			}
		})();
	}, [toSearch]);

	return (
		<>
			<BottomSheetModal
				index={1}
				ref={props.bottomSheetModalRef}
				snapPoints={props.snapPoints}
				onChange={props.handleSheetChanges}
				style={{
					borderRadius: 20,
				}}
				backdropComponent={CustomBackdrop}
			>
				<View style={CommonStyles.container}>
					<View style={CommonStyles.mainContainer}>
						<BoldText style={CommonStyles.title}>Contacts</BoldText>
						<Input
							title="Contact Name"
							placeholder="Search from contacts"
							selectionColor="#1ea47222"
							value={toSearch}
							onChange={(text: string) => {
								setToSearch(text);
							}}
							error={false}
							errorMessage=""
						/>
						<BottomSheetFlatList
							data={contacts}
							initialNumToRender={10}
							keyExtractor={(e) => e.id}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={{
										marginVertical: 10,
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
									onPress={() => {
										props.onSelectValue({
											name: item.name,
											contact: {
												ISD: item.isd
													? item.isd
													: "+91",
												number:
													item.phoneNumber.length > 10
														? item.phoneNumber.slice(
																-10
														  )
														: item.phoneNumber,
											},
										});
										props.bottomSheetModalRef.current?.close();
									}}
								>
									<Text
										style={{
											fontSize: 18,
											width: "50%",
										}}
										numberOfLines={1}
									>
										{item.name}
									</Text>
									<Text
										style={{
											fontSize: 18,
											color: "#777",
										}}
									>
										{item.phoneNumber}
									</Text>
								</TouchableOpacity>
							)}
						/>
					</View>
				</View>
			</BottomSheetModal>
		</>
	);
}
