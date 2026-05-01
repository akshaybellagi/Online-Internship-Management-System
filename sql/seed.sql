-- Seed Data for Online Internship Management System
USE internship_db;

-- Clear existing data (in correct order to respect foreign keys)
-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Delete data from all tables
DELETE FROM material_progress;
DELETE FROM notifications;
DELETE FROM learning_materials;
DELETE FROM attendance;
DELETE FROM student_exams;
DELETE FROM exams;
DELETE FROM student_assessments;
DELETE FROM assessments;
DELETE FROM certificates;
DELETE FROM applications;
DELETE FROM internships;
DELETE FROM students;
DELETE FROM users WHERE id > 1; -- Keep admin user

-- Reset auto-increment counters
ALTER TABLE material_progress AUTO_INCREMENT = 1;
ALTER TABLE notifications AUTO_INCREMENT = 1;
ALTER TABLE learning_materials AUTO_INCREMENT = 1;
ALTER TABLE attendance AUTO_INCREMENT = 1;
ALTER TABLE student_exams AUTO_INCREMENT = 1;
ALTER TABLE exams AUTO_INCREMENT = 1;
ALTER TABLE student_assessments AUTO_INCREMENT = 1;
ALTER TABLE assessments AUTO_INCREMENT = 1;
ALTER TABLE certificates AUTO_INCREMENT = 1;
ALTER TABLE applications AUTO_INCREMENT = 1;
ALTER TABLE internships AUTO_INCREMENT = 1;
ALTER TABLE students AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 2; -- Start after admin

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Users (password for all: admin123 or student123)
-- Update admin user if exists, otherwise insert
INSERT INTO users (id, name, email, password, role, phone, is_active) VALUES
(1, 'Admin User', 'admin@internhub.com', '$2b$10$/kj3aiHxI9dCEDFwqn6Rv.lBNmBUIx9kQNRSO/ck8me.hwD2QTOe.', 'admin', '+91-9876543210', TRUE)
ON DUPLICATE KEY UPDATE 
  name = 'Admin User',
  email = 'admin@internhub.com',
  password = '$2b$10$/kj3aiHxI9dCEDFwqn6Rv.lBNmBUIx9kQNRSO/ck8me.hwD2QTOe.',
  phone = '+91-9876543210';

-- Insert student users
INSERT INTO users (id, name, email, password, role, phone, is_active) VALUES
(2, 'Rahul Sharma', 'rahul.sharma@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543211', TRUE),
(3, 'Priya Patel', 'priya.patel@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543212', TRUE),
(4, 'Amit Kumar', 'amit.kumar@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543213', TRUE),
(5, 'Sneha Reddy', 'sneha.reddy@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543214', TRUE),
(6, 'Vikram Singh', 'vikram.singh@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543215', TRUE);

-- Students
INSERT INTO students (user_id, student_id, date_of_birth, gender, address, city, state, country, postal_code, education_level, institution, field_of_study, graduation_year, skills, bio) VALUES
(2, 'STU001', '2002-05-15', 'male', '123 MG Road', 'Mumbai', 'Maharashtra', 'India', '400001', 'Bachelor', 'Mumbai University', 'Computer Science', 2024, '["JavaScript", "React", "Node.js", "Python", "SQL"]', 'Passionate about web development and AI'),
(3, 'STU002', '2001-08-22', 'female', '456 Park Street', 'Kolkata', 'West Bengal', 'India', '700016', 'Bachelor', 'Jadavpur University', 'Information Technology', 2024, '["Java", "Spring Boot", "MySQL", "AWS", "Docker"]', 'Interested in cloud computing and backend development'),
(4, 'STU003', '2003-01-10', 'male', '789 Brigade Road', 'Bangalore', 'Karnataka', 'India', '560001', 'Bachelor', 'RVCE Bangalore', 'Electronics', 2025, '["Python", "Machine Learning", "TensorFlow", "Data Analysis"]', 'Aspiring data scientist with focus on ML'),
(5, 'STU004', '2002-11-30', 'female', '321 Anna Salai', 'Chennai', 'Tamil Nadu', 'India', '600002', 'Bachelor', 'Anna University', 'Computer Science', 2024, '["UI/UX Design", "Figma", "HTML", "CSS", "JavaScript"]', 'Creative designer passionate about user experience'),
(6, 'STU005', '2001-07-18', 'male', '654 Connaught Place', 'New Delhi', 'Delhi', 'India', '110001', 'Master', 'IIT Delhi', 'Data Science', 2024, '["Python", "R", "Statistics", "Deep Learning", "NLP"]', 'Research-oriented student focusing on NLP');

