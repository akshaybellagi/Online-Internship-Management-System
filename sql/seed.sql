-- Seed Data for Online Internship Management System
-- Comprehensive test data for all tables
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
DELETE FROM settings WHERE setting_key NOT IN ('site_name', 'attendance_required_percentage', 'max_application_per_student', 'certificate_prefix');
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

-- ============================================
-- USERS DATA
-- ============================================
-- Password for all users: admin123 (for admin) or student123 (for students)
-- Hashed using bcrypt with 10 rounds

-- Update admin user if exists, otherwise insert
INSERT INTO users (id, name, email, password, role, phone, is_active) VALUES
(1, 'Admin User', 'admin@internhub.com', '$2b$10$/kj3aiHxI9dCEDFwqn6Rv.lBNmBUIx9kQNRSO/ck8me.hwD2QTOe.', 'admin', '+91-9876543210', TRUE)
ON DUPLICATE KEY UPDATE 
  name = 'Admin User',
  email = 'admin@internhub.com',
  password = '$2b$10$/kj3aiHxI9dCEDFwqn6Rv.lBNmBUIx9kQNRSO/ck8me.hwD2QTOe.',
  phone = '+91-9876543210';

-- Insert student users (20 students)
INSERT INTO users (id, name, email, password, role, phone, is_active) VALUES
(2, 'Rahul Sharma', 'rahul.sharma@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543211', TRUE),
(3, 'Priya Patel', 'priya.patel@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543212', TRUE),
(4, 'Amit Kumar', 'amit.kumar@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543213', TRUE),
(5, 'Sneha Reddy', 'sneha.reddy@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543214', TRUE),
(6, 'Vikram Singh', 'vikram.singh@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543215', TRUE),
(7, 'Ananya Iyer', 'ananya.iyer@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543216', TRUE),
(8, 'Rohan Gupta', 'rohan.gupta@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543217', TRUE),
(9, 'Kavya Nair', 'kavya.nair@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543218', TRUE),
(10, 'Arjun Mehta', 'arjun.mehta@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543219', TRUE),
(11, 'Diya Kapoor', 'diya.kapoor@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543220', TRUE),
(12, 'Karan Malhotra', 'karan.malhotra@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543221', TRUE),
(13, 'Ishita Joshi', 'ishita.joshi@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543222', TRUE),
(14, 'Aditya Verma', 'aditya.verma@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543223', TRUE),
(15, 'Meera Desai', 'meera.desai@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543224', TRUE),
(16, 'Siddharth Rao', 'siddharth.rao@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543225', TRUE),
(17, 'Tanvi Bhatt', 'tanvi.bhatt@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543226', TRUE),
(18, 'Nikhil Saxena', 'nikhil.saxena@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543227', TRUE),
(19, 'Riya Agarwal', 'riya.agarwal@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543228', TRUE),
(20, 'Varun Chopra', 'varun.chopra@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543229', TRUE),
(21, 'Pooja Sinha', 'pooja.sinha@student.com', '$2b$10$z0Cqu8GkV.27p.sCk7zuGO4bwik6bz1LGzN8EmjYd8KT/.mSQuirm', 'student', '+91-9876543230', TRUE);

-- ============================================
-- STUDENTS DATA
-- ============================================
INSERT INTO students (user_id, student_id, date_of_birth, gender, address, city, state, country, postal_code, education_level, institution, field_of_study, graduation_year, skills, resume_url, linkedin_url, github_url, portfolio_url, bio) VALUES
(2, 'STU001', '2002-05-15', 'male', '123 MG Road', 'Mumbai', 'Maharashtra', 'India', '400001', 'Bachelor', 'Mumbai University', 'Computer Science', 2024, '["JavaScript", "React", "Node.js", "Python", "SQL", "MongoDB"]', 'https://example.com/resume/rahul.pdf', 'https://linkedin.com/in/rahulsharma', 'https://github.com/rahulsharma', 'https://rahulsharma.dev', 'Passionate about web development and AI. Love building scalable applications.'),
(3, 'STU002', '2001-08-22', 'female', '456 Park Street', 'Kolkata', 'West Bengal', 'India', '700016', 'Bachelor', 'Jadavpur University', 'Information Technology', 2024, '["Java", "Spring Boot", "MySQL", "AWS", "Docker", "Kubernetes"]', 'https://example.com/resume/priya.pdf', 'https://linkedin.com/in/priyapatel', 'https://github.com/priyapatel', NULL, 'Interested in cloud computing and backend development. DevOps enthusiast.'),
(4, 'STU003', '2003-01-10', 'male', '789 Brigade Road', 'Bangalore', 'Karnataka', 'India', '560001', 'Bachelor', 'RVCE Bangalore', 'Electronics', 2025, '["Python", "Machine Learning", "TensorFlow", "Data Analysis", "Pandas", "NumPy"]', 'https://example.com/resume/amit.pdf', 'https://linkedin.com/in/amitkumar', 'https://github.com/amitkumar', 'https://amitkumar.tech', 'Aspiring data scientist with focus on ML and deep learning.'),
(5, 'STU004', '2002-11-30', 'female', '321 Anna Salai', 'Chennai', 'Tamil Nadu', 'India', '600002', 'Bachelor', 'Anna University', 'Computer Science', 2024, '["UI/UX Design", "Figma", "Adobe XD", "HTML", "CSS", "JavaScript", "React"]', 'https://example.com/resume/sneha.pdf', 'https://linkedin.com/in/snehareddy', NULL, 'https://snehareddy.design', 'Creative designer passionate about user experience and visual design.'),
(6, 'STU005', '2001-07-18', 'male', '654 Connaught Place', 'New Delhi', 'Delhi', 'India', '110001', 'Master', 'IIT Delhi', 'Data Science', 2024, '["Python", "R", "Statistics", "Deep Learning", "NLP", "PyTorch"]', 'https://example.com/resume/vikram.pdf', 'https://linkedin.com/in/vikramsingh', 'https://github.com/vikramsingh', NULL, 'Research-oriented student focusing on NLP and computer vision.'),
(7, 'STU006', '2002-03-25', 'female', '111 Residency Road', 'Bangalore', 'Karnataka', 'India', '560025', 'Bachelor', 'PES University', 'Computer Science', 2025, '["Flutter", "Dart", "Firebase", "React Native", "Mobile UI/UX"]', 'https://example.com/resume/ananya.pdf', 'https://linkedin.com/in/ananyaiyer', 'https://github.com/ananyaiyer', 'https://ananyaiyer.com', 'Mobile app developer passionate about creating beautiful cross-platform apps.'),
(8, 'STU007', '2003-06-12', 'male', '222 Civil Lines', 'Jaipur', 'Rajasthan', 'India', '302006', 'Bachelor', 'MNIT Jaipur', 'Computer Engineering', 2025, '["C++", "Python", "Algorithms", "Data Structures", "Competitive Programming"]', 'https://example.com/resume/rohan.pdf', 'https://linkedin.com/in/rohangupta', 'https://github.com/rohangupta', NULL, 'Competitive programmer with interest in algorithms and problem-solving.'),
(9, 'STU008', '2002-09-08', 'female', '333 Marine Drive', 'Kochi', 'Kerala', 'India', '682031', 'Bachelor', 'CUSAT', 'Information Technology', 2024, '["Angular", "TypeScript", "Node.js", "PostgreSQL", "GraphQL"]', 'https://example.com/resume/kavya.pdf', 'https://linkedin.com/in/kavyanair', 'https://github.com/kavyanair', 'https://kavyanair.dev', 'Full-stack developer with expertise in modern web technologies.'),
(10, 'STU009', '2001-12-20', 'male', '444 Linking Road', 'Mumbai', 'Maharashtra', 'India', '400050', 'Bachelor', 'VJTI Mumbai', 'Computer Engineering', 2024, '["Blockchain", "Solidity", "Web3.js", "Ethereum", "Smart Contracts"]', 'https://example.com/resume/arjun.pdf', 'https://linkedin.com/in/arjunmehta', 'https://github.com/arjunmehta', NULL, 'Blockchain enthusiast exploring decentralized applications and Web3.'),
(11, 'STU010', '2003-04-17', 'female', '555 Golf Course Road', 'Gurgaon', 'Haryana', 'India', '122002', 'Bachelor', 'Amity University', 'Computer Science', 2025, '["Content Writing", "SEO", "Digital Marketing", "Social Media", "Canva"]', 'https://example.com/resume/diya.pdf', 'https://linkedin.com/in/diyakapoor', NULL, 'https://diyakapoor.blog', 'Digital marketing enthusiast with strong content creation skills.'),
(12, 'STU011', '2002-02-14', 'male', '666 Sector 17', 'Chandigarh', 'Chandigarh', 'India', '160017', 'Bachelor', 'PU Chandigarh', 'Computer Science', 2024, '["PHP", "Laravel", "MySQL", "Vue.js", "REST APIs"]', 'https://example.com/resume/karan.pdf', 'https://linkedin.com/in/karanmalhotra', 'https://github.com/karanmalhotra', NULL, 'Backend developer specializing in PHP and Laravel framework.'),
(13, 'STU012', '2001-10-05', 'female', '777 Law Garden', 'Ahmedabad', 'Gujarat', 'India', '380006', 'Bachelor', 'DAIICT', 'Information Technology', 2024, '["Cybersecurity", "Ethical Hacking", "Network Security", "Python", "Linux"]', 'https://example.com/resume/ishita.pdf', 'https://linkedin.com/in/ishitajoshi', 'https://github.com/ishitajoshi', NULL, 'Cybersecurity enthusiast interested in ethical hacking and penetration testing.'),
(14, 'STU013', '2003-07-28', 'male', '888 Hazratganj', 'Lucknow', 'Uttar Pradesh', 'India', '226001', 'Bachelor', 'IET Lucknow', 'Computer Science', 2025, '["Unity", "C#", "Game Development", "3D Modeling", "Blender"]', 'https://example.com/resume/aditya.pdf', 'https://linkedin.com/in/adityaverma', 'https://github.com/adityaverma', 'https://adityaverma.games', 'Game developer passionate about creating immersive gaming experiences.'),
(15, 'STU014', '2002-01-19', 'female', '999 SG Highway', 'Ahmedabad', 'Gujarat', 'India', '380015', 'Bachelor', 'Nirma University', 'Computer Engineering', 2024, '["IoT", "Arduino", "Raspberry Pi", "Python", "Embedded Systems"]', 'https://example.com/resume/meera.pdf', 'https://linkedin.com/in/meeradesai', 'https://github.com/meeradesai', NULL, 'IoT enthusiast working on smart home and automation projects.'),
(16, 'STU015', '2001-11-11', 'male', '101 Jubilee Hills', 'Hyderabad', 'Telangana', 'India', '500033', 'Master', 'IIIT Hyderabad', 'Computer Science', 2024, '["AI", "Computer Vision", "OpenCV", "TensorFlow", "Python"]', 'https://example.com/resume/siddharth.pdf', 'https://linkedin.com/in/siddharthrao', 'https://github.com/siddharthrao', 'https://siddharthrao.ai', 'AI researcher focusing on computer vision and image processing.'),
(17, 'STU016', '2003-05-23', 'female', '202 Satellite', 'Ahmedabad', 'Gujarat', 'India', '380015', 'Bachelor', 'PDPU', 'Information Technology', 2025, '["Graphic Design", "Illustrator", "Photoshop", "Branding", "UI Design"]', 'https://example.com/resume/tanvi.pdf', 'https://linkedin.com/in/tanvibhatt', NULL, 'https://tanvibhatt.design', 'Graphic designer with expertise in branding and visual identity.'),
(18, 'STU017', '2002-08-16', 'male', '303 Gomti Nagar', 'Lucknow', 'Uttar Pradesh', 'India', '226010', 'Bachelor', 'BBDNITM', 'Computer Science', 2024, '["Django", "Python", "PostgreSQL", "Redis", "Celery"]', 'https://example.com/resume/nikhil.pdf', 'https://linkedin.com/in/nikhilsaxena', 'https://github.com/nikhilsaxena', NULL, 'Python backend developer with experience in Django framework.'),
(19, 'STU018', '2001-04-09', 'female', '404 Vaishali Nagar', 'Jaipur', 'Rajasthan', 'India', '302021', 'Bachelor', 'Manipal University Jaipur', 'Computer Science', 2024, '["Business Analysis", "SQL", "Excel", "Tableau", "Power BI"]', 'https://example.com/resume/riya.pdf', 'https://linkedin.com/in/riyaagarwal', NULL, NULL, 'Business analyst with strong data visualization and analytical skills.'),
(20, 'STU019', '2003-09-30', 'male', '505 Banjara Hills', 'Hyderabad', 'Telangana', 'India', '500034', 'Bachelor', 'CBIT', 'Computer Science', 2025, '["Salesforce", "Apex", "Lightning", "CRM", "Integration"]', 'https://example.com/resume/varun.pdf', 'https://linkedin.com/in/varunchopra', 'https://github.com/varunchopra', NULL, 'Salesforce developer interested in CRM solutions and cloud platforms.'),
(21, 'STU020', '2002-06-07', 'female', '606 Salt Lake', 'Kolkata', 'West Bengal', 'India', '700091', 'Bachelor', 'Techno India', 'Information Technology', 2024, '["Quality Assurance", "Selenium", "Testing", "Automation", "JIRA"]', 'https://example.com/resume/pooja.pdf', 'https://linkedin.com/in/poojasinha', 'https://github.com/poojasinha', NULL, 'QA engineer passionate about test automation and quality processes.');

