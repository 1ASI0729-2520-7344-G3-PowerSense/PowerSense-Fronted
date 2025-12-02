import { Injectable } from '@angular/core';
import {
  Schedule,
  ScheduleId,
  CreateScheduleDTO,
  UpdateScheduleDTO
} from '../domain/model/schedule.entity';
import { ScheduleRule, RuleId } from '../domain/model/schedule-rule.entity';
import {
  ScheduleRepository,
  ScheduleQuery,
  ScheduleStats
} from '../domain/repositories/schedule.repository';

// Repositorio en memoria para desarrollo y pruebas
@Injectable()
export class InMemoryScheduleRepository implements ScheduleRepository {
  private schedules: Schedule[] = [];
  private rules: ScheduleRule[] = [
    {
      id: 'rule-1',
      type: 'night_mode',
      name: 'Modo Nocturno',
      description: 'Apaga luces innecesarias automáticamente por la noche',
      enabled: true,
      priority: 1,
      conditions: [{ type: 'time_range', value: { start: '22:00', end: '06:00' } }],
      actions: [{ type: 'turn_off', deviceIds: [], roomIds: [] }]
    },
    {
      id: 'rule-2',
      type: 'energy_saving',
      name: 'Ahorro de Energía',
      description: 'Ajusta el consumo según patrones de uso',
      enabled: false,
      priority: 2,
      conditions: [{ type: 'energy_threshold', value: 1500 }],
      actions: [{ type: 'dim', value: 70 }]
    },
    {
      id: 'rule-3',
      type: 'away_mode',
      name: 'Modo Ausente',
      description: 'Apaga todos los dispositivos cuando no hay nadie en casa',
      enabled: false,
      priority: 3,
      conditions: [{ type: 'no_motion', value: 30 }],
      actions: [{ type: 'turn_off' }]
    }
  ];
  private nextId = 1;

  constructor() {
    // Datos de ejemplo para desarrollo
    this.schedules = [
      {
        id: 'sch-1',
        deviceId: 'dev-1',
        deviceName: 'Lámpara Sala Principal',
        roomName: 'Sala',
        enabled: true,
        schedules: [
          {
            action: 'on',
            time: { hour: 18, minute: 0 },
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
          },
          {
            action: 'off',
            time: { hour: 23, minute: 0 },
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
          }
        ],
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-01-15')
      },
      {
        id: 'sch-2',
        deviceId: 'dev-2',
        deviceName: 'Aire Acondicionado',
        roomName: 'Dormitorio Principal',
        enabled: true,
        schedules: [
          {
            action: 'on',
            time: { hour: 22, minute: 30 },
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
          },
          {
            action: 'off',
            time: { hour: 7, minute: 0 },
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
          }
        ],
        createdAt: new Date('2025-01-20'),
        updatedAt: new Date('2025-01-20')
      },
      {
        id: 'sch-3',
        deviceId: 'dev-3',
        deviceName: 'Smart TV',
        roomName: 'Sala',
        enabled: false,
        schedules: [
          {
            action: 'off',
            time: { hour: 0, minute: 0 },
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
          }
        ],
        createdAt: new Date('2025-02-01'),
        updatedAt: new Date('2025-02-01')
      },
      {
        id: 'sch-4',
        deviceId: 'dev-4',
        deviceName: 'Calefactor Dormitorio',
        roomName: 'Dormitorio 2',
        enabled: true,
        schedules: [
          {
            action: 'on',
            time: { hour: 21, minute: 0 },
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
          },
          {
            action: 'off',
            time: { hour: 6, minute: 30 },
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
          }
        ],
        createdAt: new Date('2025-02-05'),
        updatedAt: new Date('2025-02-05')
      }
    ];
  }

