# SmartAttend — Attendance Management System

A role-based school attendance system built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **MySQL**.

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
attendance-system/
├── app/
│   ├── admin/          # Admin pages (dashboard, students, teachers, etc.)
│   ├── teacher/        # Teacher pages (mark attendance, history, timetable)
│   ├── student/        # Student pages (attendance, timetable, profile)
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
DB_NAME=attendance_db
DB_PORT=3306
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_NAME=SmartAttend
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
| Admin   | admin@school.com      | admin123   |
| Teacher | teacher@school.com    | teacher123 |
| Student | student@school.com    | student123 |

---

## Features

### Admin
- Dashboard with live stats (students, teachers, attendance rate)
- Manage students, teachers, subjects, and classes
- Timetable builder (per class, per day) — fixed entry creation and editing
- Holiday management (national, regional, school)
- Attendance reports with CSV export
- Teacher-subject assignments

### Teacher
- Dashboard with today's schedule
- View assigned subjects and classes
- Mark attendance — present / absent / late / excused — with bulk actions
- Attendance history with filters
- Timetable and holiday views

### Student
- Dashboard with attendance ring chart
- Subject-wise attendance summary with progress bars
- Detailed attendance records
- Timetable with day tabs
- Holiday list
- Profile management

---

## Database Schema

Key tables:

- `users` — shared for all roles (admin, teacher, student)
- `students` / `teachers` — extended profile info
- `subjects` — course catalog
- `classes` — class + section groupings
- `teacher_subjects` — teacher-to-subject-class assignments
- `timetable` — weekly schedule per class
- `attendance` — per-student, per-subject, per-date records
- `holidays` — school calendar

---

## Changelog

### Latest
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
