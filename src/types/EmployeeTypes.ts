export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hireDate: string;
  position: string;
  department: string;
  salary: number;
  isActive: boolean;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hireDate: string;
  position: string;
  department: string;
  salary: number;
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
  id: number;
  isActive: boolean;
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: string;
  message: string;
}