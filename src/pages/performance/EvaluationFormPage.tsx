import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Send, Loader } from "lucide-react";
import Button from "../../components/ui/Button";
import CriteriaRating from "../../components/performance/CriteriaRating";
import { performanceService } from "../../services/PerformanceService";
import { useCriteria } from "../../hooks/UsePerformance";
import type { ScoreData } from "../../types/PerformanceTypes";

interface EvaluationFormPageProps {
  evaluationId: number;
  onNavigateBack: () => void;
}

export default function EvaluationFormPage({
  evaluationId,
  onNavigateBack,
}: EvaluationFormPageProps) {
  const {
    criteria,
    loading: loadingCriteria,
    error: criteriaError,
  } = useCriteria();

  const [scores, setScores] = useState<
    Record<number, { score: number; comments: string }>
  >({});
  const [finalData, setFinalData] = useState({
    overallRating: "",
    comments: "",
    goals: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Inicializar scores vacíos
    const initialScores: Record<number, { score: number; comments: string }> =
      {};
    criteria.forEach((criterion) => {
      initialScores[criterion.criteriaId] = { score: 0, comments: "" };
    });
    setScores(initialScores);
  }, [criteria]);

  const handleScoreChange = (criteriaId: number, score: number) => {
    setScores((prev) => ({
      ...prev,
      [criteriaId]: { ...prev[criteriaId], score },
    }));
  };

  const handleCommentsChange = (criteriaId: number, comments: string) => {
    setScores((prev) => ({
      ...prev,
      [criteriaId]: { ...prev[criteriaId], comments },
    }));
  };

  const handleSaveProgress = async () => {
    setError(null);
    setSaveSuccess(false);

    try {
      setIsSaving(true);

      // Guardar todas las calificaciones
      for (const criteriaId in scores) {
        const scoreData: ScoreData = {
          criteriaId: parseInt(criteriaId),
          score: scores[criteriaId].score,
          comments: scores[criteriaId].comments,
        };

        if (scoreData.score > 0) {
          await performanceService.saveScore(evaluationId, scoreData);
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Error al guardar progreso");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar que todos los criterios estén calificados
    const allRated = Object.values(scores).every((s) => s.score > 0);
    if (!allRated) {
      setError("Por favor califica todos los criterios antes de enviar");
      return;
    }

    if (!finalData.overallRating || parseFloat(finalData.overallRating) <= 0) {
      setError("Por favor ingresa la calificación general");
      return;
    }

    try {
      setIsSubmitting(true);

      // Primero guardar todas las calificaciones
      await handleSaveProgress();

      // Luego enviar la evaluación final
      await performanceService.submitEvaluation(evaluationId, {
        overallRating: parseFloat(finalData.overallRating),
        comments: finalData.comments,
        goals: finalData.goals,
      });

      alert("Evaluación enviada exitosamente");
      onNavigateBack();
    } catch (err: any) {
      setError(err.message || "Error al enviar evaluación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAverageScore = () => {
    const validScores = Object.values(scores).filter((s) => s.score > 0);
    if (validScores.length === 0) return 0;
    const sum = validScores.reduce((acc, s) => acc + s.score, 0);
    return (sum / validScores.length).toFixed(2);
  };

  if (loadingCriteria) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (criteriaError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">{criteriaError}</p>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onNavigateBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Formulario de Evaluación #{evaluationId}
            </h1>
            <p className="text-gray-600 mt-1">
              Califica cada criterio y completa la evaluación
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-600">Promedio Actual</div>
          <div className="text-3xl font-bold text-indigo-600">
            {calculateAverageScore()}
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">✓ Progreso guardado exitosamente</p>
        </div>
      )}

      {/* Criteria Ratings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Criterios de Evaluación
          </h2>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveProgress}
            isLoading={isSaving}
          >
            <Save size={18} className="mr-2" />
            Guardar Progreso
          </Button>
        </div>

        {criteria.map((criterion) => (
          <CriteriaRating
            key={criterion.criteriaId}
            criteria={criterion}
            score={scores[criterion.criteriaId]?.score || 0}
            comments={scores[criterion.criteriaId]?.comments || ""}
            onScoreChange={(score) =>
              handleScoreChange(criterion.criteriaId, score)
            }
            onCommentsChange={(comments) =>
              handleCommentsChange(criterion.criteriaId, comments)
            }
          />
        ))}
      </div>

      {/* Final Evaluation Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          Evaluación Final
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación General (0-5)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={finalData.overallRating}
            onChange={(e) =>
              setFinalData((prev) => ({
                ...prev,
                overallRating: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="4.5"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Promedio calculado: {calculateAverageScore()}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentarios Generales
          </label>
          <textarea
            value={finalData.comments}
            onChange={(e) =>
              setFinalData((prev) => ({ ...prev, comments: e.target.value }))
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Comentarios sobre el desempeño general del empleado..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objetivos para el Próximo Periodo
          </label>
          <textarea
            value={finalData.goals}
            onChange={(e) =>
              setFinalData((prev) => ({ ...prev, goals: e.target.value }))
            }
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="1. Objetivo 1&#10;2. Objetivo 2&#10;3. Objetivo 3"
            required
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onNavigateBack}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            <Send size={18} className="mr-2" />
            Enviar Evaluación
          </Button>
        </div>
      </form>
    </div>
  );
}