-- ============================================
-- INTERNSHIPS DATA
-- ============================================
INSERT INTO internships (id, title, description, company_name, category, duration_weeks, start_date, end_date, stipend, location, is_remote, requirements, responsibilities, learning_outcomes, max_students, status, created_by) VALUES
(1, 'Full Stack Web Development Internship', 'Learn to build modern web applications using MERN stack. Work on real-world projects and gain hands-on experience with industry-standard tools and practices. You will be part of our development team working on client projects.', 'TechCorp Solutions', 'Web Development', 12, '2026-06-01', '2026-08-24', 15000.00, 'Mumbai', FALSE, '["Basic knowledge of HTML, CSS, JavaScript", "Familiarity with React", "Understanding of REST APIs", "Good communication skills", "Git version control"]', 'Develop responsive web applications, Write clean and maintainable code, Participate in code reviews, Collaborate with team members, Debug and fix issues, Document code and features', 'Master MERN stack development, Learn Git and version control, Understand Agile methodologies, Build production-ready applications, Work in a team environment', 20, 'active', 1),
(2, 'Data Science & Machine Learning Internship', 'Dive deep into data science and machine learning. Work with real datasets, build predictive models, and learn industry best practices. Gain experience with the complete ML pipeline from data collection to model deployment.', 'DataMinds Analytics', 'Data Science', 16, '2026-06-15', '2026-10-08', 20000.00, 'Bangalore', TRUE, '["Python programming", "Statistics fundamentals", "Basic ML concepts", "Pandas and NumPy experience", "Data visualization skills"]', 'Analyze large datasets, Build ML models, Create data visualizations, Document findings and insights, Present results to stakeholders, Optimize model performance', 'Master Python for data science, Learn advanced ML algorithms, Understand model deployment, Work with big data tools, Statistical analysis techniques', 15, 'active', 1),
(3, 'Mobile App Development Internship', 'Create amazing mobile applications for Android and iOS platforms using React Native. Learn cross-platform development and publish apps to stores. Work on real client projects and build your portfolio.', 'AppVentures', 'Mobile Development', 10, '2026-07-01', '2026-09-09', 12000.00, 'Pune', FALSE, '["JavaScript knowledge", "Basic React understanding", "Mobile UI/UX awareness", "Problem-solving skills", "Attention to detail"]', 'Develop mobile applications, Implement UI/UX designs, Test on multiple devices, Optimize app performance, Integrate APIs, Debug issues', 'Master React Native, Learn mobile app architecture, Understand app store deployment, Build portfolio apps, Cross-platform development', 25, 'active', 1),
(4, 'Digital Marketing Internship', 'Learn digital marketing strategies including SEO, SEM, social media marketing, and content marketing. Work on real campaigns and analyze results. Get hands-on experience with industry-leading marketing tools.', 'GrowthHackers Marketing', 'Marketing', 8, '2026-06-10', '2026-08-05', 8000.00, 'Delhi', TRUE, '["Good writing skills", "Social media familiarity", "Basic analytics understanding", "Creative thinking", "Communication skills"]', 'Create marketing campaigns, Manage social media accounts, Analyze campaign performance, Write engaging content, Conduct market research, Email marketing', 'Master digital marketing tools, Learn SEO and SEM, Understand analytics, Create effective campaigns, Social media strategy', 30, 'active', 1),
(5, 'UI/UX Design Internship', 'Design beautiful and intuitive user interfaces. Learn design thinking, user research, prototyping, and usability testing. Work with experienced designers on real projects for various clients.', 'DesignStudio Pro', 'Design', 12, '2026-07-15', '2026-10-07', 10000.00, 'Hyderabad', TRUE, '["Figma or Adobe XD knowledge", "Design principles understanding", "Portfolio of work", "Attention to detail", "Creative mindset"]', 'Create wireframes and mockups, Conduct user research, Design interactive prototypes, Collaborate with developers, Present designs to clients, Iterate based on feedback', 'Master design tools, Learn user research methods, Understand design systems, Build professional portfolio, Client communication', 15, 'active', 1),
(6, 'Cloud Computing & DevOps Internship', 'Learn cloud infrastructure, CI/CD pipelines, containerization, and automation. Work with AWS, Docker, and Kubernetes. Gain practical experience in deploying and managing cloud applications.', 'CloudOps Technologies', 'DevOps', 14, '2026-08-01', '2026-11-07', 18000.00, 'Bangalore', FALSE, '["Linux basics", "Scripting knowledge", "Networking fundamentals", "Problem-solving mindset", "Command line proficiency"]', 'Set up cloud infrastructure, Create CI/CD pipelines, Manage containers, Automate deployments, Monitor systems, Troubleshoot issues', 'Master AWS services, Learn Docker and Kubernetes, Understand DevOps practices, Build scalable systems, Infrastructure as code', 12, 'active', 1),
(7, 'Cybersecurity Internship', 'Learn about network security, ethical hacking, vulnerability assessment, and security best practices. Work on real security audits and penetration testing projects under expert guidance.', 'SecureNet Solutions', 'Cybersecurity', 10, '2026-06-20', '2026-08-29', 16000.00, 'Pune', FALSE, '["Basic networking knowledge", "Linux familiarity", "Programming basics", "Analytical thinking", "Security awareness"]', 'Conduct security assessments, Perform penetration testing, Analyze vulnerabilities, Document findings, Implement security measures, Learn security tools', 'Ethical hacking techniques, Security assessment methodologies, Network security, Web application security, Security tools mastery', 10, 'active', 1),
(8, 'Blockchain Development Internship', 'Explore blockchain technology and develop decentralized applications. Learn Solidity, smart contracts, and Web3 development. Work on innovative blockchain projects.', 'CryptoTech Innovations', 'Blockchain', 12, '2026-07-10', '2026-10-02', 17000.00, 'Bangalore', TRUE, '["JavaScript knowledge", "Basic blockchain understanding", "Problem-solving skills", "Interest in cryptocurrency", "Programming experience"]', 'Develop smart contracts, Build DApps, Test blockchain applications, Integrate Web3, Document code, Research blockchain trends', 'Master Solidity programming, Understand blockchain architecture, Learn Web3 development, Smart contract security, DApp deployment', 8, 'active', 1),
(9, 'Content Writing & SEO Internship', 'Create engaging content for websites, blogs, and social media. Learn SEO best practices and content strategy. Work with various clients across different industries.', 'ContentCraft Agency', 'Content Writing', 8, '2026-06-05', '2026-07-31', 7000.00, 'Remote', TRUE, '["Excellent writing skills", "Grammar proficiency", "Research abilities", "Creativity", "Basic SEO knowledge"]', 'Write blog posts and articles, Optimize content for SEO, Conduct keyword research, Edit and proofread, Create social media content, Analyze content performance', 'Professional writing skills, SEO optimization, Content strategy, Research techniques, Content management systems', 20, 'active', 1),
(10, 'Game Development Internship', 'Create exciting games using Unity and C#. Learn game design, physics, animations, and game mechanics. Work on both 2D and 3D game projects.', 'GameForge Studios', 'Game Development', 14, '2026-07-20', '2026-10-25', 14000.00, 'Hyderabad', FALSE, '["C# programming", "Unity basics", "Game design interest", "Problem-solving skills", "Creative thinking"]', 'Develop game mechanics, Create game assets, Implement physics, Design levels, Test gameplay, Optimize performance', 'Master Unity engine, Learn C# for games, Game design principles, Physics and animations, Game optimization', 12, 'active', 1),
(11, 'Business Analytics Internship', 'Analyze business data and create insights using SQL, Excel, and BI tools. Learn data-driven decision making and business intelligence. Work with real business datasets.', 'Analytics Pro Consulting', 'Business Analytics', 10, '2026-06-25', '2026-09-03', 13000.00, 'Mumbai', TRUE, '["SQL knowledge", "Excel proficiency", "Analytical thinking", "Statistics basics", "Communication skills"]', 'Analyze business data, Create dashboards, Generate reports, Present insights, Identify trends, Support decision making', 'Advanced SQL, Business intelligence tools, Data visualization, Statistical analysis, Business acumen', 15, 'active', 1),
(12, 'IoT Development Internship', 'Build Internet of Things solutions using Arduino, Raspberry Pi, and sensors. Learn embedded systems and IoT protocols. Create smart devices and automation systems.', 'SmartTech IoT', 'IoT', 12, '2026-08-05', '2026-10-28', 15000.00, 'Bangalore', FALSE, '["Basic electronics", "Programming knowledge", "Problem-solving skills", "Hardware interest", "Python or C++"]', 'Build IoT devices, Program microcontrollers, Integrate sensors, Develop IoT applications, Test hardware, Document projects', 'IoT architecture, Embedded programming, Sensor integration, IoT protocols, Hardware-software integration', 10, 'active', 1);

-- ============================================
-- APPLICATIONS DATA
-- ============================================
INSERT INTO applications (internship_id, student_id, cover_letter, status, applied_at, reviewed_at, reviewed_by, review_notes) VALUES
-- Internship 1: Full Stack Web Development
(1, 1, 'I am very interested in full stack development and have built several projects using React and Node.js. I am eager to learn more and contribute to real-world projects. My portfolio includes an e-commerce website and a social media dashboard.', 'approved', '2026-05-10 10:30:00', '2026-05-11 09:00:00', 1, 'Strong portfolio, good communication skills, excellent React knowledge'),
(1, 2, 'I have experience with Java backend development and want to expand my skills to include modern JavaScript frameworks. This internship aligns perfectly with my career goals.', 'approved', '2026-05-11 14:20:00', '2026-05-12 10:00:00', 1, 'Good technical background, motivated learner'),
(1, 8, 'I have strong fundamentals in data structures and algorithms. I want to apply my problem-solving skills to web development and learn the MERN stack.', 'approved', '2026-05-12 11:00:00', '2026-05-13 14:00:00', 1, 'Strong CS fundamentals, quick learner'),
(1, 9, 'As an Angular developer, I want to learn React and Node.js to become a complete full-stack developer. I have experience building enterprise applications.', 'pending', '2026-05-15 16:30:00', NULL, NULL, NULL),
(1, 12, 'I have been working with PHP and Laravel. I want to transition to JavaScript stack and learn modern web development practices.', 'rejected', '2026-05-09 09:00:00', '2026-05-10 11:00:00', 1, 'Limited JavaScript experience, recommend starting with basics first'),

-- Internship 2: Data Science & ML
(2, 4, 'Data science is my passion. I have completed several online courses and worked on personal projects involving ML algorithms. I am excited to work with real datasets.', 'approved', '2026-05-12 09:15:00', '2026-05-13 10:00:00', 1, 'Strong ML fundamentals, good project portfolio'),
(2, 6, 'I am pursuing my masters in Data Science and looking for practical experience. I have strong Python skills and understanding of statistical methods.', 'approved', '2026-05-12 16:45:00', '2026-05-13 11:00:00', 1, 'Excellent academic background, research experience'),
(2, 16, 'I am working on computer vision research and want to gain industry experience in ML. I have published papers in this field.', 'approved', '2026-05-13 14:00:00', '2026-05-14 09:00:00', 1, 'Strong research background, excellent fit'),
(2, 19, 'I have experience with business analytics and want to transition to data science. I am proficient in SQL and Excel.', 'pending', '2026-05-16 10:00:00', NULL, NULL, NULL),

