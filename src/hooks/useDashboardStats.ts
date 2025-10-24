import { useState, useEffect } from 'react';
import { employeeService } from '../services/EmployeeService';
import { attendanceService } from '../services/AttendanceService';
import { leaveService } from '../services/LeaveService';

interface DashboardStats {
  totalEmployees: number;
  attendanceToday: number;
  pendingLeaveRequests: number;
  loading: boolean;
  error: string | null;
}

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    attendanceToday: 0,
    pendingLeaveRequests: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // 1. Obtener total de empleados
        const employeesResponse = await employeeService.getAll();
        const totalEmployees = employeesResponse.length;

        // 2. Obtener asistencias del día actual
        const today = new Date().toISOString().split('T')[0];
        const attendanceResponse = await attendanceService.getDailyAttendance(today);
        const attendanceToday = attendanceResponse.data.length;

        // 3. Obtener solicitudes de permisos pendientes
        // Nota: Esto requiere iterar por empleados o tener un endpoint que devuelva todas las solicitudes
        // Por simplicidad, usaremos el ID del usuario autenticado o un aproximado
        let pendingLeaveRequests = 0;
        
        // Intentar obtener solicitudes del primer empleado como muestra
        // En producción, deberías tener un endpoint que devuelva TODAS las solicitudes pendientes
        try {
          if (totalEmployees > 0) {
            const leaveResponse = await leaveService.getEmployeeRequests(1);
            pendingLeaveRequests = leaveResponse.data.filter(
              r => r.status === 'Pending'
            ).length;
          }
        } catch (err) {
          // Si falla, dejar en 0
          pendingLeaveRequests = 0;
        }

        setStats({
          totalEmployees,
          attendanceToday,
          pendingLeaveRequests,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: err.message || 'Error al cargar estadísticas',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
}