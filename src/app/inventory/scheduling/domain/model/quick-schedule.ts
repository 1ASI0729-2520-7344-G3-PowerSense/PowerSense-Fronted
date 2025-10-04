// Presets de programación rápida para grupos de dispositivos

export type QuickScheduleId = string;

// Ámbito del preset (dónde se aplica)
export type QuickScheduleScope = 'all' | 'bedrooms' | 'common_areas' | 'custom';

// Configuración de programación rápida
export interface QuickSchedulePreset {
  id: QuickScheduleId;
  name: string;
  description: string;
  scope: QuickScheduleScope;
  icon: string;
  roomIds?: string[]; // Para scope 'custom'
  defaultSchedules: {
    action: 'on' | 'off';
    hour: number;
    minute: number;
    days: string[]; // ['monday', 'tuesday', ...]
  }[];
}

// Opciones populares para mostrar en UI
export const QUICK_SCHEDULE_PRESETS: QuickSchedulePreset[] = [
  {
    id: 'all_house',
    name: 'Toda la casa',
    description: 'Apagar todo por la noche, encender por la mañana',
    scope: 'all',
    icon: 'home',
    defaultSchedules: [
      { action: 'on', hour: 7, minute: 0, days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
      { action: 'off', hour: 23, minute: 0, days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }
    ]
  },
  {
    id: 'bedrooms_only',
    name: 'Solo dormitorios',
    description: 'Programa solo dispositivos de dormitorios',
    scope: 'bedrooms',
    icon: 'bed',
    defaultSchedules: [
      { action: 'off', hour: 23, minute: 30, days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }
    ]
  },
  {
    id: 'common_areas',
    name: 'Áreas comunes',
    description: 'Sala, cocina, baños',
    scope: 'common_areas',
    icon: 'living',
    defaultSchedules: [
      { action: 'on', hour: 18, minute: 0, days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
      { action: 'off', hour: 22, minute: 0, days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }
    ]
  }
];

