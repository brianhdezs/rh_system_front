import React, { useState } from "react";
import { Loader } from "lucide-react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useLeaveTypes } from "../../hooks/useLeave";
import type { CreateLeaveRequest } from "../../types/LeaveTypes";

interface LeaveRequestFormProps {
  employeeId: number;
  onSubmit: (data: CreateLeaveRequest) => Promise<void>;
  onCancel: () => void;
}

export default function LeaveRequestForm({
  employeeId,
  onSubmit,
  onCancel,
}: LeaveRequestFormProps) {
  const { leaveTypes, loading: loadingTypes } = useLeaveTypes();

  const [formData, setFormData] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const totalDays = calculateDays(formData.startDate, formData.endDate);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.leaveTypeId)
      newErrors.leaveTypeId = "Selecciona un tipo de permiso";
    if (!formData.startDate)
      newErrors.startDate = "La fecha de inicio es requerida";
    if (!formData.endDate) newErrors.endDate = "La fecha de fin es requerida";
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate =
          "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }
    if (!formData.reason.trim()) newErrors.reason = "El motivo es requerido";
    if (formData.reason.length > 1000)
      newErrors.reason = "El motivo no puede exceder 1000 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const requestData: CreateLeaveRequest = {
        employeeId,
        leaveTypeId: parseInt(formData.leaveTypeId),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate + "T23:59:59").toISOString(),
        totalDays,
        reason: formData.reason,
      };

      await onSubmit(requestData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingTypes) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Permiso
        </label>
        <select
          name="leaveTypeId"
          value={formData.leaveTypeId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Selecciona un tipo</option>
          {leaveTypes.map((type) => (
            <option key={type.leaveTypeId} value={type.leaveTypeId}>
              {type.typeName} ({type.defaultDays} días)
            </option>
          ))}
        </select>
        {errors.leaveTypeId && (
          <p className="text-sm text-red-600 mt-1">{errors.leaveTypeId}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Fecha de Inicio"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          error={errors.startDate}
          min={new Date().toISOString().split("T")[0]}
        />

        <Input
          label="Fecha de Fin"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          error={errors.endDate}
          min={formData.startDate || new Date().toISOString().split("T")[0]}
        />
      </div>

      {totalDays > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-indigo-800">
            <strong>Total de días solicitados:</strong> {totalDays}{" "}
            {totalDays === 1 ? "día" : "días"}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Motivo de la Solicitud
        </label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={4}
          maxLength={1000}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Describe el motivo de tu solicitud..."
        />
        <div className="flex justify-between mt-1">
          {errors.reason && (
            <p className="text-sm text-red-600">{errors.reason}</p>
          )}
          <p className="text-xs text-gray-500 ml-auto">
            {formData.reason.length}/1000 caracteres
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Enviar Solicitud
        </Button>
      </div>
    </form>
  );
}
