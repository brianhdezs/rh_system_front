import { TrendingUp, Clock, CheckCircle, Users } from "lucide-react";
import type { AttendanceRecord } from "../../types/AttendanceTypes";

interface AttendanceStatsProps {
  records: AttendanceRecord[];
}

export default function AttendanceStats({ records }: AttendanceStatsProps) {
  const stats = {
    total: records.length,
    present: records.filter((r) => r.status === "Present").length,
    absent: records.filter((r) => r.status === "Absent").length,
    avgHours:
      records
        .filter((r) => r.hoursWorked !== null)
        .reduce((acc, r) => acc + (r.hoursWorked || 0), 0) /
        records.filter((r) => r.hoursWorked !== null).length || 0,
  };

  const statCards = [
    {
      title: "Total Registros",
      value: stats.total,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Presentes",
      value: stats.present,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Ausentes",
      value: stats.absent,
      icon: TrendingUp,
      color: "bg-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "Promedio Horas",
      value: stats.avgHours.toFixed(2),
      icon: Clock,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <Icon size={20} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </div>
        );
      })}
    </div>
  );
}
