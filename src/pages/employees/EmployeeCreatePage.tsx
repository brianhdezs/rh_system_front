import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import EmployeeForm from "../../components/employees/EmployeeForm";
import { useToast } from "../../context/ToastContext";
import { employeeService } from "../../services/EmployeeService";
import type { CreateEmployeeRequest } from "../../types/EmployeeTypes";

interface EmployeeCreatePageProps {
  onNavigateBack: () => void;
}

export default function EmployeeCreatePage({
  onNavigateBack,
}: EmployeeCreatePageProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateEmployeeRequest) => {
    try {
      setIsLoading(true);
      await employeeService.create(data);
      showToast(
        "success",
        "¡Empleado creado exitosamente!",
        `${data.firstName} ${data.lastName} ha sido agregado al sistema`
      );

      // Esperar un momento antes de navegar para que se vea el toast
      setTimeout(() => {
        onNavigateBack();
      }, 1500);
    } catch (err: any) {
      showToast(
        "error",
        "Error al crear empleado",
        err.message || "No se pudo crear el empleado"
      );
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