-- Internship 3: Mobile App Development
(3, 1, 'I want to learn mobile development to complement my web development skills. I have basic React knowledge which will help me learn React Native quickly.', 'approved', '2026-05-13 11:00:00', '2026-05-14 15:00:00', 1, 'Good React foundation, motivated to learn mobile'),
(3, 7, 'I have been developing Flutter apps and want to learn React Native for cross-platform development. I have published 2 apps on Play Store.', 'approved', '2026-05-14 09:30:00', '2026-05-15 10:00:00', 1, 'Strong mobile development experience'),
(3, 9, 'I want to expand from web to mobile development. I have experience with responsive design and PWAs.', 'pending', '2026-05-17 14:00:00', NULL, NULL, NULL),

-- Internship 4: Digital Marketing
(4, 5, 'As a designer, I understand the importance of marketing. I want to learn how to market digital products effectively and create engaging campaigns.', 'approved', '2026-05-14 10:30:00', '2026-05-15 09:00:00', 1, 'Creative approach, good fit for content creation'),
(4, 11, 'I have been managing social media for college events. I want to learn professional digital marketing strategies and tools.', 'approved', '2026-05-14 15:00:00', '2026-05-15 11:00:00', 1, 'Good social media experience, enthusiastic'),
(4, 17, 'As a graphic designer, I want to learn how to market design services and understand client acquisition strategies.', 'approved', '2026-05-15 11:00:00', '2026-05-16 10:00:00', 1, 'Design skills will be valuable for marketing'),

-- Internship 5: UI/UX Design
(5, 5, 'UI/UX design is my core strength. I have a portfolio of 10+ projects and I am proficient in Figma. I would love to work on professional projects.', 'approved', '2026-05-15 13:20:00', '2026-05-16 09:00:00', 1, 'Impressive portfolio, strong design skills'),
(5, 17, 'I have experience in graphic design and want to transition to UI/UX. I understand visual design principles and branding.', 'approved', '2026-05-16 10:00:00', '2026-05-17 09:00:00', 1, 'Good design foundation, needs UX training'),
(5, 11, 'I want to learn UI/UX design to complement my marketing skills. I have basic Canva experience.', 'pending', '2026-05-18 11:00:00', NULL, NULL, NULL),

-- Internship 6: Cloud & DevOps
(6, 2, 'I have experience with AWS and Docker from my previous projects. I want to deepen my DevOps knowledge and learn Kubernetes.', 'approved', '2026-05-16 15:00:00', '2026-05-17 10:00:00', 1, 'Good cloud foundation, ready for advanced topics'),
(6, 3, 'I have been working with Docker and want to learn complete DevOps practices including CI/CD and Kubernetes.', 'pending', '2026-05-17 09:00:00', NULL, NULL, NULL),

-- Internship 7: Cybersecurity
(7, 13, 'Cybersecurity is my passion. I have completed CEH certification and want practical experience in penetration testing.', 'approved', '2026-05-17 10:00:00', '2026-05-18 09:00:00', 1, 'Certified, strong security knowledge'),
(7, 8, 'I have strong programming skills and interest in security. I want to learn ethical hacking and security assessment.', 'approved', '2026-05-17 14:00:00', '2026-05-18 11:00:00', 1, 'Good technical foundation for security'),

-- Internship 8: Blockchain
(8, 10, 'I have been studying blockchain and built a few smart contracts. I want to work on real blockchain projects and learn best practices.', 'approved', '2026-05-18 09:00:00', '2026-05-19 09:00:00', 1, 'Good blockchain understanding, practical experience'),
(8, 1, 'I want to explore blockchain technology and learn Web3 development. I have strong JavaScript skills.', 'pending', '2026-05-19 10:00:00', NULL, NULL, NULL),

-- Internship 9: Content Writing
(9, 11, 'I love writing and have been blogging for 2 years. I want to learn professional content writing and SEO strategies.', 'approved', '2026-05-19 11:00:00', '2026-05-20 09:00:00', 1, 'Good writing samples, SEO awareness'),
(9, 19, 'I have experience writing business reports and want to transition to content writing. I have strong research skills.', 'approved', '2026-05-19 15:00:00', '2026-05-20 10:00:00', 1, 'Professional writing experience'),

-- Internship 10: Game Development
(10, 14, 'Game development is my dream career. I have built 3 games using Unity and want to work on professional game projects.', 'approved', '2026-05-20 09:00:00', '2026-05-21 09:00:00', 1, 'Strong Unity skills, passionate about games'),
(10, 8, 'I have strong C++ skills and want to learn game development. I am interested in game physics and AI.', 'pending', '2026-05-20 14:00:00', NULL, NULL, NULL),

-- Internship 11: Business Analytics
(11, 19, 'I have experience with SQL and Excel. I want to learn advanced analytics and BI tools like Tableau and Power BI.', 'approved', '2026-05-21 09:00:00', '2026-05-22 09:00:00', 1, 'Strong analytical skills, good SQL knowledge'),
(11, 4, 'I want to combine my data science skills with business analytics to understand business applications of ML.', 'approved', '2026-05-21 11:00:00', '2026-05-22 10:00:00', 1, 'Good technical background for analytics'),

-- Internship 12: IoT Development
(12, 15, 'IoT is my area of interest. I have built several Arduino projects and want to work on professional IoT solutions.', 'approved', '2026-05-22 09:00:00', '2026-05-23 09:00:00', 1, 'Strong IoT project portfolio'),
(12, 14, 'I want to explore IoT and learn how to integrate hardware with software. I have programming experience.', 'pending', '2026-05-22 14:00:00', NULL, NULL, NULL);

-- ============================================
-- ATTENDANCE DATA
-- ============================================
-- Attendance records for approved students in their respective internships
INSERT INTO attendance (student_id, internship_id, date, status, check_in_time, check_out_time, remarks, marked_by) VALUES
-- Internship 1: Full Stack (Students 1, 2, 8) - Started June 1
(1, 1, '2026-06-01', 'present', '09:00:00', '17:00:00', 'First day, orientation completed', 1),
(1, 1, '2026-06-02', 'present', '09:05:00', '17:10:00', NULL, 1),
(1, 1, '2026-06-03', 'present', '09:00:00', '17:00:00', NULL, 1),
(1, 1, '2026-06-04', 'late', '09:30:00', '17:00:00', 'Traffic delay', 1),
(1, 1, '2026-06-05', 'present', '09:00:00', '17:00:00', NULL, 1),
(1, 1, '2026-06-08', 'present', '08:55:00', '17:05:00', NULL, 1),
(1, 1, '2026-06-09', 'present', '09:00:00', '17:00:00', NULL, 1),
(1, 1, '2026-06-10', 'present', '09:00:00', '17:00:00', 'Completed first module', 1),

(2, 1, '2026-06-01', 'present', '09:00:00', '17:00:00', 'First day, orientation completed', 1),
(2, 1, '2026-06-02', 'present', '09:00:00', '17:00:00', NULL, 1),
(2, 1, '2026-06-03', 'absent', NULL, NULL, 'Medical leave', 1),
(2, 1, '2026-06-04', 'present', '09:00:00', '17:00:00', NULL, 1),
(2, 1, '2026-06-05', 'present', '09:00:00', '17:00:00', NULL, 1),
(2, 1, '2026-06-08', 'present', '09:10:00', '17:00:00', NULL, 1),
(2, 1, '2026-06-09', 'present', '09:00:00', '17:00:00', NULL, 1),
(2, 1, '2026-06-10', 'present', '09:00:00', '17:00:00', NULL, 1),

(8, 1, '2026-06-01', 'present', '09:00:00', '17:00:00', 'First day, orientation completed', 1),
(8, 1, '2026-06-02', 'present', '09:00:00', '17:00:00', NULL, 1),
(8, 1, '2026-06-03', 'present', '09:00:00', '17:00:00', NULL, 1),
(8, 1, '2026-06-04', 'present', '09:00:00', '17:00:00', NULL, 1),
(8, 1, '2026-06-05', 'late', '09:45:00', '17:00:00', 'Overslept', 1),
(8, 1, '2026-06-08', 'present', '09:00:00', '17:00:00', NULL, 1),
(8, 1, '2026-06-09', 'present', '09:00:00', '17:00:00', NULL, 1),
(8, 1, '2026-06-10', 'present', '09:00:00', '17:00:00', NULL, 1),

-- Internship 2: Data Science (Students 3, 5, 15) - Started June 15
(3, 2, '2026-06-15', 'present', '10:00:00', '18:00:00', 'First day, setup completed', 1),
(3, 2, '2026-06-16', 'present', '10:00:00', '18:00:00', NULL, 1),
(3, 2, '2026-06-17', 'present', '10:00:00', '18:00:00', NULL, 1),
(3, 2, '2026-06-18', 'present', '10:00:00', '18:00:00', NULL, 1),
(3, 2, '2026-06-19', 'present', '10:00:00', '18:00:00', NULL, 1),
(3, 2, '2026-06-22', 'present', '10:00:00', '18:00:00', NULL, 1),
(3, 2, '2026-06-23', 'present', '10:00:00', '18:00:00', NULL, 1),
(3, 2, '2026-06-24', 'late', '10:30:00', '18:00:00', 'Internet issues', 1),

(5, 2, '2026-06-15', 'present', '10:00:00', '18:00:00', 'First day, setup completed', 1),
(5, 2, '2026-06-16', 'present', '10:00:00', '18:00:00', NULL, 1),
(5, 2, '2026-06-17', 'present', '10:00:00', '18:00:00', NULL, 1),
(5, 2, '2026-06-18', 'present', '10:00:00', '18:00:00', NULL, 1),
(5, 2, '2026-06-19', 'present', '10:00:00', '18:00:00', NULL, 1),
(5, 2, '2026-06-22', 'present', '10:00:00', '18:00:00', NULL, 1),
(5, 2, '2026-06-23', 'present', '10:00:00', '18:00:00', NULL, 1),
(5, 2, '2026-06-24', 'present', '10:00:00', '18:00:00', NULL, 1),

(15, 2, '2026-06-15', 'present', '10:00:00', '18:00:00', 'First day, setup completed', 1),
(15, 2, '2026-06-16', 'present', '10:00:00', '18:00:00', NULL, 1),
(15, 2, '2026-06-17', 'present', '10:00:00', '18:00:00', NULL, 1),
(15, 2, '2026-06-18', 'absent', NULL, NULL, 'Family emergency', 1),
(15, 2, '2026-06-19', 'present', '10:00:00', '18:00:00', NULL, 1),
(15, 2, '2026-06-22', 'present', '10:00:00', '18:00:00', NULL, 1),
(15, 2, '2026-06-23', 'present', '10:00:00', '18:00:00', NULL, 1),
(15, 2, '2026-06-24', 'present', '10:00:00', '18:00:00', NULL, 1),

-- Internship 3: Mobile Development (Students 1, 6) - Started July 1
(1, 3, '2026-07-01', 'present', '09:00:00', '17:00:00', 'Mobile dev orientation', 1),
(1, 3, '2026-07-02', 'present', '09:00:00', '17:00:00', NULL, 1),
(1, 3, '2026-07-03', 'present', '09:00:00', '17:00:00', NULL, 1),

(6, 3, '2026-07-01', 'present', '09:00:00', '17:00:00', 'Mobile dev orientation', 1),
(6, 3, '2026-07-02', 'present', '09:00:00', '17:00:00', NULL, 1),
(6, 3, '2026-07-03', 'late', '09:20:00', '17:00:00', 'Transport delay', 1),

-- Internship 4: Digital Marketing (Students 4, 10, 16) - Started June 10
(4, 4, '2026-06-10', 'present', '10:00:00', '18:00:00', 'Marketing orientation', 1),
(4, 4, '2026-06-11', 'present', '10:00:00', '18:00:00', NULL, 1),
(4, 4, '2026-06-12', 'present', '10:00:00', '18:00:00', NULL, 1),
(4, 4, '2026-06-13', 'present', '10:00:00', '18:00:00', NULL, 1),
(4, 4, '2026-06-16', 'present', '10:00:00', '18:00:00', NULL, 1),
(4, 4, '2026-06-17', 'present', '10:00:00', '18:00:00', NULL, 1),

