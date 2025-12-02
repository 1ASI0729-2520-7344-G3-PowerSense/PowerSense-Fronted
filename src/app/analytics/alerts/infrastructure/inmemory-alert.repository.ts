import { Injectable } from '@angular/core';
import { Alert, AlertId, CreateAlertDTO, DynamicAlert, AlertType, AlertSeverity } from '../domain/model/alert.entity';
import { AlertQuery, AlertRepository } from '../domain/repositories/alert.repository';

@Injectable({ providedIn: 'root' })
export class InMemoryAlertRepository implements AlertRepository {
    private alerts: Alert[] = [
        {
            id: 'alert-001',
            type: 'HIGH_CONSUMPTION',
            severity: 'WARNING',
            deviceId: 'device-001',
            threshold: 1000,
            message: 'Consumo excesivo detectado en Aire Acondicionado',
            acknowledged: false,
            acknowledgedAt: undefined,
            createdAt: new Date('2025-11-25T10:00:00Z'),
            updatedAt: new Date('2025-11-25T10:00:00Z')
        },
        {
            id: 'alert-002',
            type: 'DEVICE_OFFLINE',
            severity: 'ERROR',
            deviceId: 'device-002',
            threshold: undefined,
            message: 'Dispositivo desconectado: Lámpara Sala',
            acknowledged: true,
            acknowledgedAt: new Date('2025-11-25T11:30:00Z'),
            createdAt: new Date('2025-11-25T09:00:00Z'),
            updatedAt: new Date('2025-11-25T11:30:00Z')
        },
        {
            id: 'alert-003',
            type: 'SCHEDULE_CONFLICT',
            severity: 'INFO',
            deviceId: 'device-003',
            threshold: undefined,
            message: 'Conflicto detectado en programación de TV Sala',
            acknowledged: false,
            acknowledgedAt: undefined,
            createdAt: new Date('2025-11-25T08:00:00Z'),
            updatedAt: new Date('2025-11-25T08:00:00Z')
        },
        {
            id: 'alert-004',
            type: 'LOW_EFFICIENCY',
            severity: 'WARNING',
            deviceId: 'device-004',
            threshold: 75,
            message: 'Baja eficiencia energética en Refrigerador',
            acknowledged: false,
            acknowledgedAt: undefined,
            createdAt: new Date('2025-11-25T07:00:00Z'),
            updatedAt: new Date('2025-11-25T07:00:00Z')
        },
        {
            id: 'alert-005',
            type: 'THRESHOLD_EXCEEDED',
            severity: 'CRITICAL',
            deviceId: 'device-005',
            threshold: 2000,
            message: 'Umbral crítico excedido en sistema HVAC',
            acknowledged: false,
            acknowledgedAt: undefined,
            createdAt: new Date('2025-11-25T12:00:00Z'),
            updatedAt: new Date('2025-11-25T12:00:00Z')
        }
    ];

    private dynamicAlerts: DynamicAlert[] = [
        {
            id: 'dynamic-001',
            type: 'warning',
            icon: '⚠️',
            message: 'Alto consumo detectado en Sala Principal',
            timestamp: new Date('2025-11-24T20:30:00Z')
        },
        {
            id: 'dynamic-002',
            type: 'info',
            icon: 'ℹ️',
            message: '3 dispositivos inactivos desde hace 24 horas',
            timestamp: new Date('2025-11-24T19:15:00Z')
        },
        {
            id: 'dynamic-003',
            type: 'error',
            icon: '❌',
            message: 'Error de conexión con sensor de temperatura',
            timestamp: new Date('2025-11-24T18:00:00Z')
        }
    ];

    private nextId = 6;

    async list(query?: AlertQuery): Promise<Alert[]> {
        let result = [...this.alerts];

        if (query) {
            if (query.type) {
                result = result.filter(a => a.type === query.type);
            }
            if (query.severity) {
                result = result.filter(a => a.severity === query.severity);
            }
            if (query.deviceId) {
                result = result.filter(a => a.deviceId === query.deviceId);
            }
            if (query.acknowledged !== undefined) {
                result = result.filter(a => a.acknowledged === query.acknowledged);
            }
        }

        // Ordenar por fecha de creación (más recientes primero)
        return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async getById(id: AlertId): Promise<Alert | null> {
        return this.alerts.find(a => a.id === id) || null;
    }

    async create(alert: CreateAlertDTO): Promise<Alert> {
        const newAlert: Alert = {
            id: `alert-${String(this.nextId++).padStart(3, '0')}`,
            type: alert.type,
            severity: alert.severity,
            deviceId: alert.deviceId,
            threshold: alert.threshold,
            message: alert.message,
            acknowledged: false,
            acknowledgedAt: undefined,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.alerts.push(newAlert);
        return newAlert;
    }

    async acknowledge(id: AlertId): Promise<Alert> {
        const alert = this.alerts.find(a => a.id === id);
        if (!alert) {
            throw new Error('Alert not found');
        }

        alert.acknowledged = true;
        alert.acknowledgedAt = new Date();
        alert.updatedAt = new Date();

        return alert;
    }

    async getRecent(): Promise<DynamicAlert[]> {
        return [...this.dynamicAlerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
}


