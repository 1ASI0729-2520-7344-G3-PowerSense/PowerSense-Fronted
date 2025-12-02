// Modelos para el sistema de alertas de PowerSense

export type AlertId = string;

// Tipos de alertas soportados por el sistema
export type AlertType =
    | 'HIGH_CONSUMPTION'
    | 'LOW_EFFICIENCY'
    | 'DEVICE_OFFLINE'
    | 'SCHEDULE_CONFLICT'
    | 'THRESHOLD_EXCEEDED'
    | 'CUSTOM';

// Niveles de severidad de las alertas
export type AlertSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

// Alerta configurable (persistente, creada por el usuario)
export interface Alert {
    id: AlertId;
    type: AlertType;
    severity: AlertSeverity;
    deviceId?: string;
    threshold?: number;
    message: string;
    acknowledged: boolean;
    acknowledgedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Alerta dinámica (temporal, generada automáticamente por el sistema)
export interface DynamicAlert {
    id: string;
    type: 'warning' | 'info' | 'error';
    icon: string;
    message: string;
    timestamp: Date;
}

// DTO para crear una nueva alerta
export type CreateAlertDTO = Omit<Alert, 'id' | 'acknowledged' | 'acknowledgedAt' | 'createdAt' | 'updatedAt'>;


