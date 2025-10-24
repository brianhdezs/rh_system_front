import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'https://hrms-gateway-production.up.railway.app';

export const handlers = [
  // Auth - Login
  http.post(`${API_BASE_URL}/gateway/auth/signin`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };

    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        success: true,
        message: 'Login exitoso',
        data: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          userId: 1,
          email: 'test@example.com',
          fullName: 'Usuario Test',
          role: 'Administrador',
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
        },
      });
    }

    return HttpResponse.json(
      {
        success: false,
        message: 'Credenciales inválidas',
        errors: ['Credenciales inválidas'],
      },
      { status: 401 }
    );
  }),

  // Auth - Register
  http.post(`${API_BASE_URL}/gateway/auth/signup`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        userId: 2,
        email: body.email,
        fullName: `${body.firstName} ${body.lastName}`,
        role: body.RoleId === 1 ? 'Administrador' : 'Usuario',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
    });
  }),

  // Employees - Get All
  http.get(`${API_BASE_URL}/gateway/staff/list`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    return HttpResponse.json([
      {
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@company.com',
        phoneNumber: '5551234567',
        hireDate: '2024-01-15',
        position: 'Desarrollador Senior',
        department: 'Tecnología',
        salary: 50000.0,
        isActive: true,
      },
      {
        id: 2,
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@company.com',
        phoneNumber: '5559876543',
        hireDate: '2024-10-18',
        position: 'Analista de Datos',
        department: 'Análisis',
        salary: 45000.0,
        isActive: true,
      },
    ]);
  }),

  // Employees - Get By ID
  http.get(`${API_BASE_URL}/gateway/staff/details/:id`, ({ params }) => {
    const { id } = params;

    if (id === '1') {
      return HttpResponse.json({
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@company.com',
        phoneNumber: '5551234567',
        hireDate: '2024-01-15',
        position: 'Desarrollador Senior',
        department: 'Tecnología',
        salary: 50000.0,
        isActive: true,
      });
    }

    return HttpResponse.json(
      { message: 'Empleado no encontrado' },
      { status: 404 }
    );
  }),

  // Employees - Create
  http.post(`${API_BASE_URL}/gateway/staff/create`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json(
      {
        id: 3,
        ...body,
        isActive: true,
      },
      { status: 201 }
    );
  }),

  // Employees - Update
  http.put(`${API_BASE_URL}/gateway/staff/update/:id`, async ({ params, request }) => {
    const body = await request.json() as any;

    if (body.id !== parseInt(params.id as string)) {
      return HttpResponse.json(
        { message: 'El ID no coincide' },
        { status: 400 }
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // Employees - Delete
  http.delete(`${API_BASE_URL}/gateway/staff/remove/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Attendance - Check In
  http.post(`${API_BASE_URL}/gateway/timeclock/entry`, async () => {
    return HttpResponse.json({
      success: true,
      message: 'Check-in registrado exitosamente',
      data: {
        attendanceId: 1,
        message: 'Check-in registrado exitosamente',
        checkInTime: new Date().toISOString(),
      },
    });
  }),

  // Attendance - Check Out
  http.post(`${API_BASE_URL}/gateway/timeclock/exit`, async () => {
    return HttpResponse.json({
      success: true,
      message: 'Check-out registrado exitosamente',
      data: {
        message: 'Check-out registrado exitosamente',
        hoursWorked: 8.5,
        checkOutTime: new Date().toISOString(),
      },
    });
  }),

  // Attendance - History
  http.get(`${API_BASE_URL}/gateway/timeclock/history/:employeeId`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Registros obtenidos exitosamente',
      data: [
        {
          attendanceId: 1,
          employeeId: parseInt(params.employeeId as string),
          date: new Date().toISOString().split('T')[0],
          checkInTime: '2025-10-23T08:00:00',
          checkOutTime: '2025-10-23T17:00:00',
          hoursWorked: 8.5,
          status: 'Present',
          notes: null,
          createdDate: '2025-10-23T08:00:00',
        },
      ],
    });
  }),
];