(10, 4, '2026-06-10', 'present', '10:00:00', '18:00:00', 'Marketing orientation', 1),
(10, 4, '2026-06-11', 'present', '10:00:00', '18:00:00', NULL, 1),
(10, 4, '2026-06-12', 'present', '10:00:00', '18:00:00', NULL, 1),
(10, 4, '2026-06-13', 'present', '10:00:00', '18:00:00', NULL, 1),
(10, 4, '2026-06-16', 'present', '10:00:00', '18:00:00', NULL, 1),
(10, 4, '2026-06-17', 'present', '10:00:00', '18:00:00', NULL, 1),

(16, 4, '2026-06-10', 'present', '10:00:00', '18:00:00', 'Marketing orientation', 1),
(16, 4, '2026-06-11', 'present', '10:00:00', '18:00:00', NULL, 1),
(16, 4, '2026-06-12', 'absent', NULL, NULL, 'Sick leave', 1),
(16, 4, '2026-06-13', 'present', '10:00:00', '18:00:00', NULL, 1),
(16, 4, '2026-06-16', 'present', '10:00:00', '18:00:00', NULL, 1),
(16, 4, '2026-06-17', 'present', '10:00:00', '18:00:00', NULL, 1),

-- Internship 5: UI/UX Design (Students 4, 16) - Started July 15
(4, 5, '2026-07-15', 'present', '10:00:00', '18:00:00', 'Design orientation', 1),
(4, 5, '2026-07-16', 'present', '10:00:00', '18:00:00', NULL, 1),
(4, 5, '2026-07-17', 'present', '10:00:00', '18:00:00', NULL, 1),

(16, 5, '2026-07-15', 'present', '10:00:00', '18:00:00', 'Design orientation', 1),
(16, 5, '2026-07-16', 'present', '10:00:00', '18:00:00', NULL, 1),
(16, 5, '2026-07-17', 'present', '10:00:00', '18:00:00', NULL, 1),

-- Internship 6: Cloud & DevOps (Student 2) - Started August 1
(2, 6, '2026-08-01', 'present', '09:00:00', '17:00:00', 'DevOps orientation', 1),
(2, 6, '2026-08-04', 'present', '09:00:00', '17:00:00', NULL, 1),
(2, 6, '2026-08-05', 'present', '09:00:00', '17:00:00', NULL, 1),

-- Internship 7: Cybersecurity (Students 12, 7) - Started June 20
(12, 7, '2026-06-20', 'present', '09:00:00', '17:00:00', 'Security orientation', 1),
(12, 7, '2026-06-23', 'present', '09:00:00', '17:00:00', NULL, 1),
(12, 7, '2026-06-24', 'present', '09:00:00', '17:00:00', NULL, 1),
(12, 7, '2026-06-25', 'present', '09:00:00', '17:00:00', NULL, 1),

(7, 7, '2026-06-20', 'present', '09:00:00', '17:00:00', 'Security orientation', 1),
(7, 7, '2026-06-23', 'present', '09:00:00', '17:00:00', NULL, 1),
(7, 7, '2026-06-24', 'present', '09:00:00', '17:00:00', NULL, 1),
(7, 7, '2026-06-25', 'late', '09:40:00', '17:00:00', 'Lab access issue', 1),

-- Internship 8: Blockchain (Student 9) - Started July 10
(9, 8, '2026-07-10', 'present', '10:00:00', '18:00:00', 'Blockchain orientation', 1),
(9, 8, '2026-07-11', 'present', '10:00:00', '18:00:00', NULL, 1),
(9, 8, '2026-07-14', 'present', '10:00:00', '18:00:00', NULL, 1),

-- Internship 9: Content Writing (Students 10, 18) - Started June 5
(10, 9, '2026-06-05', 'present', '10:00:00', '18:00:00', 'Content writing orientation', 1),
(10, 9, '2026-06-08', 'present', '10:00:00', '18:00:00', NULL, 1),
(10, 9, '2026-06-09', 'present', '10:00:00', '18:00:00', NULL, 1),
(10, 9, '2026-06-10', 'present', '10:00:00', '18:00:00', NULL, 1),

(18, 9, '2026-06-05', 'present', '10:00:00', '18:00:00', 'Content writing orientation', 1),
(18, 9, '2026-06-08', 'present', '10:00:00', '18:00:00', NULL, 1),
(18, 9, '2026-06-09', 'present', '10:00:00', '18:00:00', NULL, 1),
(18, 9, '2026-06-10', 'present', '10:00:00', '18:00:00', NULL, 1),

-- Internship 10: Game Development (Student 13) - Started July 20
(13, 10, '2026-07-20', 'present', '09:00:00', '17:00:00', 'Game dev orientation', 1),
(13, 10, '2026-07-21', 'present', '09:00:00', '17:00:00', NULL, 1),
(13, 10, '2026-07-22', 'present', '09:00:00', '17:00:00', NULL, 1),

-- Internship 11: Business Analytics (Students 18, 3) - Started June 25
(18, 11, '2026-06-25', 'present', '09:00:00', '17:00:00', 'Analytics orientation', 1),
(18, 11, '2026-06-26', 'present', '09:00:00', '17:00:00', NULL, 1),
(18, 11, '2026-06-29', 'present', '09:00:00', '17:00:00', NULL, 1),
(18, 11, '2026-06-30', 'present', '09:00:00', '17:00:00', NULL, 1),

(3, 11, '2026-06-25', 'present', '09:00:00', '17:00:00', 'Analytics orientation', 1),
(3, 11, '2026-06-26', 'present', '09:00:00', '17:00:00', NULL, 1),
(3, 11, '2026-06-29', 'present', '09:00:00', '17:00:00', NULL, 1),
(3, 11, '2026-06-30', 'present', '09:00:00', '17:00:00', NULL, 1),

-- Internship 12: IoT Development (Student 14) - Started August 5
(14, 12, '2026-08-05', 'present', '09:00:00', '17:00:00', 'IoT orientation', 1),
(14, 12, '2026-08-06', 'present', '09:00:00', '17:00:00', NULL, 1),
(14, 12, '2026-08-07', 'present', '09:00:00', '17:00:00', NULL, 1);

-- ============================================
-- LEARNING MATERIALS DATA
-- ============================================
INSERT INTO learning_materials (internship_id, title, description, type, external_url, file_size_kb, duration_minutes, order_index, is_mandatory, uploaded_by) VALUES
-- Internship 1: Full Stack Web Development
(1, 'Introduction to MERN Stack', 'Overview of MongoDB, Express, React, and Node.js architecture and how they work together', 'video', 'https://youtube.com/watch?v=mern-intro', NULL, 45, 1, TRUE, 1),
(1, 'React Fundamentals', 'Learn React components, props, state, hooks, and lifecycle methods', 'document', 'https://docs.example.com/react-fundamentals.pdf', 2048, NULL, 2, TRUE, 1),
(1, 'Building REST APIs with Express', 'Complete guide to creating RESTful APIs with Express.js and middleware', 'video', 'https://youtube.com/watch?v=express-apis', NULL, 60, 3, TRUE, 1),
(1, 'MongoDB Database Design', 'Best practices for NoSQL database design, schemas, and relationships', 'document', 'https://docs.example.com/mongodb-design.pdf', 1536, NULL, 4, TRUE, 1),
(1, 'Authentication with JWT', 'Implementing secure authentication using JSON Web Tokens', 'video', 'https://youtube.com/watch?v=jwt-auth', NULL, 40, 5, TRUE, 1),
(1, 'State Management with Redux', 'Advanced state management patterns in React applications', 'document', 'https://docs.example.com/redux-guide.pdf', 1024, NULL, 6, FALSE, 1),
(1, 'Deployment to Production', 'Deploy MERN applications to cloud platforms like Heroku and AWS', 'video', 'https://youtube.com/watch?v=mern-deploy', NULL, 50, 7, FALSE, 1),

-- Internship 2: Data Science & ML
(2, 'Python for Data Science', 'Python basics and essential data science libraries: NumPy, Pandas, Matplotlib', 'video', 'https://youtube.com/watch?v=python-ds', NULL, 90, 1, TRUE, 1),
(2, 'Machine Learning Algorithms', 'Understanding supervised and unsupervised learning algorithms', 'document', 'https://docs.example.com/ml-algorithms.pdf', 3072, NULL, 2, TRUE, 1),
(2, 'Data Visualization with Matplotlib', 'Creating effective data visualizations and charts', 'video', 'https://youtube.com/watch?v=matplotlib-viz', NULL, 45, 3, TRUE, 1),
(2, 'Feature Engineering Techniques', 'Advanced techniques for feature selection and engineering', 'document', 'https://docs.example.com/feature-engineering.pdf', 2048, NULL, 4, TRUE, 1),
(2, 'Deep Learning with TensorFlow', 'Introduction to neural networks and deep learning', 'video', 'https://youtube.com/watch?v=tensorflow-dl', NULL, 120, 5, FALSE, 1),
(2, 'Model Deployment Best Practices', 'Deploy ML models to production environments', 'document', 'https://docs.example.com/ml-deployment.pdf', 1536, NULL, 6, FALSE, 1),

-- Internship 3: Mobile App Development
(3, 'React Native Setup', 'Setting up development environment for React Native on Mac and Windows', 'document', 'https://docs.example.com/rn-setup.pdf', 1024, NULL, 1, TRUE, 1),
(3, 'Mobile UI Design Principles', 'Designing for mobile platforms: iOS and Android guidelines', 'video', 'https://youtube.com/watch?v=mobile-ui', NULL, 50, 2, TRUE, 1),
(3, 'Navigation in React Native', 'Implementing navigation patterns using React Navigation', 'video', 'https://youtube.com/watch?v=rn-navigation', NULL, 40, 3, TRUE, 1),
(3, 'Working with Native Modules', 'Integrating native code and third-party libraries', 'document', 'https://docs.example.com/native-modules.pdf', 1536, NULL, 4, FALSE, 1),
(3, 'App Store Deployment', 'Publishing apps to Google Play Store and Apple App Store', 'video', 'https://youtube.com/watch?v=app-deployment', NULL, 60, 5, TRUE, 1),

-- Internship 4: Digital Marketing
(4, 'Digital Marketing Fundamentals', 'Overview of digital marketing channels and strategies', 'video', 'https://youtube.com/watch?v=dm-fundamentals', NULL, 45, 1, TRUE, 1),
(4, 'SEO Best Practices', 'Search engine optimization techniques and tools', 'document', 'https://docs.example.com/seo-guide.pdf', 2048, NULL, 2, TRUE, 1),
(4, 'Social Media Marketing', 'Creating effective social media campaigns across platforms', 'video', 'https://youtube.com/watch?v=social-media', NULL, 50, 3, TRUE, 1),
(4, 'Google Ads Mastery', 'Creating and optimizing Google Ads campaigns', 'video', 'https://youtube.com/watch?v=google-ads', NULL, 60, 4, TRUE, 1),
(4, 'Content Marketing Strategy', 'Developing content that attracts and engages audiences', 'document', 'https://docs.example.com/content-strategy.pdf', 1536, NULL, 5, FALSE, 1),
(4, 'Analytics and Reporting', 'Using Google Analytics to measure campaign performance', 'video', 'https://youtube.com/watch?v=analytics', NULL, 45, 6, TRUE, 1),

-- Internship 5: UI/UX Design
(5, 'Design Thinking Process', 'Understanding the design thinking methodology', 'video', 'https://youtube.com/watch?v=design-thinking', NULL, 40, 1, TRUE, 1),
(5, 'User Research Methods', 'Conducting user interviews, surveys, and usability testing', 'document', 'https://docs.example.com/user-research.pdf', 2048, NULL, 2, TRUE, 1),
(5, 'Wireframing and Prototyping', 'Creating wireframes and interactive prototypes in Figma', 'video', 'https://youtube.com/watch?v=wireframing', NULL, 55, 3, TRUE, 1),
(5, 'Visual Design Principles', 'Color theory, typography, and layout fundamentals', 'document', 'https://docs.example.com/visual-design.pdf', 1536, NULL, 4, TRUE, 1),
(5, 'Design Systems', 'Building and maintaining scalable design systems', 'video', 'https://youtube.com/watch?v=design-systems', NULL, 50, 5, FALSE, 1),
(5, 'Accessibility in Design', 'Designing inclusive and accessible user interfaces', 'document', 'https://docs.example.com/accessibility.pdf', 1024, NULL, 6, TRUE, 1),