-- Internships
INSERT INTO internships (id, title, description, company_name, category, duration_weeks, start_date, end_date, stipend, location, is_remote, requirements, responsibilities, learning_outcomes, max_students, status, created_by) VALUES
(1, 'Full Stack Web Development Internship', 'Learn to build modern web applications using MERN stack. Work on real-world projects and gain hands-on experience with industry-standard tools and practices.', 'TechCorp Solutions', 'Web Development', 12, '2026-06-01', '2026-08-24', 15000.00, 'Mumbai', FALSE, '["Basic knowledge of HTML, CSS, JavaScript", "Familiarity with React", "Understanding of REST APIs", "Good communication skills"]', 'Develop responsive web applications, Write clean and maintainable code, Participate in code reviews, Collaborate with team members', 'Master MERN stack development, Learn Git and version control, Understand Agile methodologies, Build production-ready applications', 20, 'active', 1),
(2, 'Data Science & Machine Learning Internship', 'Dive deep into data science and machine learning. Work with real datasets, build predictive models, and learn industry best practices.', 'DataMinds Analytics', 'Data Science', 16, '2026-06-15', '2026-10-08', 20000.00, 'Bangalore', TRUE, '["Python programming", "Statistics fundamentals", "Basic ML concepts", "Pandas and NumPy experience"]', 'Analyze large datasets, Build ML models, Create data visualizations, Document findings and insights', 'Master Python for data science, Learn advanced ML algorithms, Understand model deployment, Work with big data tools', 15, 'active', 1),
(3, 'Mobile App Development Internship', 'Create amazing mobile applications for Android and iOS platforms using React Native. Learn cross-platform development and publish apps to stores.', 'AppVentures', 'Mobile Development', 10, '2026-07-01', '2026-09-09', 12000.00, 'Pune', FALSE, '["JavaScript knowledge", "Basic React understanding", "Mobile UI/UX awareness", "Problem-solving skills"]', 'Develop mobile applications, Implement UI/UX designs, Test on multiple devices, Optimize app performance', 'Master React Native, Learn mobile app architecture, Understand app store deployment, Build portfolio apps', 25, 'active', 1),
(4, 'Digital Marketing Internship', 'Learn digital marketing strategies including SEO, SEM, social media marketing, and content marketing. Work on real campaigns and analyze results.', 'GrowthHackers Marketing', 'Marketing', 8, '2026-06-10', '2026-08-05', 8000.00, 'Delhi', TRUE, '["Good writing skills", "Social media familiarity", "Basic analytics understanding", "Creative thinking"]', 'Create marketing campaigns, Manage social media accounts, Analyze campaign performance, Write engaging content', 'Master digital marketing tools, Learn SEO and SEM, Understand analytics, Create effective campaigns', 30, 'active', 1),
(5, 'UI/UX Design Internship', 'Design beautiful and intuitive user interfaces. Learn design thinking, user research, prototyping, and usability testing.', 'DesignStudio Pro', 'Design', 12, '2026-07-15', '2026-10-07', 10000.00, 'Hyderabad', TRUE, '["Figma or Adobe XD knowledge", "Design principles understanding", "Portfolio of work", "Attention to detail"]', 'Create wireframes and mockups, Conduct user research, Design interactive prototypes, Collaborate with developers', 'Master design tools, Learn user research methods, Understand design systems, Build professional portfolio', 15, 'active', 1),
(6, 'Cloud Computing & DevOps Internship', 'Learn cloud infrastructure, CI/CD pipelines, containerization, and automation. Work with AWS, Docker, and Kubernetes.', 'CloudOps Technologies', 'DevOps', 14, '2026-08-01', '2026-11-07', 18000.00, 'Bangalore', FALSE, '["Linux basics", "Scripting knowledge", "Networking fundamentals", "Problem-solving mindset"]', 'Set up cloud infrastructure, Create CI/CD pipelines, Manage containers, Automate deployments', 'Master AWS services, Learn Docker and Kubernetes, Understand DevOps practices, Build scalable systems', 12, 'active', 1);

