# InternHub - Online Internship Management System

A comprehensive role-based internship management platform built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **MySQL**. Features a beautiful landing page, streamlined internship applications, certificate management, assessments, exams, and attendance tracking for educational institutions.

---

## ✨ New Features

### 🎨 Beautiful Landing Page
- **Modern Design**: Gradient backgrounds, animated blobs, and glassmorphism effects
- **Hero Section**: Compelling headline with key statistics (12+ programs, 500+ students, 95% success rate)
- **Internship Showcase**: Grid of featured programs with ratings and student counts
- **Features Highlight**: 6 key platform benefits with icons
- **Certificate Preview**: Visual mockup demonstrating certification
- **Student Testimonials**: Real success stories with 5-star ratings
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Smooth Animations**: Hover effects, transitions, and scroll animations

### 🔐 Enhanced Authentication Flow
- **Smart Routing**: Logged-out users see landing page, logged-in users go to dashboard
- **Improved Logout**: Redirects to landing page instead of login page
- **Role-Based Access**: Automatic redirection based on user role (admin/student/teacher)

### 👨‍🏫 Teacher Role Support
- **Complete Integration**: Full teacher role with dedicated dashboard
- **Attendance Management**: Mark and track student attendance
- **Class Management**: View assigned classes and subjects
- **Timetable Access**: View teaching schedule
- **History Tracking**: Review past attendance records

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
| Animations | CSS Keyframes + Tailwind          |

---

## Project Structure

```
internship-system/
├── app/
│   ├── page.tsx        # Landing page (public)
│   ├── admin/          # Admin dashboard & pages
│   ├── student/        # Student dashboard & pages
│   ├── teacher/        # Teacher dashboard & pages
│   ├── api/            # REST API routes
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   └── globals.css     # Global styles & animations
├── components/         # Shared UI components
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── TopBar.tsx      # Top navigation bar
├── lib/
│   ├── db.ts           # MySQL connection pool
│   └── auth.ts         # JWT helpers & session management
├── sql/
│   ├── schema.sql      # Database schema
│   └── seed.sql        # Comprehensive seed data
├── middleware.ts       # Route protection & authentication
└── README.md           # This file
```

---

## Getting Started

### 1. Prerequisites

- **Node.js** 18+ and npm
- **MySQL** 8.0+
- **Git** (for cloning)

### 2. Database Setup

Make sure MySQL is running, then import the schema and seed data:

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS internship_db;"

# Import schema
mysql -u root -p internship_db < sql/schema.sql