-- Internship 6: Cloud & DevOps
(6, 'Introduction to Cloud Computing', 'Cloud computing concepts and service models', 'video', 'https://youtube.com/watch?v=cloud-intro', NULL, 45, 1, TRUE, 1),
(6, 'AWS Fundamentals', 'Core AWS services: EC2, S3, RDS, Lambda', 'document', 'https://docs.example.com/aws-fundamentals.pdf', 3072, NULL, 2, TRUE, 1),
(6, 'Docker Containerization', 'Creating and managing Docker containers', 'video', 'https://youtube.com/watch?v=docker-basics', NULL, 60, 3, TRUE, 1),
(6, 'Kubernetes Orchestration', 'Container orchestration with Kubernetes', 'video', 'https://youtube.com/watch?v=kubernetes', NULL, 75, 4, TRUE, 1),
(6, 'CI/CD Pipelines', 'Building automated deployment pipelines with Jenkins', 'document', 'https://docs.example.com/cicd-pipelines.pdf', 2048, NULL, 5, TRUE, 1),
(6, 'Infrastructure as Code', 'Managing infrastructure with Terraform', 'video', 'https://youtube.com/watch?v=terraform', NULL, 50, 6, FALSE, 1),

-- Internship 7: Cybersecurity
(7, 'Cybersecurity Fundamentals', 'Introduction to information security and threat landscape', 'video', 'https://youtube.com/watch?v=security-basics', NULL, 50, 1, TRUE, 1),
(7, 'Network Security', 'Securing networks and understanding common attacks', 'document', 'https://docs.example.com/network-security.pdf', 2560, NULL, 2, TRUE, 1),
(7, 'Ethical Hacking Techniques', 'Penetration testing methodologies and tools', 'video', 'https://youtube.com/watch?v=ethical-hacking', NULL, 90, 3, TRUE, 1),
(7, 'Web Application Security', 'OWASP Top 10 vulnerabilities and mitigation', 'document', 'https://docs.example.com/web-security.pdf', 2048, NULL, 4, TRUE, 1),

-- Internship 8: Blockchain
(8, 'Blockchain Fundamentals', 'Understanding blockchain technology and cryptocurrencies', 'video', 'https://youtube.com/watch?v=blockchain-intro', NULL, 60, 1, TRUE, 1),
(8, 'Solidity Programming', 'Writing smart contracts with Solidity', 'document', 'https://docs.example.com/solidity-guide.pdf', 2560, NULL, 2, TRUE, 1),
(8, 'Building DApps', 'Creating decentralized applications with Web3.js', 'video', 'https://youtube.com/watch?v=dapp-development', NULL, 75, 3, TRUE, 1),
(8, 'Smart Contract Security', 'Common vulnerabilities and security best practices', 'document', 'https://docs.example.com/smart-contract-security.pdf', 1536, NULL, 4, TRUE, 1),

-- Internship 9: Content Writing
(9, 'Professional Writing Skills', 'Writing clear, engaging, and professional content', 'video', 'https://youtube.com/watch?v=writing-skills', NULL, 40, 1, TRUE, 1),
(9, 'SEO Content Writing', 'Optimizing content for search engines', 'document', 'https://docs.example.com/seo-writing.pdf', 1536, NULL, 2, TRUE, 1),
(9, 'Content Strategy', 'Planning and executing content marketing strategies', 'video', 'https://youtube.com/watch?v=content-strategy', NULL, 45, 3, TRUE, 1),
(9, 'Copywriting Techniques', 'Persuasive writing for marketing and advertising', 'document', 'https://docs.example.com/copywriting.pdf', 1024, NULL, 4, FALSE, 1),

-- Internship 10: Game Development
(10, 'Unity Basics', 'Introduction to Unity game engine and interface', 'video', 'https://youtube.com/watch?v=unity-basics', NULL, 60, 1, TRUE, 1),
(10, 'C# for Game Development', 'Programming games with C# in Unity', 'document', 'https://docs.example.com/csharp-games.pdf', 2048, NULL, 2, TRUE, 1),
(10, 'Game Physics', 'Implementing physics and collisions in games', 'video', 'https://youtube.com/watch?v=game-physics', NULL, 50, 3, TRUE, 1),
(10, '2D Game Development', 'Creating 2D games with sprites and animations', 'video', 'https://youtube.com/watch?v=2d-games', NULL, 70, 4, FALSE, 1),

-- Internship 11: Business Analytics
(11, 'SQL for Analytics', 'Advanced SQL queries for data analysis', 'video', 'https://youtube.com/watch?v=sql-analytics', NULL, 60, 1, TRUE, 1),
(11, 'Excel for Business', 'Advanced Excel functions and pivot tables', 'document', 'https://docs.example.com/excel-business.pdf', 2048, NULL, 2, TRUE, 1),
(11, 'Tableau Fundamentals', 'Creating interactive dashboards with Tableau', 'video', 'https://youtube.com/watch?v=tableau-basics', NULL, 55, 3, TRUE, 1),
(11, 'Business Intelligence', 'BI concepts and data-driven decision making', 'document', 'https://docs.example.com/business-intelligence.pdf', 1536, NULL, 4, TRUE, 1),

-- Internship 12: IoT Development
(12, 'IoT Fundamentals', 'Introduction to Internet of Things and architecture', 'video', 'https://youtube.com/watch?v=iot-intro', NULL, 45, 1, TRUE, 1),
(12, 'Arduino Programming', 'Programming microcontrollers with Arduino', 'document', 'https://docs.example.com/arduino-guide.pdf', 2048, NULL, 2, TRUE, 1),
(12, 'Sensor Integration', 'Working with various sensors and actuators', 'video', 'https://youtube.com/watch?v=sensors', NULL, 50, 3, TRUE, 1),
(12, 'IoT Communication Protocols', 'MQTT, HTTP, and other IoT protocols', 'document', 'https://docs.example.com/iot-protocols.pdf', 1536, NULL, 4, TRUE, 1);

-- ============================================
-- ASSESSMENTS DATA
-- ============================================
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
  },
  {
    "id": 6,
    "question": "What is event bubbling?",
    "type": "text",
    "marks": 10
  },
  {
    "id": 7,
    "question": "Which keyword is used to declare a constant?",
    "type": "mcq",
    "options": ["var", "let", "const", "static"],
    "correctAnswer": 2,
    "marks": 5
  }
]', 1),
(1, 'React Components Assignment', 'Build a todo list application using React hooks', 'assignment', 100, 50, NULL, '[
  {
    "id": 1,
    "question": "Create a functional component with useState and useEffect hooks",
    "type": "text",
    "marks": 40
  },
  {
    "id": 2,
    "question": "Implement add, delete, and toggle functionality",
    "type": "text",
    "marks": 40
  },
  {
    "id": 3,
    "question": "Add proper styling and make it responsive",
    "type": "text",
    "marks": 20
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
  },
  {
    "id": 4,
    "question": "Explain the bias-variance tradeoff",
    "type": "text",
    "marks": 15
  },
  {
    "id": 5,
    "question": "What is the purpose of train-test split?",
    "type": "mcq",
    "options": ["To increase accuracy", "To validate model performance", "To reduce overfitting", "All of the above"],
    "correctAnswer": 3,
    "marks": 5
  }
]', 1),
(2, 'ML Model Building Project', 'Build a predictive model on provided dataset', 'project', 100, 50, NULL, '[
  {
    "id": 1,
    "question": "Perform exploratory data analysis",
    "type": "text",
    "marks": 25
  },
  {
    "id": 2,
    "question": "Build and train a machine learning model",
    "type": "text",
    "marks": 40
  },
  {
    "id": 3,
    "question": "Evaluate model performance and document findings",
    "type": "text",
    "marks": 35
  }
]', 1),
(3, 'React Native Basics Quiz', 'Test your React Native knowledge', 'quiz', 50, 25, 30, '[
  {
    "id": 1,
    "question": "What is the difference between View and Text components?",
    "type": "text",
    "marks": 10
  },
  {
    "id": 2,
    "question": "Which component is used for scrollable content?",
    "type": "mcq",
    "options": ["View", "ScrollView", "FlatList", "Both B and C"],
    "correctAnswer": 3,
    "marks": 5
  },
  {
    "id": 3,
    "question": "Explain the purpose of StyleSheet.create()",
    "type": "text",
    "marks": 10
  }
]', 1),
(4, 'Digital Marketing Fundamentals Quiz', 'Test your digital marketing knowledge', 'quiz', 50, 25, 30, '[
  {
    "id": 1,
    "question": "What does SEO stand for?",
    "type": "mcq",
    "options": ["Search Engine Optimization", "Social Engine Optimization", "Search Engine Operation", "Social Engine Operation"],
    "correctAnswer": 0,
    "marks": 5
  },
  {
    "id": 2,
    "question": "Explain the difference between organic and paid search results",
    "type": "text",
    "marks": 15
  },
  {
    "id": 3,
    "question": "What is a conversion rate?",
    "type": "text",
    "marks": 10
  }
]', 1),
(5, 'UI/UX Design Principles Quiz', 'Test your design knowledge', 'quiz', 50, 25, 30, '[
  {
    "id": 1,
    "question": "What is the purpose of user personas?",
    "type": "text",
    "marks": 15
  },
  {
    "id": 2,
    "question": "Which principle emphasizes visual hierarchy?",
    "type": "mcq",
    "options": ["Contrast", "Alignment", "Proximity", "All of the above"],
    "correctAnswer": 3,
    "marks": 5
  },
  {
    "id": 3,
    "question": "Explain the difference between wireframes and mockups",
    "type": "text",
    "marks": 15
  }
]', 1),
(6, 'Cloud & DevOps Quiz', 'Test your cloud and DevOps knowledge', 'quiz', 50, 25, 30, '[
  {
    "id": 1,
    "question": "What is the difference between IaaS, PaaS, and SaaS?",
    "type": "text",
    "marks": 15
  },
  {
    "id": 2,
    "question": "Which AWS service is used for object storage?",
    "type": "mcq",
    "options": ["EC2", "S3", "RDS", "Lambda"],
    "correctAnswer": 1,
    "marks": 5
  },
  {
    "id": 3,
    "question": "Explain the purpose of Docker containers",
    "type": "text",
    "marks": 15
  }
]', 1),
(7, 'Cybersecurity Fundamentals Quiz', 'Test your security knowledge', 'quiz', 50, 25, 30, '[
  {
    "id": 1,
    "question": "What is the CIA triad in cybersecurity?",
    "type": "text",
    "marks": 15
  },
  {
    "id": 2,
    "question": "Which attack involves overwhelming a system with traffic?",
    "type": "mcq",
    "options": ["Phishing", "DDoS", "SQL Injection", "XSS"],
    "correctAnswer": 1,
    "marks": 5
  },
  {
    "id": 3,
    "question": "Explain the difference between symmetric and asymmetric encryption",
    "type": "text",
    "marks": 15
  }
]', 1);

-- ============================================
-- STUDENT ASSESSMENT ATTEMPTS DATA
-- ============================================
INSERT INTO student_assessments (assessment_id, student_id, attempt_number, answers, score, percentage, status, started_at, submitted_at, graded_at, graded_by, feedback) VALUES
-- Assessment 1: JavaScript Basics Quiz
(1, 1, 1, '[
  {"questionId": 1, "answer": 2},
  {"questionId": 2, "answer": 0},
  {"questionId": 3, "answer": "let and const are block-scoped while var is function-scoped. const cannot be reassigned after initialization."},
  {"questionId": 4, "answer": "A closure is a function that has access to variables in its outer lexical scope even after the outer function has returned."},
  {"questionId": 5, "answer": 2},
  {"questionId": 6, "answer": "Event bubbling is when an event propagates from the target element up through its ancestors in the DOM tree."},
  {"questionId": 7, "answer": 2}
]', 45.00, 90.00, 'graded', '2026-06-10 15:00:00', '2026-06-10 15:30:00', '2026-06-11 10:00:00', 1, 'Excellent understanding of JavaScript fundamentals. Keep up the good work!'),
(1, 2, 1, '[
  {"questionId": 1, "answer": 2},
  {"questionId": 2, "answer": 0},
  {"questionId": 3, "answer": "All are used for variable declaration but have different scoping rules."},
  {"questionId": 4, "answer": "Not sure about closures."},
  {"questionId": 5, "answer": 2},
  {"questionId": 6, "answer": "Events move up the DOM"},
  {"questionId": 7, "answer": 2}
]', 28.00, 56.00, 'graded', '2026-06-10 15:30:00', '2026-06-10 16:00:00', '2026-06-11 10:30:00', 1, 'Good effort. Need to study closures and event handling in more detail.'),
(1, 8, 1, '[
  {"questionId": 1, "answer": 2},
  {"questionId": 2, "answer": 0},
  {"questionId": 3, "answer": "let and const are block-scoped, var is function-scoped. const is immutable."},
  {"questionId": 4, "answer": "A closure allows a function to access variables from an enclosing scope."},
  {"questionId": 5, "answer": 2},
  {"questionId": 6, "answer": "Event bubbling is the propagation of events from child to parent elements."},
  {"questionId": 7, "answer": 2}
]', 42.00, 84.00, 'graded', '2026-06-10 16:00:00', '2026-06-10 16:25:00', '2026-06-11 11:00:00', 1, 'Very good performance. Strong grasp of core concepts.'),

