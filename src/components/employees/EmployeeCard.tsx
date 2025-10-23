import { Mail, Phone, Calendar, Briefcase, Edit, Trash2 } from "lucide-react";
import type { Employee } from "../../types/EmployeeTypes";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

export default function EmployeeCard({
  employee,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {getInitials(employee.firstName, employee.lastName)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-500">{employee.position}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(employee)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(employee.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Mail size={16} className="mr-2" />
          {employee.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone size={16} className="mr-2" />
          {employee.phoneNumber}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Briefcase size={16} className="mr-2" />
          {employee.department}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2" />
          {new Date(employee.hireDate).toLocaleDateString("es-MX")}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Salario</span>
          <span className="text-lg font-semibold text-gray-900">
            ${employee.salary.toLocaleString("es-MX")}
          </span>
        </div>
      </div>
    </div>
  );
}
