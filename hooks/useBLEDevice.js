// hooks/useBLEDevice.js
import { useState, useEffect, useCallback } from 'react';

export function useBLEDevice() {
  const [device, setDevice] = useState(null);
  const [measurements, setMeasurements] = useState({});
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleMeasurement = useCallback((event) => {
    const value = event.target.value;
    const data = {};
    
    // Parse the measurement based on characteristic
    if (value.byteLength === 4) { // pH measurement
      data.pH = value.getFloat32(0, true);
    } else if (value.byteLength === 2) { // Temperature measurement
      data.temperature = value.getUint16(0, true) / 100;
    } else if (value.byteLength === 1) { // Other single-byte measurements
      data.value = value.getUint8(0);
    }
    
    setMeasurements(prev => ({ ...prev, ...data }));
  }, []);

  const connectDevice = useCallback(async (deviceType) => {
    try {
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth API not supported in this browser');
      }

      setError(null);
      setIsScanning(true);
      
      // Request Bluetooth device
      const bluetoothDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: false,
        filters: [{ services: ['environmental_sensing'] }],
        optionalServices: ['battery_service', 'device_information']
      });

      // Add disconnect listener
      bluetoothDevice.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setDevice(null);
      });

      setDevice(bluetoothDevice);
      
      // Connect to GATT server
      const server = await bluetoothDevice.gatt.connect();
      setIsConnected(true);
      setIsScanning(false);
      
      // Get service and characteristic based on device type
      let service, characteristic;
      
      if (deviceType === 'pH') {
        service = await server.getPrimaryService('environmental_sensing');
        characteristic = await service.getCharacteristic('ph_measurement');
      } else if (deviceType === 'temperature') {
        service = await server.getPrimaryService('environmental_sensing');
        characteristic = await service.getCharacteristic('temperature_measurement');
      } else if (deviceType === 'conductivity') {
        service = await server.getPrimaryService('environmental_sensing');
        characteristic = await service.getCharacteristic('conductivity_measurement');
      }
      
      // Start notifications
      characteristic.addEventListener('characteristicvaluechanged', handleMeasurement);
      await characteristic.startNotifications();
      
      // Read battery level if available
      try {
        const batteryService = await server.getPrimaryService('battery_service');
        const batteryLevelCharacteristic = await batteryService.getCharacteristic('battery_level');
        const batteryLevel = await batteryLevelCharacteristic.readValue();
        setMeasurements(prev => ({ ...prev, battery: batteryLevel.getUint8(0) }));
      } catch (e) {
        console.log('Battery service not available');
      }
      
    } catch (err) {
      setError(`Failed to connect to device: ${err.message}`);
      setIsConnected(false);
      setIsScanning(false);
    }
  }, [handleMeasurement]);

  const disconnectDevice = useCallback(() => {
    if (device && device.gatt.connected) {
      device.gatt.disconnect();
    }
    setDevice(null);
    setIsConnected(false);
    setMeasurements({});
  }, [device]);

  useEffect(() => {
    return () => {
      if (device && device.gatt.connected) {
        disconnectDevice();
      }
    };
  }, [device, disconnectDevice]);

  return {
    device,
    measurements,
    error,
    isConnected,
    isScanning,
    connectDevice,
    disconnectDevice
  };
}