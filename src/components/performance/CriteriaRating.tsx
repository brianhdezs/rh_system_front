import { Star } from "lucide-react";
import type { Criteria } from "../../types/PerformanceTypes";

interface CriteriaRatingProps {
  criteria: Criteria;
  score: number;
  comments: string;
  onScoreChange: (score: number) => void;
  onCommentsChange: (comments: string) => void;
}

export default function CriteriaRating({
  criteria,
  score,
  comments,
  onScoreChange,
  onCommentsChange,
}: CriteriaRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {criteria.criteriaName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>
          </div>
          <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Peso: {criteria.weight}%
          </span>
        </div>

        {/* Star Rating */}
        <div className="flex items-center space-x-2 my-4">
          <span className="text-sm font-medium text-gray-700 mr-2">
            Calificación:
          </span>
          {stars.map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onScoreChange(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={
                  star <= score
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
          <span className="ml-3 text-lg font-semibold text-gray-900">
            {score > 0 ? `${score}.0` : "Sin calificar"}
          </span>
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentarios
          </label>
          <textarea
            value={comments}
            onChange={(e) => onCommentsChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Agrega comentarios sobre este criterio..."
          />
        </div>
      </div>
    </div>
  );
}
