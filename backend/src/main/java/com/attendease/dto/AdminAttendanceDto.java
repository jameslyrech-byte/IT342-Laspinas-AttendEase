package com.attendease.dto;

import com.attendease.entity.AttendanceStatus;
import com.attendease.entity.UserRole;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminAttendanceDto {
    private Long id;
    private Long userId;
    private String firstname;
    private String lastname;
    private String email;
    private UserRole role;
    private LocalDate date;
    private AttendanceStatus status;
    private LocalDateTime createdAt;
}