# Import seed data (includes 12 internships, students, assessments, etc.)
mysql -u root -p internship_db < sql/seed.sql
```

### 3. Environment Configuration

Create `.env.local` in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=internship_db
DB_PORT=3306

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App Configuration
NEXT_PUBLIC_APP_NAME=InternHub
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page!

---

## Demo Accounts

| Role    | Email                  | Password   | Access                           |
|---------|------------------------|------------|----------------------------------|
| Admin   | admin@internhub.com    | admin123   | Full system access               |
| Student | akxay.b@student.com    | student123 | Student dashboard & applications |
| Teacher | teacher@internhub.com  | teacher123 | Teacher dashboard & attendance   |

**Note**: Additional demo accounts are available in the seed data.

---

## Features

### 🏠 Landing Page (Public)
- **Hero Section**: Eye-catching introduction with gradient text
- **Statistics**: Real-time platform metrics
- **Internship Programs**: Featured programs with details
- **Features Showcase**: Platform benefits and capabilities
- **Certificate Preview**: Visual demonstration of certification
- **Testimonials**: Student success stories
- **Call-to-Action**: Clear paths to login or register
- **Responsive Footer**: Links and company information

### 👨‍💼 Admin Dashboard
- **Live Statistics**: Total students, active internships, applications, completion rate
- **Internship Management**
  - Create, edit, and delete internships
  - Set duration, requirements, stipend, and eligibility
  - Track applications per internship
  - Manage internship status (active, closed, upcoming)
- **Application Management**
  - Review student applications
  - Approve or reject with feedback
  - Bulk actions for efficiency
  - Filter by status and internship
- **Certificate Management**
  - Generate certificates for completed internships
  - Customize certificate details
  - Bulk certificate generation
  - Verification code system
  - Download and print certificates
- **Assessment & Exam Management**
  - Create assessments with multiple question types (MCQ, text, coding)
  - Design timed exams with passing criteria
  - Auto-grading for objective questions
  - Manual grading interface for subjective answers
  - Performance analytics and reports
- **Student Management**
  - View all registered students
  - Monitor progress and performance
  - Track application history
  - Manage student profiles
- **Teacher Management**
  - Add and manage teachers
  - Assign subjects and classes
  - View teaching schedules
- **Reports & Analytics**
  - Application statistics
  - Completion rates by program
  - Performance analytics
  - Export to CSV/PDF

### 🎓 Student Dashboard
- **Profile Management**
  - Update personal information
  - Upload resume and documents
  - Manage skills and education
  - View application history
- **Browse Internships**
  - Search and filter programs
  - View detailed descriptions
  - Check eligibility requirements
  - See available slots
- **Application System**
  - Apply with cover letter
  - Track application status
  - Receive notifications
  - Reapply if rejected
- **Learning Materials**
  - Access course materials
  - Download resources
  - Watch video tutorials
  - Track progress
- **Assessments & Exams**
  - Take online assessments
  - Attempt timed exams
  - View scores and feedback
  - Retake if allowed
- **Attendance Tracking**
  - View attendance records
  - Check attendance percentage
  - Receive alerts for low attendance
- **Certificates**
  - Download completed certificates
  - View certificate history
  - Share on LinkedIn
  - Verify authenticity
- **Notifications**
  - Application updates
  - Exam reminders
  - Attendance alerts
  - Certificate availability

### 👨‍🏫 Teacher Dashboard
- **Class Management**
  - View assigned classes
  - See student lists
  - Track class schedules
- **Attendance Management**
  - Mark student attendance
  - Bulk attendance marking
  - View attendance history
  - Generate reports
- **Subject Management**
  - View assigned subjects
  - Access teaching materials
  - Track syllabus progress
- **Timetable**
  - View teaching schedule
  - Check upcoming classes
  - See room assignments
- **Holidays & Events**
  - View academic calendar
  - Check holiday schedule

---

## Database Schema

### Core Tables

- **`users`** — Shared authentication (admin, student, teacher)
- **`students`** — Extended student profiles (resume, skills, education)
- **`teachers`** — Teacher information and qualifications
- **`internships`** — Internship listings (12 programs included)
- **`applications`** — Student applications with status tracking
- **`certificates`** — Generated certificates with verification codes
- **`assessments`** — Assessment definitions with questions
- **`exams`** — Exam definitions with time limits
- **`student_assessments`** — Assessment attempts and scores
- **`student_exams`** — Exam attempts and results
- **`attendance`** — Attendance records per student/session
- **`learning_materials`** — Course materials (videos, documents, links)
- **`material_progress`** — Student progress tracking
- **`notifications`** — System notifications
- **`classes`** — Class definitions
- **`subjects`** — Subject catalog
- **`timetable`** — Class schedules
- **`holidays`** — Academic calendar

### Seed Data Includes

- 12 diverse internship programs (Web Dev, Data Science, Mobile, Marketing, UI/UX, Cloud, Security, Blockchain, Content Writing, Game Dev, Business Analytics, IoT)
- 20+ students with varied profiles
- 10+ teachers with subject assignments
- 60+ learning materials across programs
- Multiple assessments and exams
- Student progress and completion data
- Certificates with verification codes
- Comprehensive notification history

---

## API Routes

### Authentication
- `POST /api/auth/login` — User login
- `POST /api/auth/register` — Student registration
- `POST /api/auth/logout` — User logout
- `GET /api/auth/me` — Get current user

### Admin APIs
- `GET/POST /api/admin/internships` — Manage internships
- `GET/PUT /api/admin/applications` — Review applications
- `GET/POST /api/admin/certificates` — Generate certificates
- `GET/POST /api/admin/assessments` — Manage assessments
- `GET/POST /api/admin/exams` — Manage exams
- `GET /api/admin/students` — View students
- `GET /api/admin/stats` — Dashboard statistics

### Student APIs
- `GET /api/student/internships` — Browse internships
- `POST /api/student/applications` — Apply for internship
- `GET /api/student/certificates` — View certificates
- `GET /api/student/materials` — Access learning materials
- `GET /api/student/exams` — View available exams
- `GET /api/student/timetable` — View schedule

### Teacher APIs
- `GET/POST /api/teacher/attendance` — Mark attendance
- `GET /api/teacher/subjects` — View assigned subjects
- `GET /api/teacher/timetable` — View teaching schedule

---

## Security Features

- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Password Hashing**: bcrypt for password security
- ✅ **Role-Based Access Control**: Middleware-enforced permissions
- ✅ **SQL Injection Prevention**: Parameterized queries
- ✅ **XSS Protection**: Input sanitization
- ✅ **CSRF Protection**: Token validation
- ✅ **Secure Cookies**: HttpOnly and Secure flags
- ✅ **Route Protection**: Middleware guards all protected routes

---

## Changelog

### v3.0.0 - Landing Page & Enhanced Features (Current)
- ✨ **NEW**: Beautiful, modern landing page with animations
- ✨ **NEW**: Teacher role fully integrated
- 🔧 **FIXED**: Logout now redirects to landing page
- 🔧 **FIXED**: Home page accessible without authentication
- 🎨 **IMPROVED**: Enhanced UI with gradient designs
- 📊 **EXPANDED**: Comprehensive seed data with 12 internships
- 🔐 **ENHANCED**: Complete role-based authentication
- 📱 **OPTIMIZED**: Fully responsive design

### v2.0.0 - Internship Management System
- Complete transformation from Attendance to Internship Management
- Added certificate generation system
- Implemented assessment and exam modules
- Enhanced student application workflow
- Added learning materials management
- Implemented notification system

### v1.0.0 - Attendance Management System (Legacy)
- Initial release with basic attendance tracking
- Teacher and student roles
- Timetable management

---

## Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build with optimization
npm run start    # Start production server
npm run lint     # Run ESLint for code quality
```