-- Applications
INSERT INTO applications (internship_id, student_id, cover_letter, status, applied_at, reviewed_by, review_notes) VALUES
(1, 1, 'I am very interested in full stack development and have built several projects using React and Node.js. I am eager to learn more and contribute to real-world projects.', 'approved', '2026-05-10 10:30:00', 1, 'Strong portfolio, good communication skills'),
(1, 2, 'I have experience with Java backend development and want to expand my skills to include modern JavaScript frameworks. This internship aligns perfectly with my career goals.', 'approved', '2026-05-11 14:20:00', 1, 'Good technical background'),
(2, 3, 'Data science is my passion. I have completed several online courses and worked on personal projects involving ML algorithms. I am excited to work with real datasets.', 'approved', '2026-05-12 09:15:00', 1, 'Strong ML fundamentals'),
(2, 5, 'I am pursuing my masters in Data Science and looking for practical experience. I have strong Python skills and understanding of statistical methods.', 'approved', '2026-05-12 16:45:00', 1, 'Excellent academic background'),
(3, 1, 'I want to learn mobile development to complement my web development skills. I have basic React knowledge which will help me learn React Native quickly.', 'pending', '2026-05-13 11:00:00', NULL, NULL),
(4, 4, 'As a designer, I understand the importance of marketing. I want to learn how to market digital products effectively and create engaging campaigns.', 'approved', '2026-05-14 10:30:00', 1, 'Creative approach, good fit'),
(5, 4, 'UI/UX design is my core strength. I have a portfolio of 10+ projects and I am proficient in Figma. I would love to work on professional projects.', 'approved', '2026-05-15 13:20:00', 1, 'Impressive portfolio'),
(6, 2, 'I have experience with AWS and Docker from my previous projects. I want to deepen my DevOps knowledge and learn Kubernetes.', 'pending', '2026-05-16 15:00:00', NULL, NULL);

-- Attendance (for approved students)
INSERT INTO attendance (student_id, internship_id, date, status, check_in_time, check_out_time, marked_by) VALUES
-- Rahul (Student 1) - Internship 1
(1, 1, '2026-06-01', 'present', '09:00:00', '17:00:00', 1),
(1, 1, '2026-06-02', 'present', '09:05:00', '17:10:00', 1),
(1, 1, '2026-06-03', 'present', '09:00:00', '17:00:00', 1),
(1, 1, '2026-06-04', 'late', '09:30:00', '17:00:00', 1),
(1, 1, '2026-06-05', 'present', '09:00:00', '17:00:00', 1),
-- Priya (Student 2) - Internship 1
(2, 1, '2026-06-01', 'present', '09:00:00', '17:00:00', 1),
(2, 1, '2026-06-02', 'present', '09:00:00', '17:00:00', 1),
(2, 1, '2026-06-03', 'absent', NULL, NULL, 1),
(2, 1, '2026-06-04', 'present', '09:00:00', '17:00:00', 1),
(2, 1, '2026-06-05', 'present', '09:00:00', '17:00:00', 1),
-- Amit (Student 3) - Internship 2
(3, 2, '2026-06-15', 'present', '10:00:00', '18:00:00', 1),
(3, 2, '2026-06-16', 'present', '10:00:00', '18:00:00', 1),
(3, 2, '2026-06-17', 'present', '10:00:00', '18:00:00', 1);

