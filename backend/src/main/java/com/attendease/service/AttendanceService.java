package com.attendease.service;

import com.attendease.entity.Attendance;
import com.attendease.entity.AttendanceStatus;
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

    public List<Attendance> getUserAttendance(Long userId) {
        return attendanceRepository.findByUserId(userId);
    }

    public List<Attendance> getTodayAttendance(Long userId) {
        return attendanceRepository.findByUserIdAndDate(userId, LocalDate.now());
    }

    @Transactional
    public Attendance checkIn(Long userId) {
        LocalDate today = LocalDate.now();
        return attendanceRepository.findByUserIdAndDate(userId, today)
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    Attendance attendance = new Attendance();
                    attendance.setUserId(userId);
                    attendance.setDate(today);
                    attendance.setStatus(AttendanceStatus.PRESENT);
                    return attendanceRepository.save(attendance);
                });
    }
}