---

## Key Workflows

### For Visitors (Not Logged In)
1. **Visit Landing Page** → See platform features and internships
2. **Browse Programs** → Explore available internships
3. **Register** → Create student account
4. **Login** → Access dashboard

### For Administrators
1. **Login** → Access admin dashboard
2. **Create Internship** → Set details, requirements, duration
3. **Review Applications** → Approve/reject with feedback
4. **Create Assessments** → Design evaluation criteria
5. **Generate Certificates** → Issue to successful students
6. **View Analytics** → Monitor platform performance

### For Students
1. **Register/Login** → Create account and authenticate
2. **Browse Internships** → Find suitable opportunities
3. **Apply** → Submit application with cover letter
4. **Access Materials** → Study course content
5. **Complete Assessments** → Take tests and exams
6. **Download Certificate** → Receive completion certificate

### For Teachers
1. **Login** → Access teacher dashboard
2. **View Classes** → See assigned classes and students
3. **Mark Attendance** → Record student attendance
4. **View Schedule** → Check timetable
5. **Track History** → Review past records

---

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker
```bash
# Build image
docker build -t internhub .

# Run container
docker run -p 3000:3000 --env-file .env.local internhub
```

### Traditional Hosting
```bash
# Build
npm run build

# Start with PM2
pm2 start npm --name "internhub" -- start
```

---

## Future Enhancements

- [ ] 📧 Email notifications (SendGrid/Nodemailer)
- [ ] 📱 SMS notifications for important updates
- [ ] 🎥 Video conferencing integration
- [ ] 🤖 AI-powered internship recommendations
- [ ] ⛓️ Blockchain-based certificate verification
- [ ] 📱 Mobile app (React Native)
- [ ] 📊 Advanced analytics dashboard
- [ ] 🌍 Multi-language support (i18n)
- [ ] 💳 Payment gateway for paid internships
- [ ] 👥 Mentor assignment and tracking
- [ ] 🌙 Dark mode toggle
- [ ] 📝 Blog section for updates
- [ ] 💬 Live chat support
- [ ] 🔔 Push notifications
- [ ] 📈 Progress tracking gamification

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write clean, documented code
- Test thoroughly before submitting
- Follow existing code style
- Update documentation as needed

---

## Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1;"

# Verify database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'internship_db';"
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues
- Check JWT_SECRET is set in .env.local
- Clear browser cookies
- Verify token expiration settings

---

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

## Support

For issues, questions, or feature requests:
- 📧 Email: support@internhub.com
- 🐛 GitHub Issues: [Open an issue](https://github.com/yourusername/internhub/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/internhub/wiki)

---

## Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for beautiful icons
- **MySQL** for reliable database management

---

**Built with ❤️ for students and educational institutions worldwide**
