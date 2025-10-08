// Modelos para gestión de horarios de dispositivos
import { DeviceId } from '../../../devices/domain/model/device.entity';

export type ScheduleId = string;

// Días de la semana en los que se aplica la programación
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Estado del dispositivo que se aplicará
export type ScheduleAction = 'on' | 'off';

// Horario específico (hora y minuto)
export interface TimeSlot {
  hour: number; // 0-23
  minute: number; // 0-59
}

// Configuración de un horario programado
export interface ScheduleConfig {
  action: ScheduleAction; // Encender o apagar
  time: TimeSlot; // Hora del día
  days: DayOfWeek[]; // Días en los que se aplica
}

// Horario completo de un dispositivo
export interface Schedule {
  id: ScheduleId;
  deviceId: DeviceId;
  deviceName: string; // Para mostrar en la UI sin hacer join
  roomName: string; // Para filtrar por habitación
  enabled: boolean; // Si la programación está activa
  schedules: ScheduleConfig[]; // Lista de horarios (on/off)
  createdAt: Date;
  updatedAt: Date;
}

// Datos para crear un nuevo horario
export type CreateScheduleDTO = Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>;

// Datos para actualizar un horario existente
export type UpdateScheduleDTO = Partial<Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>>;


