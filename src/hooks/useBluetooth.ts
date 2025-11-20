import { useCallback, useContext, useEffect, useState } from 'react';
import { PermissionsAndroid } from 'react-native';
import { Device } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import BandContext from '../contexts/BandContext';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

function StringToBool(str: string): boolean {
  return str === 'true';
}

async function requestBluetoothPermissions() {
  const permissions = [
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
  ];

  for (const permission of permissions) {
    await PermissionsAndroid.request(permission, {
      title: 'Bluetooth Permission',
      message: 'Bluetooth permission is required to scan and connect devices.',
      buttonNeutral: 'Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
  }
}

async function readInitialValues(
  device: Device,
  SERVICE_UUID: string,
  CHAR_UUID_BPM_STATUS: string,
  CHAR_UUID_VIBRA_STATUS: string,
  CHAR_UUID_BATTERY: string,
  setBpmStatus: (val: string) => void,
  setVibraStatus: (val: boolean) => void,
  setBatteryLevel: (val: number) => void,
) {
  try {
    const bpmChar = await device.readCharacteristicForService(
      SERVICE_UUID,
      CHAR_UUID_BPM_STATUS,
    );
    setBpmStatus(base64.decode(bpmChar?.value ?? ''));

    const vibraChar = await device.readCharacteristicForService(
      SERVICE_UUID,
      CHAR_UUID_VIBRA_STATUS,
    );
    setVibraStatus(StringToBool(base64.decode(vibraChar?.value ?? '')));

    const batteryChar = await device.readCharacteristicForService(
      SERVICE_UUID,
      CHAR_UUID_BATTERY,
    );
    const batteryValue = parseInt(base64.decode(batteryChar?.value ?? '0'), 10);
    setBatteryLevel(batteryValue);
  } catch (error) {
    console.error('Erro ao ler valores iniciais:', error);
  }
}

function monitorCharacteristics(
  device: Device,
  SERVICE_UUID: string,
  CHAR_UUID_BPM_STATUS: string,
  CHAR_UUID_VIBRA_STATUS: string,
  CHAR_UUID_BATTERY: string,
  setBpmStatus: (val: string) => void,
  setVibraStatus: (val: boolean) => void,
  setBatteryLevel: (val: number) => void,
) {
  device.monitorCharacteristicForService(
    SERVICE_UUID,
    CHAR_UUID_BPM_STATUS,
    (error, characteristic) => {
      if (error) {
        return;
      }

      if (characteristic?.value != null) {
        const bpm = base64.decode(characteristic.value).replace(/\D/g, '');
        bpm !== '' && setBpmStatus(bpm);
      }
    },
    'bpmtransaction',
  );

  device.monitorCharacteristicForService(
    SERVICE_UUID,
    CHAR_UUID_VIBRA_STATUS,
    (error, characteristic) => {
      if (error) {
        return;
      }

      if (characteristic?.value != null) {
        setVibraStatus(StringToBool(base64.decode(characteristic.value)));
      }
    },
    'vibratransaction',
  );

  device.monitorCharacteristicForService(
    SERVICE_UUID,
    CHAR_UUID_BATTERY,
    (error, characteristic) => {
      if (error) {
        return;
      }

      if (characteristic?.value != null) {
        const battery = parseInt(base64.decode(characteristic.value), 10);
        console.log('Battery Level:', battery);
        setBatteryLevel(battery);
      }
    },
    'batterytransaction',
  );
}

export function useBluetooth() {
  const {
    isConnected,
    setIsConnected,
    connectedDevice,
    setConnectedDevice,
    BLTManager,
    SERVICE_UUID,
    CHAR_UUID_BPM_STATUS,
    CHAR_UUID_VIBRA_STATUS,
    CHAR_UUID_BATTERY,
    setIsSearchingForBand,
    setBpmStatus,
    setVibraStatus,
    setBatteryLevel,
    bandModalRef,
  } = useContext(BandContext);

  const [bluetoothTunedOn, setBluetoothTunedOn] = useState<boolean>(false);

  const { t } = useTranslation();

  const isBluetoothActive = useCallback(async (): Promise<boolean> => {
    const state = await BLTManager.state();
    return state === 'PoweredOn';
  }, [BLTManager]);

  const monitorBluetoothState = useCallback(
    (onStateChange?: (state: string) => void) => {
      const subscription = BLTManager.onStateChange(state => {
        if (state === 'PoweredOn') {
          setBluetoothTunedOn(true);
        } else {
          setBluetoothTunedOn(false);
          setIsConnected(false);
          setConnectedDevice(undefined);
        }
        onStateChange?.(state);
      }, true);

      return subscription;
    },
    [BLTManager, setIsConnected, setConnectedDevice],
  );

  useEffect(() => {
    const subscription = monitorBluetoothState();

    return () => {
      subscription.remove();
    };
  }, [monitorBluetoothState]);

  useEffect(() => {
    const checkState = async () => {
      const active = await isBluetoothActive();
      setBluetoothTunedOn(active);
    };
    checkState();
  }, [isBluetoothActive]);

  const connectDevice = useCallback(
    async (device: Device) => {
      try {
        const connected = await device.connect();
        setConnectedDevice(connected);
        setIsConnected(true);
        await connected.discoverAllServicesAndCharacteristics();

        BLTManager.onDeviceDisconnected(connected.id, _e => {
          bandModalRef.current?.hide();
          setIsConnected(false);
          setConnectedDevice(undefined);
        });

        await readInitialValues(
          connected,
          SERVICE_UUID,
          CHAR_UUID_BPM_STATUS,
          CHAR_UUID_VIBRA_STATUS,
          CHAR_UUID_BATTERY,
          setBpmStatus,
          setVibraStatus,
          setBatteryLevel,
        );
        monitorCharacteristics(
          connected,
          SERVICE_UUID,
          CHAR_UUID_BPM_STATUS,
          CHAR_UUID_VIBRA_STATUS,
          CHAR_UUID_BATTERY,
          setBpmStatus,
          setVibraStatus,
          setBatteryLevel,
        );
      } catch (error) {
        console.warn('Connection error:', error);
        setIsConnected(false);
        setConnectedDevice(undefined);
      }
    },
    [
      setConnectedDevice,
      setIsConnected,
      BLTManager,
      SERVICE_UUID,
      CHAR_UUID_BPM_STATUS,
      CHAR_UUID_VIBRA_STATUS,
      CHAR_UUID_BATTERY,
      setBpmStatus,
      setVibraStatus,
      setBatteryLevel,
      bandModalRef,
    ],
  );

  const scanDevices = useCallback(async (): Promise<Device[]> => {
    await requestBluetoothPermissions();

    return new Promise<Device[]>(resolve => {
      const foundDevices: { [id: string]: Device } = {};

      BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) {
          console.warn(error);
          BLTManager.stopDeviceScan();
          resolve(
            Object.values(foundDevices).filter(
              device => device.name === 'PulseBand',
            ),
          );
          return;
        }

        if (scannedDevice && scannedDevice.id) {
          foundDevices[scannedDevice.id] = scannedDevice;
        }
      });

      setTimeout(() => {
        BLTManager.stopDeviceScan();
        const pulseBands = Object.values(foundDevices).filter(
          device => device.name === 'PulseBand',
        );

        resolve(pulseBands);

        if (pulseBands.length === 0) {
          bandModalRef.current?.hide();

          Toast.show({
            type: 'info',
            text1: t('errors.unexpectedError'),
            text2: t('pulseBand.notFound'),
          });
          setIsSearchingForBand(false);
        }
      }, 5000);
    });
  }, [BLTManager, bandModalRef, setIsSearchingForBand, t]);

  const disconnectDevice = useCallback(async () => {
    if (connectedDevice) {
      await BLTManager.cancelDeviceConnection(connectedDevice.id);
      bandModalRef.current?.hide();
      setIsConnected(false);
      setConnectedDevice(undefined);
    }
  }, [
    BLTManager,
    bandModalRef,
    connectedDevice,
    setConnectedDevice,
    setIsConnected,
  ]);

  return {
    scanDevices,
    disconnectDevice,
    connectDevice,
    bluetoothTunedOn,
    connectedDevice,
    isConnected,
  };
}
