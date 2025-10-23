import { useState } from "react";
import { AdminHeader } from "../components/AdminHeader";
import { AdminSidebar } from "../components/AdminSidebar";
import { DashboardPage } from "../../pages/DashboardPage";
import EmployeesListPage from "../../pages/employees/EmployeesListPage";
import EmployeeCreatePage from "../../pages/employees/EmployeeCreatePage";
import EmployeeEditPage from "../../pages/employees/EmployeeEditPage";
import type { Employee } from "../../types/EmployeeTypes";

type Page = "dashboard" | "employees" | "employee-create" | "employee-edit";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

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
        onNavigate={(page) => setCurrentPage(page as Page)}
      />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-6">{renderPage()}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
