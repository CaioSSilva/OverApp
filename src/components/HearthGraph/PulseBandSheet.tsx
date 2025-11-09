import React, { useContext, useRef, useState } from 'react';
import {
  Dimensions,
  Linking,
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ScrollView,
} from 'react-native';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import Button from '../Button';
import { COLORS, getThemedStyles } from '../../styles/theme';
import { useTranslation } from 'react-i18next';
import BandContext from '../../contexts/BandContext';
import { useBluetooth } from '../../hooks/useBluetooth';
import { Device } from 'react-native-ble-plx';
import { LineChart } from 'react-native-chart-kit';
import { ClockFading } from 'lucide-react-native';
import HistorySheet from './HistorySheet';

const PulseBandSheet = () => {
  const historySheetRef = useRef<ActionSheetRef>(null);
  const isDarkMode = useColorScheme() === 'dark';
  const { t } = useTranslation();
  const { bluetoothTunedOn, scanDevices, connectDevice, disconnectDevice } =
    useBluetooth();
  const {
    bandModalRef,
    isConnected,
    bpmForExibition,
    setIsSearchingForBand,
    isSearchingForBand,
  } = useContext(BandContext);
  const [devices, setDevices] = useState<Device[]>([]);

  const openBluetoothSettings = () => {
    Platform.OS === 'ios'
      ? Linking.openSettings()
      : Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
  };

  const closeBluetoothModal = () => {
    bandModalRef.current?.hide();
  };

  const searchForBands = async () => {
    setIsSearchingForBand(true);
    const devicesFound = await scanDevices();
    setDevices(devicesFound);
  };

  const cancelButtonStyles = {
    marginTop: 20,
    backgroundColor: COLORS.ERROR,
  };

  return (
    <ActionSheet
      gestureEnabled={true}
      onBeforeShow={() => setIsSearchingForBand(false)}
      headerAlwaysVisible
      ref={bandModalRef}
      containerStyle={getThemedStyles(isDarkMode).sheet}
    >
      <View style={styles(isDarkMode).sheetContent}>
        {!isConnected && !isSearchingForBand ? (
          <>
            <Text style={getThemedStyles(isDarkMode).titleText}>
              {t('pulseBand.hasBandTitle')}
            </Text>

            <Text style={styles(isDarkMode).messageText}>
              {t('pulseBand.connectMessage')}
            </Text>

            <Button
              title={
                bluetoothTunedOn
                  ? t('pulseBand.search')
                  : t('common.openSettings')
              }
              scale={1.1}
              onPress={() =>
                bluetoothTunedOn ? searchForBands() : openBluetoothSettings()
              }
            />

            <Button
              title={t('common.cancel')}
              scale={1.1}
              customStyles={cancelButtonStyles}
              onPress={closeBluetoothModal}
            />
          </>
        ) : isSearchingForBand ? (
          <>
            <Text style={getThemedStyles(isDarkMode).titleText}>
              {t('pulseBand.searching')}
            </Text>

            <Text style={styles(isDarkMode).messageText}>
              {t('pulseBand.description')}
            </Text>

            <View style={styles(isDarkMode).devicesListContainer}>
              <ScrollView
                contentContainerStyle={styles(isDarkMode).devicesScrollContent}
              >
                {devices.map(device => (
                  <View key={device.id} style={styles(isDarkMode).deviceRow}>
                    <Text style={styles(isDarkMode).deviceTitle}>
                      {device.name ? device.name : t('pulseBand.unknown')}
                    </Text>
                    <Button
                      title={t('pulseBand.connect')}
                      scale={1.1}
                      onPress={async () => {
                        await connectDevice(device);
                        setIsSearchingForBand(false);
                        closeBluetoothModal();
                      }}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        ) : (
          <>
            <View style={styles(isDarkMode).chartHeader}>
              <Text style={getThemedStyles(isDarkMode).titleText}>
                {t('pulseBand.title')}
              </Text>

              <Button
                icon={<ClockFading size={20} color={COLORS.WHITE}/>}
                customStyles={styles(isDarkMode).clockwiseIcon}
                scale={1.1}
                onPress={() => {
                  historySheetRef.current?.show();
                }}
              />
            </View>

            <LineChart
              bezier
              data={{
                labels: [],
                datasets: [
                  {
                    data: bpmForExibition,
                  },
                ],
              }}
              width={Dimensions.get('window').width * 0.9}
              height={220}
              yAxisSuffix={` ${t('pulseBand.bpm').toLocaleUpperCase()}`}
              chartConfig={{
                backgroundColor: isDarkMode
                  ? COLORS.DARK.CARD
                  : COLORS.LIGHT.CARD,
                backgroundGradientFrom: isDarkMode
                  ? COLORS.DARK.CARD
                  : COLORS.LIGHT.CARD,
                backgroundGradientTo: isDarkMode
                  ? COLORS.DARK.CARD
                  : COLORS.LIGHT.CARD,
                decimalPlaces: 0,
                color: (opacity = 1) =>
                  isDarkMode
                    ? `rgba(255, 255, 255, ${opacity})`
                    : `rgba(44, 62, 80, ${opacity})`,
                labelColor: (opacity = 1) =>
                  isDarkMode
                    ? `rgba(255,255,255,${opacity})`
                    : `rgba(44,62,80,${opacity})`,
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: COLORS.PRIMARY,
                  fill: COLORS.PRIMARY,
                },
                propsForBackgroundLines: {
                  stroke: isDarkMode ? COLORS.DARK.BORDER : COLORS.LIGHT.BORDER,
                  strokeDasharray: '',
                },
              }}
              style={styles(isDarkMode).chart}
            />

            <Text style={styles(isDarkMode).messageText}>
              {t('pulseBand.currentBpm', {
                bpm: bpmForExibition[bpmForExibition.length - 1],
              })}
            </Text>

            <Button
              title={t('pulseBand.disconnect')}
              scale={1.1}
              onPress={async () => {
                await disconnectDevice();
                setDevices([]);
              }}
            />
            <HistorySheet ref={historySheetRef}/>
          </>
        )}
      </View>
    </ActionSheet>
  );
};

export default PulseBandSheet;

const styles = (isDarkMode: boolean) =>
  StyleSheet.create({
    devicesListContainer: {
      width: '100%',
      maxHeight: 250,
    },
    devicesScrollContent: {
      paddingHorizontal: 10,
    },
    deviceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      width: '100%',
      paddingHorizontal: 8,
    },
    deviceTitle: {
      flex: 1,
      fontWeight: '700',
      fontSize: 16,
      color: isDarkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT,
      textAlign: 'left',
      marginBottom: 0,
      lineHeight: 24,
    },
    sheetContent: {
      alignItems: 'center',
    },
    messageText: {
      fontSize: 16,
      color: isDarkMode ? COLORS.DARK.TEXT : COLORS.LIGHT.TEXT,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 24,
    },
    chart: {
      marginVertical: 12,
      borderRadius: 18,
      backgroundColor: isDarkMode ? COLORS.DARK.CARD : COLORS.LIGHT.CARD,
    },
    chartHeader: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    clockwiseIcon: {
      position: 'absolute',
      right: 0,
    },
  });
