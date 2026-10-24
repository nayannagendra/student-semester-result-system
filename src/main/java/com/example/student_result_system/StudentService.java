package com.example.student_result_system;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Student getStudent(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Student not found: " + id));
    }

    @Transactional
    public Student createStudent(Student student) {
        validate(student);

        if (repository.existsByPrn(student.getPrn().trim())) {
            throw new RuntimeException("This PRN already exists.");
        }

        student.setPrn(student.getPrn().trim());
        student.setName(student.getName().trim());

        return repository.save(student);
    }

    @Transactional
    public Student updateStudent(Long id, Student updated) {
        Student existing = getStudent(id);
        validate(updated);

        String prn = updated.getPrn().trim();

        boolean duplicate = repository.findAll().stream()
                .anyMatch(s -> !s.getId().equals(id)
                        && s.getPrn().equalsIgnoreCase(prn));

        if (duplicate) {
            throw new RuntimeException("This PRN already exists.");
        }

        existing.setPrn(prn);
        existing.setName(updated.getName().trim());
        existing.setSemester(updated.getSemester());

        existing.setSubject1Mse(updated.getSubject1Mse());
        existing.setSubject1Ese(updated.getSubject1Ese());
        existing.setSubject2Mse(updated.getSubject2Mse());
        existing.setSubject2Ese(updated.getSubject2Ese());
        existing.setSubject3Mse(updated.getSubject3Mse());
        existing.setSubject3Ese(updated.getSubject3Ese());
        existing.setSubject4Mse(updated.getSubject4Mse());
        existing.setSubject4Ese(updated.getSubject4Ese());

        return repository.save(existing);
    }

    public void deleteStudent(Long id) {
        Student student = getStudent(id);
        repository.delete(student);
    }

    private void validate(Student s) {
        if (s.getPrn() == null || s.getPrn().isBlank()
                || s.getName() == null || s.getName().isBlank()) {
            throw new RuntimeException("PRN and name are required.");
        }

        if (s.getSemester() == null
                || s.getSemester() < 1 || s.getSemester() > 8) {
            throw new RuntimeException("Semester must be between 1 and 8.");
        }

        checkMark(s.getSubject1Mse(), 30, "Subject 1 MSE");
        checkMark(s.getSubject1Ese(), 70, "Subject 1 ESE");
        checkMark(s.getSubject2Mse(), 30, "Subject 2 MSE");
        checkMark(s.getSubject2Ese(), 70, "Subject 2 ESE");
        checkMark(s.getSubject3Mse(), 30, "Subject 3 MSE");
        checkMark(s.getSubject3Ese(), 70, "Subject 3 ESE");
        checkMark(s.getSubject4Mse(), 30, "Subject 4 MSE");
        checkMark(s.getSubject4Ese(), 70, "Subject 4 ESE");
    }

    private void checkMark(Integer value, int max, String label) {
        if (value == null || value < 0 || value > max) {
            throw new RuntimeException(
                    label + " must be between 0 and " + max + ".");
        }
    }
}