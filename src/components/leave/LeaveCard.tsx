import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { LeaveRequest } from "../../types/LeaveTypes";

interface LeaveCardProps {
  request: LeaveRequest;
  onApprove?: (requestId: number) => void;
  onReject?: (requestId: number) => void;
  showActions?: boolean;
}

export default function LeaveCard({
  request,
  onApprove,
  onReject,
  showActions,
}: LeaveCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={18} />;
      case "Rejected":
        return <XCircle size={18} />;
      case "Pending":
        return <AlertCircle size={18} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Approved":
        return "Aprobada";
      case "Rejected":
        return "Rechazada";
      case "Pending":
        return "Pendiente";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {request.leaveTypeName}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Solicitud #{request.requestId}
          </p>
        </div>
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full border-2 ${getStatusColor(
            request.status
          )}`}
        >
          {getStatusIcon(request.status)}
          <span className="text-sm font-medium">
            {getStatusText(request.status)}
          </span>
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>
            <strong>Desde:</strong> {formatDate(request.startDate)}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>
            <strong>Hasta:</strong> {formatDate(request.endDate)}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={16} className="mr-2" />
          <span>
            <strong>Total:</strong> {request.totalDays}{" "}
            {request.totalDays === 1 ? "día" : "días"}
          </span>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-500 mb-1">Motivo:</p>
        <p className="text-sm text-gray-700">{request.reason}</p>
      </div>

      {/* Review Info */}
      {request.reviewedBy && (
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <User size={16} className="mr-2" />
            <span>Revisado por: ID #{request.reviewedBy}</span>
          </div>
          {request.reviewedDate && (
            <div className="text-xs text-gray-500">
              Fecha de revisión:{" "}
              {new Date(request.reviewedDate).toLocaleString("es-MX")}
            </div>
          )}
          {request.reviewComments && (
            <div className="bg-blue-50 rounded-lg p-3 mt-2">
              <p className="text-xs text-blue-600 mb-1">
                Comentarios del revisor:
              </p>
              <p className="text-sm text-gray-700">{request.reviewComments}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && request.status === "Pending" && (
        <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onApprove && onApprove(request.requestId)}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Aprobar
          </button>
          <button
            onClick={() => onReject && onReject(request.requestId)}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Rechazar
          </button>
        </div>
      )}

      {/* Requested Date */}
      <div className="text-xs text-gray-400 mt-4">
        Solicitado: {new Date(request.requestedDate).toLocaleString("es-MX")}
      </div>
    </div>
  );
}
