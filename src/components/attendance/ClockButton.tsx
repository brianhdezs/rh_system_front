import { LogIn, LogOut } from "lucide-react";

interface ClockButtonProps {
  type: "in" | "out";
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function ClockButton({
  type,
  onClick,
  disabled,
  loading,
}: ClockButtonProps) {
  const isCheckIn = type === "in";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center space-x-3 px-8 py-6 rounded-xl font-semibold text-lg
        transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isCheckIn
            ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/50"
            : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/50"
        }
      `}
    >
      {isCheckIn ? <LogIn size={28} /> : <LogOut size={28} />}
      <span>
        {loading
          ? "Procesando..."
          : isCheckIn
          ? "Registrar Entrada"
          : "Registrar Salida"}
      </span>
    </button>
  );
}
