import { Injectable, inject } from '@angular/core';
import { SCHEDULE_REPOSITORY } from '../domain/tokens';
import { ScheduleRule } from '../domain/model/schedule-rule';

// Listar todas las reglas inteligentes
@Injectable({ providedIn: 'root' })
export class ListScheduleRulesUseCase {
  private repository = inject(SCHEDULE_REPOSITORY);

  async execute(): Promise<ScheduleRule[]> {
    return this.repository.listRules();
  }
}

