import React, { useState } from "react";
import { Search, Loader, Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import EvaluationCard from "../../components/performance/EvaluationCard";
import { performanceService } from "../../services/PerformanceService";
import type { Evaluation } from "../../types/PerformanceTypes";

interface PerformanceListPageProps {
  onNavigateToCreate: () => void;
  onNavigateToCycles: () => void;
}

export default function PerformanceListPage({
  onNavigateToCreate,
  onNavigateToCycles,
}: PerformanceListPageProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;

    setError(null);
    setSearched(false);

    try {
      setLoading(true);
      const response = await performanceService.getEmployeeEvaluations(
        parseInt(employeeId)
      );
      setEvaluations(response.data);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || "Error al buscar evaluaciones");
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = evaluations.length;
    const pending = evaluations.filter((e) => e.status === "Pending").length;
    const submitted = evaluations.filter(
      (e) => e.status === "Submitted"
    ).length;
    const reviewed = evaluations.filter((e) => e.status === "Reviewed").length;

    const ratingsWithScores = evaluations.filter((e) => e.overallRating);
    const avgRating =
      ratingsWithScores.length > 0
        ? (
            ratingsWithScores.reduce(
              (acc, e) => acc + (e.overallRating || 0),
              0
            ) / ratingsWithScores.length
          ).toFixed(2)
        : "0.00";

    return { total, pending, submitted, reviewed, avgRating };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Evaluaciones de Desempeño
          </h1>
          <p className="text-gray-600 mt-1">
            Busca y gestiona las evaluaciones de empleados
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={onNavigateToCycles}>
            Crear Periodo
          </Button>
          <Button onClick={onNavigateToCreate}>
            <Plus size={20} className="mr-2" />
            Nueva Evaluación
          </Button>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <Input
              id="employeeId"
              name="employeeId"
              type="number"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Ingresa el ID del empleado"
              className="text-base"
              required
            />
          </div>
          <Button type="submit" isLoading={loading}>
            <Search size={20} className="mr-2" />
            Buscar
          </Button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-indigo-600" size={48} />
        </div>
      )}

      {/* Stats */}
      {searched && !loading && evaluations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="text-sm text-yellow-800">Pendientes</div>
            <div className="text-2xl font-bold text-yellow-900">
              {stats.pending}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">Enviadas</div>
            <div className="text-2xl font-bold text-blue-900">
              {stats.submitted}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-sm text-green-800">Revisadas</div>
            <div className="text-2xl font-bold text-green-900">
              {stats.reviewed}
            </div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <div className="text-sm text-indigo-800">Promedio</div>
            <div className="text-2xl font-bold text-indigo-900">
              {stats.avgRating}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {searched && !loading && (
        <>
          {evaluations.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <p className="text-gray-500">
                No se encontraron evaluaciones para este empleado
              </p>
              <button
                onClick={onNavigateToCreate}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Crear Primera Evaluación
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evaluations.map((evaluation) => (
                <EvaluationCard
                  key={evaluation.evaluationId}
                  evaluation={evaluation}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!searched && !loading && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-12 text-center border border-indigo-100">
          <Search size={64} className="mx-auto text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Busca Evaluaciones
          </h3>
          <p className="text-gray-600">
            Ingresa el ID de un empleado para ver sus evaluaciones de desempeño
          </p>
        </div>
      )}
    </div>
  );
}
