# Online Internship Management System

A comprehensive role-based internship management platform built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **MySQL**. Streamlines internship applications, certificate management, assessments, exams, and attendance tracking for educational institutions.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Framework  | Next.js 16 (App Router)           |
| Language   | TypeScript                        |
| Styling    | Tailwind CSS v4                   |
| Database   | MySQL 8 via `mysql2`              |
| Auth       | JWT (`jose` + `jsonwebtoken`)     |
| Icons      | Lucide React                      |

---

## Project Structure

```
internship-system/
├── app/
│   ├── admin/          # Admin pages (internships, students, certificates, assessments, exams)
│   ├── student/        # Student pages (applications, attendance, certificates, materials, exams)
│   ├── api/            # REST API routes
│   └── login/          # Login page
├── components/         # Shared UI components
├── lib/
│   ├── db.ts           # MySQL connection pool
│   └── auth.ts         # JWT helpers
└── sql/
    ├── schema.sql      # Database schema
    └── seed.sql        # Seed data
```

---

## Getting Started

### 1. Database

Make sure MySQL is running, then import the schema and seed data:

```bash
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seed.sql
```

### 2. Environment

Copy or edit `.env.local`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=internship_db
DB_PORT=3306
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_NAME=InternHub
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Accounts

| Role    | Email                 | Password   |
|---------|-----------------------|------------|
| Admin   | admin@internhub.com   | admin123   |
| Student | student@internhub.com | student123 |

---

## Features

### Admin
- **Dashboard** with live statistics (total students, active internships, applications, completion rate)
- **Internship Management**
  - Add new internships with details (title, description, duration, requirements, stipend)
  - Edit and manage internship details
  - Set internship status (active, closed, upcoming)
  - Track applications per internship
- **Certificate Management**
  - Generate certificates for completed internships
  - Customize certificate templates
  - Bulk certificate generation
  - Certificate verification system
- **Assessment & Exam Management**
  - Create assessments with multiple question types
  - Create exams with time limits and passing criteria
  - Auto-grading for objective questions
  - Manual grading interface for subjective questions
  - View student performance analytics
- **Attendance Tracking**
  - Track student attendance for internship sessions
  - Generate attendance reports
  - Set attendance requirements for certificate eligibility
- **Student Management**
  - Monitor student applications and progress
  - View student profiles and performance
  - Approve/reject applications
  - Track completion status
- **Reports & Analytics**
  - Application statistics
  - Completion rates
  - Performance analytics
  - Export reports (CSV, PDF)

### Student
- **Registration & Authentication**
  - Secure registration with email verification
  - Login with JWT-based authentication
  - Password reset functionality
- **Profile Management**
  - Update personal information
  - Upload resume and documents
  - View application history
- **Internship Applications**
  - Browse available internships
  - Filter by category, duration, stipend
  - Apply for internships with cover letter
  - Track application status (pending, approved, rejected)
- **Attendance**
  - View attendance records
  - Check attendance percentage
  - Receive attendance notifications
- **Certificates**
  - Download completed internship certificates
  - View certificate history
  - Share certificates (LinkedIn, social media)
- **Learning Materials**
  - Access internship-specific materials
  - Download resources and documents
  - Video tutorials and guides
- **Assessments & Exams**
  - Take online assessments
  - Attempt timed exams
  - View scores and feedback
  - Retake failed assessments (if allowed)
- **Notifications**
  - Real-time notifications for application updates
  - Exam and assessment reminders
  - Attendance alerts
  - Certificate availability notifications

---

## Database Schema

Key tables:

- `users` — shared for all roles (admin, student)
- `students` — extended student profile info (resume, skills, education)
- `internships` — internship listings (title, description, duration, requirements, stipend)
- `applications` — student applications to internships
- `certificates` — generated certificates for completed internships
- `assessments` — assessment definitions (questions, answers, scoring)
- `exams` — exam definitions (questions, time limits, passing criteria)
- `student_assessments` — student assessment attempts and scores
- `student_exams` — student exam attempts and results
- `attendance` — per-student, per-internship attendance records
- `learning_materials` — internship-specific learning resources
- `notifications` — system notifications for students

---

## Changelog

### v2.0.0 - Internship Management System
- **Complete system transformation** from Attendance Management to Internship Management
- Added internship creation and management features
- Implemented certificate generation system
- Created assessment and exam modules
- Enhanced student application workflow
- Added learning materials management
- Implemented notification system
- Removed teacher role (now admin-student only)
- Updated database schema for internship management
- Redesigned UI for internship-focused workflows

### v1.0.0 - Attendance Management System (Legacy)
- Fixed timetable entry creation — teacher ID was resolving to the wrong foreign key (`users.id` instead of `teachers.id`)
- Fixed timetable edit form — class, subject, and teacher fields now pre-populate correctly when editing an existing entry

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Key Workflows

### For Administrators

1. **Create Internship** → Set details, requirements, duration
2. **Review Applications** → Approve/reject student applications
3. **Track Attendance** → Monitor student participation
4. **Create Assessments/Exams** → Design evaluation criteria
5. **Generate Certificates** → Issue certificates to successful students

### For Students

1. **Register/Login** → Create account and authenticate
2. **Browse Internships** → Find suitable opportunities
3. **Apply** → Submit application with cover letter
4. **Attend Sessions** → Participate in internship activities
5. **Complete Assessments** → Take tests and exams
6. **Download Certificate** → Receive completion certificate

---

## Security Features

- JWT-based authentication with secure token storage
- Password hashing with bcrypt
- Role-based access control (RBAC)
- SQL injection prevention with parameterized queries
- XSS protection with input sanitization
- CSRF protection for form submissions
- Secure file upload validation

---

## Future Enhancements

- [ ] Email notifications (SendGrid/Nodemailer integration)
- [ ] SMS notifications for important updates
- [ ] Video conferencing integration for virtual internships
- [ ] AI-powered internship recommendations
- [ ] Blockchain-based certificate verification
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Payment gateway for paid internships
- [ ] Mentor assignment and tracking

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Support

For issues, questions, or feature requests, please open an issue on GitHub or contact support@internhub.com.