-- Learning Materials
INSERT INTO learning_materials (internship_id, title, description, type, external_url, order_index, is_mandatory, uploaded_by) VALUES
(1, 'Introduction to MERN Stack', 'Overview of MongoDB, Express, React, and Node.js', 'video', 'https://youtube.com/watch?v=example1', 1, TRUE, 1),
(1, 'React Fundamentals', 'Learn React components, props, state, and hooks', 'document', 'https://docs.example.com/react-fundamentals.pdf', 2, TRUE, 1),
(1, 'Building REST APIs with Express', 'Complete guide to creating RESTful APIs', 'video', 'https://youtube.com/watch?v=example2', 3, TRUE, 1),
(1, 'MongoDB Database Design', 'Best practices for NoSQL database design', 'document', 'https://docs.example.com/mongodb-design.pdf', 4, FALSE, 1),
(2, 'Python for Data Science', 'Python basics and data science libraries', 'video', 'https://youtube.com/watch?v=example3', 1, TRUE, 1),
(2, 'Machine Learning Algorithms', 'Understanding supervised and unsupervised learning', 'document', 'https://docs.example.com/ml-algorithms.pdf', 2, TRUE, 1),
(2, 'Data Visualization with Matplotlib', 'Creating effective data visualizations', 'video', 'https://youtube.com/watch?v=example4', 3, FALSE, 1),
(3, 'React Native Setup', 'Setting up development environment for React Native', 'document', 'https://docs.example.com/rn-setup.pdf', 1, TRUE, 1),
(3, 'Mobile UI Design Principles', 'Designing for mobile platforms', 'video', 'https://youtube.com/watch?v=example5', 2, TRUE, 1);

-- Assessments
INSERT INTO assessments (internship_id, title, description, type, total_marks, passing_marks, duration_minutes, questions, created_by) VALUES
(1, 'JavaScript Basics Quiz', 'Test your JavaScript fundamentals', 'quiz', 50, 25, 30, '[
  {
    "id": 1,
    "question": "What is the output of: console.log(typeof null)?",
    "type": "mcq",
    "options": ["null", "undefined", "object", "number"],
    "correctAnswer": 2,
    "marks": 5
  },
  {
    "id": 2,
    "question": "Which method is used to add elements to the end of an array?",
    "type": "mcq",
    "options": ["push()", "pop()", "shift()", "unshift()"],
    "correctAnswer": 0,
    "marks": 5
  },
  {
    "id": 3,
    "question": "Explain the difference between let, const, and var.",
    "type": "text",
    "marks": 10
  },
  {
    "id": 4,
    "question": "What is a closure in JavaScript?",
    "type": "text",
    "marks": 10
  },
  {
    "id": 5,
    "question": "Which of the following is NOT a JavaScript data type?",
    "type": "mcq",
    "options": ["String", "Boolean", "Float", "Symbol"],
    "correctAnswer": 2,
    "marks": 5
  }
]', 1),
(2, 'Python & Data Science Quiz', 'Test your Python and data science knowledge', 'quiz', 60, 30, 45, '[
  {
    "id": 1,
    "question": "Which library is primarily used for data manipulation in Python?",
    "type": "mcq",
    "options": ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
    "correctAnswer": 1,
    "marks": 5
  },
  {
    "id": 2,
    "question": "What is overfitting in machine learning?",
    "type": "text",
    "marks": 15
  },
  {
    "id": 3,
    "question": "Which algorithm is used for classification problems?",
    "type": "mcq",
    "options": ["Linear Regression", "K-Means", "Decision Tree", "PCA"],
    "correctAnswer": 2,
    "marks": 5
  }
]', 1);

