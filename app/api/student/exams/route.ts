import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

interface Exam {
  id: number;
  internship_id: number;
  internship_title: string;
  title: string;
  description: string;
  exam_date: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  instructions: string;
  max_attempts: number;
  attempt_count: number;
  best_score: number | null;
  is_passed: boolean;
  last_attempt_status: string | null;
}

// GET - Fetch available exams
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get student ID from students table
    const [student] = await query<[{ id: number }]>(
      'SELECT id FROM students WHERE user_id = ?',
      [session.id]
    );

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const examId = searchParams.get('id');

    if (examId) {
      // Fetch specific exam with student's attempts
      const exam = await query<any[]>(
        `SELECT 
          e.*,
          i.title as internship_title
         FROM exams e
         JOIN internships i ON e.internship_id = i.id
         JOIN applications app ON i.id = app.internship_id
         WHERE e.id = ? AND app.student_id = ? AND app.status = 'approved' AND e.is_active = 1`,
        [examId, student.id]
      );

      if (exam.length === 0) {
        return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
      }

      // Get student's attempts
      const attempts = await query<any[]>(
        `SELECT * FROM student_exams 
         WHERE exam_id = ? AND student_id = ?
         ORDER BY attempt_number DESC`,
        [examId, student.id]
      );

      // Check if student can take exam
      const canTakeExam = attempts.length < exam[0].max_attempts;
      const examDate = new Date(exam[0].exam_date);
      const now = new Date();
      const isExamTime = now >= examDate;

      return NextResponse.json({
        ...exam[0],
        questions: canTakeExam && isExamTime ? JSON.parse(exam[0].questions) : null,
        attempts,
        can_take_exam: canTakeExam && isExamTime,
        attempts_remaining: exam[0].max_attempts - attempts.length
      });
    }

    // Fetch all available exams
    const exams = await query<Exam[]>(
      `SELECT 
        e.*,
        i.title as internship_title,
        COUNT(se.id) as attempt_count,
        MAX(se.score) as best_score,
        MAX(se.is_passed) as is_passed,
        (SELECT status FROM student_exams 
         WHERE exam_id = e.id AND student_id = ? 
         ORDER BY attempt_number DESC LIMIT 1) as last_attempt_status
       FROM exams e
       JOIN internships i ON e.internship_id = i.id
       JOIN applications app ON i.id = app.internship_id
       LEFT JOIN student_exams se ON e.id = se.exam_id AND se.student_id = ?
       WHERE app.student_id = ? AND app.status = 'approved' AND e.is_active = 1
       GROUP BY e.id
       ORDER BY e.exam_date ASC`,
      [student.id, student.id, student.id]
    );

    // Check material completion for each exam
    const examsWithMaterialStatus = [];
    for (const exam of exams) {
      // Check if all mandatory materials are completed for this internship
      const materials = await query<any[]>(
        `SELECT 
          COUNT(*) as total_materials,
          COUNT(CASE WHEN lm.is_mandatory = 1 THEN 1 END) as mandatory_materials,
          COUNT(CASE WHEN mp.is_completed = 1 THEN 1 END) as completed_materials,
          COUNT(CASE WHEN lm.is_mandatory = 1 AND mp.is_completed = 1 THEN 1 END) as completed_mandatory
         FROM learning_materials lm
         LEFT JOIN material_progress mp ON lm.id = mp.material_id AND mp.student_id = ?
         WHERE lm.internship_id = ? AND lm.is_active = 1`,
        [student.id, exam.internship_id]
      );

      const materialStats = materials[0];
      
      // Show exam if:
      // 1. No materials exist for this internship, OR
      // 2. No mandatory materials exist, OR
      // 3. All mandatory materials are completed
      const canAccessExam = 
        materialStats.total_materials === 0 || 
        materialStats.mandatory_materials === 0 ||
        materialStats.mandatory_materials === materialStats.completed_mandatory;

      examsWithMaterialStatus.push({
        ...exam,
        materials_completed: materialStats.completed_materials === materialStats.total_materials,
        mandatory_materials_completed: materialStats.mandatory_materials === materialStats.completed_mandatory,
        can_access_exam: canAccessExam,
        material_stats: materialStats
      });
    }

    return NextResponse.json(examsWithMaterialStatus);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Start or submit exam attempt
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get student ID from students table
    const [student] = await query<[{ id: number }]>(
      'SELECT id FROM students WHERE user_id = ?',
      [session.id]
    );

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const body = await req.json();
    const { exam_id, action, answers } = body;

    if (!exam_id || !action) {
      return NextResponse.json(
        { error: 'Exam ID and action required' },
        { status: 400 }
      );
    }

    // Get exam details
    const exam = await query<any[]>(
      'SELECT * FROM exams WHERE id = ?',
      [exam_id]
    );

    if (exam.length === 0) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    if (action === 'start') {
      // Check attempts limit
      const attempts = await query<any[]>(
        'SELECT COUNT(*) as count FROM student_exams WHERE exam_id = ? AND student_id = ?',
        [exam_id, student.id]
      );

      if (attempts[0].count >= exam[0].max_attempts) {
        return NextResponse.json(
          { error: 'Maximum attempts reached' },
          { status: 400 }
        );
      }

      // Check exam time
      const examDate = new Date(exam[0].exam_date);
      const now = new Date();
      if (now < examDate) {
        return NextResponse.json(
          { error: 'Exam has not started yet' },
          { status: 400 }
        );
      }

      const attemptNumber = attempts[0].count + 1;

      // Create exam attempt
      const result = await query(
        `INSERT INTO student_exams (
          exam_id, student_id, attempt_number, status, started_at
        ) VALUES (?, ?, ?, 'in_progress', NOW())`,
        [exam_id, student.id, attemptNumber]
      );

      return NextResponse.json({
        message: 'Exam started',
        attempt_id: (result as any).insertId,
        duration_minutes: exam[0].duration_minutes,
        questions: JSON.parse(exam[0].questions)
      });
    }

    if (action === 'submit') {
      if (!answers) {
        return NextResponse.json(
          { error: 'Answers required' },
          { status: 400 }
        );
      }

      // Get current attempt
      const attempt = await query<any[]>(
        `SELECT * FROM student_exams 
         WHERE exam_id = ? AND student_id = ? AND status = 'in_progress'
         ORDER BY attempt_number DESC LIMIT 1`,
        [exam_id, student.id]
      );

      if (attempt.length === 0) {
        return NextResponse.json(
          { error: 'No active exam attempt found' },
          { status: 404 }
        );
      }

      // Auto-grade MCQ questions
      const questions = JSON.parse(exam[0].questions);
      let totalScore = 0;

      // Convert answers array to map for easier lookup
      const answerMap: Record<number, number> = {};
      answers.forEach((ans: any) => {
        answerMap[ans.question_index] = ans.answer;
      });

      // Grade each question
      questions.forEach((q: any, index: number) => {
        const studentAnswer = answerMap[index];
        if (studentAnswer !== undefined && studentAnswer === q.correctAnswer) {
          totalScore += q.marks;
        }
      });

      const percentage = (totalScore / exam[0].total_marks) * 100;
      const isPassed = totalScore >= exam[0].passing_marks;

      // Update attempt
      await query(
        `UPDATE student_exams 
         SET answers = ?, score = ?, percentage = ?, status = 'graded', 
             is_passed = ?, submitted_at = NOW(), graded_at = NOW()
         WHERE id = ?`,
        [
          JSON.stringify(answers),
          totalScore,
          percentage,
          isPassed ? 1 : 0,
          attempt[0].id
        ]
      );

      // Auto-generate certificate if student passed
      if (isPassed) {
        try {
          // Get student ID from students table
          const [student] = await query<[{ id: number }]>(
            'SELECT id FROM students WHERE user_id = ?',
            [session.id]
          );

          if (!student) {
            throw new Error('Student not found');
          }

          // Check if certificate already exists
          const existingCert = await query<any[]>(
            'SELECT id FROM certificates WHERE student_id = ? AND internship_id = ?',
            [student.id, exam[0].internship_id]
          );

          if (existingCert.length === 0) {
            // Generate certificate number
            const year = new Date().getFullYear();
            const certCount = await query<any[]>(
              'SELECT COUNT(*) as count FROM certificates WHERE YEAR(issue_date) = ?',
              [year]
            );
            const certNumber = `CERT-${year}-${String(certCount[0].count + 1).padStart(4, '0')}`;

            // Generate verification code
            const verificationCode = `VERIFY-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

            // Determine grade based on percentage
            let grade = 'Pass';
            if (percentage >= 90) grade = 'A+';
            else if (percentage >= 80) grade = 'A';
            else if (percentage >= 70) grade = 'B+';
            else if (percentage >= 60) grade = 'B';
            else if (percentage >= 50) grade = 'C';

            // Create certificate
            const certResult = await query(
              `INSERT INTO certificates (
                certificate_number, student_id, internship_id, issue_date,
                completion_date, grade, performance_score, verification_code,
                issued_by, remarks
              ) VALUES (?, ?, ?, CURDATE(), CURDATE(), ?, ?, ?, 1, ?)`,
              [
                certNumber,
                student.id,
                exam[0].internship_id,
                grade,
                percentage,
                verificationCode,
                'Auto-generated upon passing exam'
              ]
            );

            // Create notification for certificate
            await query(
              `INSERT INTO notifications (user_id, title, message, type, related_id, priority)
               VALUES (?, ?, ?, 'certificate', ?, 'high')`,
              [
                session.id,
                'Certificate Earned! 🎉',
                `Congratulations! You've earned a certificate for passing the exam with ${percentage.toFixed(1)}%`,
                (certResult as any).insertId
              ]
            );
          }
        } catch (certError) {
          console.error('Error auto-generating certificate:', certError);
          // Don't fail the exam submission if certificate generation fails
        }
      }

      return NextResponse.json({
        message: 'Exam submitted successfully',
        score: totalScore,
        percentage,
        is_passed: isPassed,
        status: 'graded',
        needs_manual_grading: false,
        certificate_generated: isPassed
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing exam:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
