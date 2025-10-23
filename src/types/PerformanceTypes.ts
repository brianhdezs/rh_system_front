export interface EvaluationCycle {
  periodId?: number;
  periodName: string;
  startDate: string;
  endDate: string;
  createdBy?: number;
}

export interface Evaluation {
  evaluationId: number;
  periodId: number;
  periodName: string;
  startDate: string;
  endDate: string;
  employeeId: number;
  evaluatorId: number;
  status: 'Pending' | 'Submitted' | 'Reviewed';
  overallRating?: number;
  comments?: string;
  goals?: string;
  createdDate: string;
  submittedDate?: string;
  reviewedDate?: string;
}

export interface CreateEvaluationRequest {
  periodId: number;
  employeeId: number;
  evaluatorId: number;
}

export interface Criteria {
  criteriaId: number;
  criteriaName: string;
  description: string;
  weight: number;
}

export interface ScoreData {
  criteriaId: number;
  score: number;
  comments: string;
}

export interface SubmitEvaluationData {
  overallRating: number;
  comments: string;
  goals: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}