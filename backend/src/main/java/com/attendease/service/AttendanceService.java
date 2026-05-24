package com.attendease.service;

import com.attendease.entity.Attendance;
import com.attendease.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    
    @Transactional
    public Attendance markAttendance(Long userId, String status) {
        // Check if already marked for today
        if (attendanceRepository.existsByUserIdAndDate(userId, LocalDate.now())) {
            throw new IllegalArgumentException("Attendance already marked for today");
        }
        
        Attendance attendance = new Attendance();
        attendance.setUserId(userId);
        attendance.setDate(LocalDate.now());
        attendance.setStatus(com.attendease.entity.AttendanceStatus.valueOf(status.toUpperCase()));
        
        return attendanceRepository.save(attendance);
    }
    
    public List<Attendance> getUserAttendance(Long userId) {
        return attendanceRepository.findByUserIdOrderByDateDesc(userId);
    }
}
