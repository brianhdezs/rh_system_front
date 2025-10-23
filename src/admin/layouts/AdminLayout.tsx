import { useState } from "react";
import { AdminHeader } from "../components/AdminHeader";
import { AdminSidebar } from "../components/AdminSidebar";
import { DashboardPage } from "../../pages/DashboardPage";
import EmployeesListPage from "../../pages/employees/EmployeesListPage";
import EmployeeCreatePage from "../../pages/employees/EmployeeCreatePage";
import EmployeeEditPage from "../../pages/employees/EmployeeEditPage";
import PerformanceListPage from "../../pages/performance/PerformanceListPage";
import PerformanceCyclesPage from "../../pages/performance/PerformanceCyclesPage";
import CreateEvaluationPage from "../../pages/performance/CreateEvaluationPage";
import EvaluationFormPage from "../../pages/performance/EvaluationFormPage";
import type { Employee } from "../../types/EmployeeTypes";
import AttendanceClockPage from "../../pages/attendance/AttendanceClockPage";
import AttendanceHistoryPage from "../../pages/attendance/AttendanceHistoryPage";
import AttendanceDailyPage from "../../pages/attendance/AttendanceDailyPage";
import AttendanceMainPage from "../../pages/attendance/AttendanceMainPage";

type Page =
  | "dashboard"
  | "employees"
  | "employee-create"
  | "employee-edit"
  | "performance"
  | "performance-cycles"
  | "performance-create"
  | "performance-form"
  | "attendance"
  | "attendance-clock"
  | "attendance-history"
  | "attendance-daily"
  | "departments"
  | "reports"
  | "notifications"
  | "settings"
  | "help";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<
    number | null
  >(null);

  // Función wrapper para manejar la navegación desde el sidebar
  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <DashboardPage
            onNavigateToEmployees={() => setCurrentPage("employees")}
          />
        );

      case "employees":
        return (
          <EmployeesListPage
            onNavigateToCreate={() => setCurrentPage("employee-create")}
            onNavigateToEdit={(employee) => {
              setSelectedEmployee(employee);
              setCurrentPage("employee-edit");
            }}
          />
        );

      case "employee-create":
        return (
          <EmployeeCreatePage
            onNavigateBack={() => setCurrentPage("employees")}
          />
        );

      case "employee-edit":
        return selectedEmployee ? (
          <EmployeeEditPage
            employeeId={selectedEmployee.id}
            onNavigateBack={() => {
              setSelectedEmployee(null);
              setCurrentPage("employees");
            }}
          />
        ) : null;

      case "performance":
        return (
          <PerformanceListPage
            onNavigateToCreate={() => setCurrentPage("performance-create")}
            onNavigateToCycles={() => setCurrentPage("performance-cycles")}
          />
        );

      case "performance-cycles":
        return (
          <PerformanceCyclesPage
            onNavigateBack={() => setCurrentPage("performance")}
          />
        );

      case "performance-create":
        return (
          <CreateEvaluationPage
            onNavigateBack={() => setCurrentPage("performance")}
            onNavigateToForm={(evaluationId) => {
              setSelectedEvaluationId(evaluationId);
              setCurrentPage("performance-form");
            }}
          />
        );

      case "performance-form":
        return selectedEvaluationId ? (
          <EvaluationFormPage
            evaluationId={selectedEvaluationId}
            onNavigateBack={() => {
              setSelectedEvaluationId(null);
              setCurrentPage("performance");
            }}
          />
        ) : null;

      // Páginas placeholder para los otros módulos
      case "attendance":
        return (
          <AttendanceMainPage
            onNavigateToClock={() => setCurrentPage("attendance-clock")}
            onNavigateToHistory={() => setCurrentPage("attendance-history")}
            onNavigateToDaily={() => setCurrentPage("attendance-daily")}
          />
        );

      case "attendance-clock":
        return <AttendanceClockPage />;

      case "attendance-history":
        return <AttendanceHistoryPage />;

      case "attendance-daily":
        return <AttendanceDailyPage />;
      case "departments":
      case "reports":
      case "notifications":
      case "settings":
      case "help":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Módulo en Construcción
            </h2>
            <p className="text-gray-600">
              Este módulo estará disponible próximamente
            </p>
            <button
              onClick={() => setCurrentPage("dashboard")}
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Volver al Dashboard
            </button>
          </div>
        );

      default:
        return (
          <DashboardPage
            onNavigateToEmployees={() => setCurrentPage("employees")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6">{renderPage()}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
