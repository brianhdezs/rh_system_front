import { Calendar, Clock, User, CheckCircle, XCircle } from "lucide-react";
import type { AttendanceRecord } from "../../types/AttendanceTypes";

interface AttendanceCardProps {
  record: AttendanceRecord;
}

export default function AttendanceCard({ record }: AttendanceCardProps) {
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "N/A";
    return new Date(timeString).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      case "Late":
        return "bg-yellow-100 text-yellow-800";
      case "Early":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Present":
        return "Presente";
      case "Absent":
        return "Ausente";
      case "Late":
        return "Tarde";
      case "Early":
        return "Temprano";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <User size={24} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Empleado #{record.employeeId}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Calendar size={14} className="mr-1" />
              {formatDate(record.date)}
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            record.status
          )}`}
        >
          {getStatusText(record.status)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-start space-x-2">
          {record.checkInTime ? (
            <CheckCircle size={18} className="text-green-500 mt-0.5" />
          ) : (
            <XCircle size={18} className="text-gray-300 mt-0.5" />
          )}
          <div>
            <p className="text-xs text-gray-500">Entrada</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatTime(record.checkInTime)}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          {record.checkOutTime ? (
            <CheckCircle size={18} className="text-green-500 mt-0.5" />
          ) : (
            <XCircle size={18} className="text-gray-300 mt-0.5" />
          )}
          <div>
            <p className="text-xs text-gray-500">Salida</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatTime(record.checkOutTime)}
            </p>
          </div>
        </div>
      </div>

      {record.hoursWorked !== null && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-2" />
              Horas Trabajadas
            </div>
            <span className="text-lg font-bold text-indigo-600">
              {record.hoursWorked.toFixed(2)} hrs
            </span>
          </div>
        </div>
      )}

      {record.notes && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">Notas:</p>
          <p className="text-sm text-gray-700 mt-1">{record.notes}</p>
        </div>
      )}
    </div>
  );
}
