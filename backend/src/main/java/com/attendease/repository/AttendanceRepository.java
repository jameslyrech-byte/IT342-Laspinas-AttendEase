package com.attendease.repository;

import com.attendease.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByUserId(Long userId);
    List<Attendance> findByUserIdAndDate(Long userId, LocalDate date);
    boolean existsByUserIdAndDate(Long userId, LocalDate date);
    List<Attendance> findByUserIdOrderByDateDesc(Long userId);
}