-- Student Assessment Attempts
INSERT INTO student_assessments (assessment_id, student_id, attempt_number, answers, score, percentage, status, submitted_at, graded_by) VALUES
(1, 1, 1, '[
  {"questionId": 1, "answer": 2},
  {"questionId": 2, "answer": 0},
  {"questionId": 3, "answer": "let and const are block-scoped while var is function-scoped. const cannot be reassigned."},
  {"questionId": 4, "answer": "A closure is a function that has access to variables in its outer scope."},
  {"questionId": 5, "answer": 2}
]', 42.00, 84.00, 'graded', '2026-06-10 15:30:00', 1),
(1, 2, 1, '[
  {"questionId": 1, "answer": 2},
  {"questionId": 2, "answer": 0},
  {"questionId": 3, "answer": "All are used for variable declaration but have different scoping rules."},
  {"questionId": 4, "answer": "Not sure about closures."},
  {"questionId": 5, "answer": 2}
]', 28.00, 56.00, 'graded', '2026-06-10 16:00:00', 1);

-- Exams
INSERT INTO exams (internship_id, title, description, exam_date, duration_minutes, total_marks, passing_marks, questions, instructions, max_attempts, created_by) VALUES
(1, 'MERN Stack Final Exam', 'Comprehensive exam covering all MERN stack concepts', '2026-08-20 10:00:00', 120, 100, 50, '[
  {
    "id": 1,
    "question": "Explain the Virtual DOM in React and its benefits.",
    "type": "text",
    "marks": 15
  },
  {
    "id": 2,
    "question": "What is middleware in Express.js?",
    "type": "text",
    "marks": 10
  },
  {
    "id": 3,
    "question": "Which HTTP method is used to update a resource?",
    "type": "mcq",
    "options": ["GET", "POST", "PUT", "DELETE"],
    "correctAnswer": 2,
    "marks": 5
  },
  {
    "id": 4,
    "question": "Describe the aggregation pipeline in MongoDB.",
    "type": "text",
    "marks": 15
  },
  {
    "id": 5,
    "question": "What is the purpose of useEffect hook in React?",
    "type": "text",
    "marks": 15
  }
]', 'Read all questions carefully. Manage your time wisely. No external resources allowed.', 2, 1);

-- Certificates
INSERT INTO certificates (certificate_number, student_id, internship_id, issue_date, completion_date, grade, performance_score, verification_code, issued_by, remarks) VALUES
('CERT-2026-001', 1, 1, '2026-08-25', '2026-08-24', 'A', 85.50, 'VERIFY-ABC123XYZ', 1, 'Excellent performance throughout the internship'),
('CERT-2026-002', 2, 1, '2026-08-25', '2026-08-24', 'B+', 78.00, 'VERIFY-DEF456UVW', 1, 'Good work and consistent attendance');

-- Notifications
INSERT INTO notifications (user_id, title, message, type, related_id, is_read, priority) VALUES
(2, 'Application Approved', 'Your application for Full Stack Web Development Internship has been approved!', 'application', 1, TRUE, 'high'),
(2, 'New Assessment Available', 'JavaScript Basics Quiz is now available. Complete it before the deadline.', 'assessment', 1, FALSE, 'medium'),
(2, 'Certificate Ready', 'Your internship certificate is ready for download!', 'certificate', 1, FALSE, 'high'),
(3, 'Application Approved', 'Your application for Data Science & Machine Learning Internship has been approved!', 'application', 3, TRUE, 'high'),
(4, 'Application Approved', 'Your application for Digital Marketing Internship has been approved!', 'application', 6, TRUE, 'high'),
(4, 'Application Approved', 'Your application for UI/UX Design Internship has been approved!', 'application', 7, TRUE, 'high');

-- Material Progress
INSERT INTO material_progress (student_id, material_id, progress_percentage, is_completed, completed_at) VALUES
(1, 1, 100, TRUE, '2026-06-02 18:00:00'),
(1, 2, 100, TRUE, '2026-06-04 19:00:00'),
(1, 3, 60, FALSE, NULL),
(2, 1, 100, TRUE, '2026-06-03 17:30:00'),
(2, 2, 45, FALSE, NULL),
(3, 5, 100, TRUE, '2026-06-16 20:00:00'),
(3, 6, 80, FALSE, NULL);
