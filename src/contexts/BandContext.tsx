import React, { createContext, useEffect, useState, useCallback } from 'react';
import { ActionSheetRef } from 'react-native-actions-sheet';
import { BleManager, Device } from 'react-native-ble-plx';
import { COLORS } from '../styles/theme';

interface BandContextType {
  bandModalRef: React.RefObject<ActionSheetRef | null>;
  isConnected: boolean;
  isSearchingForBand: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  connectedDevice: Device | undefined;
  setConnectedDevice: React.Dispatch<React.SetStateAction<Device | undefined>>;
  BLTManager: BleManager;
  SERVICE_UUID: string;
  CHAR_UUID_BPM_STATUS: string;
  CHAR_UUID_VIBRA_STATUS: string;
  CHAR_UUID_BATTERY: string;
  setBpmStatus: React.Dispatch<React.SetStateAction<string>>;
  setVibraStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSearchingForBand: React.Dispatch<React.SetStateAction<boolean>>;
  bpmHistory: { value: number; timestamp: number }[];
  bpmForExibition: number[];
  vibraHistory: { value: boolean; timestamp: number }[];
  batteryLevel: number
  setBatteryLevel: React.Dispatch<React.SetStateAction<number>>;
  mapBatteryState: () => { color: string } | undefined;
}

const BandContext = createContext<BandContextType>({} as BandContextType);

export const BandProvider = (children: { children: React.ReactNode }) => {
  const bandModalRef = React.useRef<ActionSheetRef>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<Device>();

  const BLTManager = new BleManager();

  const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  const CHAR_UUID_BPM_STATUS = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
  const CHAR_UUID_VIBRA_STATUS = '86b14f82-a337-43c3-8b7c-0e86f8d052d9';
  const CHAR_UUID_BATTERY  =    "124f1674-636b-4e91-b226-345123456789";


  const [bpmStatus, setBpmStatus] = useState<string>('');
  const [vibraStatus, setVibraStatus] = useState<boolean>(false);

  const [isSearchingForBand, setIsSearchingForBand] = useState(false);

  const [bpmHistory, setBpmHistory] = useState<
    { value: number; timestamp: number }[]
  >([]);
  const [vibraHistory, setVibraHistory] = useState<
    {
      value: boolean;
      timestamp: number;
    }[]
  >([]);

  const [bpmForExibition, setBpmForExibition] = useState<number[]>([]);

  const [batteryLevel, setBatteryLevel] = useState<number>(0);

  const mapBatteryState = useCallback(() => {
    const lvl = Math.round(batteryLevel);
    if (lvl >= 90)
      return {
        color: COLORS.BATTERY.HIGH,
      };
    if (lvl >= 50)
      return {
        color: COLORS.BATTERY.MEDIUM
      };
    if (lvl >= 30)
      return {
        color: COLORS.BATTERY.LOW,
      };
  }, [batteryLevel]);


  useEffect(() => {
    if (bpmStatus)
      setBpmHistory(prev => [
        ...prev,
        {
          value: !Number.isNaN(Number(bpmStatus)) ? Number(bpmStatus) : 0,
          timestamp: Date.now(),
        },
      ]);

    if (bpmStatus) {
      setBpmForExibition(prev => {
        const newValue = !Number.isNaN(Number(bpmStatus))
          ? Number(bpmStatus)
          : 0;
        const updated = [...prev, newValue];
        return updated.slice(-7);
      });
    }

    setVibraHistory(prev => [
      ...prev,
      {
        value: vibraStatus,
        timestamp: Date.now(),
      },
    ]);
  }, [bpmStatus, vibraStatus]);

  return (
    <BandContext.Provider
      value={{
        bandModalRef,
        isConnected,
        isSearchingForBand,
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
        bpmHistory,
        bpmForExibition,
        vibraHistory,
        batteryLevel,
        setBatteryLevel,
        mapBatteryState, 
      }}
    >
      {children.children}
    </BandContext.Provider>
  );
};

export default BandContext;
