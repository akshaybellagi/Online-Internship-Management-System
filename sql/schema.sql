-- Online Internship Management System Schema

CREATE DATABASE IF NOT EXISTS internship_db;
USE internship_db;

-- Users table (shared for admin and student roles)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'student') NOT NULL,
  phone VARCHAR(20),
  avatar VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students extended profile
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  postal_code VARCHAR(20),
  education_level VARCHAR(100),
  institution VARCHAR(200),
  field_of_study VARCHAR(100),
  graduation_year INT,
  skills TEXT, -- JSON array of skills
  resume_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  github_url VARCHAR(255),
  portfolio_url VARCHAR(255),
  bio TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Internships
CREATE TABLE IF NOT EXISTS internships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  company_name VARCHAR(200),
  category VARCHAR(100), -- e.g., 'Web Development', 'Data Science', 'Marketing'
  duration_weeks INT NOT NULL,
  start_date DATE,
  end_date DATE,
  stipend DECIMAL(10, 2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'INR',
  location VARCHAR(200),
  is_remote BOOLEAN DEFAULT FALSE,
  requirements TEXT, -- JSON array of requirements
  responsibilities TEXT,
  learning_outcomes TEXT,
  max_students INT DEFAULT 50,
  status ENUM('draft', 'active', 'closed', 'completed') DEFAULT 'active',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  internship_id INT NOT NULL,
  student_id INT NOT NULL,
  cover_letter TEXT,
  status ENUM('pending', 'approved', 'rejected', 'withdrawn') DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewed_by INT,
  review_notes TEXT,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_application (internship_id, student_id)
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  certificate_number VARCHAR(50) UNIQUE NOT NULL,
  student_id INT NOT NULL,
  internship_id INT NOT NULL,
  issue_date DATE NOT NULL,
  completion_date DATE NOT NULL,
  grade VARCHAR(10), -- e.g., 'A+', 'A', 'B+', 'Pass'
  performance_score DECIMAL(5, 2), -- 0-100
  certificate_url VARCHAR(255),
  verification_code VARCHAR(100) UNIQUE,
  is_verified BOOLEAN DEFAULT TRUE,
  issued_by INT NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
  FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Assessments
CREATE TABLE IF NOT EXISTS assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  internship_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type ENUM('quiz', 'assignment', 'project', 'practical') DEFAULT 'quiz',
  total_marks INT NOT NULL DEFAULT 100,
  passing_marks INT NOT NULL DEFAULT 40,
  duration_minutes INT, -- NULL for untimed assessments
  questions TEXT NOT NULL, -- JSON array of questions with options and correct answers
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Student Assessment Attempts
CREATE TABLE IF NOT EXISTS student_assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assessment_id INT NOT NULL,
  student_id INT NOT NULL,
  attempt_number INT DEFAULT 1,
  answers TEXT, -- JSON array of student answers
  score DECIMAL(5, 2),
  percentage DECIMAL(5, 2),
  status ENUM('in_progress', 'submitted', 'graded') DEFAULT 'in_progress',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP NULL,
  graded_at TIMESTAMP NULL,
  graded_by INT,
  feedback TEXT,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Exams
CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  internship_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  exam_date DATETIME NOT NULL,
  duration_minutes INT NOT NULL,
  total_marks INT NOT NULL DEFAULT 100,
  passing_marks INT NOT NULL DEFAULT 40,
  questions TEXT NOT NULL, -- JSON array of questions
  instructions TEXT,
  is_proctored BOOLEAN DEFAULT FALSE,
  max_attempts INT DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Student Exam Attempts
CREATE TABLE IF NOT EXISTS student_exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT NOT NULL,
  student_id INT NOT NULL,
  attempt_number INT DEFAULT 1,
  answers TEXT, -- JSON array of student answers
  score DECIMAL(5, 2),
  percentage DECIMAL(5, 2),
  status ENUM('scheduled', 'in_progress', 'submitted', 'graded') DEFAULT 'scheduled',
  started_at TIMESTAMP NULL,
  submitted_at TIMESTAMP NULL,
  graded_at TIMESTAMP NULL,
  graded_by INT,
  feedback TEXT,
  is_passed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  internship_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present', 'absent', 'late', 'excused') NOT NULL,
  check_in_time TIME,
  check_out_time TIME,
  remarks TEXT,
  marked_by INT NOT NULL,
  marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
  FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (student_id, internship_id, date)
);

-- Learning Materials
CREATE TABLE IF NOT EXISTS learning_materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  internship_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  type ENUM('document', 'video', 'link', 'code', 'presentation') NOT NULL,
  file_url VARCHAR(255),
  external_url VARCHAR(255),
  content TEXT, -- For embedded content
  file_size_kb INT,
  duration_minutes INT, -- For videos
  order_index INT DEFAULT 0,
  is_mandatory BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('application', 'attendance', 'assessment', 'exam', 'certificate', 'general') DEFAULT 'general',
  related_id INT, -- ID of related entity (application_id, exam_id, etc.)
  is_read BOOLEAN DEFAULT FALSE,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  action_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Material Progress Tracking
CREATE TABLE IF NOT EXISTS material_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  material_id INT NOT NULL,
  progress_percentage INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES learning_materials(id) ON DELETE CASCADE,
  UNIQUE KEY unique_progress (student_id, material_id)
);

-- System Settings
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed admin user (password: admin123)
INSERT IGNORE INTO users (id, name, email, password, role) VALUES
(1, 'Admin User', 'admin@internhub.com', '$2b$10$/kj3aiHxI9dCEDFwqn6Rv.lBNmBUIx9kQNRSO/ck8me.hwD2QTOe.', 'admin');

-- Seed some default settings
INSERT IGNORE INTO settings (setting_key, setting_value, description) VALUES
('site_name', 'InternHub', 'Application name'),
('attendance_required_percentage', '75', 'Minimum attendance percentage for certificate eligibility'),
('max_application_per_student', '5', 'Maximum active applications per student'),
('certificate_prefix', 'CERT', 'Certificate number prefix');
