import api from './api';

export interface AttendanceRecord {
  id: number;
  userId: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  createdAt: string;
}

export const attendanceService = {
  markAttendance: async (userId: number, status: string = 'PRESENT'): Promise<AttendanceRecord> => {
    const response = await api.post('/attendance/mark', { userId, status });
    return response.data;
  },

  getUserAttendance: async (userId: number): Promise<AttendanceRecord[]> => {
    const response = await api.get(`/attendance/user/${userId}`);
    return response.data;
  }
};
