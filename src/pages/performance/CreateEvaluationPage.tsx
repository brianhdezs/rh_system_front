import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { performanceService } from "../../services/PerformanceService";
import type { EvaluationCycle } from "../../types/PerformanceTypes";

interface CreateEvaluationPageProps {
  onNavigateBack: () => void;
  onNavigateToForm: (evaluationId: number) => void;
}

export default function CreateEvaluationPage({
  onNavigateBack,
  onNavigateToForm,
}: CreateEvaluationPageProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    periodId: "",
    employeeId: "",
    evaluatorId: "",
  });
  const [cycles, setCycles] = useState<EvaluationCycle[]>([]);
  const [loadingCycles, setLoadingCycles] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCycles();
  }, []);

  const loadCycles = async () => {
    try {
      setLoadingCycles(true);
      const response = await performanceService.getAllCycles();
      setCycles(response.data);
    } catch (err: any) {
      showToast(
        "error",
        "Error al cargar periodos",
        err.message || "No se pudieron cargar los periodos"
      );
    } finally {
      setLoadingCycles(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await performanceService.createEvaluation({
        periodId: parseInt(formData.periodId),
        employeeId: parseInt(formData.employeeId),
        evaluatorId: parseInt(formData.evaluatorId),
      });

      if (response.success) {
        showToast(
          "success",
          "Evaluación creada exitosamente",
          `ID de evaluación: ${response.data.evaluationId}`
        );

        // Redirigir al formulario después de un momento
        setTimeout(() => {
          onNavigateToForm(response.data.evaluationId);
        }, 1500);
      }
    } catch (err: any) {
      showToast(
        "error",
        "Error al crear evaluación",
        err.message || "No se pudo crear la evaluación"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropdown de Periodos */}
          <div>
            <label
              htmlFor="periodId"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Periodo de Evaluación
            </label>
            {loadingCycles ? (
              <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg">
                <Loader
                  className="animate-spin text-indigo-600 mr-2"
                  size={20}
                />
                <span className="text-sm text-gray-600">
                  Cargando periodos...
                </span>
              </div>
            ) : cycles.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  No hay periodos disponibles. Por favor, crea un periodo
                  primero.
                </p>
              </div>
            ) : (
              <select
                id="periodId"
                name="periodId"
                value={formData.periodId}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              >
                <option value="">Selecciona un periodo</option>
                {cycles.map((cycle: any) => (
                  <option key={cycle.periodId} value={cycle.periodId}>
                    {cycle.periodName} ({formatDate(cycle.startDate)} -{" "}
                    {formatDate(cycle.endDate)})
                  </option>
                ))}
              </select>
            )}
          </div>

          <Input
            label="ID del Empleado a Evaluar"
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
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={loadingCycles || cycles.length === 0}
            >
              Crear y Continuar
            </Button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          📋 Información
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Selecciona el periodo en el que se realizará la evaluación</li>
          <li>• Ingresa el ID del empleado que será evaluado</li>
          <li>• Ingresa tu ID como evaluador</li>
          <li>• Después de crear, podrás calificar los criterios</li>
        </ul>
      </div>
    </div>
  );
}
