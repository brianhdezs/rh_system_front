import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./components/register/Login";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return <Login onLogin={handleLogin} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
