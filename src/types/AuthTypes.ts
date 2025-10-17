export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  RoleId: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    email: string;
    fullName: string;
    role: string;
    expiresAt: string;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors: string[];
}

export interface User {
  userId: number;
  email: string;
  fullName: string;
  role: string;
}