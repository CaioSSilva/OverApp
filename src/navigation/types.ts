import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Tabs: undefined;
  Stacks: undefined
};

export type TabParamList = {
  Stats: undefined;
  Characters: undefined;
  Maps: undefined;
  Matches: undefined;
};

export type DetailsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Stacks'>;
  route: RouteProp<RootStackParamList, 'Stacks'>;
};

export type { Category } from '../interfaces/Details.model';
export type { Hero } from '../interfaces/Hero.model';
