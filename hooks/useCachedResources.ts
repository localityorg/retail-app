import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";

export default function useCachedResources() {
	const [isLoadingComplete, setLoadingComplete] = React.useState(false);

	// Load any resources or data that we need prior to rendering the app
	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHideAsync();

				// Load fonts
				await Font.loadAsync({
					"space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
					"Raleway-Bold": require("../assets/fonts/Raleway-Bold.ttf"),
					"Raleway-Regular": require("../assets/fonts/Raleway-Regular.ttf"),
					"OpenSans-SemiBold": require("../assets/fonts/OpenSans-SemiBold.ttf"),
					"OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
				});
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e);
			} finally {
				setLoadingComplete(true);
				SplashScreen.hideAsync();
			}
		}

		loadResourcesAndDataAsync();
	}, []);

	return isLoadingComplete;
}
