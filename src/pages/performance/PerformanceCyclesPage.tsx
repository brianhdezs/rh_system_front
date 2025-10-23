import React, { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { performanceService } from "../../services/PerformanceService";
import type { EvaluationCycle } from "../../types/PerformanceTypes";

interface PerformanceCyclesPageProps {
  onNavigateBack: () => void;
}

export default function PerformanceCyclesPage({
  onNavigateBack,
}: PerformanceCyclesPageProps) {
  const [formData, setFormData] = useState({
    periodName: "",
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setIsLoading(true);

      const cycleData: EvaluationCycle = {
        periodName: formData.periodName,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      const response = await performanceService.createCycle(cycleData);

      if (response.success) {
        setSuccess(true);
        setFormData({ periodName: "", startDate: "", endDate: "" });
        alert("Periodo creado exitosamente");
      }
    } catch (err: any) {
      setError(err.message || "Error al crear periodo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onNavigateBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ciclos de Evaluación
          </h1>
          <p className="text-gray-600 mt-1">
            Crea y administra periodos de evaluación
          </p>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">Periodo creado exitosamente</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Crear Nuevo Periodo
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nombre del Periodo"
            name="periodName"
            value={formData.periodName}
            onChange={handleChange}
            required
            placeholder="Ej: Evaluación Q4 2024"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Fecha de Inicio"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            <Input
              label="Fecha de Fin"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={onNavigateBack}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              <Plus size={20} className="mr-2" />
              Crear Periodo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
