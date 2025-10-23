export interface AttendanceRecord {
  attendanceId: number;
  employeeId: number;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  hoursWorked: number | null;
  status: 'Present' | 'Absent' | 'Late' | 'Early';
  notes: string | null;
  createdDate: string;
}

export interface CheckInRequest {
  employeeId: number;
}

export interface CheckOutRequest {
  employeeId: number;
}

export interface CheckInResponse {
  attendanceId: number;
  message: string;
  checkInTime: string;
}

export interface CheckOutResponse {
  message: string;
  hoursWorked: number;
  checkOutTime: string;
}

export interface UserStatus {
  userId: string;
  email: string;
  name: string;
  role: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface AttendanceFilters {
  startDate?: string;
  endDate?: string;
}