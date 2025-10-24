import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../AuthService';
import { storage } from '../../utils/storage';

describe('AuthService', () => {
  beforeEach(() => {
    storage.clearAuth();
  });

  describe('login', () => {
    it('debe autenticar con credenciales válidas', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await authService.login(credentials);

      expect(response.success).toBe(true);
      expect(response.message).toBe('Login exitoso');
      expect(response.data.accessToken).toBe('mock-access-token');
      expect(response.data.email).toBe('test@example.com');
      expect(response.data.fullName).toBe('Usuario Test');
    });

    it('debe fallar con credenciales inválidas', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(credentials)).rejects.toThrow(
        'Credenciales inválidas'
      );
    });
  });

  describe('register', () => {
    it('debe registrar un nuevo usuario exitosamente', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'Nuevo',
        lastName: 'Usuario',
        RoleId: 2,
      };

      const response = await authService.register(userData);

      expect(response.success).toBe(true);
      expect(response.message).toBe('Usuario registrado exitosamente');
      expect(response.data.email).toBe(userData.email);
      expect(response.data.fullName).toBe('Nuevo Usuario');
    });
  });
});