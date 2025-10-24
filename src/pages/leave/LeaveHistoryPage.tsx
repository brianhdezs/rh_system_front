import React, { useState } from "react";
import { Search, Loader, Filter } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LeaveCard from "../../components/leave/LeaveCard";
import { useLeaveRequests } from "../../hooks/useLeave";

export default function LeaveHistoryPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { requests, loading, error } = useLeaveRequests(selectedEmployeeId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId) {
      setSelectedEmployeeId(parseInt(employeeId));
    }
  };

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "Pending").length,
    approved: requests.filter((r) => r.status === "Approved").length,
    rejected: requests.filter((r) => r.status === "Rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Historial de Solicitudes
        </h1>
        <p className="text-gray-600 mt-1">
          Consulta todas las solicitudes de un empleado
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <Input
              type="number"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="ID del empleado"
              required
            />
          </div>
          <Button type="submit">
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
      {selectedEmployeeId && !loading && requests.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-sm text-green-800">Aprobadas</div>
            <div className="text-2xl font-bold text-green-900">
              {stats.approved}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-sm text-red-800">Rechazadas</div>
            <div className="text-2xl font-bold text-red-900">
              {stats.rejected}
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      {selectedEmployeeId && !loading && requests.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4">
            <Filter size={20} className="text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Todas las solicitudes</option>
              <option value="Pending">Pendientes</option>
              <option value="Approved">Aprobadas</option>
              <option value="Rejected">Rechazadas</option>
            </select>
            <span className="text-sm text-gray-600">
              Mostrando {filteredRequests.length} de {requests.length}{" "}
              solicitudes
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      {selectedEmployeeId && !loading && (
        <>
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <Search size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {requests.length === 0
                  ? "No se encontraron solicitudes para este empleado"
                  : "No hay solicitudes con el filtro seleccionado"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Solicitudes ({filteredRequests.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <LeaveCard key={request.requestId} request={request} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!selectedEmployeeId && !loading && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-12 text-center border border-indigo-100">
          <Search size={64} className="mx-auto text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Buscar Historial
          </h3>
          <p className="text-gray-600">
            Ingresa el ID de un empleado para ver su historial de solicitudes
          </p>
        </div>
      )}
    </div>
  );
}
