import React, { useState } from "react";
import { Search, Loader, Calendar, Download } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AttendanceCard from "../../components/attendance/AttendanceCard";
import AttendanceStats from "../../components/attendance/AttendanceStats";
import { attendanceService } from "../../services/AttendanceService";
import type {
  AttendanceRecord,
  AttendanceFilters,
} from "../../types/AttendanceTypes";

export default function AttendanceHistoryPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [filters, setFilters] = useState<AttendanceFilters>({
    startDate: "",
    endDate: "",
  });
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
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
      const response = await attendanceService.getHistory(
        parseInt(employeeId),
        filters.startDate || filters.endDate ? filters : undefined
      );
      setRecords(response.data);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || "Error al buscar historial");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleExport = () => {
    if (records.length === 0) return;

    const csv = [
      ["ID", "Empleado", "Fecha", "Entrada", "Salida", "Horas", "Estado"].join(
        ","
      ),
      ...records.map((r) =>
        [
          r.attendanceId,
          r.employeeId,
          r.date,
          r.checkInTime || "N/A",
          r.checkOutTime || "N/A",
          r.hoursWorked?.toFixed(2) || "N/A",
          r.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historial-empleado-${employeeId}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Historial de Asistencias
          </h1>
          <p className="text-gray-600 mt-1">
            Consulta el registro de asistencias por empleado
          </p>
        </div>
        {records.length > 0 && (
          <Button variant="secondary" onClick={handleExport}>
            <Download size={20} className="mr-2" />
            Exportar CSV
          </Button>
        )}
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="ID del empleado"
              required
            />
            <Input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              placeholder="Fecha inicio"
            />
            <Input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              placeholder="Fecha fin"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" isLoading={loading}>
              <Search size={20} className="mr-2" />
              Buscar Historial
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
      {searched && !loading && records.length > 0 && (
        <AttendanceStats records={records} />
      )}

      {/* Results */}
      {searched && !loading && (
        <>
          {records.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                No se encontraron registros de asistencia
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Intenta con diferentes fechas o verifica el ID del empleado
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Registros Encontrados ({records.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {records.map((record) => (
                  <AttendanceCard key={record.attendanceId} record={record} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!searched && !loading && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-12 text-center border border-blue-100">
          <Search size={64} className="mx-auto text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Buscar Historial
          </h3>
          <p className="text-gray-600">
            Ingresa el ID de un empleado para ver su historial de asistencias
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Opcionalmente puedes filtrar por rango de fechas
          </p>
        </div>
      )}
    </div>
  );
}
