import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/AuthService";
import { storage } from "../utils/storage";
import type { User, LoginRequest, RegisterRequest } from "../types/AuthTypes";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado al cargar la app
    const savedUser = storage.getUser();
    if (savedUser && storage.isAuthenticated()) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);

    // Guardar tokens y usuario
    storage.setTokens(response.data.accessToken, response.data.refreshToken);

    const userData: User = {
      userId: response.data.userId,
      email: response.data.email,
      fullName: response.data.fullName,
      role: response.data.role,
    };

    storage.setUser(userData);
    setUser(userData);
  };

  const register = async (userData: RegisterRequest) => {
    const response = await authService.register(userData);

    // Guardar tokens y usuario
    storage.setTokens(response.data.accessToken, response.data.refreshToken);

    const user: User = {
      userId: response.data.userId,
      email: response.data.email,
      fullName: response.data.fullName,
      role: response.data.role,
    };

    storage.setUser(user);
    setUser(user);
  };

  const logout = () => {
    storage.clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
