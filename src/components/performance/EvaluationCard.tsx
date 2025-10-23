import { Calendar, User, Star, FileText } from "lucide-react";
import type { Evaluation } from "../../types/PerformanceTypes";

interface EvaluationCardProps {
  evaluation: Evaluation;
  onView?: (evaluation: Evaluation) => void;
}

export default function EvaluationCard({
  evaluation,
  onView,
}: EvaluationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Reviewed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Pending":
        return "Pendiente";
      case "Submitted":
        return "Enviada";
      case "Reviewed":
        return "Revisada";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {evaluation.periodName}
          </h3>
          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
            <Calendar size={16} />
            <span>
              {new Date(evaluation.startDate).toLocaleDateString("es-MX")} -{" "}
              {new Date(evaluation.endDate).toLocaleDateString("es-MX")}
            </span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            evaluation.status
          )}`}
        >
          {getStatusText(evaluation.status)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <User size={16} className="mr-2" />
          <span>Evaluador ID: {evaluation.evaluatorId}</span>
        </div>

        {evaluation.overallRating && (
          <div className="flex items-center text-sm">
            <Star size={16} className="mr-2 text-yellow-500" />
            <span className="font-semibold text-gray-900">
              Calificación: {evaluation.overallRating.toFixed(1)} / 5.0
            </span>
          </div>
        )}

        {evaluation.comments && (
          <div className="flex items-start text-sm text-gray-600">
            <FileText size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <p className="line-clamp-2">{evaluation.comments}</p>
          </div>
        )}
      </div>

      {onView && (
        <button
          onClick={() => onView(evaluation)}
          className="mt-4 w-full py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
        >
          Ver Detalles
        </button>
      )}
    </div>
  );
}
