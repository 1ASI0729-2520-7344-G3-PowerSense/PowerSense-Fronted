// Modelo base de un dispositivo dentro del sistema.
// Mantiene datos para usar en toda la app.
export type DeviceId = string;

export type DeviceCategory =
  | 'light'
  | 'ac'
  | 'tv'
  | 'refrigerator'
  | 'heating'
  | 'computer'
  | 'genericPower';

// Dónde está el dispositivo (sirve para agrupar por habitación)
export interface DeviceLocation {
  roomId: string;
  roomName: string;
}

// Medidas de consumo del dispositivo
export interface DevicePower {
  watts: number; // consumo actual
  voltage?: number;
  amperage?: number;
}

export type DeviceStatus = 'active' | 'inactive';

// Dispositivo completo tal como lo muestra la interfaz
export interface Device {
  id: DeviceId;
  name: string;
  category: DeviceCategory;
  status: DeviceStatus;
  location: DeviceLocation;
  power: DevicePower;
}


