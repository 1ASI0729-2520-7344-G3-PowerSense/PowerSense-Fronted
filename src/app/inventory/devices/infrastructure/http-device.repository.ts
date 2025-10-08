import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Device, DeviceId } from '../domain/model/device.entity';
import { DeviceQuery, DeviceRepository } from '../domain/repositories/device.repository';
import { API_BASE_URL } from '../../../shared/infrastructure/api.config';

@Injectable({ providedIn: 'root' })
export class HttpDeviceRepository implements DeviceRepository {
  private readonly baseUrl = `${API_BASE_URL}/devices`;

  constructor(private readonly http: HttpClient) {}

  // Trae los dispositivos desde la API y aplica filtros desde la app
  async list(query?: DeviceQuery): Promise<Device[]> {
    const data = await firstValueFrom(this.http.get<Device[]>(this.baseUrl));
    if (!query) return data;
    return data.filter(d => {
      if (query.search) {
        const q = query.search.toLowerCase();
        const matches = d.name.toLowerCase().includes(q) || d.location.roomName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (query.category && d.category !== query.category) return false;
      if (query.roomId && d.location.roomId !== query.roomId) return false;
      if (query.status && d.status !== query.status) return false;
      return true;
    });
  }

  // Busca un dispositivo por su id
  async getById(id: DeviceId): Promise<Device | null> {
    try {
      return await firstValueFrom(this.http.get<Device>(`${this.baseUrl}/${id}`));
    } catch {
      return null;
    }
  }

  // Agrega un nuevo dispositivo
  async create(device: Omit<Device, 'id'>): Promise<Device> {
    const created = await firstValueFrom(this.http.post<Device>(this.baseUrl, device as any));
    return { ...created, id: String((created as any).id) } as Device;
  }

  // Actualiza datos del dispositivo
  async update(id: DeviceId, device: Partial<Omit<Device, 'id'>>): Promise<Device> {
    const updated = await firstValueFrom(this.http.patch<Device>(`${this.baseUrl}/${id}`, device as any));
    return { ...updated, id: String((updated as any).id) } as Device;
  }

  // Elimina un dispositivo
  async delete(id: DeviceId): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
  }

  // Enciende o apaga un dispositivo
  async setStatus(id: DeviceId, status: 'active' | 'inactive'): Promise<Device> {
    return this.update(id, { status });
  }
}


