export interface LeaveRequest {
  requestId: number;
  employeeId: number;
  leaveTypeId: number;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedDate: string;
  reviewedBy?: number;
  reviewedDate?: string;
  reviewComments?: string;
}

export interface CreateLeaveRequest {
  employeeId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
}

export interface ReviewLeaveRequest {
  reviewedBy: number;
  comments?: string;
}

export interface LeaveBalance {
  balanceId: number;
  employeeId: number;
  leaveTypeId: number;
  leaveTypeName: string;
  year: number;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  lastUpdated: string;
}

export interface LeaveType {
  leaveTypeId: number;
  typeName: string;
  description: string | null;
  defaultDays: number;
  requiresApproval: boolean;
  isActive: boolean;
}

export interface UserInfo {
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