import React, { useState } from "react";
import { Calendar, Loader, RefreshCw, Users } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AttendanceCard from "../../components/attendance/AttendanceCard";
import AttendanceStats from "../../components/attendance/AttendanceStats";
import { useDailyAttendance } from "../../hooks/UseAttendance";

export default function AttendanceDailyPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeDate, setActiveDate] = useState(selectedDate);

  const { attendances, loading, error, refetch } =
    useDailyAttendance(activeDate);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveDate(selectedDate);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    setActiveDate(today);
  };

  const formatDateDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Asistencias del Día
          </h1>
          <p className="text-gray-600 mt-1">
            Visualiza todas las asistencias registradas en una fecha específica
          </p>
        </div>
        <Button variant="secondary" onClick={handleToday}>
          <Calendar size={20} className="mr-2" />
          Hoy
        </Button>
      </div>

      {/* Date Selector */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>
          <Button type="submit">
            <Calendar size={20} className="mr-2" />
            Buscar
          </Button>
          <Button type="button" variant="secondary" onClick={refetch}>
            <RefreshCw size={20} />
          </Button>
        </form>
      </div>

      {/* Date Display */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {formatDateDisplay(activeDate)}
            </h2>
            <p className="text-indigo-100 mt-1">
              {attendances.length}{" "}
              {attendances.length === 1 ? "registro" : "registros"} encontrados
            </p>
          </div>
          <Users size={48} className="opacity-50" />
        </div>
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
      {!loading && attendances.length > 0 && (
        <AttendanceStats records={attendances} />
      )}

      {/* Results */}
      {!loading && (
        <>
          {attendances.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                No hay registros de asistencia para esta fecha
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Intenta con otra fecha o verifica que haya registros
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Todos los Registros
                </h2>
                <div className="text-sm text-gray-600">
                  Ordenados por hora de entrada
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attendances
                  .sort((a, b) => {
                    if (!a.checkInTime) return 1;
                    if (!b.checkInTime) return -1;
                    return (
                      new Date(a.checkInTime).getTime() -
                      new Date(b.checkInTime).getTime()
                    );
                  })
                  .map((record) => (
                    <AttendanceCard key={record.attendanceId} record={record} />
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
