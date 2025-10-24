import React, { useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LeaveRequestForm from "../../components/leave/LeaveRequestForm";
import { leaveService } from "../../services/LeaveService";
import type { CreateLeaveRequest } from "../../types/LeaveTypes";

interface LeaveRequestPageProps {
  onNavigateBack: () => void;
}

export default function LeaveRequestPage({
  onNavigateBack,
}: LeaveRequestPageProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleEmployeeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId) {
      setShowForm(true);
      setError(null);
    }
  };

  const handleSubmit = async (data: CreateLeaveRequest) => {
    setError(null);
    setSuccess(false);

    try {
      const response = await leaveService.applyLeave(data);

      if (response.success) {
        setSuccess(true);
        alert(
          `✓ ${response.message}\nID de Solicitud: ${response.data.requestId}`
        );
        setShowForm(false);
        setEmployeeId("");
      }
    } catch (err: any) {
      setError(err.message || "Error al enviar solicitud");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onNavigateBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Solicitar Permiso o Vacaciones
          </h1>
          <p className="text-gray-600 mt-1">
            Completa el formulario para enviar tu solicitud
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">✓ Solicitud enviada exitosamente</p>
        </div>
      )}

      {/* Employee ID Input */}
      {!showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar size={24} className="text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Identificación del Empleado
            </h2>
          </div>
          <form onSubmit={handleEmployeeSearch} className="flex space-x-4">
            <div className="flex-1">
              <Input
                type="number"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Ingresa tu ID de empleado"
                required
              />
            </div>
            <Button type="submit">Continuar</Button>
          </form>
        </div>
      )}

      {/* Request Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Formulario de Solicitud
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Empleado ID: <strong>{employeeId}</strong>
            </p>
          </div>

          <LeaveRequestForm
            employeeId={parseInt(employeeId)}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEmployeeId("");
            }}
          />
        </div>
      )}

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📋 Instrucciones
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Verifica tu balance de días disponibles</li>
            <li>• Selecciona las fechas correctamente</li>
            <li>• Proporciona un motivo claro y detallado</li>
            <li>• Espera la aprobación de tu supervisor</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            ⚠️ Importante
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Las solicitudes deben hacerse con anticipación</li>
            <li>• No se garantiza la aprobación automática</li>
            <li>• Verifica que no excedan tus días disponibles</li>
            <li>• Algunos permisos requieren documentación</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
