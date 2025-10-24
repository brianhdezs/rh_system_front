import React, { useState } from "react";
import { Search, Loader, Calendar, TrendingUp } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LeaveBalanceCard from "../../components/leave/LeaveBalanceCard";
import { useLeaveBalance } from "../../hooks/useLeave";

export default function LeaveBalancePage() {
  const [employeeId, setEmployeeId] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );

  const { balance, loading, error } = useLeaveBalance(
    selectedEmployeeId,
    selectedYear
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId) {
      setSelectedEmployeeId(parseInt(employeeId));
    }
  };

  const totalDaysAvailable = balance.reduce((sum, b) => sum + b.totalDays, 0);
  const totalDaysUsed = balance.reduce((sum, b) => sum + b.usedDays, 0);
  const totalDaysRemaining = balance.reduce(
    (sum, b) => sum + b.remainingDays,
    0
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Balance de Vacaciones
        </h1>
        <p className="text-gray-600 mt-1">
          Consulta los días disponibles por empleado
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                type="number"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="ID del empleado"
                required
              />
            </div>
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    Año {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              <Search size={20} className="mr-2" />
              Consultar Balance
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

      {/* Summary Stats */}
      {selectedEmployeeId && !loading && balance.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                Resumen General - Año {selectedYear}
              </h2>
              <p className="text-indigo-100 mt-1">
                Empleado #{selectedEmployeeId}
              </p>
            </div>
            <TrendingUp size={48} className="opacity-50" />
          </div>
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div>
              <p className="text-indigo-100 text-sm mb-1">Total Asignado</p>
              <p className="text-3xl font-bold">{totalDaysAvailable}</p>
              <p className="text-sm">días</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm mb-1">Días Usados</p>
              <p className="text-3xl font-bold">{totalDaysUsed}</p>
              <p className="text-sm">días</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm mb-1">Días Disponibles</p>
              <p className="text-3xl font-bold">{totalDaysRemaining}</p>
              <p className="text-sm">días</p>
            </div>
          </div>
        </div>
      )}

      {/* Balance Cards */}
      {selectedEmployeeId && !loading && (
        <>
          {balance.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                No se encontró balance para este empleado
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Balance por Tipo de Permiso
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {balance.map((item) => (
                  <LeaveBalanceCard key={item.balanceId} balance={item} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!selectedEmployeeId && !loading && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-12 text-center border border-green-100">
          <Calendar size={64} className="mx-auto text-green-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Consultar Balance
          </h3>
          <p className="text-gray-600">
            Ingresa el ID de un empleado para ver su balance de días disponibles
          </p>
        </div>
      )}
    </div>
  );
}
