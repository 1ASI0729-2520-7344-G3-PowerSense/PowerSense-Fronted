import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Alert, DynamicAlert, AlertType, AlertSeverity } from '../../../../domain/model/alert.entity';

@Component({
    selector: 'app-alert-card',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, MatChipsModule],
    templateUrl: './alert-card.html',
    styleUrl: './alert-card.css'
})
export class AlertCardComponent {
    @Input() alert!: Alert | DynamicAlert;
    @Input() isDynamic: boolean = false;
    @Output() acknowledge = new EventEmitter<Alert>();

    get configurableAlert(): Alert | null {
        return !this.isDynamic ? (this.alert as Alert) : null;
    }

    get dynamicAlert(): DynamicAlert | null {
        return this.isDynamic ? (this.alert as DynamicAlert) : null;
    }

    onAcknowledge(): void {
        if (this.configurableAlert && !this.configurableAlert.acknowledged) {
            this.acknowledge.emit(this.configurableAlert);
        }
    }

    getIcon(): string {
        if (this.isDynamic) {
            return this.dynamicAlert?.icon || 'ℹ️';
        }

        const type = this.configurableAlert?.type;
        switch (type) {
            case 'HIGH_CONSUMPTION': return 'trending_up';
            case 'LOW_EFFICIENCY': return 'battery_alert';
            case 'DEVICE_OFFLINE': return 'power_off';
            case 'SCHEDULE_CONFLICT': return 'event_busy';
            case 'THRESHOLD_EXCEEDED': return 'warning';
            case 'CUSTOM': return 'notifications';
            default: return 'info';
        }
    }

    getColor(): string {
        if (this.isDynamic) {
            const type = this.dynamicAlert?.type;
            switch (type) {
                case 'warning': return '#FF9800';
                case 'error': return '#F44336';
                case 'info': return '#2196F3';
                default: return '#757575';
            }
        }

        const severity = this.configurableAlert?.severity;
        switch (severity) {
            case 'INFO': return '#2196F3';
            case 'WARNING': return '#FF9800';
            case 'ERROR': return '#F44336';
            case 'CRITICAL': return '#9C27B0';
            default: return '#757575';
        }
    }

    formatDate(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours} h`;
        if (days < 7) return `Hace ${days} días`;
        return date.toLocaleDateString('es-ES');
    }

    translateType(type: AlertType): string {
        switch (type) {
            case 'HIGH_CONSUMPTION': return 'Alto Consumo';
            case 'LOW_EFFICIENCY': return 'Baja Eficiencia';
            case 'DEVICE_OFFLINE': return 'Dispositivo Desconectado';
            case 'SCHEDULE_CONFLICT': return 'Conflicto de Horario';
            case 'THRESHOLD_EXCEEDED': return 'Umbral Excedido';
            case 'CUSTOM': return 'Personalizada';
            default: return type;
        }
    }

    translateSeverity(severity: AlertSeverity): string {
        switch (severity) {
            case 'INFO': return 'Información';
            case 'WARNING': return 'Advertencia';
            case 'ERROR': return 'Error';
            case 'CRITICAL': return 'Crítico';
            default: return severity;
        }
    }
}


