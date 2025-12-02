import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { Schedule } from '../../../domain/model/schedule.entity';
import { ScheduleStats } from '../../../domain/repositories/schedule.repository';
import { ScheduleRule } from '../../../domain/model/schedule-rule.entity';
import { QUICK_SCHEDULE_PRESETS } from '../../../domain/model/quick-schedule.entity';
import { ListSchedulesUseCase } from '../../../application/list-schedules.usecase';
import { ToggleScheduleUseCase } from '../../../application/toggle-schedule.usecase';
import { DeleteScheduleUseCase } from '../../../application/delete-schedule.usecase';
import { GetScheduleStatsUseCase } from '../../../application/get-schedule-stats.usecase';
import { ListScheduleRulesUseCase } from '../../../application/list-schedule-rules.usecase';
import { ToggleScheduleRuleUseCase } from '../../../application/toggle-schedule-rule.usecase';
import { ApplyQuickScheduleUseCase } from '../../../application/apply-quick-schedule.usecase';
import { UpdateScheduleUseCase } from '../../../application/update-schedule.usecase';
import { CreateScheduleRuleUseCase } from '../../../application/create-schedule-rule.usecase';
import { EditScheduleDialog } from '../dialogs/edit-schedule-dialog/edit-schedule-dialog';
import { CreateRuleDialog } from '../dialogs/create-rule-dialog/create-rule-dialog';
import { ConfirmDialogComponent } from '../../../../../shared/presentation/components/dialogs/confirm-dialog.component';

@Component({
  selector: 'app-scheduling-page',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './scheduling-page.html',
  styleUrl: './scheduling-page.css'
})
export class SchedulingPage {
  // Estado de la página
  readonly schedules = signal<Schedule[]>([]);
  readonly stats = signal<ScheduleStats>({ totalScheduled: 0, activeHours: 0, estimatedSavings: 0 });
  readonly rules = signal<ScheduleRule[]>([]);
  readonly loading = signal<boolean>(false);
  readonly quickPresets = QUICK_SCHEDULE_PRESETS;

  // Paginación
  readonly schedulePageSize = 5;
  readonly rulePageSize = 3;
  readonly visibleSchedulesCount = signal<number>(5);
  readonly visibleRulesCount = signal<number>(3);

  // Filtros
  search = '';
  selectedRoom = '';

  // Habitaciones disponibles (extraídas de los horarios)
  get rooms(): string[] {
    const uniqueRooms = new Set<string>();
    this.schedules().forEach(s => uniqueRooms.add(s.roomName));
    return ['Todas las habitaciones', ...Array.from(uniqueRooms).sort()];
  }

  // Programaciones visibles (con paginación)
  get visibleSchedules(): Schedule[] {
    return this.schedules().slice(0, this.visibleSchedulesCount());
  }

  // Verificar si hay más programaciones
  get hasMoreSchedules(): boolean {
    return this.visibleSchedulesCount() < this.schedules().length;
  }

  // Reglas visibles (con paginación)
  get visibleRules(): ScheduleRule[] {
    return this.rules().slice(0, this.visibleRulesCount());
  }

  // Verificar si hay más reglas
  get hasMoreRules(): boolean {
    return this.visibleRulesCount() < this.rules().length;
  }

  constructor(
    private readonly listSchedules: ListSchedulesUseCase,
    private readonly toggleSchedule: ToggleScheduleUseCase,
    private readonly deleteSchedule: DeleteScheduleUseCase,
    private readonly updateSchedule: UpdateScheduleUseCase,
    private readonly getStats: GetScheduleStatsUseCase,
    private readonly listRules: ListScheduleRulesUseCase,
    private readonly toggleRule: ToggleScheduleRuleUseCase,
    private readonly createRule: CreateScheduleRuleUseCase,
    private readonly applyQuickSchedule: ApplyQuickScheduleUseCase,
    private readonly dialog: MatDialog
  ) {
    this.refresh();
  }

  // Recargar todos los datos
  async refresh(): Promise<void> {
    this.loading.set(true);
    try {
      const query: any = {};
      if (this.search) query.search = this.search;
      if (this.selectedRoom && this.selectedRoom !== 'Todas las habitaciones') {
        query.roomId = this.selectedRoom;
      }

      const [schedules, stats, rules] = await Promise.all([
        this.listSchedules.execute(Object.keys(query).length ? query : undefined),
        this.getStats.execute(),
        this.listRules.execute()
      ]);

      this.schedules.set(schedules);
      this.stats.set(stats);
      this.rules.set(rules);
    } finally {
      this.loading.set(false);
    }
  }

  // Activar/desactivar una programación
  async toggleScheduleEnabled(schedule: Schedule): Promise<void> {
    const prev = this.schedules();
    const optimistic = prev.map(s =>
      s.id === schedule.id ? { ...s, enabled: !s.enabled } : s
    );
    this.schedules.set(optimistic);

    try {
      await this.toggleSchedule.execute(schedule.id, !schedule.enabled);
      await this.refreshStats();
    } catch {
      this.schedules.set(prev);
    }
  }

