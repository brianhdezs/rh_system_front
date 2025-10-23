import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { performanceService } from "../../services/PerformanceService";

interface CreateEvaluationPageProps {
  onNavigateBack: () => void;
  onNavigateToForm: (evaluationId: number) => void;
}

export default function CreateEvaluationPage({
  onNavigateBack,
  onNavigateToForm,
}: CreateEvaluationPageProps) {
  const [formData, setFormData] = useState({
    periodId: "",
    employeeId: "",
    evaluatorId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);

      const response = await performanceService.createEvaluation({
        periodId: parseInt(formData.periodId),
        employeeId: parseInt(formData.employeeId),
        evaluatorId: parseInt(formData.evaluatorId),
      });

      if (response.success) {
        alert("Evaluación creada exitosamente");
        onNavigateToForm(response.data.evaluationId);
      }
    } catch (err: any) {
      setError(err.message || "Error al crear evaluación");
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
          <h1 className="text-2xl font-bold text-gray-900">Nueva Evaluación</h1>
          <p className="text-gray-600 mt-1">
            Crea una evaluación para un empleado
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="ID del Periodo"
            type="number"
            name="periodId"
            value={formData.periodId}
            onChange={handleChange}
            required
            placeholder="5"
          />

          <Input
            label="ID del Empleado"
            type="number"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
            placeholder="10"
          />

          <Input
            label="ID del Evaluador"
            type="number"
            name="evaluatorId"
            value={formData.evaluatorId}
            onChange={handleChange}
            required
            placeholder="2"
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={onNavigateBack}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Crear y Continuar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
