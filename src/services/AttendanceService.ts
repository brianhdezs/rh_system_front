import { storage } from '../utils/storage';
import type {
  AttendanceRecord,
  CheckInRequest,
  CheckOutRequest,
  CheckInResponse,
  CheckOutResponse,
  UserStatus,
  ApiResponse,
  AttendanceFilters,
} from '../types/AttendanceTypes';

const API_BASE_URL = 'https://hrms-gateway-production.up.railway.app/gateway/timeclock';

class AttendanceService {
  private getAuthHeaders() {
    const token = storage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Registrar entrada (Check-In)
  async checkIn(data: CheckInRequest): Promise<ApiResponse<CheckInResponse>> {
    const response = await fetch(`${API_BASE_URL}/entry`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al registrar entrada');
    }

    return result;
  }

  // Registrar salida (Check-Out)
  async checkOut(data: CheckOutRequest): Promise<ApiResponse<CheckOutResponse>> {
    const response = await fetch(`${API_BASE_URL}/exit`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al registrar salida');
    }

    return result;
  }

  // Obtener historial de asistencias
  async getHistory(
    employeeId: number,
    filters?: AttendanceFilters
  ): Promise<ApiResponse<AttendanceRecord[]>> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/history/${employeeId}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener historial');
    }

    return response.json();
  }

  // Obtener asistencias del día
  async getDailyAttendance(date: string): Promise<ApiResponse<AttendanceRecord[]>> {
    const response = await fetch(`${API_BASE_URL}/daily/${date}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener asistencias del día');
    }

    return response.json();
  }

  // Obtener asistencia actual del empleado
  async getCurrentAttendance(employeeId: number): Promise<ApiResponse<AttendanceRecord>> {
    const response = await fetch(`${API_BASE_URL}/current/${employeeId}`, {
      headers: this.getAuthHeaders(),
    });

    const result = await response.json();
    
    if (!response.ok && response.status !== 200) {
      throw new Error(result.message || 'Error al obtener asistencia actual');
    }

    return result;
  }

  // Obtener estado del usuario autenticado
  async getMyStatus(): Promise<UserStatus> {
    const response = await fetch(`${API_BASE_URL}/my-status`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener estado del usuario');
    }

    return response.json();
  }
}

export const attendanceService = new AttendanceService();