-- Assessment 3: Python & Data Science Quiz
(3, 3, 1, '[
  {"questionId": 1, "answer": 1},
  {"questionId": 2, "answer": "Overfitting occurs when a model learns the training data too well, including noise, and performs poorly on new data."},
  {"questionId": 3, "answer": 2},
  {"questionId": 4, "answer": "Bias-variance tradeoff is the balance between model simplicity and complexity."},
  {"questionId": 5, "answer": 3}
]', 48.00, 80.00, 'graded', '2026-06-20 14:00:00', '2026-06-20 14:40:00', '2026-06-21 09:00:00', 1, 'Good understanding of ML concepts. Expand on bias-variance explanation.'),
(3, 5, 1, '[
  {"questionId": 1, "answer": 1},
  {"questionId": 2, "answer": "Overfitting is when the model memorizes training data instead of learning patterns, leading to poor generalization."},
  {"questionId": 3, "answer": 2},
  {"questionId": 4, "answer": "It represents the tradeoff between underfitting (high bias) and overfitting (high variance)."},
  {"questionId": 5, "answer": 3}
]', 55.00, 91.67, 'graded', '2026-06-20 15:00:00', '2026-06-20 15:35:00', '2026-06-21 09:30:00', 1, 'Excellent work! Clear understanding of fundamental ML concepts.'),
(3, 15, 1, '[
  {"questionId": 1, "answer": 1},
  {"questionId": 2, "answer": "When model fits training data too closely"},
  {"questionId": 3, "answer": 2},
  {"questionId": 4, "answer": "Balance between simple and complex models"},
  {"questionId": 5, "answer": 1}
]', 30.00, 50.00, 'graded', '2026-06-20 16:00:00', '2026-06-20 16:30:00', '2026-06-21 10:00:00', 1, 'Needs more detailed explanations. Review ML fundamentals.'),

-- Assessment 5: React Native Basics Quiz
(5, 1, 1, '[
  {"questionId": 1, "answer": "View is a container component while Text is specifically for displaying text content."},
  {"questionId": 2, "answer": 3},
  {"questionId": 3, "answer": "StyleSheet.create() optimizes styles by creating a reference instead of creating new style objects on each render."}
]', 42.00, 84.00, 'graded', '2026-07-05 10:00:00', '2026-07-05 10:25:00', '2026-07-06 09:00:00', 1, 'Great understanding of React Native components!'),
(5, 6, 1, '[
  {"questionId": 1, "answer": "View is for layout, Text is for text"},
  {"questionId": 2, "answer": 3},
  {"questionId": 3, "answer": "It creates styles for components"}
]', 28.00, 56.00, 'graded', '2026-07-05 11:00:00', '2026-07-05 11:20:00', '2026-07-06 09:30:00', 1, 'Basic understanding present. Provide more detailed explanations.'),

-- Assessment 6: Digital Marketing Quiz
(6, 4, 1, '[
  {"questionId": 1, "answer": 0},
  {"questionId": 2, "answer": "Organic results appear naturally based on relevance, while paid results are advertisements that businesses pay for."},
  {"questionId": 3, "answer": "Conversion rate is the percentage of visitors who complete a desired action."}
]', 42.00, 84.00, 'graded', '2026-06-18 14:00:00', '2026-06-18 14:25:00', '2026-06-19 09:00:00', 1, 'Solid understanding of digital marketing basics!'),
(6, 10, 1, '[
  {"questionId": 1, "answer": 0},
  {"questionId": 2, "answer": "Organic is free, paid costs money"},
  {"questionId": 3, "answer": "Rate of conversions"}
]', 25.00, 50.00, 'graded', '2026-06-18 15:00:00', '2026-06-18 15:20:00', '2026-06-19 09:30:00', 1, 'Correct basics but need more detailed explanations.'),

-- Assessment 7: UI/UX Design Quiz
(7, 4, 1, '[
  {"questionId": 1, "answer": "User personas represent fictional characters based on research that embody the characteristics of target users."},
  {"questionId": 2, "answer": 3},
  {"questionId": 3, "answer": "Wireframes are low-fidelity sketches showing structure, while mockups are high-fidelity designs with visual details."}
]', 47.00, 94.00, 'graded', '2026-07-18 10:00:00', '2026-07-18 10:25:00', '2026-07-19 09:00:00', 1, 'Excellent grasp of UX principles and design process!'),
(7, 16, 1, '[
  {"questionId": 1, "answer": "Personas help understand users better"},
  {"questionId": 2, "answer": 3},
  {"questionId": 3, "answer": "Wireframes are basic, mockups have colors and details"}
]', 32.00, 64.00, 'graded', '2026-07-18 11:00:00', '2026-07-18 11:20:00', '2026-07-19 09:30:00', 1, 'Good start. Expand your answers with more specific details.');

-- ============================================
-- EXAMS DATA
-- ============================================
INSERT INTO exams (internship_id, title, description, exam_date, duration_minutes, total_marks, passing_marks, questions, instructions, is_proctored, max_attempts, created_by) VALUES
(1, 'MERN Stack Final Exam', 'Comprehensive exam covering all MERN stack concepts learned during the internship', '2026-08-20 10:00:00', 120, 100, 50, '[
  {
    "id": 1,
    "question": "Explain the Virtual DOM in React and its benefits over direct DOM manipulation.",
    "type": "text",
    "marks": 15
  },
  {
    "id": 2,
    "question": "What is middleware in Express.js and provide an example use case?",
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
    "question": "Describe the aggregation pipeline in MongoDB and when to use it.",
    "type": "text",
    "marks": 15
  },
  {
    "id": 5,
    "question": "What is the purpose of useEffect hook in React? Explain with an example.",
    "type": "text",
    "marks": 15
  },
  {
    "id": 6,
    "question": "Explain the concept of JWT authentication and its advantages.",
    "type": "text",
    "marks": 20
  },
  {
    "id": 7,
    "question": "What is the difference between SQL and NoSQL databases?",
    "type": "text",
    "marks": 10
  },
  {
    "id": 8,
    "question": "Which React hook is used for managing component state?",
    "type": "mcq",
    "options": ["useEffect", "useState", "useContext", "useReducer"],
    "correctAnswer": 1,
    "marks": 5
  },
  {
    "id": 9,
    "question": "Explain CORS and why it is important in web applications.",
    "type": "text",
    "marks": 5
  }
]', 'Read all questions carefully. Manage your time wisely. No external resources or internet access allowed. Answer all questions to the best of your ability.', TRUE, 2, 1),
(2, 'Data Science Final Exam', 'Comprehensive exam covering Python, ML algorithms, and data analysis', '2026-10-05 10:00:00', 150, 100, 50, '[
  {
    "id": 1,
    "question": "Explain the difference between supervised and unsupervised learning with examples.",
    "type": "text",
    "marks": 15
  },
  {
    "id": 2,
    "question": "What is cross-validation and why is it important?",
    "type": "text",
    "marks": 15
  },
  {
    "id": 3,
    "question": "Which metric is best for imbalanced classification problems?",
    "type": "mcq",
    "options": ["Accuracy", "Precision", "F1-Score", "R-squared"],
    "correctAnswer": 2,
    "marks": 5
  },
  {
    "id": 4,
    "question": "Explain the working of Random Forest algorithm.",
    "type": "text",
    "marks": 20
  },
  {
    "id": 5,
    "question": "What is feature scaling and when should it be applied?",
    "type": "text",
    "marks": 15
  },
  {
    "id": 6,
    "question": "Describe the steps in a typical machine learning pipeline.",
    "type": "text",
    "marks": 20
  },
  {
    "id": 7,
    "question": "What is the curse of dimensionality?",
    "type": "text",
    "marks": 10
  }
]', 'This is a comprehensive exam. Show your work and explain your reasoning. Partial credit will be given for correct methodology.', TRUE, 2, 1),
(3, 'Mobile Development Final Exam', 'Comprehensive exam on React Native and mobile app development', '2026-09-08 10:00:00', 90, 100, 50, '[
  {
    "id": 1,
    "question": "Explain the difference between React and React Native.",
    "type": "text",
    "marks": 15
  },
  {
    "id": 2,
    "question": "What are the key considerations for mobile app performance optimization?",
    "type": "text",
    "marks": 20
  },
  {
    "id": 3,
    "question": "Which component is used for handling user input?",
    "type": "mcq",
    "options": ["View", "Text", "TextInput", "Button"],
    "correctAnswer": 2,
    "marks": 5
  },
  {
    "id": 4,
    "question": "Explain the navigation patterns in mobile applications.",
    "type": "text",
    "marks": 20
  },
  {
    "id": 5,
    "question": "What are the steps to publish an app to app stores?",
    "type": "text",
    "marks": 20
  }
]', 'Answer all questions. Provide code examples where applicable.', FALSE, 2, 1),
(4, 'Digital Marketing Final Exam', 'Comprehensive exam covering all digital marketing concepts', '2026-08-04 14:00:00', 90, 100, 50, '[
  {
    "id": 1,
    "question": "Explain the difference between on-page and off-page SEO.",
    "type": "text",
    "marks": 15
  },
  {
    "id": 2,
    "question": "What are the key metrics to track in a digital marketing campaign?",
    "type": "text",
    "marks": 20
  },
  {
    "id": 3,
    "question": "Describe the customer journey and its stages.",
    "type": "text",
    "marks": 20
  },
  {
    "id": 4,
    "question": "What is A/B testing and why is it important?",
    "type": "text",
    "marks": 15
  },
  {
    "id": 5,
    "question": "Explain the concept of marketing funnel.",
    "type": "text",
    "marks": 15
  }
]', 'Provide practical examples from real campaigns where possible.', FALSE, 2, 1);

