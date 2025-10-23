import { useState, useEffect } from 'react';
import { performanceService } from '../services/PerformanceService';
import type { Criteria } from '../types/PerformanceTypes';

export function useCriteria() {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await performanceService.getCriteria();
      setCriteria(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar criterios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  return { criteria, loading, error, refetch: fetchCriteria };
}