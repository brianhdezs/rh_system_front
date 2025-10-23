import { storage } from '../utils/storage';
import type {
  EvaluationCycle,
  Evaluation,
  CreateEvaluationRequest,
  Criteria,
  ScoreData,
  SubmitEvaluationData,
  ApiResponse,
} from '../types/PerformanceTypes';

const API_BASE_URL = 'https://hrms-gateway-production.up.railway.app/gateway/reviews';

class PerformanceService {
  private getAuthHeaders() {
    const token = storage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Health check (sin autenticación)
  async checkHealth(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) {
      throw new Error('Error al verificar estado del servicio');
    }
    return response.json();
  }

  // Verificar autenticación
  async verifyAuth(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error de autenticación');
    }
    return response.json();
  }

  // Crear periodo de evaluación
  async createCycle(cycleData: EvaluationCycle): Promise<ApiResponse<number>> {
    const response = await fetch(`${API_BASE_URL}/cycles`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(cycleData),
    });

    if (!response.ok) {
      throw new Error('Error al crear periodo de evaluación');
    }

    return response.json();
  }

  // Crear evaluación
  async createEvaluation(evaluationData: CreateEvaluationRequest): Promise<ApiResponse<{ evaluationId: number; message: string }>> {
    const response = await fetch(`${API_BASE_URL}/assessments`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(evaluationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear evaluación');
    }

    return data;
  }

  // Obtener evaluaciones de un empleado
  async getEmployeeEvaluations(employeeId: number): Promise<ApiResponse<Evaluation[]>> {
    const response = await fetch(`${API_BASE_URL}/employee/${employeeId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener evaluaciones');
    }

    return response.json();
  }

  // Guardar calificación de criterio
  async saveScore(evaluationId: number, scoreData: ScoreData): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${API_BASE_URL}/ratings/${evaluationId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(scoreData),
    });

    if (!response.ok) {
      throw new Error('Error al guardar calificación');
    }

    return response.json();
  }

  // Enviar evaluación completa
  async submitEvaluation(evaluationId: number, submissionData: SubmitEvaluationData): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${API_BASE_URL}/finalize/${evaluationId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      throw new Error('Error al enviar evaluación');
    }

    return response.json();
  }

  // Obtener criterios de evaluación
  async getCriteria(): Promise<ApiResponse<Criteria[]>> {
    const response = await fetch(`${API_BASE_URL}/metrics`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener criterios');
    }

    return response.json();
  }
}

export const performanceService = new PerformanceService();