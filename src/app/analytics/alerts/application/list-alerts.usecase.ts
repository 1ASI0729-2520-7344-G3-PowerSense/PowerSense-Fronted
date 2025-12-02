import { Inject, Injectable } from '@angular/core';
import { Alert } from '../domain/model/alert.entity';
import { AlertQuery, AlertRepository } from '../domain/repositories/alert.repository';
import { ALERT_REPOSITORY } from '../domain/tokens';

@Injectable({ providedIn: 'root' })
export class ListAlertsUseCase {
    constructor(@Inject(ALERT_REPOSITORY) private readonly repository: AlertRepository) { }

    execute(query?: AlertQuery): Promise<Alert[]> {
        return this.repository.list(query);
    }
}


