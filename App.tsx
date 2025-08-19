import {
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Splash from './src/screens/Splash';
import { getThemedStyles } from './styles';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar/>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      style={[
        getThemedStyles(isDarkMode).container,
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
          paddingLeft: safeAreaInsets.left,
          paddingRight: safeAreaInsets.right,
        },
      ]}
    >
      <Splash />
    </View>
  );
}

export default App;
