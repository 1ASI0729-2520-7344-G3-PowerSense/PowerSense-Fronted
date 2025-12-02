import { Alert, AlertId, AlertType, AlertSeverity, CreateAlertDTO, DynamicAlert } from '../model/alert.entity';

// Filtros para buscar alertas
export interface AlertQuery {
    type?: AlertType;
    severity?: AlertSeverity;
    deviceId?: string;
    acknowledged?: boolean;
}

// Operaciones que debe soportar cualquier fuente de datos de alertas
export interface AlertRepository {
    list(query?: AlertQuery): Promise<Alert[]>;
    getById(id: AlertId): Promise<Alert | null>;
    create(alert: CreateAlertDTO): Promise<Alert>;
    acknowledge(id: AlertId): Promise<Alert>;
    getRecent(): Promise<DynamicAlert[]>;
}


