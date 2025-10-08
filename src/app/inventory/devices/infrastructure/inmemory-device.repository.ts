import { Device, DeviceId } from '../domain/model/device.entity';
import { DeviceQuery, DeviceRepository } from '../domain/repositories/device.repository';

function generateId(): DeviceId {
  return Math.random().toString(36).slice(2, 10);
}

export class InMemoryDeviceRepository implements DeviceRepository {
  // Este repositorio vive en memoria y es ideal para desarrollo/maquetas.
  // FUTURO: Sustituir por una implementación HTTP que consuma la API real.
  // Ver 'device.repository.ts' para la estructura a respetar.
  private devices: Device[] = [
    {
      id: 'dev-1',
      name: 'Lámpara de Sala',
      category: 'light',
      status: 'active',
      location: { roomId: 'room-living', roomName: 'Sala' },
      power: { watts: 12 }
    },
    {
      id: 'dev-2',
      name: 'Aire Acondicionado',
      category: 'ac',
      status: 'inactive',
      location: { roomId: 'room-bedroom', roomName: 'Dormitorio' },
      power: { watts: 900 }
    },
    {
      id: 'dev-3',
      name: 'Televisor 55"',
      category: 'tv',
      status: 'active',
      location: { roomId: 'room-living', roomName: 'Sala' },
      power: { watts: 120 }
    },
    {
      id: 'dev-4',
      name: 'Refrigerador',
      category: 'refrigerator',
      status: 'active',
      location: { roomId: 'room-kitchen', roomName: 'Cocina' },
      power: { watts: 150 }
    },
    {
      id: 'dev-5',
      name: 'Calefacción',
      category: 'heating',
      status: 'inactive',
      location: { roomId: 'room-bedroom', roomName: 'Dormitorio' },
      power: { watts: 800 }
    },
    {
      id: 'dev-6',
      name: 'Computadora',
      category: 'computer',
      status: 'active',
      location: { roomId: 'room-office', roomName: 'Oficina' },
      power: { watts: 65 }
    }
  ];

  async list(query?: DeviceQuery): Promise<Device[]> {
    let result = [...this.devices];
    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(q) || d.location.roomName.toLowerCase().includes(q));
    }
    if (query?.category) {
      result = result.filter(d => d.category === query.category);
    }
    if (query?.roomId) {
      result = result.filter(d => d.location.roomId === query.roomId);
    }
    if (query?.status) {
      result = result.filter(d => d.status === query.status);
    }
    return Promise.resolve(result);
  }

  async getById(id: DeviceId): Promise<Device | null> {
    return Promise.resolve(this.devices.find(d => d.id === id) ?? null);
  }

  async create(device: Omit<Device, 'id'>): Promise<Device> {
    const created: Device = { ...device, id: generateId() };
    this.devices.push(created);
    return Promise.resolve(created);
  }

  async update(id: DeviceId, device: Partial<Omit<Device, 'id'>>): Promise<Device> {
    const idx = this.devices.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Device not found');
    const updated: Device = { ...this.devices[idx], ...device } as Device;
    this.devices[idx] = updated;
    return Promise.resolve(updated);
  }

  async delete(id: DeviceId): Promise<void> {
    this.devices = this.devices.filter(d => d.id !== id);
    return Promise.resolve();
  }

  async setStatus(id: DeviceId, status: 'active' | 'inactive'): Promise<Device> {
    return this.update(id, { status });
  }
}


