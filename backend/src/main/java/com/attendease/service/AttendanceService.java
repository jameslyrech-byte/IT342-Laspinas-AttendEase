package com.attendease.service;

import com.attendease.dto.AdminAttendanceDto;
import com.attendease.entity.Attendance;
import com.attendease.entity.AttendanceStatus;
import com.attendease.entity.User;
import com.attendease.repository.AttendanceRepository;
import com.attendease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    public List<Attendance> getUserAttendance(Long userId) {
        return attendanceRepository.findByUserId(userId);
    }

    public List<Attendance> getTodayAttendance(Long userId) {
        return attendanceRepository.findByUserIdAndDate(userId, LocalDate.now());
    }

    public List<AdminAttendanceDto> getAllAttendanceForAdmin() {
        Map<Long, User> usersById = userRepository.findAll()
                .stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        return attendanceRepository.findAllByOrderByDateDescCreatedAtDesc()
                .stream()
                .map(attendance -> {
                    User user = usersById.get(attendance.getUserId());
                    return new AdminAttendanceDto(
                            attendance.getId(),
                            attendance.getUserId(),
                            user != null ? user.getFirstname() : "Unknown",
                            user != null ? user.getLastname() : "User",
                            user != null ? user.getEmail() : "",
                            user != null ? user.getRole() : null,
                            attendance.getDate(),
                            attendance.getStatus(),
                            attendance.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
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
