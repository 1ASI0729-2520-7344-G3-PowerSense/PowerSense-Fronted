import { Inject, Injectable } from '@angular/core';
import { Alert, CreateAlertDTO } from '../domain/model/alert.entity';
import { AlertRepository } from '../domain/repositories/alert.repository';
import { ALERT_REPOSITORY } from '../domain/tokens';

@Injectable({ providedIn: 'root' })
export class CreateAlertUseCase {
    constructor(@Inject(ALERT_REPOSITORY) private readonly repository: AlertRepository) { }

    execute(alert: CreateAlertDTO): Promise<Alert> {
        return this.repository.create(alert);
    }
}


