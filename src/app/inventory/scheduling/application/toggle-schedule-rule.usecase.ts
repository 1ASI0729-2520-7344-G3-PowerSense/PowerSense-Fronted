import { Injectable, inject } from '@angular/core';
import { SCHEDULE_REPOSITORY } from '../domain/tokens';
import { ScheduleRule, RuleId } from '../domain/model/schedule-rule.entity';

// Activar o desactivar una regla inteligente
@Injectable({ providedIn: 'root' })
export class ToggleScheduleRuleUseCase {
  private repository = inject(SCHEDULE_REPOSITORY);

  async execute(id: RuleId, enabled: boolean): Promise<ScheduleRule> {
    return this.repository.toggleRule(id, enabled);
  }
}

