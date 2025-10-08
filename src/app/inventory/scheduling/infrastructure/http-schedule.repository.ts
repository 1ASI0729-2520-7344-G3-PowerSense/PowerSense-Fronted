import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { 
  Schedule, 
  ScheduleId, 
  CreateScheduleDTO, 
  UpdateScheduleDTO 
} from '../domain/model/schedule.entity';
import { ScheduleRule, RuleId } from '../domain/model/schedule-rule.entity';
import { 
  ScheduleRepository, 
  ScheduleQuery, 
  ScheduleStats 
} from '../domain/repositories/schedule.repository';
import { API_BASE_URL } from '../../../shared/infrastructure/api.config';

// Implementación HTTP del repositorio de programaciones
@Injectable()
export class HttpScheduleRepository implements ScheduleRepository {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  async list(query?: ScheduleQuery): Promise<Schedule[]> {
    const params: any = {};
    if (query?.search) params.q = query.search;
    if (query?.roomId) params.roomName = query.roomId;
    if (query?.enabled !== undefined) params.enabled = query.enabled;
    if (query?.deviceId) params.deviceId = query.deviceId;

    const response = await firstValueFrom(
      this.http.get<Schedule[]>(`${this.baseUrl}/schedules`, { params })
    );
    
    // Convertir fechas de string a Date
    return response.map(s => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt)
    }));
  }

  async getById(id: ScheduleId): Promise<Schedule | null> {
    try {
      const schedule = await firstValueFrom(
        this.http.get<Schedule>(`${this.baseUrl}/schedules/${id}`)
      );
      return {
        ...schedule,
        createdAt: new Date(schedule.createdAt),
        updatedAt: new Date(schedule.updatedAt)
      };
    } catch {
      return null;
    }
  }

  async getByDeviceId(deviceId: string): Promise<Schedule | null> {
    const schedules = await this.list({ deviceId });
    return schedules.length > 0 ? schedules[0] : null;
  }

  async create(schedule: CreateScheduleDTO): Promise<Schedule> {
    const now = new Date();
    const newSchedule = {
      ...schedule,
      createdAt: now,
      updatedAt: now
    };
    const created = await firstValueFrom(
      this.http.post<Schedule>(`${this.baseUrl}/schedules`, newSchedule)
    );
    return {
      ...created,
      createdAt: new Date(created.createdAt),
      updatedAt: new Date(created.updatedAt)
    };
  }

  async update(id: ScheduleId, schedule: UpdateScheduleDTO): Promise<Schedule> {
    const updated = await firstValueFrom(
      this.http.patch<Schedule>(`${this.baseUrl}/schedules/${id}`, {
        ...schedule,
        updatedAt: new Date()
      })
    );
    return {
      ...updated,
      createdAt: new Date(updated.createdAt),
      updatedAt: new Date(updated.updatedAt)
    };
  }

  async delete(id: ScheduleId): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${this.baseUrl}/schedules/${id}`)
    );
  }

  async toggleEnabled(id: ScheduleId, enabled: boolean): Promise<Schedule> {
    return this.update(id, { enabled });
  }

  async getStats(): Promise<ScheduleStats> {
    const stats = await firstValueFrom(
      this.http.get<ScheduleStats>(`${this.baseUrl}/schedules-stats`)
    );
    return stats;
  }

  async listRules(): Promise<ScheduleRule[]> {
    return firstValueFrom(
      this.http.get<ScheduleRule[]>(`${this.baseUrl}/schedule-rules`)
    );
  }

  async getRuleById(id: RuleId): Promise<ScheduleRule | null> {
    try {
      return await firstValueFrom(
        this.http.get<ScheduleRule>(`${this.baseUrl}/schedule-rules/${id}`)
      );
    } catch {
      return null;
    }
  }

  async toggleRule(id: RuleId, enabled: boolean): Promise<ScheduleRule> {
    return firstValueFrom(
      this.http.patch<ScheduleRule>(`${this.baseUrl}/schedule-rules/${id}`, { enabled })
    );
  }

  async updateRule(id: RuleId, rule: Partial<ScheduleRule>): Promise<ScheduleRule> {
    return firstValueFrom(
      this.http.patch<ScheduleRule>(`${this.baseUrl}/schedule-rules/${id}`, rule)
    );
  }
}

