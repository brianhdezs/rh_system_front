import { useState, useEffect, useCallback } from 'react';
import { leaveService } from '../services/LeaveService';
import type { LeaveRequest, LeaveBalance, LeaveType } from '../types/LeaveTypes';

export function useLeaveRequests(employeeId: number | null) {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!employeeId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await leaveService.getEmployeeRequests(employeeId);
      setRequests(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, refetch: fetchRequests };
}

export function useLeaveBalance(employeeId: number | null, year?: number) {
  const [balance, setBalance] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!employeeId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await leaveService.getLeaveBalance(employeeId, year);
      setBalance(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar balance');
    } finally {
      setLoading(false);
    }
  }, [employeeId, year]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, error, refetch: fetchBalance };
}

export function useLeaveTypes() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await leaveService.getLeaveTypes();
        setLeaveTypes(response.data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar tipos de permisos');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveTypes();
  }, []);

  return { leaveTypes, loading, error };
}