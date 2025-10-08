// Reglas inteligentes para automatizaciones avanzadas

export type RuleId = string;

// Tipos de reglas disponibles
export type RuleType = 
  | 'night_mode'          // Modo nocturno
  | 'energy_saving'       // Ahorro de energía
  | 'away_mode'           // Modo ausente
  | 'eco_mode'            // Modo eco
  | 'comfort_mode';       // Modo confort

// Condiciones para activar la regla
export interface RuleCondition {
  type: 'time_range' | 'no_motion' | 'energy_threshold' | 'temperature';
  value: any; // Depende del tipo
}

// Acción que ejecuta la regla
export interface RuleAction {
  type: 'turn_off' | 'turn_on' | 'dim' | 'adjust_temperature';
  deviceIds?: string[]; // Dispositivos afectados (vacío = todos)
  roomIds?: string[]; // Habitaciones afectadas
  value?: any; // Valor específico (ej. temperatura, intensidad)
}

// Regla inteligente completa
export interface ScheduleRule {
  id: RuleId;
  type: RuleType;
  name: string;
  description: string;
  enabled: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number; // Para resolver conflictos entre reglas
}

// Preset de reglas populares para mostrar en UI
export interface RulePreset {
  type: RuleType;
  name: string;
  description: string;
  icon: string;
  defaultEnabled: boolean;
}


