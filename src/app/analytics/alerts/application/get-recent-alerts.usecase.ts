import { Inject, Injectable } from '@angular/core';
import { DynamicAlert } from '../domain/model/alert.entity';
import { AlertRepository } from '../domain/repositories/alert.repository';
import { ALERT_REPOSITORY } from '../domain/tokens';

@Injectable({ providedIn: 'root' })
export class GetRecentAlertsUseCase {
    constructor(@Inject(ALERT_REPOSITORY) private readonly repository: AlertRepository) { }

    execute(): Promise<DynamicAlert[]> {
        return this.repository.getRecent();
    }
}


