import { useState } from "react";
import { Plus, Search, Loader } from "lucide-react";
import { useEmployees } from "../../hooks/UseEmployees";
import { employeeService } from "../../services/EmployeeService";
import EmployeeCard from "../../components/employees/EmployeeCard";
import type { Employee } from "../../types/EmployeeTypes";

interface EmployeesListPageProps {
  onNavigateToCreate: () => void;
  onNavigateToEdit: (employee: Employee) => void;
}

export default function EmployeesListPage({
  onNavigateToCreate,
  onNavigateToEdit,
}: EmployeesListPageProps) {
  const { employees, loading, error, refetch } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar este empleado?")
    ) {
      return;
    }

    try {
      setDeleteLoading(id);
      await employeeService.delete(id);
      refetch();
    } catch (err: any) {
      alert(err.message || "Error al eliminar empleado");
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empleados</h1>
          <p className="text-gray-600 mt-1">
            Gestiona la información de tu equipo
          </p>
        </div>
        <button
          onClick={onNavigateToCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Nuevo Empleado</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar empleados por nombre, email, puesto o departamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total de empleados</span>
          <span className="text-2xl font-bold text-gray-900">
            {employees.length}
          </span>
        </div>
      </div>

      {/* Employee Cards Grid */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <p className="text-gray-500">
            {searchTerm
              ? "No se encontraron empleados"
              : "No hay empleados registrados"}
          </p>
          {!searchTerm && (
            <button
              onClick={onNavigateToCreate}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Agregar Primer Empleado
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className={deleteLoading === employee.id ? "opacity-50" : ""}
            >
              <EmployeeCard
                employee={employee}
                onEdit={onNavigateToEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
