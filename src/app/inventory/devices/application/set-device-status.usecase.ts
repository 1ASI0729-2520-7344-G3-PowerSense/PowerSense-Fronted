// Importa decoradores y utilidades del núcleo de Angular
import { Inject, Injectable } from '@angular/core';

// Importa los tipos de datos del dominio: Device (modelo) y DeviceId (identificador único del dispositivo)
import { Device, DeviceId } from '../domain/model/device';

// Importa la interfaz del repositorio de dispositivos
import { DeviceRepository } from '../domain/repositories/device.repository';

// Importa el token de inyección asociado al repositorio de dispositivos
import { DEVICE_REPOSITORY } from '../domain/tokens';

// Declara que esta clase es un servicio inyectable y disponible a nivel global en la aplicación
@Injectable({ providedIn: 'root' })
export class SetDeviceStatusUseCase {
  
  // Inyecta el repositorio mediante un token, promoviendo el desacoplamiento entre la capa de dominio y la de infraestructura
  constructor(@Inject(DEVICE_REPOSITORY) private readonly repository: DeviceRepository) {}

  /**
   * Caso de uso: Cambia el estado de un dispositivo específico.
   * 
   * @param id - Identificador único del dispositivo (DeviceId)
   * @param status - Nuevo estado del dispositivo ('active' o 'inactive')
   * @returns Promise<Device> - Devuelve una promesa que resuelve el dispositivo actualizado
   */
  execute(id: DeviceId, status: 'active' | 'inactive'): Promise<Device> {
    // Delegación al repositorio: se actualiza el estado del dispositivo y se retorna el resultado
    return this.repository.setStatus(id, status);
  }
}
