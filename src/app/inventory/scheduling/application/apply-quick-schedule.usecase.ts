import { Injectable, inject } from '@angular/core';
import { SCHEDULE_REPOSITORY } from '../domain/tokens';
import { DEVICE_REPOSITORY } from '../../devices/domain/tokens';
import { QuickSchedulePreset } from '../domain/model/quick-schedule.entity';
import { Schedule, ScheduleConfig } from '../domain/model/schedule.entity';

// Aplicar un preset de programación rápida a múltiples dispositivos
@Injectable({ providedIn: 'root' })
export class ApplyQuickScheduleUseCase {
  private scheduleRepo = inject(SCHEDULE_REPOSITORY);
  private deviceRepo = inject(DEVICE_REPOSITORY);

  async execute(preset: QuickSchedulePreset): Promise<Schedule[]> {
    // 1. Obtener dispositivos según el scope
    let devices = await this.deviceRepo.list();

    // Filtrar según el ámbito
    if (preset.scope === 'bedrooms') {
      devices = devices.filter(d => 
        d.location.roomName.toLowerCase().includes('dormitorio') ||
        d.location.roomName.toLowerCase().includes('habitación')
      );
    } else if (preset.scope === 'common_areas') {
      devices = devices.filter(d => 
        d.location.roomName.toLowerCase().includes('sala') ||
        d.location.roomName.toLowerCase().includes('cocina') ||
        d.location.roomName.toLowerCase().includes('baño')
      );
    } else if (preset.scope === 'custom' && preset.roomIds) {
      devices = devices.filter(d => 
        preset.roomIds!.includes(d.location.roomId)
      );
    }
    // Si es 'all', no filtramos

    // 2. Crear o actualizar programaciones para cada dispositivo
    const results: Schedule[] = [];

    for (const device of devices) {
      const existing = await this.scheduleRepo.getByDeviceId(device.id);

      const scheduleData = {
        deviceId: device.id,
        deviceName: device.name,
        roomName: device.location.roomName,
        enabled: true,
        schedules: preset.defaultSchedules.map((s): ScheduleConfig => ({
          action: s.action,
          time: { hour: s.hour, minute: s.minute },
          days: s.days as any
        }))
      };

      if (existing) {
        // Actualizar existente
        const updated = await this.scheduleRepo.update(existing.id, scheduleData);
        results.push(updated);
      } else {
        // Crear nuevo
        const created = await this.scheduleRepo.create(scheduleData);
        results.push(created);
      }
    }

    return results;
  }
}

