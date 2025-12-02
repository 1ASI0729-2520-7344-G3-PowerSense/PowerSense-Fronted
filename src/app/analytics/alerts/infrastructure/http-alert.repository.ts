import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Alert, AlertId, CreateAlertDTO, DynamicAlert } from '../domain/model/alert.entity';
import { AlertQuery, AlertRepository } from '../domain/repositories/alert.repository';
import { API_BASE_URL } from '../../../shared/infrastructure/api.config';

@Injectable({ providedIn: 'root' })
export class HttpAlertRepository implements AlertRepository {
    private readonly baseUrl = `${API_BASE_URL}/analytics/alerts`;

    constructor(private readonly http: HttpClient) { }

    // Obtiene alertas configurables con filtros opcionales
    async list(query?: AlertQuery): Promise<Alert[]> {
        let url = this.baseUrl;
        const params: string[] = [];

        if (query) {
            if (query.type) params.push(`type=${query.type}`);
            if (query.severity) params.push(`severity=${query.severity}`);
            if (query.deviceId) params.push(`deviceId=${query.deviceId}`);
            if (query.acknowledged !== undefined) params.push(`acknowledged=${query.acknowledged}`);
        }

        if (params.length > 0) {
            url += '?' + params.join('&');
        }

        const data = await firstValueFrom(this.http.get<any[]>(url));
        return data.map(this.mapToAlert);
    }

    // Obtiene una alerta específica por ID
    async getById(id: AlertId): Promise<Alert | null> {
        try {
            const data = await firstValueFrom(this.http.get<any>(`${this.baseUrl}/${id}`));
            return this.mapToAlert(data);
        } catch {
            return null;
        }
    }

    // Crea una nueva alerta configurable
    async create(alert: CreateAlertDTO): Promise<Alert> {
        const payload = {
            type: alert.type,
            severity: alert.severity,
            deviceId: alert.deviceId,
            threshold: alert.threshold,
            message: alert.message
        };

        const data = await firstValueFrom(this.http.post<any>(this.baseUrl, payload));
        return this.mapToAlert(data);
    }

    // Marca una alerta como reconocida
    async acknowledge(id: AlertId): Promise<Alert> {
        const data = await firstValueFrom(
            this.http.patch<any>(`${this.baseUrl}/${id}/acknowledge`, {})
        );
        return this.mapToAlert(data);
    }

    // Obtiene alertas dinámicas recientes
    async getRecent(): Promise<DynamicAlert[]> {
        const data = await firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/recent`));
        return data.map(item => ({
            id: item.id,
            type: item.type,
            icon: item.icon,
            message: item.message,
            timestamp: new Date(item.timestamp)
        }));
    }

    // Convierte la respuesta del backend a la entidad del dominio
    private mapToAlert(data: any): Alert {
        return {
            id: data.id,
            type: data.type,
            severity: data.severity,
            deviceId: data.deviceId,
            threshold: data.threshold,
            message: data.message,
            acknowledged: data.acknowledged,
            acknowledgedAt: data.acknowledgedAt ? new Date(data.acknowledgedAt) : undefined,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt)
        };
    }
}


