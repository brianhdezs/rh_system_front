import React, { useState } from "react";
import { Search, Loader, Plus, FolderSearch } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import EvaluationCard from "../../components/performance/EvaluationCard";
import { performanceService } from "../../services/PerformanceService";
import type { Evaluation } from "../../types/PerformanceTypes";

interface PerformanceListPageProps {
  onNavigateToCreate: () => void;
  onNavigateToCycles: () => void;
  onNavigateToCyclesSearch: () => void;
}

export default function PerformanceListPage({
  onNavigateToCreate,
  onNavigateToCycles,
  onNavigateToCyclesSearch,
}: PerformanceListPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"employee" | "period">(
    "employee"
  );
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    setError(null);
    setSearched(false);

    try {
      setLoading(true);

      if (searchType === "employee") {
        // Buscar por ID de empleado
        const employeeId = parseInt(searchTerm);
        if (isNaN(employeeId)) {
          throw new Error("El ID del empleado debe ser un número");
        }
        const response = await performanceService.getEmployeeEvaluations(
          employeeId
        );
        setEvaluations(response.data);
      } else {
        // Buscar por nombre de periodo
        // Primero obtener todos los ciclos
        const cyclesResponse = await performanceService.getAllCycles();
        const matchingCycles = cyclesResponse.data.filter((cycle: any) =>
          cycle.periodName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (matchingCycles.length === 0) {
          setEvaluations([]);
        } else {
          // Por ahora, mostrar mensaje que se encontraron los periodos
          // En una implementación completa, necesitarías un endpoint que obtenga
          // evaluaciones por periodId
          setError(
            `Se encontraron ${matchingCycles.length} periodo(s) con "${searchTerm}". ` +
              "Para ver evaluaciones específicas, busca por ID de empleado."
          );
          setEvaluations([]);
        }
      }

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
          <Button variant="secondary" onClick={onNavigateToCyclesSearch}>
            <FolderSearch size={20} className="mr-2" />
            Buscar Periodos
          </Button>
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
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Selector de tipo de búsqueda */}
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="employee"
                checked={searchType === "employee"}
                onChange={(e) =>
                  setSearchType(e.target.value as "employee" | "period")
                }
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Buscar por Empleado
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                value="period"
                checked={searchType === "period"}
                onChange={(e) =>
                  setSearchType(e.target.value as "employee" | "period")
                }
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Buscar por Periodo
              </span>
            </label>
          </div>

          {/* Campo de búsqueda */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                type={searchType === "employee" ? "number" : "text"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  searchType === "employee"
                    ? "Ingresa el ID del empleado (ej: 10)"
                    : "Ingresa el nombre del periodo (ej: Agosto 2025)"
                }
                required
              />
            </div>
            <Button type="submit" isLoading={loading}>
              <Search size={20} className="mr-2" />
              Buscar
            </Button>
          </div>
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
              <Search size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {searchType === "employee"
                  ? "No se encontraron evaluaciones para este empleado"
                  : "No se encontraron evaluaciones para este periodo"}
              </p>
              <button
                onClick={onNavigateToCreate}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Crear Nueva Evaluación
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Resultados de Búsqueda
                </h2>
                <span className="text-sm text-gray-600">
                  {evaluations.length}{" "}
                  {evaluations.length === 1
                    ? "evaluación encontrada"
                    : "evaluaciones encontradas"}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {evaluations.map((evaluation) => (
                  <EvaluationCard
                    key={evaluation.evaluationId}
                    evaluation={evaluation}
                  />
                ))}
              </div>
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
          <p className="text-gray-600 mb-4">
            Selecciona el tipo de búsqueda e ingresa el criterio
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <strong>Por Empleado:</strong> Busca por ID
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <strong>Por Periodo:</strong> Busca por nombre
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
