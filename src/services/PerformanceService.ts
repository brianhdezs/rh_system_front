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

// URLs correctas separadas
const EVALUATIONS_API_URL = 'https://hrms-performance-production.up.railway.app/api/Evaluations';
const PERIODS_API_URL = 'https://hrms-performance-production.up.railway.app/api/Periods';

class PerformanceService {
  private getAuthHeaders() {
    const token = storage.getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Health check
  async checkHealth(): Promise<any> {
    const response = await fetch(`${PERIODS_API_URL}/health`);
    if (!response.ok) {
      throw new Error('Error al verificar estado del servicio');
    }
    return response.json();
  }

  // Verificar autenticación
  async verifyAuth(): Promise<any> {
    const response = await fetch(`${PERIODS_API_URL}/test-auth`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error de autenticación');
    }
    return response.json();
  }

  // ===== PERÍODOS =====

  // Crear periodo de evaluación
  async createCycle(cycleData: EvaluationCycle): Promise<ApiResponse<number>> {
    const response = await fetch(PERIODS_API_URL, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(cycleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear periodo de evaluación');
    }

    return response.json();
  }

  // Obtener todos los periodos
  async getAllCycles(): Promise<ApiResponse<EvaluationCycle[]>> {
    const response = await fetch(PERIODS_API_URL, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener periodos');
    }

    return response.json();
  }

  // ===== EVALUACIONES =====

  // Crear evaluación
  async createEvaluation(evaluationData: CreateEvaluationRequest): Promise<ApiResponse<{ evaluationId: number; message: string }>> {
    const response = await fetch(EVALUATIONS_API_URL, {
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
    const response = await fetch(`${EVALUATIONS_API_URL}/employee/${employeeId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener evaluaciones');
    }

    return response.json();
  }

  // Guardar calificación de criterio
  async saveScore(evaluationId: number, scoreData: ScoreData): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${EVALUATIONS_API_URL}/${evaluationId}/scores`, {
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
    const response = await fetch(`${EVALUATIONS_API_URL}/${evaluationId}/submit`, {
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
    const response = await fetch(`${EVALUATIONS_API_URL}/criteria`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener criterios');
    }

    return response.json();
  }
}

export const performanceService = new PerformanceService();