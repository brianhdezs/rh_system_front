import { useState, useEffect } from 'react';
import { employeeService } from '../services/EmployeeService';
import { attendanceService } from '../services/AttendanceService';

interface ChartData {
  label: string;
  value: number;
}

interface DashboardChartsData {
  employeesByDepartment: ChartData[];
  attendanceByDay: ChartData[];
  loading: boolean;
  error: string | null;
}

export function useDashboardCharts(): DashboardChartsData {
  const [data, setData] = useState<DashboardChartsData>({
    employeesByDepartment: [],
    attendanceByDay: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchChartsData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // 1. Obtener empleados por departamento
        const employees = await employeeService.getAll();
        const departmentCounts: Record<string, number> = {};
        
        employees.forEach(emp => {
          const dept = emp.department || 'Sin Departamento';
          departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
        });

        const employeesByDepartment = Object.entries(departmentCounts).map(([label, value]) => ({
          label,
          value,
        }));

        // 2. Obtener asistencias por día (últimos 7 días)
        const attendanceByDay: ChartData[] = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          try {
            const response = await attendanceService.getDailyAttendance(dateStr);
            const dayName = date.toLocaleDateString('es-MX', { weekday: 'short' });
            attendanceByDay.push({
              label: dayName.charAt(0).toUpperCase() + dayName.slice(1),
              value: response.data.length,
            });
          } catch {
            // Si no hay datos para ese día, poner 0
            const dayName = date.toLocaleDateString('es-MX', { weekday: 'short' });
            attendanceByDay.push({
              label: dayName.charAt(0).toUpperCase() + dayName.slice(1),
              value: 0,
            });
          }
        }

        setData({
          employeesByDepartment,
          attendanceByDay,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: err.message || 'Error al cargar datos de gráficos',
        }));
      }
    };

    fetchChartsData();
  }, []);

  return data;
}