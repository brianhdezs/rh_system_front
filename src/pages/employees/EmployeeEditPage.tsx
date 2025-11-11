import { useState, useEffect } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import EmployeeForm from "../../components/employees/EmployeeForm";
import { useToast } from "../../context/ToastContext";
import { employeeService } from "../../services/EmployeeService";
import type {
  Employee,
  CreateEmployeeRequest,
} from "../../types/EmployeeTypes";

interface EmployeeEditPageProps {
  employeeId: number;
  onNavigateBack: () => void;
}

export default function EmployeeEditPage({
  employeeId,
  onNavigateBack,
}: EmployeeEditPageProps) {
  const { showToast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getById(employeeId);
        setEmployee(data);
      } catch (err: any) {
        const errorMsg = err.message || "Error al cargar empleado";
        setError(errorMsg);
        showToast("error", "Error", errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleSubmit = async (data: CreateEmployeeRequest) => {
    if (!employee) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await employeeService.update(employeeId, {
        ...data,
        id: employee.id,
        isActive: employee.isActive,
      });
      showToast(
        "success",
        "¡Empleado actualizado!",
        `La información de ${data.firstName} ${data.lastName} ha sido actualizada`
      );

      // Esperar un momento antes de navegar para que se vea el toast
      setTimeout(() => {
        onNavigateBack();
      }, 1500);
    } catch (err: any) {
      showToast(
        "error",
        "Error al actualizar",
        err.message || "No se pudo actualizar el empleado"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (error && !employee) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">{error}</p>
        <button
          onClick={onNavigateBack}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Volver
        </button>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Editar Empleado</h1>
          <p className="text-gray-600 mt-1">
            Actualiza la información de {employee?.firstName}{" "}
            {employee?.lastName}
          </p>
        </div>
      </div>

      {/* Form */}
      {employee && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <EmployeeForm
            employee={employee}
            onSubmit={handleSubmit}
            onCancel={onNavigateBack}
            isLoading={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
