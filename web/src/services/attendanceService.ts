import api from './api';

export interface AttendanceRecord {
  id: number;
  userId: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  createdAt: string;
}

export interface AdminAttendanceRecord extends AttendanceRecord {
  firstname: string;
  lastname: string;
  email: string;
  role?: string;
}

export const attendanceService = {
  getMine: async (): Promise<AttendanceRecord[]> => {
    const response = await api.get('/attendance/me');
    return response.data;
  },

  getAll: async (): Promise<AdminAttendanceRecord[]> => {
    const response = await api.get('/attendance/all');
    return response.data;
  },

  getToday: async (): Promise<{ checkedIn: boolean }> => {
    const response = await api.get('/attendance/today');
    return response.data;
  },

  checkIn: async (): Promise<AttendanceRecord> => {
    const response = await api.post('/attendance/check-in');
    return response.data;
  },
};
