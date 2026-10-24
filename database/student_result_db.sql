CREATE DATABASE IF NOT EXISTS student_result_db;
USE student_result_db;

CREATE TABLE IF NOT EXISTS students (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    prn VARCHAR(255) NOT NULL UNIQUE,
    semester INT,
    subject1_ese INT,
    subject1_mse INT,
    subject2_ese INT,
    subject2_mse INT,
    subject3_ese INT,
    subject3_mse INT,
    subject4_ese INT,
    subject4_mse INT
);
