import { Inject, Injectable } from '@angular/core';
import { Alert, AlertId } from '../domain/model/alert.entity';
import { AlertRepository } from '../domain/repositories/alert.repository';
import { ALERT_REPOSITORY } from '../domain/tokens';

@Injectable({ providedIn: 'root' })
export class GetAlertByIdUseCase {
    constructor(@Inject(ALERT_REPOSITORY) private readonly repository: AlertRepository) { }

    execute(id: AlertId): Promise<Alert | null> {
        return this.repository.getById(id);
    }
}


