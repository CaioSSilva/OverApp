import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/theme';
import { useRoute } from '@react-navigation/native';
import { BatteryFull, BatteryLow, BatteryMedium } from 'lucide-react-native';
import BandContext from '../contexts/BandContext';

const BUBBLE_SIZE = 45;

export function BandBubble() {
  const route = useRoute();
  const { mapBatteryState, bandModalRef, batteryLevel } =
    useContext(BandContext);

  const isOnAthena = () => {
    return route.name === 'Athena';
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => bandModalRef.current?.show()}
      style={[
        styles(isOnAthena()).bubble,
        { borderColor: mapBatteryState()?.color },
      ]}
    >
      {batteryLevel >= 90 ? (
        <BatteryFull size={21} color={mapBatteryState()?.color} />
      ) : batteryLevel >= 50 ? (
       <BatteryMedium size={21} color={mapBatteryState()?.color} />
      ) : (
        <BatteryLow size={21} color={mapBatteryState()?.color} />
      )}
    </TouchableOpacity>
  );
}

const styles = (isOnAthena: boolean) =>
  StyleSheet.create({
    bubble: {
      width: BUBBLE_SIZE,
      height: BUBBLE_SIZE,
      borderRadius: BUBBLE_SIZE / 2,
      backgroundColor: COLORS.INFO,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: isOnAthena ? 100 : 20,
      right: 20,
      zIndex: 100,
      borderWidth: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
  });
