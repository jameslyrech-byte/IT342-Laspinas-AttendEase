import api from './api';

export interface AttendanceRecord {
  id: number;
  userId: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  createdAt: string;
}

export const attendanceService = {
  getMine: async (): Promise<AttendanceRecord[]> => {
    const response = await api.get('/attendance/me');
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
