import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Schedule, ScheduleConfig, DayOfWeek } from '../../../../domain/model/schedule.entity';

export interface EditScheduleDialogData {
  schedule: Schedule;
}

@Component({
  selector: 'app-edit-schedule-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSlideToggleModule
  ],
  templateUrl: './edit-schedule-dialog.html',
  styleUrl: './edit-schedule-dialog.css'
})
export class EditScheduleDialog {
  readonly dialogRef = inject(MatDialogRef<EditScheduleDialog>);
  readonly data = inject<EditScheduleDialogData>(MAT_DIALOG_DATA);

  // Estado del formulario
  readonly schedules = signal<ScheduleConfig[]>([...this.data.schedule.schedules]);
  enabled = this.data.schedule.enabled;

  // Días de la semana disponibles
  readonly daysOfWeek: { value: DayOfWeek; label: string }[] = [
    { value: 'monday', label: 'Lun' },
    { value: 'tuesday', label: 'Mar' },
    { value: 'wednesday', label: 'Mié' },
    { value: 'thursday', label: 'Jue' },
    { value: 'friday', label: 'Vie' },
    { value: 'saturday', label: 'Sáb' },
    { value: 'sunday', label: 'Dom' }
  ];

  // Agregar nuevo horario
  addSchedule(): void {
    const newSchedule: ScheduleConfig = {
      action: 'on',
      time: { hour: 18, minute: 0 },
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    } as ScheduleConfig;
    this.schedules.update(schedules => [...schedules, newSchedule]);
  }

  // Eliminar horario
  removeSchedule(index: number): void {
    this.schedules.update(schedules => schedules.filter((_, i) => i !== index));
  }

  // Toggle día en un horario
  toggleDay(scheduleIndex: number, day: DayOfWeek): void {
    this.schedules.update(schedules => {
      const updated = [...schedules];
      const schedule = updated[scheduleIndex];
      const days = [...schedule.days];
      const dayIndex = days.indexOf(day);
      
      if (dayIndex >= 0) {
        days.splice(dayIndex, 1);
      } else {
        days.push(day);
      }
      
      updated[scheduleIndex] = { ...schedule, days };
      return updated;
    });
  }

  // Verificar si un día está seleccionado
  isDaySelected(scheduleIndex: number, day: DayOfWeek): boolean {
    return this.schedules()[scheduleIndex].days.includes(day);
  }

  // Cambiar acción a 'on'
  setActionOn(scheduleIndex: number): void {
    this.schedules.update(schedules => {
      const updated = [...schedules];
      updated[scheduleIndex] = { ...updated[scheduleIndex], action: 'on' };
      return updated;
    });
  }

  // Cambiar acción a 'off'
  setActionOff(scheduleIndex: number): void {
    this.schedules.update(schedules => {
      const updated = [...schedules];
      updated[scheduleIndex] = { ...updated[scheduleIndex], action: 'off' };
      return updated;
    });
  }

  // Guardar cambios
  save(): void {
    const updatedSchedule: Schedule = {
      ...this.data.schedule,
      enabled: this.enabled,
      schedules: this.schedules(),
      updatedAt: new Date()
    };
    this.dialogRef.close(updatedSchedule);
  }

  // Cancelar
  cancel(): void {
    this.dialogRef.close();
  }

  // Formatear hora para input
  formatTimeForInput(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  // Parsear hora desde input
  parseTimeFromInput(timeString: string, scheduleIndex: number): void {
    const [hour, minute] = timeString.split(':').map(Number);
    this.schedules.update(schedules => {
      const updated = [...schedules];
      updated[scheduleIndex] = {
        ...updated[scheduleIndex],
        time: { hour, minute }
      };
      return updated;
    });
  }
}


