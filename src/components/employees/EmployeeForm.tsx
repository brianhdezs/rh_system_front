import React, { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import type {
  Employee,
  CreateEmployeeRequest,
} from "../../types/EmployeeTypes";

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: CreateEmployeeRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  isLoading,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    hireDate: "",
    position: "",
    department: "",
    salary: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        hireDate: employee.hireDate,
        position: employee.position,
        department: employee.department,
        salary: employee.salary.toString(),
      });
    }
  }, [employee]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "El nombre es requerido";
    if (!formData.lastName.trim())
      newErrors.lastName = "El apellido es requerido";
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validación mejorada de teléfono
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "El teléfono es requerido";
    } else if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "El teléfono debe tener 10 dígitos";
    } else if (formData.phoneNumber.length > 10) {
      newErrors.phoneNumber = "El teléfono no puede tener más de 10 dígitos";
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "El teléfono solo puede contener números";
    }

    if (!formData.hireDate)
      newErrors.hireDate = "La fecha de contratación es requerida";
    if (!formData.position.trim())
      newErrors.position = "El puesto es requerido";
    if (!formData.department.trim())
      newErrors.department = "El departamento es requerido";
    if (!formData.salary || parseFloat(formData.salary) <= 0) {
      newErrors.salary = "El salario debe ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validación especial para teléfono
    if (name === "phoneNumber") {
      // Solo permitir números y máximo 10 dígitos
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData: CreateEmployeeRequest = {
      ...formData,
      salary: parseFloat(formData.salary),
    };

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          placeholder="Juan"
        />

        <Input
          label="Apellido"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          placeholder="Pérez"
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="juan.perez@company.com"
        />

        <Input
          type="tel"
          label="Teléfono"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
          placeholder="5551234567"
          maxLength={10}
        />

        <Input
          label="Fecha de Contratación"
          type="date"
          name="hireDate"
          value={formData.hireDate}
          onChange={handleChange}
          error={errors.hireDate}
        />

        <Input
          label="Puesto"
          name="position"
          value={formData.position}
          onChange={handleChange}
          error={errors.position}
          placeholder="Desarrollador Senior"
        />

        <Input
          label="Departamento"
          name="department"
          value={formData.department}
          onChange={handleChange}
          error={errors.department}
          placeholder="Tecnología"
        />

        <Input
          label="Salario"
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          error={errors.salary}
          placeholder="50000"
          step="0.01"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {employee ? "Actualizar" : "Crear"} Empleado
        </Button>
      </div>
    </form>
  );
}
