import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ListDevicesUseCase } from '../../../application/list-devices.usecase';
import { SetDeviceStatusUseCase } from '../../../application/set-device-status.usecase';
import { SetRoomDevicesStatusUseCase } from '../../../application/set-room-devices-status.usecase';
import { ExportDevicesUseCase } from '../../../application/export-devices.usecase';
import { ImportDevicesUseCase } from '../../../application/import-devices.usecase';
import { SetAllDevicesStatusUseCase } from '../../../application/set-all-devices-status.usecase';
import { DeviceCardComponent } from '../cards/device/device';
import { DevicesToolbarComponent } from '../cards/toolbar/toolbar';
import { RoomsCardComponent } from '../cards/rooms/rooms';
import { Device } from '../../../domain/model/device';

@Component({
  selector: 'app-devices-page',
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, FormsModule, DeviceCardComponent, DevicesToolbarComponent, RoomsCardComponent],
  templateUrl: './devices-page.html',
  styleUrl: './devices-page.css'
})
export class DevicesPage {
  // Estado mostrado en la pantalla
  readonly devices = signal<Device[]>([]);
  readonly loading = signal<boolean>(false);
  readonly pageSize = 6;
  readonly visibleCount = signal<number>(6);
  search = '';
  selectedCategory: '' | Device['category'] = '';
  selectedStatus: '' | 'active' | 'inactive' = '';
  sortBy: 'name' | 'watts' | 'status' = 'name';
  sortDir: 'asc' | 'desc' = 'asc';

  private get scrollContainer(): HTMLElement | null {
    return document.querySelector('.layout-router-content');
  }

