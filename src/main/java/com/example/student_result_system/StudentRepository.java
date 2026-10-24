package com.example.student_result_system;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository
        extends JpaRepository<Student, Long> {

    boolean existsByPrn(String prn);
}