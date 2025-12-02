import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AlertType, AlertSeverity } from '../../../../domain/model/alert.entity';

@Component({
    selector: 'app-alert-filters',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        FormsModule
    ],
    templateUrl: './alert-filters.html',
    styleUrl: './alert-filters.css'
})
export class AlertFiltersComponent {
    @Output() filtersChange = new EventEmitter<any>();

    selectedType: AlertType | '' = '';
    selectedSeverity: AlertSeverity | '' = '';
    selectedAcknowledged: 'all' | 'acknowledged' | 'unacknowledged' = 'all';
    searchText = '';

    readonly types: { value: AlertType | ''; label: string }[] = [
        { value: '', label: 'Todos los tipos' },
        { value: 'HIGH_CONSUMPTION', label: 'Alto Consumo' },
        { value: 'LOW_EFFICIENCY', label: 'Baja Eficiencia' },
        { value: 'DEVICE_OFFLINE', label: 'Dispositivo Desconectado' },
        { value: 'SCHEDULE_CONFLICT', label: 'Conflicto de Horario' },
        { value: 'THRESHOLD_EXCEEDED', label: 'Umbral Excedido' },
        { value: 'CUSTOM', label: 'Personalizada' }
    ];

    readonly severities: { value: AlertSeverity | ''; label: string }[] = [
        { value: '', label: 'Todas las severidades' },
        { value: 'INFO', label: 'Información' },
        { value: 'WARNING', label: 'Advertencia' },
        { value: 'ERROR', label: 'Error' },
        { value: 'CRITICAL', label: 'Crítico' }
    ];

    readonly acknowledgedOptions: { value: 'all' | 'acknowledged' | 'unacknowledged'; label: string }[] = [
        { value: 'all', label: 'Todas' },
        { value: 'unacknowledged', label: 'No reconocidas' },
        { value: 'acknowledged', label: 'Reconocidas' }
    ];

    onFilterChange(): void {
        this.filtersChange.emit({
            type: this.selectedType,
            severity: this.selectedSeverity,
            acknowledged: this.selectedAcknowledged,
            search: this.searchText
        });
    }

    clearFilters(): void {
        this.selectedType = '';
        this.selectedSeverity = '';
        this.selectedAcknowledged = 'all';
        this.searchText = '';
        this.onFilterChange();
    }
}


