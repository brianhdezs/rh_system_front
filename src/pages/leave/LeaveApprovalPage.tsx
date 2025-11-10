import React, { useState } from "react";
import { Search, Loader, CheckSquare } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import LeaveCard from "../../components/leave/LeaveCard";
import { useLeaveRequests } from "../../hooks/useLeave";
import { useToast } from "../../context/ToastContext";
import { leaveService } from "../../services/LeaveService";

export default function LeaveApprovalPage() {
  const { showToast } = useToast();
  const [employeeId, setEmployeeId] = useState("");
  const [reviewerId, setReviewerId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [reviewComments, setReviewComments] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">(
    "approve"
  );
  const [processing, setProcessing] = useState(false);

  const { requests, loading, error, refetch } =
    useLeaveRequests(selectedEmployeeId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId) {
      setSelectedEmployeeId(parseInt(employeeId));
    }
  };

  const handleReviewClick = (
    requestId: number,
    action: "approve" | "reject"
  ) => {
    setSelectedRequestId(requestId);
    setReviewAction(action);
    setShowReviewModal(true);
    setReviewComments("");
  };

  const handleSubmitReview = async () => {
    if (!selectedRequestId || !reviewerId) return;

    setProcessing(true);

    try {
      const reviewData = {
        reviewedBy: parseInt(reviewerId),
        comments: reviewComments || undefined,
      };

      if (reviewAction === "approve") {
        await leaveService.approveRequest(selectedRequestId, reviewData);
        showToast(
          "success",
          "Solicitud aprobada",
          "La solicitud ha sido aprobada exitosamente"
        );
      } else {
        await leaveService.rejectRequest(selectedRequestId, reviewData);
        showToast(
          "error",
          "Solicitud rechazada",
          "La solicitud ha sido rechazada"
        );
      }

      setShowReviewModal(false);
      setSelectedRequestId(null);
      setReviewComments("");
      refetch();
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.message || "No se pudo procesar la solicitud"
      );
    } finally {
      setProcessing(false);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "Pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Aprobar/Rechazar Solicitudes
        </h1>
        <p className="text-gray-600 mt-1">
          Gestiona las solicitudes de permisos pendientes
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Ingresa número del Empleado"
              label="Número del empleado"
              required
            />
            <Input
              type="number"
              value={reviewerId}
              onChange={(e) => setReviewerId(e.target.value)}
              placeholder="Tu ID como revisor"
              label="Número del Revisor (Tu ID)"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              <Search size={20} className="mr-2" />
              Buscar Solicitudes
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

      {/* Pending Stats */}
      {selectedEmployeeId && !loading && pendingRequests.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <CheckSquare size={24} className="text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-900">
                {pendingRequests.length}{" "}
                {pendingRequests.length === 1
                  ? "solicitud pendiente"
                  : "solicitudes pendientes"}
              </p>
              <p className="text-sm text-yellow-700">Requieren tu revisión</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {selectedEmployeeId && !loading && (
        <>
          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <CheckSquare size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                No hay solicitudes pendientes para este empleado
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Solicitudes Pendientes ({pendingRequests.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingRequests.map((request) => (
                  <LeaveCard
                    key={request.requestId}
                    request={request}
                    onApprove={(id) => handleReviewClick(id, "approve")}
                    onReject={(id) => handleReviewClick(id, "reject")}
                    showActions={true}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <>
          {/* Overlay con backdrop blur */}
          <div
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40"
            onClick={() => {
              setShowReviewModal(false);
              setReviewComments("");
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {reviewAction === "approve"
                  ? "Aprobar Solicitud"
                  : "Rechazar Solicitud"}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios {reviewAction === "reject" && "(Requerido)"}
                </label>
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={
                    reviewAction === "approve"
                      ? "Comentarios opcionales..."
                      : "Explica el motivo del rechazo..."
                  }
                  required={reviewAction === "reject"}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewComments("");
                  }}
                  disabled={processing}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={
                    processing ||
                    (reviewAction === "reject" && !reviewComments.trim())
                  }
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                    reviewAction === "approve"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {processing ? "Procesando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Initial State */}
      {!selectedEmployeeId && !loading && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-12 text-center border border-purple-100">
          <CheckSquare size={64} className="mx-auto text-purple-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Revisar Solicitudes
          </h3>
          <p className="text-gray-600">
            Ingresa el ID del empleado y tu ID como revisor para gestionar las
            solicitudes
          </p>
        </div>
      )}
    </div>
  );
}
