import React from "react";

import { View, Dimensions } from "react-native";

import { QRCode } from "react-native-custom-qr-codes";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import {
	CommonStyles,
	SecondaryActionBtn,
	SecondaryActionBtnText,
} from "../Common/Elements";

import { CustomBackdrop } from "../Common/ModalStyle";

interface QRModalInterface {
	paymentUri: string;
	closeQR: any;
	key: number;
	bottomSheetModalRef: any;
	snapPoints: any;
	handleSheetChanges: any;
}

export default function QRModal(props: QRModalInterface) {
	return (
		<BottomSheetModal
			ref={props.bottomSheetModalRef}
			index={1}
			key={props.key}
			snapPoints={props.snapPoints}
			onChange={props.handleSheetChanges}
			backdropComponent={CustomBackdrop}
			style={{
				borderRadius: 20,
			}}
		>
			<View style={CommonStyles.loadingContainer}>
				<QRCode
					content={props.paymentUri}
					backgroundColor="transparent"
					color="#1ea472"
					codeStyle="sharp"
					height={Dimensions.get("window").width - 50}
					width={Dimensions.get("window").width - 50}
				/>

				<View style={CommonStyles.actionBtnContainer}>
					<SecondaryActionBtn disable={false} onPress={props.closeQR}>
						<SecondaryActionBtnText>Done</SecondaryActionBtnText>
					</SecondaryActionBtn>
				</View>
			</View>
		</BottomSheetModal>
	);
}
