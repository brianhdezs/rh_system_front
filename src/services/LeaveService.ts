import { storage } from '../utils/storage';
import type {
  LeaveRequest,
  CreateLeaveRequest,
  ReviewLeaveRequest,
  LeaveBalance,
  LeaveType,
  UserInfo,
  ApiResponse,
} from '../types/LeaveTypes';

const API_BASE_URL = 'https://hrms-gateway-production.up.railway.app/gateway/timeoff';

class LeaveService {
  private getAuthHeaders() {
    const token = storage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Solicitar vacaciones/permiso
  async applyLeave(data: CreateLeaveRequest): Promise<ApiResponse<{ requestId: number; message: string }>> {
    const response = await fetch(`${API_BASE_URL}/apply`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al solicitar permiso');
    }

    return result;
  }

  // Aprobar solicitud
  async approveRequest(requestId: number, reviewData: ReviewLeaveRequest): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${API_BASE_URL}/accept/${requestId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al aprobar solicitud');
    }

    return result;
  }

  // Rechazar solicitud
  async rejectRequest(requestId: number, reviewData: ReviewLeaveRequest): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${API_BASE_URL}/decline/${requestId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al rechazar solicitud');
    }

    return result;
  }

  // Obtener solicitudes del empleado
  async getEmployeeRequests(employeeId: number): Promise<ApiResponse<LeaveRequest[]>> {
    const response = await fetch(`${API_BASE_URL}/requests/${employeeId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener solicitudes');
    }

    return response.json();
  }

  // Obtener balance de vacaciones
  async getLeaveBalance(employeeId: number, year?: number): Promise<ApiResponse<LeaveBalance[]>> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());

    const queryString = params.toString();
    const url = `${API_BASE_URL}/available/${employeeId}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener balance');
    }

    return response.json();
  }

  // Obtener tipos de permisos
  async getLeaveTypes(): Promise<ApiResponse<LeaveType[]>> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener tipos de permisos');
    }

    return response.json();
  }

  // Obtener info del usuario autenticado
  async getMyInfo(): Promise<UserInfo> {
    const response = await fetch(`${API_BASE_URL}/my-info`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener información del usuario');
    }

    return response.json();
  }
}

export const leaveService = new LeaveService();