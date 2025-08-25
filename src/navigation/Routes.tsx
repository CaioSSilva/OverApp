import { Image, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Stats from '../screens/Stats';
import Matchs from '../screens/Matchs';
import { useTranslation } from 'react-i18next';
import Maps from '../screens/Maps';
import { MapPin } from 'lucide-react-native';
import Characters from '../screens/Characters';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import Details from '../screens/Details';
import { RouteProp } from '@react-navigation/native';
import { DetailsProps } from '../interfaces/Details.model';
import HeroDetails from '../screens/HeroDetails/HeroDetails';

const TabNavigator = createBottomTabNavigator();

type StackParamList = {
  Details: {
    status: DetailsProps['status'];
    hero: DetailsProps['hero'];
  };
  HeroDetails: {
    hero: DetailsProps['hero'];
  };
};

const StackNavigator = createStackNavigator<StackParamList>();

type DetailsScreenProps = {
  navigation: StackNavigationProp<StackParamList, 'Details'>;
  route: RouteProp<StackParamList, 'Details'>;
};

function DetailsWrapper({ route }: DetailsScreenProps) {
  const { status, hero } = route.params;
  return <Details status={status} hero={hero} />;
}

type HeroDetailsScreenProps = {
  navigation: StackNavigationProp<StackParamList, 'HeroDetails'>;
  route: RouteProp<StackParamList, 'HeroDetails'>;
};

function HeroDetailsWrapper({ route }: HeroDetailsScreenProps) {
  const { hero } = route.params;
  return <HeroDetails hero={hero} />;
}

function Tabs() {
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
        name={t('navigation.stats')}
        component={Stats}
        options={{
          tabBarIcon: ({ color, size }) =>
            createImageIcon(require('../assets/comp_points.png'), size, color),
        }}
      />
      <TabNavigator.Screen
        name={t('navigation.characters')}
        component={Characters}
        options={{
          tabBarIcon: ({ size, color }) =>
            createImageIcon(require('../assets/logo.png'), size, color),
        }}
      />
      <TabNavigator.Screen
        name={t('navigation.maps')}
        component={Maps}
        options={{
          tabBarIcon: ({ size, color }) => createMapsIcon(size, color),
        }}
      />
      <TabNavigator.Screen
        name={t('navigation.matches')}
        component={Matchs}
        options={{
          tabBarIcon: ({ color, size }) =>
            createImageIcon(require('../assets/rank_badge.png'), size, color),
        }}
      />
    </TabNavigator.Navigator>
  );
}

function Stack() {
  return (
    <StackNavigator.Navigator

    >
      <StackNavigator.Screen
        name="Details"
        options={{
          headerShown: false,
        }}
        component={DetailsWrapper}
      />
       <StackNavigator.Screen
      name="HeroDetails"
      options={{
        headerShown: false,
      }}
      component={HeroDetailsWrapper}
      />
    </StackNavigator.Navigator>
  );
}

const MainStackNavigator = createStackNavigator();

export default function Routes() {
  return (
    <MainStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        gestureDirection: 'horizontal',
      }}
    >
      <MainStackNavigator.Screen name="Tabs" component={Tabs} />
      <MainStackNavigator.Screen name="Stack" component={Stack} />
    </MainStackNavigator.Navigator>
  );
}

const createMapsIcon = (size: number, color: string) => {
  return <MapPin strokeWidth={2.5} size={size} color={color} />;
};

const createImageIcon = (source: any, size: number, color: string) => {
  return (
    <Image
      source={source}
      style={{ tintColor: color, width: size, height: size }}
    />
  );
};
