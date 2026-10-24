package com.example.student_result_system;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String prn;

    @Column(nullable = false)
    private String name;

    private Integer semester;

    private Integer subject1Mse;
    private Integer subject1Ese;
    private Integer subject2Mse;
    private Integer subject2Ese;
    private Integer subject3Mse;
    private Integer subject3Ese;
    private Integer subject4Mse;
    private Integer subject4Ese;

    public Student() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPrn() { return prn; }
    public void setPrn(String prn) { this.prn = prn; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Integer getSubject1Mse() { return subject1Mse; }
    public void setSubject1Mse(Integer v) { subject1Mse = v; }

    public Integer getSubject1Ese() { return subject1Ese; }
    public void setSubject1Ese(Integer v) { subject1Ese = v; }

    public Integer getSubject2Mse() { return subject2Mse; }
    public void setSubject2Mse(Integer v) { subject2Mse = v; }

    public Integer getSubject2Ese() { return subject2Ese; }
    public void setSubject2Ese(Integer v) { subject2Ese = v; }

    public Integer getSubject3Mse() { return subject3Mse; }
    public void setSubject3Mse(Integer v) { subject3Mse = v; }

    public Integer getSubject3Ese() { return subject3Ese; }
    public void setSubject3Ese(Integer v) { subject3Ese = v; }

    public Integer getSubject4Mse() { return subject4Mse; }
    public void setSubject4Mse(Integer v) { subject4Mse = v; }

    public Integer getSubject4Ese() { return subject4Ese; }
    public void setSubject4Ese(Integer v) { subject4Ese = v; }

    private int mark(Integer value) {
        return value == null ? 0 : value;
    }

    public int getSubject1Total() {
        return mark(subject1Mse) + mark(subject1Ese);
    }

    public int getSubject2Total() {
        return mark(subject2Mse) + mark(subject2Ese);
    }

    public int getSubject3Total() {
        return mark(subject3Mse) + mark(subject3Ese);
    }

    public int getSubject4Total() {
        return mark(subject4Mse) + mark(subject4Ese);
    }

    public int getTotalMarks() {
        return getSubject1Total() + getSubject2Total()
                + getSubject3Total() + getSubject4Total();
    }

    public double getPercentage() {
        return getTotalMarks() / 4.0;
    }

    public String getResult() {
        return getSubject1Total() >= 40
                && getSubject2Total() >= 40
                && getSubject3Total() >= 40
                && getSubject4Total() >= 40
                ? "PASS" : "FAIL";
    }
}