USE attendance_db;

-- Classes
INSERT IGNORE INTO classes (id, name, section, academic_year) VALUES
(1, 'Class 10', 'A', '2024-25'),
(2, 'Class 10', 'B', '2024-25'),
(3, 'Class 11', 'A', '2024-25');

-- Subjects
INSERT IGNORE INTO subjects (id, name, code, description, credits) VALUES
(1, 'Mathematics', 'MATH101', 'Advanced Mathematics', 4),
(2, 'Physics', 'PHY101', 'Fundamentals of Physics', 4),
(3, 'Chemistry', 'CHEM101', 'Organic & Inorganic Chemistry', 3),
(4, 'English', 'ENG101', 'English Language & Literature', 3),
(5, 'Computer Science', 'CS101', 'Introduction to Programming', 3);

-- Demo teacher (password: teacher123)
INSERT IGNORE INTO users (id, name, email, password, role, phone) VALUES
(2, 'John Smith', 'teacher@school.com', '$2b$10$dDjsy30goGl89CD8dF/AWexKNIv4nThbxCMamzFppIg390hp3pPUW', 'teacher', '9876543210');

INSERT IGNORE INTO teachers (id, user_id, employee_id, department, joining_date) VALUES
(1, 2, 'EMP001', 'Science', '2020-06-01');

-- Demo student (password: student123)
INSERT IGNORE INTO users (id, name, email, password, role, phone) VALUES
(3, 'Alice Johnson', 'student@school.com', '$2b$10$vM3kVo5/ZYvoatouNaxjuO/8yy7wSHmV.9LXBnvm/q5Na8eQuTbwK', 'student', '9123456789');

INSERT IGNORE INTO students (id, user_id, roll_number, class_id, section, admission_date) VALUES
(1, 3, 'STU001', 1, 'A', '2023-06-01');

-- Teacher-Subject assignments
INSERT IGNORE INTO teacher_subjects (teacher_id, subject_id, class_id) VALUES
(1, 1, 1), (1, 2, 1), (1, 3, 1);

-- Timetable
INSERT IGNORE INTO timetable (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room) VALUES
(1, 1, 1, 'Monday', '09:00', '10:00', 'Room 101'),
(1, 2, 1, 'Monday', '10:00', '11:00', 'Lab 1'),
(1, 3, 1, 'Tuesday', '09:00', '10:00', 'Lab 2'),
(1, 1, 1, 'Wednesday', '09:00', '10:00', 'Room 101'),
(1, 4, 1, 'Thursday', '11:00', '12:00', 'Room 102'),
(1, 5, 1, 'Friday', '10:00', '11:00', 'Computer Lab');

-- Holidays
INSERT IGNORE INTO holidays (title, date, description, type) VALUES
('Republic Day', '2025-01-26', 'National holiday', 'national'),
('Holi', '2025-03-14', 'Festival of colors', 'national'),
('Summer Break Begins', '2025-05-15', 'School summer vacation starts', 'school'),
('Independence Day', '2025-08-15', 'National holiday', 'national'),
('Diwali', '2025-10-20', 'Festival of lights', 'national');

-- Sample attendance
INSERT IGNORE INTO attendance (student_id, subject_id, teacher_id, class_id, date, status) VALUES
(1, 1, 1, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present'),
(1, 2, 1, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'present'),
(1, 3, 1, 1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'absent'),
(1, 1, 1, 1, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'present'),
(1, 2, 1, 1, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'late'),
(1, 3, 1, 1, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'present'),
(1, 4, 1, 1, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 'present'),
(1, 5, 1, 1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'absent');