-- ============================================
-- STUDENT EXAM ATTEMPTS DATA
-- ============================================
INSERT INTO student_exams (exam_id, student_id, attempt_number, answers, score, percentage, status, started_at, submitted_at, graded_at, graded_by, feedback, is_passed) VALUES
(1, 1, 1, '[
  {"questionId": 1, "answer": "Virtual DOM is a lightweight copy of the actual DOM. React uses it to minimize direct DOM manipulation by batching updates and only changing what is necessary, improving performance."},
  {"questionId": 2, "answer": "Middleware functions have access to request and response objects. Example: authentication middleware that verifies JWT tokens before allowing access to protected routes."},
  {"questionId": 3, "answer": 2},
  {"questionId": 4, "answer": "Aggregation pipeline processes data through multiple stages like $match, $group, $sort. Used for complex data transformations and analytics."},
  {"questionId": 5, "answer": "useEffect handles side effects like API calls, subscriptions. It runs after render and can clean up with return function."},
  {"questionId": 6, "answer": "JWT is a token-based authentication where server creates a signed token containing user info. Advantages: stateless, scalable, works across domains."},
  {"questionId": 7, "answer": "SQL databases are relational with fixed schema, NoSQL are flexible with dynamic schema. SQL uses tables, NoSQL uses documents/key-value pairs."},
  {"questionId": 8, "answer": 1},
  {"questionId": 9, "answer": "CORS allows controlled access to resources from different origins, preventing security issues."}
]', 88.00, 88.00, 'graded', '2026-08-20 10:00:00', '2026-08-20 11:55:00', '2026-08-21 14:00:00', 1, 'Excellent performance! Strong understanding of all MERN stack concepts. Well explained answers with good examples.', TRUE),
(1, 2, 1, '[
  {"questionId": 1, "answer": "Virtual DOM is faster than real DOM because it updates only changed parts."},
  {"questionId": 2, "answer": "Middleware is code that runs between request and response."},
  {"questionId": 3, "answer": 2},
  {"questionId": 4, "answer": "Aggregation pipeline is used to process data in MongoDB through different stages."},
  {"questionId": 5, "answer": "useEffect is used for side effects in React components."},
  {"questionId": 6, "answer": "JWT is a token for authentication. It is secure and can be used across different platforms."},
  {"questionId": 7, "answer": "SQL has tables, NoSQL has documents."},
  {"questionId": 8, "answer": 1},
  {"questionId": 9, "answer": "CORS is for security"}
]', 52.00, 52.00, 'graded', '2026-08-20 10:00:00', '2026-08-20 11:50:00', '2026-08-21 14:30:00', 1, 'Passed but needs more detailed explanations. Review middleware, aggregation pipeline, and CORS concepts in depth.', TRUE),
(1, 8, 1, '[
  {"questionId": 1, "answer": "Virtual DOM is an in-memory representation that React uses to optimize rendering by comparing changes and updating only modified elements."},
  {"questionId": 2, "answer": "Middleware functions process requests before they reach route handlers. Example: logging middleware that records all incoming requests."},
  {"questionId": 3, "answer": 2},
  {"questionId": 4, "answer": "Aggregation pipeline chains operations like filtering, grouping, and sorting to transform documents. Useful for complex queries and data analysis."},
  {"questionId": 5, "answer": "useEffect manages side effects like fetching data, setting up subscriptions. Runs after render and cleanup function prevents memory leaks."},
  {"questionId": 6, "answer": "JWT contains encoded user data and signature. Server verifies signature to authenticate. Benefits: no server-side session storage, works well with microservices."},
  {"questionId": 7, "answer": "SQL enforces schema and relationships, good for structured data. NoSQL is schema-less, better for unstructured data and horizontal scaling."},
  {"questionId": 8, "answer": 1},
  {"questionId": 9, "answer": "CORS is Cross-Origin Resource Sharing, a security mechanism that controls which domains can access resources."}
]', 92.00, 92.00, 'graded', '2026-08-20 10:00:00', '2026-08-20 11:45:00', '2026-08-21 15:00:00', 1, 'Outstanding work! Comprehensive answers with excellent technical depth. Top performer in the batch.', TRUE);

-- ============================================
-- CERTIFICATES DATA
-- ============================================
INSERT INTO certificates (certificate_number, student_id, internship_id, issue_date, completion_date, grade, performance_score, verification_code, issued_by, remarks) VALUES
('CERT-2026-001', 1, 1, '2026-08-25', '2026-08-24', 'A+', 90.50, 'VERIFY-ABC123XYZ', 1, 'Excellent performance throughout the internship. Demonstrated strong technical skills and completed all projects successfully.'),
('CERT-2026-002', 2, 1, '2026-08-25', '2026-08-24', 'B+', 78.00, 'VERIFY-DEF456UVW', 1, 'Good work and consistent attendance. Showed steady improvement throughout the program.'),
('CERT-2026-003', 8, 1, '2026-08-25', '2026-08-24', 'A+', 92.00, 'VERIFY-GHI789RST', 1, 'Outstanding performance. Top scorer in assessments and exams. Highly recommended.'),
('CERT-2026-004', 3, 2, '2026-10-09', '2026-10-08', 'A', 85.00, 'VERIFY-JKL012MNO', 1, 'Strong analytical skills and excellent project work. Great understanding of ML concepts.'),
('CERT-2026-005', 5, 2, '2026-10-09', '2026-10-08', 'A+', 91.00, 'VERIFY-PQR345STU', 1, 'Exceptional performance in data science projects. Published quality work.'),
('CERT-2026-006', 4, 4, '2026-08-06', '2026-08-05', 'A', 86.00, 'VERIFY-VWX678YZA', 1, 'Creative marketing campaigns and excellent content creation skills.'),
('CERT-2026-007', 10, 4, '2026-08-06', '2026-08-05', 'B+', 79.00, 'VERIFY-BCD901EFG', 1, 'Good understanding of digital marketing principles. Consistent performer.');

-- ============================================
-- NOTIFICATIONS DATA
-- ============================================
INSERT INTO notifications (user_id, title, message, type, related_id, is_read, priority, action_url, created_at) VALUES
-- Student 1 (Rahul) notifications
(2, 'Application Approved', 'Your application for Full Stack Web Development Internship has been approved! Welcome to TechCorp Solutions.', 'application', 1, TRUE, 'high', '/student/internships/1', '2026-05-11 09:00:00'),
(2, 'Internship Starting Soon', 'Your Full Stack Web Development Internship starts on June 1, 2026. Please check your email for joining instructions.', 'general', 1, TRUE, 'high', '/student/internships/1', '2026-05-25 10:00:00'),
(2, 'New Learning Material', 'New material "Introduction to MERN Stack" has been added to your internship.', 'general', 1, TRUE, 'medium', '/student/materials', '2026-06-01 09:30:00'),
(2, 'New Assessment Available', 'JavaScript Basics Quiz is now available. Complete it before June 15, 2026.', 'assessment', 1, FALSE, 'medium', '/student/assessments', '2026-06-08 10:00:00'),
(2, 'Assessment Graded', 'Your JavaScript Basics Quiz has been graded. Score: 90%. Great job!', 'assessment', 1, FALSE, 'medium', '/student/assessments/1', '2026-06-11 10:00:00'),
(2, 'Exam Scheduled', 'MERN Stack Final Exam is scheduled for August 20, 2026 at 10:00 AM.', 'exam', 1, FALSE, 'high', '/student/exams/1', '2026-08-01 09:00:00'),
(2, 'Certificate Ready', 'Congratulations! Your internship certificate is ready for download.', 'certificate', 1, FALSE, 'high', '/student/certificates', '2026-08-25 10:00:00'),
(2, 'Mobile App Internship Approved', 'Your application for Mobile App Development Internship has been approved!', 'application', 11, FALSE, 'high', '/student/internships/3', '2026-05-14 15:00:00'),

-- Student 2 (Priya) notifications
(3, 'Application Approved', 'Your application for Full Stack Web Development Internship has been approved!', 'application', 2, TRUE, 'high', '/student/internships/1', '2026-05-12 10:00:00'),
(3, 'Attendance Reminder', 'Please ensure regular attendance. Your current attendance: 87.5%', 'attendance', NULL, TRUE, 'medium', '/student/attendance', '2026-06-15 09:00:00'),
(3, 'Assessment Graded', 'Your JavaScript Basics Quiz has been graded. Score: 56%. Review the feedback.', 'assessment', 1, FALSE, 'medium', '/student/assessments/1', '2026-06-11 10:30:00'),
(3, 'Certificate Ready', 'Your internship certificate is ready for download.', 'certificate', 2, FALSE, 'high', '/student/certificates', '2026-08-25 10:00:00'),
(3, 'Cloud & DevOps Internship Approved', 'Your application for Cloud Computing & DevOps Internship has been approved!', 'application', 22, FALSE, 'high', '/student/internships/6', '2026-05-17 10:00:00'),

-- Student 3 (Amit) notifications
(4, 'Application Approved', 'Your application for Data Science & Machine Learning Internship has been approved!', 'application', 4, TRUE, 'high', '/student/internships/2', '2026-05-13 10:00:00'),
(4, 'New Learning Material', 'Python for Data Science material is now available.', 'general', 2, TRUE, 'medium', '/student/materials', '2026-06-15 10:00:00'),
(4, 'Assessment Graded', 'Your Python & Data Science Quiz has been graded. Score: 80%. Well done!', 'assessment', 3, FALSE, 'medium', '/student/assessments/3', '2026-06-21 09:00:00'),
(4, 'Project Deadline', 'ML Model Building Project is due on July 15, 2026.', 'assessment', 4, FALSE, 'high', '/student/assessments/4', '2026-07-01 09:00:00'),
(4, 'Certificate Ready', 'Your Data Science internship certificate is ready!', 'certificate', 4, FALSE, 'high', '/student/certificates', '2026-10-09 10:00:00'),

-- Student 4 (Sneha) notifications
(5, 'Application Approved', 'Your application for Digital Marketing Internship has been approved!', 'application', 13, TRUE, 'high', '/student/internships/4', '2026-05-15 09:00:00'),
(5, 'Application Approved', 'Your application for UI/UX Design Internship has been approved!', 'application', 17, TRUE, 'high', '/student/internships/5', '2026-05-16 09:00:00'),
(5, 'New Assessment Available', 'Digital Marketing Fundamentals Quiz is now available.', 'assessment', 6, FALSE, 'medium', '/student/assessments', '2026-06-15 10:00:00'),
(5, 'Assessment Graded', 'Your Digital Marketing Quiz has been graded. Score: 84%. Excellent!', 'assessment', 6, FALSE, 'medium', '/student/assessments/6', '2026-06-19 09:00:00'),
(5, 'Certificate Ready', 'Your Digital Marketing internship certificate is ready!', 'certificate', 6, FALSE, 'high', '/student/certificates', '2026-08-06 10:00:00'),

-- Student 5 (Vikram) notifications
(6, 'Application Approved', 'Your application for Data Science & Machine Learning Internship has been approved!', 'application', 5, TRUE, 'high', '/student/internships/2', '2026-05-13 11:00:00'),
(6, 'Assessment Graded', 'Your Python & Data Science Quiz has been graded. Score: 91.67%. Outstanding!', 'assessment', 3, FALSE, 'medium', '/student/assessments/3', '2026-06-21 09:30:00'),
(6, 'Research Paper Opportunity', 'Your project work is excellent. Consider publishing it as a research paper.', 'general', NULL, FALSE, 'medium', NULL, '2026-09-15 10:00:00'),
(6, 'Certificate Ready', 'Your Data Science internship certificate is ready!', 'certificate', 5, FALSE, 'high', '/student/certificates', '2026-10-09 10:00:00'),

-- Student 6 (Ananya) notifications
(7, 'Application Approved', 'Your application for Mobile App Development Internship has been approved!', 'application', 12, TRUE, 'high', '/student/internships/3', '2026-05-15 10:00:00'),
(7, 'New Assessment Available', 'React Native Basics Quiz is now available.', 'assessment', 5, FALSE, 'medium', '/student/assessments', '2026-07-03 10:00:00'),
(7, 'Assessment Graded', 'Your React Native Quiz has been graded. Score: 56%. Review the concepts.', 'assessment', 5, FALSE, 'medium', '/student/assessments/5', '2026-07-06 09:30:00'),

-- Student 7 (Rohan) notifications
(8, 'Application Approved', 'Your application for Full Stack Web Development Internship has been approved!', 'application', 3, TRUE, 'high', '/student/internships/1', '2026-05-13 14:00:00'),
(8, 'Assessment Graded', 'Your JavaScript Basics Quiz has been graded. Score: 84%. Very good!', 'assessment', 1, FALSE, 'medium', '/student/assessments/1', '2026-06-11 11:00:00'),
(8, 'Exam Result', 'Your MERN Stack Final Exam result: 92%. Excellent performance!', 'exam', 1, FALSE, 'high', '/student/exams/1', '2026-08-21 15:00:00'),
(8, 'Certificate Ready', 'Your internship certificate is ready for download.', 'certificate', 3, FALSE, 'high', '/student/certificates', '2026-08-25 10:00:00'),
(8, 'Cybersecurity Internship Approved', 'Your application for Cybersecurity Internship has been approved!', 'application', 24, TRUE, 'high', '/student/internships/7', '2026-05-18 11:00:00'),

-- Student 8 (Kavya) notifications
(9, 'Application Approved', 'Your application for Blockchain Development Internship has been approved!', 'application', 26, TRUE, 'high', '/student/internships/8', '2026-05-19 09:00:00'),
(9, 'New Learning Material', 'Blockchain Fundamentals material is now available.', 'general', 8, TRUE, 'medium', '/student/materials', '2026-07-10 10:00:00'),

-- Student 9 (Arjun) notifications
(10, 'Application Approved', 'Your application for Digital Marketing Internship has been approved!', 'application', 14, TRUE, 'high', '/student/internships/4', '2026-05-15 11:00:00'),
(10, 'Assessment Graded', 'Your Digital Marketing Quiz has been graded. Score: 50%. Needs improvement.', 'assessment', 6, FALSE, 'medium', '/student/assessments/6', '2026-06-19 09:30:00'),
(10, 'Certificate Ready', 'Your Digital Marketing internship certificate is ready!', 'certificate', 7, FALSE, 'high', '/student/certificates', '2026-08-06 10:00:00'),
(10, 'Content Writing Internship Approved', 'Your application for Content Writing & SEO Internship has been approved!', 'application', 27, TRUE, 'high', '/student/internships/9', '2026-05-20 09:00:00'),