  async list(query?: ScheduleQuery): Promise<Schedule[]> {
    let result = [...this.schedules];

    if (query?.search) {
      const search = query.search.toLowerCase();
      result = result.filter(s =>
        s.deviceName.toLowerCase().includes(search) ||
        s.roomName.toLowerCase().includes(search)
      );
    }

    if (query?.roomId) {
      result = result.filter(s => s.roomName === query.roomId);
    }

    if (query?.enabled !== undefined) {
      result = result.filter(s => s.enabled === query.enabled);
    }

    if (query?.deviceId) {
      result = result.filter(s => s.deviceId === query.deviceId);
    }

    return result;
  }

  async getById(id: ScheduleId): Promise<Schedule | null> {
    return this.schedules.find(s => s.id === id) || null;
  }

  async getByDeviceId(deviceId: string): Promise<Schedule | null> {
    return this.schedules.find(s => s.deviceId === deviceId) || null;
  }

  async create(schedule: CreateScheduleDTO): Promise<Schedule> {
    const now = new Date();
    const newSchedule: Schedule = {
      ...schedule,
      id: `sch-${this.nextId++}`,
      createdAt: now,
      updatedAt: now
    };
    this.schedules.push(newSchedule);
    return newSchedule;
  }

  async update(id: ScheduleId, schedule: UpdateScheduleDTO): Promise<Schedule> {
    const index = this.schedules.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Schedule not found');

    this.schedules[index] = {
      ...this.schedules[index],
      ...schedule,
      updatedAt: new Date()
    };
    return this.schedules[index];
  }

  async delete(id: ScheduleId): Promise<void> {
    const index = this.schedules.findIndex(s => s.id === id);
    if (index !== -1) {
      this.schedules.splice(index, 1);
    }
  }

  async toggleEnabled(id: ScheduleId, enabled: boolean): Promise<Schedule> {
    return this.update(id, { enabled });
  }

  async getStats(): Promise<ScheduleStats> {
    const activeSchedules = this.schedules.filter(s => s.enabled);

    // Calcular horas activas (promedio simple)
    const totalHours = activeSchedules.reduce((sum, schedule) => {
      const dailyHours = schedule.schedules.reduce((hours, config) => {
        if (config.action === 'on') {
          // Buscar el siguiente "off" para calcular duración
          const offConfig = schedule.schedules.find(c => c.action === 'off');
          if (offConfig) {
            const onTime = config.time.hour + config.time.minute / 60;
            const offTime = offConfig.time.hour + offConfig.time.minute / 60;
            return hours + (offTime > onTime ? offTime - onTime : 24 - onTime + offTime);
          }
        }
        return hours;
      }, 0);
      return sum + dailyHours * 7; // Multiplicar por días de la semana
    }, 0);

    // Ahorro estimado (ejemplo: 20% de reducción en consumo)
    const estimatedSavings = activeSchedules.length * 15.5; // kWh por mes

    return {
      totalScheduled: activeSchedules.length,
      activeHours: Math.round(totalHours),
      estimatedSavings: Math.round(estimatedSavings * 10) / 10
    };
  }

  async listRules(): Promise<ScheduleRule[]> {
    return [...this.rules];
  }

  async getRuleById(id: RuleId): Promise<ScheduleRule | null> {
    return this.rules.find(r => r.id === id) || null;
  }

  async toggleRule(id: RuleId, enabled: boolean): Promise<ScheduleRule> {
    const rule = this.rules.find(r => r.id === id);
    if (!rule) throw new Error('Rule not found');
    rule.enabled = enabled;
    return rule;
  }

  async updateRule(id: RuleId, update: Partial<ScheduleRule>): Promise<ScheduleRule> {
    const index = this.rules.findIndex(r => r.id === id);

    if (index === -1) {
      // Si no existe, crear nueva regla
      const newRule: ScheduleRule = {
        id,
        type: update.type!,
        name: update.name!,
        description: update.description!,
        enabled: update.enabled ?? false,
        conditions: update.conditions ?? [],
        actions: update.actions ?? [],
        priority: update.priority ?? 1
      };
      this.rules.push(newRule);
      return newRule;
    }

    // Si existe, actualizar
    Object.assign(this.rules[index], update);
    return this.rules[index];
  }
}

