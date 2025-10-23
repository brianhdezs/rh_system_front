import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/AttendanceService';
import type { AttendanceRecord } from '../types/AttendanceTypes';

export function useCurrentAttendance(employeeId: number | null) {
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentAttendance = useCallback(async () => {
    if (!employeeId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await attendanceService.getCurrentAttendance(employeeId);
      if (response.success) {
        setAttendance(response.data);
      } else {
        setAttendance(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar asistencia');
      setAttendance(null);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchCurrentAttendance();
  }, [fetchCurrentAttendance]);

  return { attendance, loading, error, refetch: fetchCurrentAttendance };
}

export function useDailyAttendance(date: string) {
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceService.getDailyAttendance(date);
      setAttendances(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar asistencias');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchDailyAttendance();
  }, [fetchDailyAttendance]);

  return { attendances, loading, error, refetch: fetchDailyAttendance };
}