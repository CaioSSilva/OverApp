import { Image, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Stats from '../screens/Stats';
import Matchs from '../screens/Matchs';
import { useTranslation } from 'react-i18next';
import Maps from '../screens/Maps';
import { MapPin } from 'lucide-react-native';
import Characters from '../screens/Characters';

const TabNavigator = createBottomTabNavigator();

export default function Routes() {
  const isDarkMode = useColorScheme() === 'dark';
    const { t } = useTranslation();

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
        name={t('stats')}
        component={Stats}
        options={{
          tabBarIcon: ({ color, size }) =>
            createImageIcon(require('../assets/comp_points.png'), size, color),
        }}
      />
      <TabNavigator.Screen
        name={t('characters')}
        component={Characters}
        options={{
          tabBarIcon: ({ size, color }) =>
            createImageIcon( require('../assets/logo.png'),
              size,
              color,
            ),
        }}
      />
      <TabNavigator.Screen
        name={t('maps')}
        component={Maps}
        options={{
          tabBarIcon: ({ size, color }) =>
            createMapsIcon(size, color),
        }}
      />
      <TabNavigator.Screen
        name={t('matches')}
        component={Matchs}
        options={{
          tabBarIcon: ({ color, size }) => createImageIcon(require('../assets/rank_badge.png'), size, color),
        }}
      />
    </TabNavigator.Navigator>
  );
}

const createMapsIcon = (size: number, color: string) => {
  return <MapPin strokeWidth={2.5} size={size} color={color} />;
}

const createImageIcon = (source: any, size: number, color: string) => {
  return (
    <Image
      source={source}
      style={{ tintColor: color, width: size, height: size }}
    />
  );
};
