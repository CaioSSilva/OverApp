import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import PulseBandSheet from "./src/components/HearthGraph/PulseBandSheet";
import NoConnectionModal from "./src/components/NoConnectionModal/NoConnectionModal";
import { AppContext } from "./src/contexts/AppContext";
import { useBiometrics } from "./src/hooks/useBiometrics";
import Routes from "./src/navigation/Routes";
import Biometrics from "./src/screens/Biometrics";
import Splash from "./src/screens/Splash";
import Welcome from "./src/screens/Welcome";
import { getThemedStyles } from "./src/styles/theme";

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const safeAreaInsets = useSafeAreaInsets();
  const [isInitializing, setIsInitializing] = useState(true);

  const { setLoaded, Loaded, User, setUser } = useContext(AppContext);
  const { Authenticated: isAuthenticated, biometryActive, setBiometryActive } = useBiometrics();

  useEffect(() => {
    const initialize = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        setUser(JSON.parse(userString));
      }

      const biometryStatus = await AsyncStorage.getItem('biometryActive');
      setBiometryActive(biometryStatus === 'true');

      setIsInitializing(false);

      const randomDelay = Math.floor(Math.random() * 6001);
      setTimeout(() => setLoaded(true), randomDelay);
    };

    initialize();
  }, [setUser, setLoaded, setBiometryActive]);

  const renderScreen = () => {
    if (isInitializing) return <Splash />;
    if (biometryActive && !isAuthenticated) return <Biometrics />;
    if (!User) return <Welcome />;
    if (!Loaded) return <Splash />;
    
    return (
      <NavigationContainer>
        <Routes />
        <PulseBandSheet />
      </NavigationContainer>
    );
  };

  return (
    <View
      style={[
        getThemedStyles(isDarkMode).container,
        { paddingTop: safeAreaInsets.top },
      ]}
    >
      {renderScreen()}
      <Toast />
      <NoConnectionModal />
    </View>
  );
}

export default AppContent;
