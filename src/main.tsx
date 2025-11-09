import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminDashboard from "./admin/layouts/AdminLayout";
import { useState } from "react";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return showRegister ? (
    <Register onNavigateToLogin={() => setShowRegister(false)} />
  ) : (
    <Login onNavigateToRegister={() => setShowRegister(true)} />
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
