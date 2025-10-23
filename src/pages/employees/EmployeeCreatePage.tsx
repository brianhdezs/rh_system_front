import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import EmployeeForm from "../../components/employees/EmployeeForm";
import { employeeService } from "../../services/EmployeeService";
import type { CreateEmployeeRequest } from "../../types/EmployeeTypes";

interface EmployeeCreatePageProps {
  onNavigateBack: () => void;
}

export default function EmployeeCreatePage({
  onNavigateBack,
}: EmployeeCreatePageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateEmployeeRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await employeeService.create(data);
      alert("Empleado creado exitosamente");
      onNavigateBack();
    } catch (err: any) {
      setError(err.message || "Error al crear empleado");
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
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Empleado</h1>
          <p className="text-gray-600 mt-1">
            Completa la información del nuevo empleado
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
        <EmployeeForm
          onSubmit={handleSubmit}
          onCancel={onNavigateBack}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
