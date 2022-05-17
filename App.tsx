// react
import React from "react";
import { ActivityIndicator } from "react-native";

// react native components
import { SafeAreaProvider } from "react-native-safe-area-context";

// importing resources and colorscheme hooks
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";

// navigation container
import Navigation from "./navigation";

// expo imports
import { StatusBar } from "expo-status-bar";

// apollo
import { ApolloProvider } from "@apollo/client";
import { client } from "./ApolloProvider";
import { AuthProvider } from "./context/auth";

// redux
import { Provider } from "react-redux";
import { Store } from "./redux/store";

// external components
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";

import { toastConfig } from "./constants/ToastConfig";

export default function App() {
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	if (!isLoadingComplete && client) {
		return <ActivityIndicator size="large" color="#1ea472" />;
	} else {
		return (
			<SafeAreaProvider>
				<ApolloProvider client={client}>
					<AuthProvider>
						<Provider store={Store}>
							<BottomSheetModalProvider>
								<Navigation colorScheme={colorScheme} />
								<Toast config={toastConfig} />
							</BottomSheetModalProvider>
						</Provider>
						<StatusBar />
					</AuthProvider>
				</ApolloProvider>
			</SafeAreaProvider>
		);
	}
}
