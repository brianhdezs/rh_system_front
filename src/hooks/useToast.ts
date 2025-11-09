import { useState, useCallback } from 'react';

interface ToastState {
  show: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'info',
    message: '',
    description: '',
  });

  const showToast = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    description?: string
  ) => {
    console.log('🔔 Showing toast:', { type, message, description });
    setToast({
      show: true,
      type,
      message,
      description,
    });
  }, []);

  const hideToast = useCallback(() => {
    console.log('🔕 Hiding toast');
    setToast(prev => ({ ...prev, show: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}