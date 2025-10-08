// Importa los tipos del dominio: el modelo de dispositivo (Device) y su identificador único (DeviceId)
import { Device, DeviceId } from '../model/device';


// ============================================================
// 🔍 INTERFAZ: DeviceQuery
// ------------------------------------------------------------
// Define los posibles filtros para realizar búsquedas o listados
// de dispositivos en el repositorio. Todos los campos son opcionales.
// ============================================================
export interface DeviceQuery {
  search?: string; // Texto para búsqueda general (por nombre, descripción, etc.)
  category?: string; // Categoría del dispositivo (ej. “sensor”, “luces”, etc.)
  roomId?: string; // ID de la habitación a la que pertenece el dispositivo
  status?: 'active' | 'inactive'; // Estado actual del dispositivo
}


// ============================================================
// 🧩 INTERFAZ: DeviceRepository
// ------------------------------------------------------------
// Define las operaciones que debe implementar cualquier fuente de
// datos (por ejemplo, una API o base de datos local) para gestionar
// dispositivos. Representa un contrato del dominio.
// ============================================================
export interface DeviceRepository {

  // Obtiene una lista de dispositivos filtrados según los criterios del query.
  list(query?: DeviceQuery): Promise<Device[]>;

  // Busca un dispositivo específico por su identificador único.
  getById(id: DeviceId): Promise<Device | null>;

  // Crea un nuevo dispositivo (sin incluir el id, que se genera automáticamente).
  create(device: Omit<Device, 'id'>): Promise<Device>;

  // Actualiza parcialmente un dispositivo existente.
  update(id: DeviceId, device: Partial<Omit<Device, 'id'>>): Promise<Device>;

  // Elimina un dispositivo del repositorio según su identificador.
  delete(id: DeviceId): Promise<void>;

  // Cambia el estado (‘active’ o ‘inactive’) de un dispositivo.
  setStatus(id: DeviceId, status: 'active' | 'inactive'): Promise<Device>;
}


// ============================================================
// 📝 NOTA:
// Esta interfaz define el contrato mínimo necesario para que la
// pantalla o módulo de gestión de dispositivos funcione correctamente.
// Si en el futuro se necesitan nuevas funcionalidades (como historial
// de uso o registro de eventos), deben añadirse nuevos métodos aquí y
// en las implementaciones correspondientes.
// ============================================================
