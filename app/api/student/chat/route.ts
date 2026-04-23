import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'student') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { message } = await req.json();
  if (!message) return NextResponse.json({ reply: 'Please ask me something!' });

  const msg = message.toLowerCase().trim();

  // Get student record
  const students = await query<{ id: number; roll_number: string; class_id: number; class_name: string; section: string }[]>(`
    SELECT s.id, s.roll_number, s.class_id, c.name as class_name, c.section
    FROM students s
    LEFT JOIN classes c ON s.class_id = c.id
    WHERE s.user_id = ?
  `, [session.id]);

  if (!students.length) return NextResponse.json({ reply: "I couldn't find your student profile. Please contact admin." });
  const student = students[0];

  // ── ATTENDANCE queries ──────────────────────────────────────────
  if (msg.includes('attendance') || msg.includes('present') || msg.includes('absent') || msg.includes('percentage') || msg.includes('%')) {

    // Subject-specific
    const subjectMatch = msg.match(/(?:attendance|present|absent|percentage).{0,20}(?:in|for|of)\s+(.+)/i)
      || msg.match(/(.+?)\s+(?:attendance|percentage)/i);

    if (subjectMatch) {
      const subName = subjectMatch[1].trim();
      const subAtt = await query<{ subject_name: string; present: number; absent: number; late: number; total: number; percentage: number }[]>(`
        SELECT sub.name as subject_name,
               SUM(a.status='present') as present,
               SUM(a.status='absent') as absent,
               SUM(a.status='late') as late,
               COUNT(*) as total,
               ROUND(SUM(a.status='present')/COUNT(*)*100,1) as percentage
        FROM attendance a
        JOIN subjects sub ON a.subject_id = sub.id
        WHERE a.student_id = ? AND (sub.name LIKE ? OR sub.code LIKE ?)
        GROUP BY a.subject_id
      `, [student.id, `%${subName}%`, `%${subName}%`]);

      if (subAtt.length) {
        const s = subAtt[0];
        const status = s.percentage >= 75 ? '✅ Good standing' : '⚠️ Below required 75%';
        return NextResponse.json({ reply: `📊 **${s.subject_name} Attendance**\n\n• Present: ${s.present}/${s.total} classes\n• Absent: ${s.absent}\n• Late: ${s.late}\n• Percentage: **${s.percentage}%**\n• Status: ${status}` });
      }
    }

    // Overall attendance
    const overall = await query<{ subject_name: string; present: number; total: number; percentage: number }[]>(`
      SELECT sub.name as subject_name,
             SUM(a.status='present') as present,
             COUNT(*) as total,
             ROUND(SUM(a.status='present')/COUNT(*)*100,1) as percentage
      FROM attendance a
      JOIN subjects sub ON a.subject_id = sub.id
      WHERE a.student_id = ?
      GROUP BY a.subject_id
      ORDER BY percentage ASC
    `, [student.id]);

    if (!overall.length) return NextResponse.json({ reply: "No attendance records found yet. Attendance will appear here once your teacher marks it." });

    const avgPct = Math.round(overall.reduce((a, r) => a + r.percentage, 0) / overall.length);
    const low = overall.filter(r => r.percentage < 75);
    let reply = `📊 **Your Attendance Summary**\n\nOverall Average: **${avgPct}%**\n\n`;
    overall.forEach(r => {
      const icon = r.percentage >= 75 ? '✅' : '⚠️';
      reply += `${icon} ${r.subject_name}: **${r.percentage}%** (${r.present}/${r.total})\n`;
    });
    if (low.length) reply += `\n⚠️ You have low attendance in **${low.length}** subject(s). Minimum required is 75%.`;
    return NextResponse.json({ reply });
  }

  // ── TIMETABLE queries ───────────────────────────────────────────
  if (msg.includes('timetable') || msg.includes('schedule') || msg.includes('class today') || msg.includes('today class') || msg.includes('classes today')) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let targetDay = days[new Date().getDay()];
    for (const d of days) {
      if (msg.includes(d.toLowerCase())) { targetDay = d; break; }
    }

    if (!student.class_id) return NextResponse.json({ reply: "You're not assigned to a class yet. Please contact admin." });

    const slots = await query<{ subject_name: string; start_time: string; end_time: string; teacher_name: string; room: string }[]>(`
      SELECT sub.name as subject_name, t.start_time, t.end_time, u.name as teacher_name, t.room
      FROM timetable t
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN teachers te ON t.teacher_id = te.id
      JOIN users u ON te.user_id = u.id
      WHERE t.class_id = ? AND t.day_of_week = ?
      ORDER BY t.start_time
    `, [student.class_id, targetDay]);

    if (!slots.length) return NextResponse.json({ reply: `📅 No classes scheduled for **${targetDay}**. Enjoy your free day! 🎉` });

    let reply = `📅 **${targetDay}'s Timetable**\n\n`;
    slots.forEach(s => {
      reply += `🕐 ${s.start_time} – ${s.end_time} | **${s.subject_name}**\n   👨‍🏫 ${s.teacher_name}${s.room ? ` · 🏫 ${s.room}` : ''}\n\n`;
    });
    return NextResponse.json({ reply: reply.trim() });
  }

  // ── HOLIDAY queries ─────────────────────────────────────────────
  if (msg.includes('holiday') || msg.includes('vacation') || msg.includes('off day') || msg.includes('break')) {

    if (msg.includes('next') || msg.includes('upcoming') || msg.includes('soon')) {
      const upcoming = await query<{ title: string; date: string; type: string; description: string }[]>(`
        SELECT title, date, type, description FROM holidays
        WHERE date >= CURDATE()
        ORDER BY date ASC LIMIT 5
      `);
      if (!upcoming.length) return NextResponse.json({ reply: "🎉 No upcoming holidays scheduled right now. Check back later!" });

      let reply = `🏖️ **Upcoming Holidays**\n\n`;
      upcoming.forEach(h => {
        const daysLeft = Math.ceil((new Date(h.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const when = daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow!' : `In ${daysLeft} days`;
        reply += `📅 **${h.title}**\n   ${new Date(h.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })} · ${when}\n   Type: ${h.type}\n\n`;
      });
      return NextResponse.json({ reply: reply.trim() });
    }

    // All holidays this year
    const allHolidays = await query<{ title: string; date: string; type: string }[]>(`
      SELECT title, date, type FROM holidays
      WHERE YEAR(date) = YEAR(CURDATE())
      ORDER BY date ASC
    `);
    if (!allHolidays.length) return NextResponse.json({ reply: "No holidays found for this year." });

    let reply = `🗓️ **Holidays This Year (${new Date().getFullYear()})**\n\n`;
    allHolidays.forEach(h => {
      const isPast = new Date(h.date) < new Date();
      reply += `${isPast ? '✓' : '📅'} **${h.title}** — ${new Date(h.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })} _(${h.type})_\n`;
    });
    return NextResponse.json({ reply });
  }

  // ── SUBJECTS queries ────────────────────────────────────────────
  if (msg.includes('subject') || msg.includes('course') || msg.includes('syllabus')) {
    const subjects = await query<{ name: string; code: string; credits: number; teacher_name: string }[]>(`
      SELECT DISTINCT sub.name, sub.code, sub.credits, u.name as teacher_name
      FROM timetable t
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN teachers te ON t.teacher_id = te.id
      JOIN users u ON te.user_id = u.id
      WHERE t.class_id = ?
    `, [student.class_id]);

    if (!subjects.length) return NextResponse.json({ reply: "No subjects found for your class yet." });

    let reply = `📚 **Your Subjects**\n\n`;
    subjects.forEach(s => {
      reply += `• **${s.name}** (${s.code}) — ${s.credits} credits\n  👨‍🏫 Teacher: ${s.teacher_name}\n\n`;
    });
    return NextResponse.json({ reply: reply.trim() });
  }

  // ── PROFILE / ROLL NUMBER ───────────────────────────────────────
  if (msg.includes('roll') || msg.includes('class') || msg.includes('my info') || msg.includes('profile') || msg.includes('who am i')) {
    return NextResponse.json({
      reply: `👤 **Your Profile**\n\n• Name: **${session.name}**\n• Roll Number: **${student.roll_number}**\n• Class: **${student.class_name || 'Not assigned'}${student.section ? ' — Section ' + student.section : ''}**\n• Email: ${session.email}`
    });
  }

  // ── NEXT CLASS ──────────────────────────────────────────────────
  if (msg.includes('next class') || msg.includes('next period')) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const now = new Date().toTimeString().slice(0, 5);

    const next = await query<{ subject_name: string; start_time: string; end_time: string; teacher_name: string }[]>(`
      SELECT sub.name as subject_name, t.start_time, t.end_time, u.name as teacher_name
      FROM timetable t
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN teachers te ON t.teacher_id = te.id
      JOIN users u ON te.user_id = u.id
      WHERE t.class_id = ? AND t.day_of_week = ? AND t.start_time > ?
      ORDER BY t.start_time ASC LIMIT 1
    `, [student.class_id, today, now]);

    if (!next.length) return NextResponse.json({ reply: `No more classes today! 🎉 Check tomorrow's timetable by asking "timetable for tomorrow".` });
    const n = next[0];
    return NextResponse.json({ reply: `⏭️ **Next Class**\n\n📖 ${n.subject_name}\n🕐 ${n.start_time} – ${n.end_time}\n👨‍🏫 ${n.teacher_name}` });
  }

  // ── HELP ────────────────────────────────────────────────────────
  if (msg.includes('help') || msg.includes('what can you') || msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
    return NextResponse.json({
      reply: `👋 Hi **${session.name}**! I'm your SmartAttend assistant.\n\nHere's what you can ask me:\n\n📊 **Attendance**\n• "Show my attendance"\n• "Attendance in Maths"\n• "Which subjects am I low in?"\n\n📅 **Timetable**\n• "What classes do I have today?"\n• "Timetable for Monday"\n• "What's my next class?"\n\n🏖️ **Holidays**\n• "Upcoming holidays"\n• "All holidays this year"\n\n📚 **Subjects**\n• "What subjects do I have?"\n\n👤 **Profile**\n• "What's my roll number?"`
    });
  }

  // ── DEFAULT ─────────────────────────────────────────────────────
  return NextResponse.json({
    reply: `🤔 I'm not sure about that. I can only answer questions about your **attendance**, **timetable**, **holidays**, and **subjects**.\n\nTry asking:\n• "Show my attendance"\n• "Classes today"\n• "Upcoming holidays"\n• Type **"help"** to see all options.`
  });
}