  // Eliminar una programación
  async deleteScheduleItem(schedule: Schedule): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      minHeight: '250px',
      height: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: 'confirm-dialog-no-scroll',
      data: {
        title: 'Eliminar Programación',
        message: `¿Estás seguro de que deseas eliminar la programación de "${schedule.deviceName}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        icon: 'delete'
      }
    });

    const confirmed = await dialogRef.afterClosed().toPromise();
    if (!confirmed) {
      return;
    }

    const prev = this.schedules();
    this.schedules.set(prev.filter(s => s.id !== schedule.id));

    try {
      await this.deleteSchedule.execute(schedule.id);
      await this.refreshStats();
    } catch {
      this.schedules.set(prev);
    }
  }

  // Actualizar solo las estadísticas
  private async refreshStats(): Promise<void> {
    const stats = await this.getStats.execute();
    this.stats.set(stats);
  }

  // Activar/desactivar una regla inteligente
  async toggleRuleEnabled(rule: ScheduleRule): Promise<void> {
    const prev = this.rules();
    const optimistic = prev.map(r =>
      r.id === rule.id ? { ...r, enabled: !r.enabled } : r
    );
    this.rules.set(optimistic);

    try {
      await this.toggleRule.execute(rule.id, !rule.enabled);
    } catch {
      this.rules.set(prev);
    }
  }

  // Aplicar preset de programación rápida
  async applyQuickPreset(presetId: string): Promise<void> {
    const preset = this.quickPresets.find(p => p.id === presetId);
    if (!preset) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      minHeight: '250px',
      height: 'auto',
      maxWidth: '90vw',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: 'confirm-dialog-no-scroll',
      data: {
        title: 'Aplicar Programación Rápida',
        message: `¿Deseas aplicar la programación "${preset.name}" a los dispositivos seleccionados? ${preset.description}`,
        confirmText: 'Aplicar',
        cancelText: 'Cancelar',
        icon: preset.icon
      }
    });

    const confirmed = await dialogRef.afterClosed().toPromise();
    if (!confirmed) {
      return;
    }

    this.loading.set(true);
    try {
      await this.applyQuickSchedule.execute(preset);
      await this.refresh();
    } finally {
      this.loading.set(false);
    }
  }

  // Formatear hora para mostrar
  formatTime(hour: number, minute: number): string {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  // Formatear días de la semana
  formatDays(days: string[]): string {
    const dayLabels: Record<string, string> = {
      monday: 'Lun',
      tuesday: 'Mar',
      wednesday: 'Mié',
      thursday: 'Jue',
      friday: 'Vie',
      saturday: 'Sáb',
      sunday: 'Dom'
    };

    if (days.length === 7) return 'Todos los días';
    if (days.length === 5 && !days.includes('saturday') && !days.includes('sunday')) {
      return 'Lun - Vie';
    }

    return days.map(d => dayLabels[d] || d).join(', ');
  }

  // Ícono para cada tipo de regla
  getRuleIcon(type: string): string {
    const icons: Record<string, string> = {
      night_mode: 'nightlight',
      energy_saving: 'eco',
      away_mode: 'home',
      eco_mode: 'park',
      comfort_mode: 'thermostat'
    };
    return icons[type] || 'settings';
  }

  // Obtener categoría del dispositivo para el borde coloreado
  getDeviceCategory(deviceName: string): string {
    const name = deviceName.toLowerCase();
    if (name.includes('lámpara') || name.includes('luz')) return 'light';
    if (name.includes('aire') || name.includes('ac') || name.includes('acondicionado')) return 'ac';
    if (name.includes('tv') || name.includes('televisor')) return 'tv';
    return 'other';
  }

  // Obtener ícono del dispositivo
  getDeviceIcon(deviceName: string): string {
    const name = deviceName.toLowerCase();

    // Iluminación
    if (name.includes('lámpara') || name.includes('luz')) return 'lightbulb';

    // Climatización
    if (name.includes('aire') || name.includes('ac') || name.includes('acondicionado')) return 'ac_unit';
    if (name.includes('calefacción') || name.includes('calefactor')) return 'whatshot';
    if (name.includes('ventilador')) return 'air';

    // Entretenimiento
    if (name.includes('tv') || name.includes('televisor')) return 'tv';
    if (name.includes('consola') || name.includes('videojuego')) return 'videogame_asset';

    // Cocina
    if (name.includes('refrigerador') || name.includes('nevera')) return 'kitchen';
    if (name.includes('microondas')) return 'microwave';

    // Limpieza
    if (name.includes('lavadora')) return 'local_laundry_service';

    // Oficina
    if (name.includes('computadora') || name.includes('pc') || name.includes('ordenador')) return 'computer';
    if (name.includes('impresora')) return 'print';

    // Genérico
    return 'power';
  }

  // Callback de filtros
  onFiltersChange(): void {
    this.visibleSchedulesCount.set(this.schedulePageSize);
    this.refresh();
  }

  // Ver más programaciones
  showMoreSchedules(): void {
    const next = Math.min(
      this.visibleSchedulesCount() + this.schedulePageSize,
      this.schedules().length
    );
    this.visibleSchedulesCount.set(next);
  }

  // Ver más reglas
  showMoreRules(): void {
    const next = Math.min(
      this.visibleRulesCount() + this.rulePageSize,
      this.rules().length
    );
    this.visibleRulesCount.set(next);
  }

  // Abrir diálogo de edición de programación
  openEditDialog(schedule: Schedule): void {
    const dialogRef = this.dialog.open(EditScheduleDialog, {
      width: '650px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'confirm-dialog-no-scroll',
      data: { schedule },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(async (result: Schedule | undefined) => {
      if (result) {
        try {
          await this.updateSchedule.execute(result.id, {
            enabled: result.enabled,
            schedules: result.schedules
          });
          await this.refresh();
        } catch (error) {
          console.error('Error al actualizar programación:', error);
        }
      }
    });
  }

  // Abrir diálogo para crear nueva regla inteligente
  openCreateRuleDialog(): void {
    const dialogRef = this.dialog.open(CreateRuleDialog, {
      width: '650px',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'confirm-dialog-no-scroll'
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.createRule.execute(result);
          await this.refresh();
        } catch (error) {
          console.error('Error al crear regla:', error);
        }
      }
    });
  }
}

