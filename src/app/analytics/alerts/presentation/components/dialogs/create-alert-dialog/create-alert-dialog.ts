import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AlertType, AlertSeverity, CreateAlertDTO } from '../../../../domain/model/alert.entity';

@Component({
    selector: 'app-create-alert-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        FormsModule
    ],
    templateUrl: './create-alert-dialog.html',
    styleUrl: './create-alert-dialog.css'
})
export class CreateAlertDialogComponent {
    selectedType: AlertType = 'CUSTOM';
    selectedSeverity: AlertSeverity = 'INFO';
    deviceId = '';
    threshold?: number;
    message = '';

    readonly types: { value: AlertType; label: string }[] = [
        { value: 'HIGH_CONSUMPTION', label: 'Alto Consumo' },
        { value: 'LOW_EFFICIENCY', label: 'Baja Eficiencia' },
        { value: 'DEVICE_OFFLINE', label: 'Dispositivo Desconectado' },
        { value: 'SCHEDULE_CONFLICT', label: 'Conflicto de Horario' },
        { value: 'THRESHOLD_EXCEEDED', label: 'Umbral Excedido' },
        { value: 'CUSTOM', label: 'Personalizada' }
    ];

    readonly severities: { value: AlertSeverity; label: string }[] = [
        { value: 'INFO', label: 'Información' },
        { value: 'WARNING', label: 'Advertencia' },
        { value: 'ERROR', label: 'Error' },
        { value: 'CRITICAL', label: 'Crítico' }
    ];

    constructor(private dialogRef: MatDialogRef<CreateAlertDialogComponent>) { }

    onCancel(): void {
        this.dialogRef.close();
    }

    onCreate(): void {
        if (!this.isValid()) {
            return;
        }

        const alert: CreateAlertDTO = {
            type: this.selectedType,
            severity: this.selectedSeverity,
            deviceId: this.deviceId || undefined,
            threshold: this.threshold,
            message: this.message.trim()
        };

        this.dialogRef.close(alert);
    }

    isValid(): boolean {
        return this.message.trim().length > 0 && this.message.trim().length <= 500;
    }
}


