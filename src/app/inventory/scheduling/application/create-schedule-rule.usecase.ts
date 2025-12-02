import { Inject, Injectable } from '@angular/core';
import { ScheduleRule } from '../domain/model/schedule-rule.entity';
import { ScheduleRepository } from '../domain/repositories/schedule.repository';
import { SCHEDULE_REPOSITORY } from '../domain/tokens';

export interface CreateRuleDTO {
    type: string;
    name: string;
    description: string;
}

@Injectable({ providedIn: 'root' })
export class CreateScheduleRuleUseCase {
    constructor(@Inject(SCHEDULE_REPOSITORY) private readonly repository: ScheduleRepository) { }

    async execute(dto: CreateRuleDTO): Promise<ScheduleRule> {
        // Create a basic rule with default conditions and actions
        const rule: Partial<ScheduleRule> = {
            type: dto.type as any,
            name: dto.name,
            description: dto.description,
            enabled: false, // Start disabled
            conditions: [],
            actions: [],
            priority: 1
        };

        // Note: In a real implementation, this would call repository.createRule()
        // For now, we'll use updateRule with a generated ID
        const newId = `rule-${Date.now()}`;
        return this.repository.updateRule(newId, rule as ScheduleRule);
    }
}
