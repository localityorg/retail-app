import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	ActivityIndicator,
	Alert,
	TouchableOpacity,
	Dimensions,
} from "react-native";

import { useLazyQuery, useMutation } from "@apollo/client";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { BoldText, View } from "../Common/Themed";

import { DELETE_ACCOUNT } from "../../graphql/userdefs";
import { setICart, setUser } from "../../redux/actions";
import { AuthContext } from "../../context/auth";
import TFA from "../Auth/TFA";
import { TWOFACTOR_AUTH } from "../../graphql/authdefs";

const { width, height } = Dimensions.get("screen");

export default function DeleteBtn() {
	const [message, setMessage] = useState<string | any>(null);
	const [userState, setUserState] = useState<any>(null);

	const dispatch = useDispatch();
	const navigation: any = useNavigation();
	const context = useContext(AuthContext);

	const { user } = useSelector((state: any) => state.userReducer);

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	// variables
	const snapPoints = useMemo(() => ["60%"], []);
	// callbacks
	const handleSheetChanges = useCallback(() => {}, []);

	const [deleteAccount, { loading: deleteLoading }] = useMutation(
		DELETE_ACCOUNT,
		{
			onCompleted(data) {
				if (data.deleteAccount) {
					bottomSheetModalRef.current?.close();
					dispatch(setUser(null));
					dispatch(setICart(null));
					context.logout();
				}
			},
		}
	);

	const [twoFactorAuth, { data: twoFactorData, loading: tfaLoading }] =
		useLazyQuery(TWOFACTOR_AUTH, {
			variables: {
				contact: userState?.contact.number,
				newAcc: false,
			},
			fetchPolicy: "no-cache",
			onCompleted(data) {
				data.twoFactorAuth.error
					? setMessage("Account with this contact does not exist.")
					: bottomSheetModalRef.current?.present();
			},
			onError(err) {
				Alert.alert("Oops!", `${err}. Try Again`);
				process.env.NODE_ENV && console.log(err);
			},
		});

	useEffect(() => {
		user && setUserState(user);
	}, [user]);

	return (
		<>
			<TFA
				onCompleted={() => deleteAccount()}
				onDismiss={() => console.log("")}
				bottomSheetModalRef={bottomSheetModalRef}
				snapPoints={snapPoints}
				handleSheetChanges={handleSheetChanges}
				message={message}
				date={twoFactorData?.twoFactorAuth.date}
			/>
			{deleteLoading ? (
				<View
					style={{
						backgroundColor: "#00000033",
						position: "absolute",
						zIndex: 10,
						height,
						width,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<ActivityIndicator size="large" color="#1ea472" />
				</View>
			) : (
				<TouchableOpacity
					onPress={() => {
						twoFactorAuth();
					}}
					disabled={tfaLoading}
					style={{ marginVertical: 10 }}
				>
					<BoldText
						style={{
							textDecorationLine: "underline",
							color: "#dd0000",
						}}
					>
						Delete Account
					</BoldText>
				</TouchableOpacity>
			)}
		</>
	);
}
