import React, { useState } from "react";
import { User, AlertCircle } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import TimeDisplay from "../../components/attendance/TimeDisplay";
import ClockButton from "../../components/attendance/ClockButton";
import { attendanceService } from "../../services/AttendanceService";
import { useCurrentAttendance } from "../../hooks/UseAttendance";

export default function AttendanceClockPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    attendance,
    loading: loadingAttendance,
    refetch,
  } = useCurrentAttendance(selectedEmployeeId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;
    setSelectedEmployeeId(parseInt(employeeId));
    setError(null);
    setSuccess(null);
  };

  const handleCheckIn = async () => {
    if (!selectedEmployeeId) return;

    setError(null);
    setSuccess(null);

    try {
      setCheckInLoading(true);
      const response = await attendanceService.checkIn({
        employeeId: selectedEmployeeId,
      });
      setSuccess(response.message);
      refetch();
    } catch (err: any) {
      setError(err.message || "Error al registrar entrada");
    } finally {
      setCheckInLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedEmployeeId) return;

    setError(null);
    setSuccess(null);

    try {
      setCheckOutLoading(true);
      const response = await attendanceService.checkOut({
        employeeId: selectedEmployeeId,
      });
      setSuccess(
        `${
          response.message
        } - Horas trabajadas: ${response.data.hoursWorked.toFixed(2)}`
      );
      refetch();
    } catch (err: any) {
      setError(err.message || "Error al registrar salida");
    } finally {
      setCheckOutLoading(false);
    }
  };

  const hasCheckedIn = attendance && attendance.checkInTime !== null;
  const hasCheckedOut = attendance && attendance.checkOutTime !== null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Control de Asistencia
        </h1>
        <p className="text-gray-600 mt-2">
          Registra tu entrada y salida del trabajo
        </p>
      </div>

      {/* Time Display */}
      <TimeDisplay />

      {/* Employee Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <Input
              type="number"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Ingresa tu número de empleado"
              required
            />
          </div>
          <Button type="submit">
            <User size={20} className="mr-2" />
            Buscar
          </Button>
        </form>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle
            size={20}
            className="text-red-600 mt-0.5 flex-shrink-0"
          />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">✓ {success}</p>
        </div>
      )}

      {/* Clock Buttons */}
      {selectedEmployeeId && !loadingAttendance && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Empleado #{selectedEmployeeId}
            </h2>
            {attendance && (
              <p className="text-sm text-gray-600 mt-1">
                Estado:{" "}
                {hasCheckedOut
                  ? "Salida registrada"
                  : hasCheckedIn
                  ? "Trabajando"
                  : "Sin registro hoy"}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ClockButton
              type="in"
              onClick={handleCheckIn}
              disabled={hasCheckedIn || checkInLoading || checkOutLoading}
              loading={checkInLoading}
            />
            <ClockButton
              type="out"
              onClick={handleCheckOut}
              disabled={
                !hasCheckedIn ||
                hasCheckedOut ||
                checkInLoading ||
                checkOutLoading
              }
              loading={checkOutLoading}
            />
          </div>

          {attendance && hasCheckedIn && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Hora de Entrada</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(attendance.checkInTime!).toLocaleTimeString(
                      "es-MX",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
                {attendance.checkOutTime && (
                  <div>
                    <p className="text-sm text-gray-600">Hora de Salida</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(attendance.checkOutTime).toLocaleTimeString(
                        "es-MX",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
