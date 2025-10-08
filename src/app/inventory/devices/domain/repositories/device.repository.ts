import { Device, DeviceId } from '../model/device.entity';

// Filtros básicos para buscar dispositivos
export interface DeviceQuery {
  search?: string;
  category?: string;
  roomId?: string;
  status?: 'active' | 'inactive';
}

// Lo que debe poder hacer cualquier fuente de datos de dispositivos
export interface DeviceRepository {
  list(query?: DeviceQuery): Promise<Device[]>;
  getById(id: DeviceId): Promise<Device | null>;
  create(device: Omit<Device, 'id'>): Promise<Device>;
  update(id: DeviceId, device: Partial<Omit<Device, 'id'>>): Promise<Device>;
  delete(id: DeviceId): Promise<void>;
  setStatus(id: DeviceId, status: 'active' | 'inactive'): Promise<Device>;
}

// NOTA:
// - Esta lista marca lo mínimo que necesitamos para que la pantalla funcione.
// - Si más adelante se agregan más datos (por ejemplo, historial), crear métodos
//   nuevos aquí y en las implementaciones.


