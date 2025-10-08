import { Schedule, ScheduleId, CreateScheduleDTO, UpdateScheduleDTO } from '../model/schedule.entity';
import { ScheduleRule, RuleId } from '../model/schedule-rule.entity';

// Filtros para búsqueda de programaciones
export interface ScheduleQuery {
  search?: string; // Buscar por nombre de dispositivo
  roomId?: string; // Filtrar por habitación
  enabled?: boolean; // Solo activas o inactivas
  deviceId?: string; // Programación de un dispositivo específico
}

// Estadísticas de programaciones
export interface ScheduleStats {
  totalScheduled: number; // Total de dispositivos programados
  activeHours: number; // Horas totales programadas (estimado)
  estimatedSavings: number; // Ahorro estimado en kWh o dinero
}

// Repositorio para gestionar programaciones
export interface ScheduleRepository {
  // Operaciones CRUD de programaciones
  list(query?: ScheduleQuery): Promise<Schedule[]>;
  getById(id: ScheduleId): Promise<Schedule | null>;
  getByDeviceId(deviceId: string): Promise<Schedule | null>;
  create(schedule: CreateScheduleDTO): Promise<Schedule>;
  update(id: ScheduleId, schedule: UpdateScheduleDTO): Promise<Schedule>;
  delete(id: ScheduleId): Promise<void>;
  
  // Operaciones específicas
  toggleEnabled(id: ScheduleId, enabled: boolean): Promise<Schedule>;
  
  // Estadísticas
  getStats(): Promise<ScheduleStats>;
  
  // Reglas inteligentes
  listRules(): Promise<ScheduleRule[]>;
  getRuleById(id: RuleId): Promise<ScheduleRule | null>;
  toggleRule(id: RuleId, enabled: boolean): Promise<ScheduleRule>;
  updateRule(id: RuleId, rule: Partial<ScheduleRule>): Promise<ScheduleRule>;
}

// NOTA:
// - Este repositorio maneja tanto programaciones como reglas inteligentes
// - Las estadísticas son calculadas en base a los horarios programados