-- Admin notifications
(1, 'New Application', 'New application received for Full Stack Web Development Internship from Rahul Sharma.', 'application', 1, TRUE, 'medium', '/admin/applications', '2026-05-10 10:30:00'),
(1, 'New Application', 'New application received for Data Science Internship from Amit Kumar.', 'application', 4, TRUE, 'medium', '/admin/applications', '2026-05-12 09:15:00'),
(1, 'Exam Scheduled', 'MERN Stack Final Exam has been scheduled for August 20, 2026.', 'exam', 1, FALSE, 'high', '/admin/exams/1', '2026-08-01 09:00:00'),
(1, 'Certificate Issued', 'Certificate issued to Rahul Sharma for Full Stack Web Development Internship.', 'certificate', 1, FALSE, 'medium', '/admin/certificates', '2026-08-25 10:00:00');

-- ============================================
-- MATERIAL PROGRESS DATA
-- ============================================
-- Note: Material IDs are based on insertion order in learning_materials table
-- Internship 1 materials: IDs 1-7
-- Internship 2 materials: IDs 8-13
-- Internship 3 materials: IDs 14-18
-- Internship 4 materials: IDs 19-24
-- Internship 5 materials: IDs 25-30
-- Internship 6 materials: IDs 31-36
-- Internship 7 materials: IDs 37-40
-- Internship 8 materials: IDs 41-44
-- Internship 9 materials: IDs 45-48
-- Internship 10 materials: IDs 49-52
-- Internship 11 materials: IDs 53-56
-- Internship 12 materials: IDs 57-60

INSERT INTO material_progress (student_id, material_id, progress_percentage, is_completed, last_accessed_at, completed_at) VALUES
-- Student 1 (Rahul) - Internship 1 materials (IDs 1-7)
(1, 1, 100, TRUE, '2026-06-02 18:00:00', '2026-06-02 18:00:00'),
(1, 2, 100, TRUE, '2026-06-04 19:00:00', '2026-06-04 19:00:00'),
(1, 3, 100, TRUE, '2026-06-06 20:00:00', '2026-06-06 20:00:00'),
(1, 4, 100, TRUE, '2026-06-08 18:30:00', '2026-06-08 18:30:00'),
(1, 5, 100, TRUE, '2026-06-10 19:00:00', '2026-06-10 19:00:00'),
(1, 6, 75, FALSE, '2026-06-12 17:00:00', NULL),
(1, 7, 40, FALSE, '2026-06-14 16:00:00', NULL),
-- Student 1 - Internship 3 materials (IDs 14-18)
(1, 14, 100, TRUE, '2026-07-02 18:00:00', '2026-07-02 18:00:00'),
(1, 15, 100, TRUE, '2026-07-03 19:00:00', '2026-07-03 19:00:00'),
(1, 16, 60, FALSE, '2026-07-04 17:00:00', NULL),

-- Student 2 (Priya) - Internship 1 materials (IDs 1-7)
(2, 1, 100, TRUE, '2026-06-03 17:30:00', '2026-06-03 17:30:00'),
(2, 2, 100, TRUE, '2026-06-05 18:00:00', '2026-06-05 18:00:00'),
(2, 3, 80, FALSE, '2026-06-07 17:00:00', NULL),
(2, 4, 45, FALSE, '2026-06-09 16:00:00', NULL),
(2, 5, 30, FALSE, '2026-06-11 15:00:00', NULL),
-- Student 2 - Internship 6 materials (IDs 31-36)
(2, 31, 100, TRUE, '2026-08-02 18:00:00', '2026-08-02 18:00:00'),
(2, 32, 80, FALSE, '2026-08-04 17:00:00', NULL),

-- Student 3 (Amit) - Internship 2 materials (IDs 8-13)
(3, 8, 100, TRUE, '2026-06-16 20:00:00', '2026-06-16 20:00:00'),
(3, 9, 100, TRUE, '2026-06-18 19:30:00', '2026-06-18 19:30:00'),
(3, 10, 100, TRUE, '2026-06-20 20:00:00', '2026-06-20 20:00:00'),
(3, 11, 100, TRUE, '2026-06-22 19:00:00', '2026-06-22 19:00:00'),
(3, 12, 85, FALSE, '2026-06-24 18:00:00', NULL),
(3, 13, 50, FALSE, '2026-06-26 17:00:00', NULL),
-- Student 3 - Internship 11 materials (IDs 53-56)
(3, 53, 100, TRUE, '2026-06-26 19:00:00', '2026-06-26 19:00:00'),
(3, 54, 90, FALSE, '2026-06-28 18:00:00', NULL),

-- Student 4 (Sneha) - Internship 4 materials (IDs 19-24)
(4, 19, 100, TRUE, '2026-06-11 18:00:00', '2026-06-11 18:00:00'),
(4, 20, 100, TRUE, '2026-06-13 19:00:00', '2026-06-13 19:00:00'),
(4, 21, 100, TRUE, '2026-06-15 18:30:00', '2026-06-15 18:30:00'),
(4, 22, 100, TRUE, '2026-06-17 19:00:00', '2026-06-17 19:00:00'),
(4, 23, 70, FALSE, '2026-06-19 17:00:00', NULL),
(4, 24, 60, FALSE, '2026-06-21 16:00:00', NULL),
-- Student 4 - Internship 5 materials (IDs 25-30)
(4, 25, 100, TRUE, '2026-07-16 18:00:00', '2026-07-16 18:00:00'),
(4, 26, 100, TRUE, '2026-07-17 19:00:00', '2026-07-17 19:00:00'),
(4, 27, 50, FALSE, '2026-07-18 17:00:00', NULL),

-- Student 5 (Vikram) - Internship 2 materials (IDs 8-13)
(5, 8, 100, TRUE, '2026-06-16 21:00:00', '2026-06-16 21:00:00'),
(5, 9, 100, TRUE, '2026-06-18 20:00:00', '2026-06-18 20:00:00'),
(5, 10, 100, TRUE, '2026-06-20 21:00:00', '2026-06-20 21:00:00'),
(5, 11, 100, TRUE, '2026-06-22 20:00:00', '2026-06-22 20:00:00'),
(5, 12, 100, TRUE, '2026-06-24 19:00:00', '2026-06-24 19:00:00'),
(5, 13, 100, TRUE, '2026-06-26 18:00:00', '2026-06-26 18:00:00'),

-- Student 6 (Ananya) - Internship 3 materials (IDs 14-18)
(6, 14, 100, TRUE, '2026-07-02 19:00:00', '2026-07-02 19:00:00'),
(6, 15, 100, TRUE, '2026-07-03 18:00:00', '2026-07-03 18:00:00'),
(6, 16, 70, FALSE, '2026-07-04 17:00:00', NULL),
(6, 17, 40, FALSE, '2026-07-05 16:00:00', NULL),

-- Student 7 (Rohan) - Internship 1 materials (IDs 1-7)
(7, 1, 100, TRUE, '2026-06-02 19:00:00', '2026-06-02 19:00:00'),
(7, 2, 100, TRUE, '2026-06-04 18:00:00', '2026-06-04 18:00:00'),
(7, 3, 100, TRUE, '2026-06-06 19:00:00', '2026-06-06 19:00:00'),
(7, 4, 100, TRUE, '2026-06-08 18:00:00', '2026-06-08 18:00:00'),
(7, 5, 90, FALSE, '2026-06-10 17:00:00', NULL),
-- Student 7 - Internship 7 materials (IDs 37-40)
(7, 37, 100, TRUE, '2026-06-21 18:00:00', '2026-06-21 18:00:00'),
(7, 38, 80, FALSE, '2026-06-23 17:00:00', NULL),

-- Student 8 (Kavya) - Internship 1 materials (IDs 1-7)
(8, 1, 100, TRUE, '2026-06-02 20:00:00', '2026-06-02 20:00:00'),
(8, 2, 100, TRUE, '2026-06-04 19:00:00', '2026-06-04 19:00:00'),
(8, 3, 100, TRUE, '2026-06-06 18:00:00', '2026-06-06 18:00:00'),
(8, 4, 85, FALSE, '2026-06-08 17:00:00', NULL),

-- Student 9 (Arjun) - Internship 8 materials (IDs 41-44)
(9, 41, 100, TRUE, '2026-07-11 19:00:00', '2026-07-11 19:00:00'),
(9, 42, 90, FALSE, '2026-07-13 18:00:00', NULL),

-- Student 10 (Diya) - Internship 4 materials (IDs 19-24)
(10, 19, 100, TRUE, '2026-06-06 18:00:00', '2026-06-06 18:00:00'),
(10, 20, 100, TRUE, '2026-06-08 19:00:00', '2026-06-08 19:00:00'),
(10, 21, 80, FALSE, '2026-06-10 17:00:00', NULL),
-- Student 10 - Internship 9 materials (IDs 45-48)
(10, 45, 100, TRUE, '2026-06-06 19:00:00', '2026-06-06 19:00:00'),
(10, 46, 100, TRUE, '2026-06-08 18:00:00', '2026-06-08 18:00:00'),
(10, 47, 70, FALSE, '2026-06-10 17:00:00', NULL),

-- Student 12 (Ishita) - Internship 7 materials (IDs 37-40)
(12, 37, 100, TRUE, '2026-06-21 19:00:00', '2026-06-21 19:00:00'),
(12, 38, 100, TRUE, '2026-06-23 18:00:00', '2026-06-23 18:00:00'),
(12, 39, 85, FALSE, '2026-06-25 17:00:00', NULL),

-- Student 13 (Aditya) - Internship 10 materials (IDs 49-52)
(13, 49, 100, TRUE, '2026-07-21 18:00:00', '2026-07-21 18:00:00'),
(13, 50, 100, TRUE, '2026-07-22 19:00:00', '2026-07-22 19:00:00'),
(13, 51, 60, FALSE, '2026-07-23 17:00:00', NULL),

-- Student 14 (Meera) - Internship 12 materials (IDs 57-60)
(14, 57, 100, TRUE, '2026-08-06 18:00:00', '2026-08-06 18:00:00'),
(14, 58, 90, FALSE, '2026-08-07 17:00:00', NULL),

-- Student 15 (Siddharth) - Internship 2 materials (IDs 8-13)
(15, 8, 100, TRUE, '2026-06-16 19:00:00', '2026-06-16 19:00:00'),
(15, 9, 100, TRUE, '2026-06-18 18:00:00', '2026-06-18 18:00:00'),
(15, 10, 75, FALSE, '2026-06-20 17:00:00', NULL),

-- Student 16 (Tanvi) - Internship 4 materials (IDs 19-24)
(16, 19, 100, TRUE, '2026-06-11 19:00:00', '2026-06-11 19:00:00'),
(16, 20, 100, TRUE, '2026-06-13 18:00:00', '2026-06-13 18:00:00'),
(16, 21, 90, FALSE, '2026-06-15 17:00:00', NULL),
-- Student 16 - Internship 5 materials (IDs 25-30)
(16, 25, 100, TRUE, '2026-07-16 19:00:00', '2026-07-16 19:00:00'),
(16, 26, 85, FALSE, '2026-07-17 18:00:00', NULL),

-- Student 18 (Riya) - Internship 9 materials (IDs 45-48)
(18, 45, 100, TRUE, '2026-06-06 18:00:00', '2026-06-06 18:00:00'),
(18, 46, 100, TRUE, '2026-06-08 19:00:00', '2026-06-08 19:00:00'),
(18, 47, 100, TRUE, '2026-06-10 18:00:00', '2026-06-10 18:00:00'),
(18, 48, 80, FALSE, '2026-06-12 17:00:00', NULL),
-- Student 18 - Internship 11 materials (IDs 53-56)
(18, 53, 100, TRUE, '2026-06-26 18:00:00', '2026-06-26 18:00:00'),
(18, 54, 100, TRUE, '2026-06-28 19:00:00', '2026-06-28 19:00:00'),
(18, 55, 70, FALSE, '2026-06-30 17:00:00', NULL);

-- ============================================
-- END OF SEED DATA
-- ============================================
