import React from 'react';
import Skeleton from '../../../components/Skeleton';
import { View } from 'react-native';

export function LoadingSkeleton() {
  return (
    <View>
      <Skeleton height={140} />
      <Skeleton height={60} />
      <Skeleton height={190} />
      <Skeleton height={350} />
    </View>
  );
}
