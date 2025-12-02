import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Alert, DynamicAlert, AlertType, AlertSeverity } from '../../../domain/model/alert.entity';
import { ListAlertsUseCase } from '../../../application/list-alerts.usecase';
import { GetRecentAlertsUseCase } from '../../../application/get-recent-alerts.usecase';
import { AcknowledgeAlertUseCase } from '../../../application/acknowledge-alert.usecase';
import { CreateAlertUseCase } from '../../../application/create-alert.usecase';
import { AlertCardComponent } from '../cards/alert-card/alert-card';
import { AlertFiltersComponent } from '../cards/alert-filters/alert-filters';
import { CreateAlertDialogComponent } from '../dialogs/create-alert-dialog/create-alert-dialog';

@Component({
    selector: 'app-alerts-page',
    imports: [
        CommonModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatChipsModule,
        MatDialogModule,
        FormsModule,
        AlertCardComponent,
        AlertFiltersComponent
    ],
    templateUrl: './alerts-page.html',
    styleUrl: './alerts-page.css'
})
export class AlertsPage {
    // Estado de la página
    readonly alerts = signal<Alert[]>([]);
    readonly recentAlerts = signal<DynamicAlert[]>([]);
    readonly loading = signal<boolean>(false);
    readonly visibleCount = signal<number>(10);
    readonly pageSize = 10;

    // Filtros activos
    selectedType: AlertType | '' = '';
    selectedSeverity: AlertSeverity | '' = '';
    selectedAcknowledged: 'all' | 'acknowledged' | 'unacknowledged' = 'all';
    searchText = '';

    constructor(
        private readonly listAlerts: ListAlertsUseCase,
        private readonly getRecentAlerts: GetRecentAlertsUseCase,
        private readonly acknowledgeAlert: AcknowledgeAlertUseCase,
        private readonly createAlert: CreateAlertUseCase,
        private readonly dialog: MatDialog
    ) {
        this.refresh();
    }

    // Carga alertas configurables y dinámicas
    async refresh(): Promise<void> {
        this.loading.set(true);
        try {
            const query: any = {};
            if (this.selectedType) query.type = this.selectedType;
            if (this.selectedSeverity) query.severity = this.selectedSeverity;
            if (this.selectedAcknowledged !== 'all') {
                query.acknowledged = this.selectedAcknowledged === 'acknowledged';
            }

            // Cargar datos en paralelo pero manejando errores individualmente
            const [configurable, dynamic] = await Promise.all([
                this.listAlerts.execute(Object.keys(query).length ? query : undefined).catch(err => {
                    console.error('Error loading configurable alerts:', err);
                    return [];
                }),
                this.getRecentAlerts.execute().catch(err => {
                    console.error('Error loading recent alerts:', err);
                    return [];
                })
            ]);

            // Filtrar por búsqueda de texto si existe
            let filtered = configurable;
            if (this.searchText) {
                const search = this.searchText.toLowerCase();
                filtered = filtered.filter(a => a.message.toLowerCase().includes(search));
            }

            this.alerts.set(filtered);
            this.recentAlerts.set(dynamic);
        } finally {
            this.loading.set(false);
        }
    }

    // Maneja cambios en los filtros
    onFiltersChange(filters: any): void {
        this.selectedType = filters.type;
        this.selectedSeverity = filters.severity;
        this.selectedAcknowledged = filters.acknowledged;
        this.searchText = filters.search;
        this.visibleCount.set(this.pageSize);
        this.refresh();
    }

    // Reconoce una alerta (actualización optimista)
    async onAcknowledge(alert: Alert): Promise<void> {
        const prev = this.alerts();
        const optimistic = prev.map(a =>
            a.id === alert.id
                ? { ...a, acknowledged: true, acknowledgedAt: new Date(), updatedAt: new Date() }
                : a
        );
        this.alerts.set(optimistic);

        try {
            await this.acknowledgeAlert.execute(alert.id);
        } catch {
            // Revertir si falla
            this.alerts.set(prev);
        }
    }

    // Abre el dialog para crear una nueva alerta
    openCreateDialog(): void {
        const dialogRef = this.dialog.open(CreateAlertDialogComponent, {
            width: '600px'
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                try {
                    await this.createAlert.execute(result);
                    await this.refresh();
                } catch (error) {
                    console.error('Error creating alert:', error);
                }
            }
        });
    }

    // Muestra más alertas (paginación)
    showMore(): void {
        const next = Math.min(this.visibleCount() + this.pageSize, this.alerts().length);
        this.visibleCount.set(next);
    }

    // Obtiene el icono según el tipo de alerta
    getAlertIcon(type: AlertType): string {
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

    // Obtiene el color según la severidad
    getSeverityColor(severity: AlertSeverity): string {
        switch (severity) {
            case 'INFO': return '#2196F3';
            case 'WARNING': return '#FF9800';
            case 'ERROR': return '#F44336';
            case 'CRITICAL': return '#9C27B0';
            default: return '#757575';
        }
    }

    // Formatea la fecha de forma legible
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

    // Traduce el tipo de alerta al español
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

    // Traduce la severidad al español
    translateSeverity(severity: AlertSeverity): string {
        switch (severity) {
            case 'INFO': return 'Información';
            case 'WARNING': return 'Advertencia';
            case 'ERROR': return 'Error';
            case 'CRITICAL': return 'Crítico';
            default: return severity;
        }
    }

    // Métricas de alertas
    get metrics() {
        const all = this.alerts();
        const unacknowledged = all.filter(a => !a.acknowledged).length;
        const critical = all.filter(a => a.severity === 'CRITICAL').length;
        const warnings = all.filter(a => a.severity === 'WARNING').length;

        return {
            total: all.length,
            unacknowledged,
            critical,
            warnings
        };
    }
}


