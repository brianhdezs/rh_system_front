import { useState, useEffect } from 'react';
import { employeeService } from '../services/EmployeeService';
import type { Employee } from '../types/EmployeeTypes';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const refetch = () => {
    fetchEmployees();
  };

  return { employees, loading, error, refetch };
}