  private sortDevices(list: Device[]): Device[] {
    const dir = this.sortDir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name) * dir;
        case 'status':
          return a.status.localeCompare(b.status) * dir;
        case 'watts':
          return ((a.power.watts || 0) - (b.power.watts || 0)) * dir;
        default:
          return 0;
      }
    });
  }

  // Opciones de filtros visibles en la barra
  readonly categories: { value: '' | Device['category']; label: string }[] = [
    { value: '', label: 'Todas las categorías' },
    { value: 'light', label: 'Luz' },
    { value: 'ac', label: 'Aire acondicionado' },
    { value: 'tv', label: 'Televisor' },
    { value: 'refrigerator', label: 'Refrigerador' },
    { value: 'heating', label: 'Calefacción' },
    { value: 'computer', label: 'Computadora' },
    { value: 'genericPower', label: 'Otro' }
  ];

  readonly statuses: { value: '' | 'active' | 'inactive'; label: string }[] = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' }
  ];

  readonly sortFields: { value: 'name' | 'watts' | 'status'; label: string }[] = [
    { value: 'name', label: 'Nombre' },
    { value: 'watts', label: 'Consumo (W)' },
    { value: 'status', label: 'Estado' }
  ];

  constructor(
    private readonly listDevices: ListDevicesUseCase,
    private readonly setStatus: SetDeviceStatusUseCase,
    private readonly setRoomStatus: SetRoomDevicesStatusUseCase,
    private readonly exportDevices: ExportDevicesUseCase,
    private readonly importDevices: ImportDevicesUseCase,
    private readonly setAllStatus: SetAllDevicesStatusUseCase
  ) {
    this.refresh(true);
  }

  // Carga y ordena dispositivos. Si cambian filtros, reinicia cantidad visible
  async refresh(resetVisible: boolean = false): Promise<void> {
    this.loading.set(true);
    try {
      const query: any = {};
      if (this.search) query.search = this.search;
      if (this.selectedCategory) query.category = this.selectedCategory;
      if (this.selectedStatus) query.status = this.selectedStatus;
      const data = await this.listDevices.execute(Object.keys(query).length ? query : undefined);
      const sorted = this.sortDevices(data);
      this.devices.set(sorted);
      if (resetVisible) {
        this.visibleCount.set(this.pageSize);
      } else {
        const current = this.visibleCount();
        const clamped = Math.min(Math.max(this.pageSize, current), sorted.length);
        this.visibleCount.set(clamped);
      }
    } finally {
      this.loading.set(false);
    }
  }

  get metrics() {
    // Números rápidos para las tarjetas de resumen
    const items = this.devices();
    const total = items.length;
    const active = items.filter(d => d.status === 'active').length;
    const totalWatts = items.reduce((sum, d) => sum + (d.power.watts || 0), 0);
    return { total, active, inactive: total - active, totalWatts };
  }

  get rooms() {
    // Agrupa dispositivos por habitación para la sección inferior
    const map = new Map<string, { roomId: string; roomName: string; devices: Device[]; totalWatts: number; active: number }>();
    for (const d of this.devices()) {
      const key = d.location.roomId;
      if (!map.has(key)) {
        map.set(key, { roomId: d.location.roomId, roomName: d.location.roomName, devices: [], totalWatts: 0, active: 0 });
      }
      const group = map.get(key)!;
      group.devices.push(d);
      group.totalWatts += d.power.watts || 0;
      if (d.status === 'active') group.active += 1;
    }
    return Array.from(map.values());
  }

  async setRoom(roomId: string, status: 'active' | 'inactive'): Promise<void> {
    const container = this.scrollContainer;
    const y = container ? container.scrollTop : window.scrollY;
    await this.setRoomStatus.execute(roomId, status);
    await this.refresh();
    if (container) {
      container.scrollTo({ top: y });
    } else {
      window.scrollTo({ top: y });
    }
  }

  deviceCategoryIcon(category: Device['category']): string {
    switch (category) {
      case 'light': return 'lightbulb';
      case 'ac': return 'ac_unit';
      case 'tv': return 'tv';
      case 'refrigerator': return 'kitchen';
      case 'heating': return 'heat_pump';
      case 'computer': return 'computer';
      default: return 'power';
    }
  }

  deviceCategoryColor(category: Device['category']): string {
    switch (category) {
      case 'light': return '#FFC107';
      case 'ac': return '#56CCF2';
      case 'tv': return '#BB6BD9';
      case 'refrigerator': return '#27AE60';
      case 'heating': return '#F2994A';
      case 'computer': return '#2F80ED';
      default: return '#EB5757';
    }
  }

  onFiltersChange(): void {
    this.visibleCount.set(this.pageSize);
    this.refresh(true);
  }

  percentWidth(watts: number): string {
    const clamped = Math.max(0, Math.min(100, watts));
    return clamped + '%';
  }

  // Enciende/apaga un dispositivo sin recargar la lista completa
  async toggleDevice(device: Device): Promise<void> {
    const next = device.status === 'active' ? 'inactive' : 'active';
    // Optimistic update to avoid scroll jumps
    const prev = this.devices();
    const optimistic = prev.map(d => (d.id === device.id ? { ...d, status: next as 'active' | 'inactive' } : d));
    const sorted = this.sortDevices(optimistic);
    this.devices.set(sorted);
    try {
      await this.setStatus.execute(device.id, next);
    } catch {
      // Revert on error
      this.devices.set(prev);
    }
  }

  async onExport(): Promise<void> {
    const data = await this.exportDevices.execute();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devices.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  onImportFileChanged(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text);
        const toCreate = Array.isArray(parsed) ? parsed : parsed?.devices;
        if (!Array.isArray(toCreate)) return;
        await this.importDevices.execute(
          toCreate.map((d: any) => ({
            name: d.name,
            category: d.category,
            status: d.status ?? 'inactive',
            location: d.location,
            power: d.power ?? { watts: 0 }
          }))
        );
        await this.refresh(false);
      } catch {
        // ignore invalid file
      } finally {
        input.value = '';
      }
    };
    reader.readAsText(file);
  }

  // Enciende/apaga todos los dispositivos mostrados
  async setAll(status: 'active' | 'inactive'): Promise<void> {
    const prev = this.devices();
    const optimistic = prev.map(d => ({ ...d, status: status as 'active' | 'inactive' }));
    this.devices.set(this.sortDevices(optimistic));
    try {
      await this.setAllStatus.execute(status);
    } catch {
      this.devices.set(prev);
    }
  }

  showMore(): void {
    // Muestra 6 más cada vez hasta completar la lista
    const next = Math.min(this.visibleCount() + this.pageSize, this.devices().length);
    this.visibleCount.set(next);
  }
}


