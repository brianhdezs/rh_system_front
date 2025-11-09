import React, { useState, useEffect } from "react";
import { Search, Loader, Calendar } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { performanceService } from "../../services/PerformanceService";
import type { EvaluationCycle } from "../../types/PerformanceTypes";

export default function PerformanceCyclesSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cycles, setCycles] = useState<EvaluationCycle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Cargar todos los periodos al inicio
  useEffect(() => {
    loadAllCycles();
  }, []);

  const loadAllCycles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await performanceService.getAllCycles();
      setCycles(response.data);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || "Error al cargar periodos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      loadAllCycles();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(false);

      // Filtrar localmente por ahora (si no hay endpoint de búsqueda en la API)
      const response = await performanceService.getAllCycles();
      const filtered = response.data.filter((cycle) =>
        cycle.periodName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setCycles(filtered);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || "Error al buscar periodos");
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Búsqueda de Periodos de Evaluación
        </h1>
        <p className="text-gray-600 mt-1">
          Busca periodos por nombre o visualiza todos
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre (ej: Agosto, Q4, 2024)"
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

      {/* Results */}
      {searched && !loading && (
        <>
          {cycles.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {searchTerm
                  ? `No se encontraron periodos con "${searchTerm}"`
                  : "No hay periodos creados"}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {cycles.length}{" "}
                  {cycles.length === 1
                    ? "periodo encontrado"
                    : "periodos encontrados"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cycles.map((cycle, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {cycle.periodName}
                        </h3>
                      </div>
                      <Calendar
                        size={24}
                        className="text-indigo-600 flex-shrink-0"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Inicio:</span>
                        <span>{formatDate(cycle.startDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Fin:</span>
                        <span>{formatDate(cycle.endDate)}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Activo
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
