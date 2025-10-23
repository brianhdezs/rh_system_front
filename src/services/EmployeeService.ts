import { storage } from '../utils/storage';
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, UserProfile } from '../types/EmployeeTypes';

const API_BASE_URL = 'https://hrms-gateway-production.up.railway.app/gateway/staff';

class EmployeeService {
  private getAuthHeaders() {
    const token = storage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAll(): Promise<Employee[]> {
    const response = await fetch(`${API_BASE_URL}/list`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener empleados');
    }

    return response.json();
  }

  async getById(id: number): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/details/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Empleado no encontrado');
      }
      throw new Error('Error al obtener empleado');
    }

    return response.json();
  }

  async create(employeeData: CreateEmployeeRequest): Promise<Employee> {
    const response = await fetch(`${API_BASE_URL}/create`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error('Error al crear empleado');
    }

    return response.json();
  }

  async update(id: number, employeeData: UpdateEmployeeRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/update/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('El ID no coincide');
      }
      throw new Error('Error al actualizar empleado');
    }
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/remove/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar empleado');
    }
  }

  async getCurrentProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener perfil');
    }

    return response.json();
  }
}

export const employeeService = new EmployeeService();