import { Image, useColorScheme } from 'react-native';
import Home from '../screens/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Stats from '../screens/Stats';
import Matchs from '../screens/Matchs';

const TabNavigator = createBottomTabNavigator();

export default function Routes() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TabNavigator.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#E2E2E2',
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#1F1F1F' : '#D3D3D3',
        },
        tabBarActiveTintColor: '#FA9C1E',
        tabBarLabelStyle: { fontWeight: 'bold' },
      }}
    >
      <TabNavigator.Screen
        name="Heróis"
        component={Home}
        options={{
          tabBarIcon: ({ size, color }) =>
            createImageIcon( require('../assets/logo.png'),
              size,
              color,
            ),
        }}
      />
      <TabNavigator.Screen
        name="Estatísticas"
        component={Stats}
        options={{
          tabBarIcon: ({ color, size }) =>
            createImageIcon(require('../assets/comp_points.png'), size, color),
        }}
      />
      <TabNavigator.Screen
        name="Partidas"
        component={Matchs}
        options={{
          tabBarIcon: ({ color, size }) => createImageIcon(require('../assets/rank_badge.png'), size, color),
        }}
      />
    </TabNavigator.Navigator>
  );
}

const createImageIcon = (source: any, size: number, color: string) => {
  return (
    <Image
      source={source}
      style={{ tintColor: color, width: size, height: size }}
    />
  );
};
