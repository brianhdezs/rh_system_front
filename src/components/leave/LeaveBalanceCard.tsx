import { Calendar, TrendingDown, TrendingUp } from "lucide-react";
import type { LeaveBalance } from "../../types/LeaveTypes";

interface LeaveBalanceCardProps {
  balance: LeaveBalance;
}

export default function LeaveBalanceCard({ balance }: LeaveBalanceCardProps) {
  const percentage = (balance.remainingDays / balance.totalDays) * 100;

  const getColorClass = () => {
    if (percentage >= 70) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 40)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${getColorClass()}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{balance.leaveTypeName}</h3>
          <p className="text-sm opacity-75 mt-1">Año {balance.year}</p>
        </div>
        <Calendar size={32} className="opacity-50" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Total asignado</span>
          <span className="text-xl font-bold">{balance.totalDays} días</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm flex items-center">
            <TrendingDown size={16} className="mr-1" />
            Días usados
          </span>
          <span className="font-semibold">{balance.usedDays} días</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t-2 border-current">
          <span className="text-sm flex items-center font-medium">
            <TrendingUp size={16} className="mr-1" />
            Días disponibles
          </span>
          <span className="text-2xl font-bold">
            {balance.remainingDays} días
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-white/50 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: "currentColor",
            }}
          />
        </div>
        <p className="text-xs text-center mt-2 opacity-75">
          {percentage.toFixed(0)}% disponible
        </p>
      </div>

      <p className="text-xs opacity-75 mt-4">
        Última actualización:{" "}
        {new Date(balance.lastUpdated).toLocaleDateString("es-MX")}
      </p>
    </div>
  );
}
