import React, { useContext, useEffect } from "react";
import DynamicStatusBar from "../components/Common/StatusBar";
import { LoadingContainer } from "../components/Common/Elements";

import { AuthContext } from "../context/auth";

import { RootStackScreenProps } from "../types";

const SplashScreen = ({ navigation }: RootStackScreenProps<"Splash">) => {
	const { user } = useContext(AuthContext);

	const checkUser = () => {
		if (user) {
			navigation.navigate("Root");
		} else {
			navigation.navigate("Onboarding");
		}
	};

	useEffect(() => {
		checkUser();
	}, [user]);

	return (
		<>
			<DynamicStatusBar />
			<LoadingContainer />
		</>
	);
};

export default SplashScreen;
