package com.attendease.controller;

import com.attendease.entity.Attendance;
import com.attendease.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://localhost:3005", "http://localhost:5173", "http://localhost:8081", "http://localhost:19006"})
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/me")
    public ResponseEntity<?> myAttendance(Authentication authentication) {
        Long userId = authenticatedUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required");
        }

        List<Attendance> records = attendanceService.getUserAttendance(userId);
        records.sort(Comparator.comparing(Attendance::getDate).reversed());
        return ResponseEntity.ok(records);
    }

    @GetMapping("/today")
    public ResponseEntity<?> today(Authentication authentication) {
        Long userId = authenticatedUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required");
        }

        return ResponseEntity.ok(Map.of("checkedIn", !attendanceService.getTodayAttendance(userId).isEmpty()));
    }

    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(Authentication authentication) {
        Long userId = authenticatedUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login required");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.checkIn(userId));
    }

    private Long authenticatedUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getCredentials() instanceof Long)) {
            return null;
        }
        return (Long) authentication.getCredentials();
    }
}
