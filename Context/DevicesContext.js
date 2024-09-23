import React, { useState, createContext, useCallback } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showError, showSuccess } from '../Component/helperFunctions';
import dataFile from '../data.json'; // JSON dosyası
import fs from 'react-native-fs'; // Dosya sistemi erişimi

export const DeviceContext = createContext();
let bleManager = new BleManager();
const uniqueNumbers = new Set();

export const DeviceProvider = ({ children }) => {
  const [myId, setMyId] = useState("12:6C:14:38:54:50");
  const [kurulumState, setKurulumState] = useState(true);
  const [kartNo, setKartNo] = useState('');
  const [userToken, setUserToken] = useState(false);
  const [userİnfo, setUserİnfo] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [disconnectMessage, setDisconnectMessage] = useState('');
  const [disconnectButtonVisible, setDisconnectButtonVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const resetBleManager = () => {
    bleManager.destroy();
    setTimeout(() => {
      bleManager = new BleManager();
      console.log('BleManager reset');
    }, 1000);
  };

  const handleDoorOpen = useCallback(async cardNum => {
    setIsButtonDisabled(true);
    try {
      const device = await bleManager.connectToDevice(myId);
      await device.discoverAllServicesAndCharacteristics();
      console.log('Device connected:', device);
      setConnectedDevice(device);
      setDisconnectMessage('');
      setDisconnectButtonVisible(true);

      await sendDataToDevice(device, serviceUUID, characteristicUUID, `<1:4:3>`);
      console.log('Door open command sent');

      showSuccess('Kapı açma başarılı');
      
      const disconnectDevice = async () => {
        if (device) {
          try {
            await bleManager.cancelDeviceConnection(myId);
            console.log('Disconnected from device');
            setConnectedDevice(null);
          } catch (count) {
            console.log('Bağlantı koptu', count);
          }
        }
      };

      const autoDisconnectTimeout = setTimeout(disconnectDevice, 5000);
      device.autoDisconnectTimeout = autoDisconnectTimeout;
    } catch (error) {
      console.error('Failed to open door:', error);
      resetBleManagerIfNeeded(error);
    }
    setTimeout(() => setIsButtonDisabled(false), 2500);
  }, [myId]);

  const sendDataToDevice = async (device, serviceUUID, characteristicUUID, data) => {
    try {
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(data).toString('base64'),
      );

      device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (error, characteristic) => {
        if (error) {
          console.error('Error:', error.message);
          return;
        }

        const response = Buffer.from(characteristic.value, 'base64').toString('utf-8');
        console.log('Response:', response);
        // Gelen yanıt işleme
      });
    } catch (error) {
      console.error('Failed to send data:', error);
    }
  };

  const veriYazdır = async () => {
    console.log('Veri yazdırma işlemi başladı');
    console.log('Benzersiz sayılar kümesi:', uniqueNumbers);

    // JSON dosyasını güncelleme
    const existingCards = dataFile.cards || [];
    for (const cardNumber of uniqueNumbers) {
      const existingCard = existingCards.find(card => card['Kart No'] === cardNumber);
      if (!existingCard) {
        existingCards.push({
          'Kart No': cardNumber,
          Pay: true,
          Onay: true,
          Yetki: false,
          'Daire Numarası': '',
        });
        console.log(`Yeni kart kaydedildi: ${cardNumber}`);
      } else {
        console.log(`Kart zaten mevcut: ${cardNumber}`);
      }
    }

    // JSON dosyasını yazma
    await fs.writeFile(`${fs.DocumentDirectoryPath}/data.json`, JSON.stringify({ cards: existingCards }), 'utf8');
    showSuccess('Kartlar veritabanına başarıyla kaydedildi.');
  };

  const resetBleManagerIfNeeded = (error) => {
    if (error.message.includes('BleManager was destroyed')) {
      console.log('BLE Manager destroyed, resetting...');
      resetBleManager();
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        veriYazdır,
        sendDataToDevice,
        myId,
        setMyId,
        kurulumState,
        setKurulumState,
        kartNo,
        setKartNo,
        userİnfo,
        setUserİnfo,
        userToken,
        setUserToken,
        connectedDevice,
        setConnectedDevice,
        handleDoorOpen,
        disconnectMessage,
        disconnectButtonVisible,
        setDisconnectButtonVisible,
        setDisconnectMessage,
        isButtonDisabled,
        setIsButtonDisabled,
      }}>
      {children}
    </DeviceContext.Provider>
  );
};
