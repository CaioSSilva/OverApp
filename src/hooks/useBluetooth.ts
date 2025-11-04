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
  setBpmStatus: (val: string) => void,
  setVibraStatus: (val: boolean) => void,
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
  } catch (error) {
    console.error('Erro ao ler valores iniciais:', error);
  }
}

function monitorCharacteristics(
  device: Device,
  SERVICE_UUID: string,
  CHAR_UUID_BPM_STATUS: string,
  CHAR_UUID_VIBRA_STATUS: string,
  setBpmStatus: (val: string) => void,
  setVibraStatus: (val: boolean) => void,
) {
  device.monitorCharacteristicForService(
    SERVICE_UUID,
    CHAR_UUID_BPM_STATUS,
    (error, characteristic) => {
      if (error) {
        console.error('Monitor BPM error:', error.message);
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
        console.error('Monitor Vibra error:', error.message);
        return;
      }

      if (characteristic?.value != null) {
        setVibraStatus(StringToBool(base64.decode(characteristic.value)));
      }
    },
    'vibratransaction',
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
    setIsSearchingForBand,
    setBpmStatus,
    setVibraStatus,
    bandModalRef,
  } = useContext(BandContext);

  const [bluetoothTunedOn, setBluetoothTunedOn] = useState<boolean>(false);

  const { t } = useTranslation();

  const isBluetoothActive = useCallback(async (): Promise<boolean> => {
    const state = await BLTManager.state();
    return state === 'PoweredOn';
  }, [BLTManager]);

  useEffect(() => {
    const subscription = BLTManager.onStateChange(state => {
      if (state === 'PoweredOn') {
        setBluetoothTunedOn(true);
      } else {
        setBluetoothTunedOn(false);
        setIsConnected(false);
        setConnectedDevice(undefined);
      }
    }, true);

    return () => {
      subscription.remove();
    };
  }, [BLTManager, setIsConnected, setConnectedDevice]);

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

        BLTManager.onDeviceDisconnected(connected.id, error => {
          if (error) {
            // Log de desconexão removido. O erro é tratado.
          } else {
            // Log de desconexão removido.
          }
          setIsConnected(false);
          setConnectedDevice(undefined);
        });

        await readInitialValues(
          connected,
          SERVICE_UUID,
          CHAR_UUID_BPM_STATUS,
          CHAR_UUID_VIBRA_STATUS,
          setBpmStatus,
          setVibraStatus,
        );
        monitorCharacteristics(
          connected,
          SERVICE_UUID,
          CHAR_UUID_BPM_STATUS,
          CHAR_UUID_VIBRA_STATUS,
          setBpmStatus,
          setVibraStatus,
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
      setBpmStatus,
      setVibraStatus,
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
      try {
        await BLTManager.cancelDeviceConnection(connectedDevice.id);
      } catch (error) {
        console.error(
          'Erro durante a desconexão (pode já estar desconectado):',
          error,
        );
      } finally {
        setIsConnected(false);
        setConnectedDevice(undefined);
      }
    } else {
      setIsConnected(false);
      setConnectedDevice(undefined);
    }
  }, [BLTManager, connectedDevice, setIsConnected, setConnectedDevice]);

  return {
    scanDevices,
    disconnectDevice,
    connectDevice,
    bluetoothTunedOn,
    connectedDevice,
    isConnected,
  };
}
