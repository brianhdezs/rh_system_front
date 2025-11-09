import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

interface RegisterProps {
  onNavigateToLogin?: () => void;
}

export default function Register({ onNavigateToLogin }: RegisterProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    RoleId: 2, // Usuario por defecto
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validaciones de contraseña en tiempo real
  const passwordValidations: Record<string, boolean> = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_-]/.test(formData.password),
    passwordsMatch: Boolean(
      formData.password && formData.password === formData.confirmPassword
    ),
  };

  const isPasswordValid = Object.values(passwordValidations).every(Boolean);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "RoleId" ? parseInt(value) : value,
    }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    if (!isPasswordValid) {
      setApiError(
        "Por favor, cumple con todos los requisitos de la contraseña"
      );
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      // El AuthContext redirigirá automáticamente si el registro es exitoso
    } catch (err: any) {
      setApiError(err.message || "Error al registrar usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Crea tu cuenta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {apiError && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-800">{apiError}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="firstName"
              name="firstName"
              type="text"
              label="Nombre"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              placeholder="Juan"
            />

            <Input
              id="lastName"
              name="lastName"
              type="text"
              label="Apellido"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              placeholder="Pérez"
            />
          </div>

          <Input
            id="email"
            name="email"
            type="email"
            label="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            placeholder="tu@email.com"
          />

          {/* Password Field with Toggle */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Contraseña (mínimo 8 caracteres)
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="••••••••"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field with Toggle */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="••••••••"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          {formData.password && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Requisitos de la contraseña:
              </p>
              <div className="space-y-1">
                <ValidationItem
                  isValid={passwordValidations.minLength}
                  text="Mínimo 8 caracteres"
                />
                <ValidationItem
                  isValid={passwordValidations.hasUpperCase}
                  text="Al menos una letra mayúscula"
                />
                <ValidationItem
                  isValid={passwordValidations.hasLowerCase}
                  text="Al menos una letra minúscula"
                />
                <ValidationItem
                  isValid={passwordValidations.hasNumber}
                  text="Al menos un número"
                />
                <ValidationItem
                  isValid={passwordValidations.hasSpecialChar}
                  text="Al menos un carácter especial (!@#$%...)"
                />
              </div>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            {formData.confirmPassword && (
              <ValidationItem
                isValid={passwordValidations.passwordsMatch}
                text="Las contraseñas coinciden"
              />
            )}
          </div>
          <div>
            <label
              htmlFor="RoleId"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Tipo de cuenta
            </label>
            <select
              id="RoleId"
              name="RoleId"
              value={formData.RoleId}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            >
              <option value={2}>Usuario</option>
              <option value={1}>Administrador</option>
            </select>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!isPasswordValid && formData.password.length > 0}
          >
            Crear cuenta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}

// Componente auxiliar para mostrar validaciones
interface ValidationItemProps {
  isValid: boolean;
  text: string;
}

function ValidationItem({ isValid, text }: ValidationItemProps) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      {isValid ? (
        <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
      ) : (
        <XCircle size={16} className="text-gray-400 flex-shrink-0" />
      )}
      <span className={isValid ? "text-green-700" : "text-gray-600"}>
        {text}
      </span>
    </div>
  );
}
