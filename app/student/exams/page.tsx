'use client';
import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';
import { Target, Calendar, Clock, Award, AlertCircle, CheckCircle, X } from 'lucide-react';

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
  max_attempts: number;
  attempt_count: number;
  best_score: number | null;
  is_passed: boolean;
  last_attempt_status: string | null;
  can_access_exam?: boolean;
  material_stats?: {
    total_materials: number;
    mandatory_materials: number;
    completed_materials: number;
    completed_mandatory: number;
  };
}

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

interface ExamAttempt {
  questions: MCQQuestion[];
  duration_minutes: number;
  attempt_id: number;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExamModal, setShowExamModal] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [examAttempt, setExamAttempt] = useState<ExamAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && showExamModal) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, showExamModal]);

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/student/exams');
      const data = await res.json();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (exam: Exam) => {
    try {
      const res = await fetch('/api/student/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam.id,
          action: 'start'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentExam(exam);
        setExamAttempt(data);
        setAnswers({});
        setTimeRemaining(data.duration_minutes * 60); // Convert to seconds
        setShowExamModal(true);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to start exam');
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      alert('Failed to start exam');
    }
  };

  const handleSubmitExam = async () => {
    if (!currentExam || !examAttempt) return;
    
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/student/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: currentExam.id,
          action: 'submit',
          answers: Object.entries(answers).map(([qIndex, answer]) => ({
            question_index: parseInt(qIndex),
            answer
          }))
        })
      });

      if (res.ok) {
        const result = await res.json();
        setShowExamModal(false);
        setCurrentExam(null);
        setExamAttempt(null);
        setAnswers({});
        fetchExams();
        
        // Show result with certificate info
        if (result.needs_manual_grading) {
          alert('Exam submitted! Your answers will be graded manually.');
        } else {
          let message = `Exam submitted!\n\nScore: ${result.score}/${currentExam.total_marks}\nPercentage: ${result.percentage.toFixed(1)}%\nStatus: ${result.is_passed ? 'PASSED ✓' : 'Not Passed'}`;
          
          if (result.is_passed && result.certificate_generated) {
            message += '\n\n🎉 Congratulations!\nYour certificate has been automatically generated.\nCheck "My Certificates" to view and download it.';
          }
          
          alert(message);
        }
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to submit exam');
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const isExamAvailable = (examDate: string) => {
    // Exam is available if the date has arrived (current time >= exam date)
    return new Date() >= new Date(examDate);
  };

  const canTakeExam = (exam: Exam) => {
    return exam.attempt_count < exam.max_attempts && isExamAvailable(exam.exam_date);
  };

  return (
    <div>
      <PageHeader
        title="Exams"
        subtitle="View and take your scheduled exams"
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No exams scheduled</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {exams.map(exam => (
            <div key={exam.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{exam.title}</h3>
                  <p className="text-sm text-gray-600">{exam.internship_title}</p>
                </div>
                <Badge 
                  text={isExamAvailable(exam.exam_date) ? 'Available' : 'Scheduled'} 
                  className={isExamAvailable(exam.exam_date)
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-blue-100 text-blue-700 border-blue-200'
                  } 
                />
              </div>

              <p className="text-sm text-gray-600 mb-4">{exam.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>{new Date(exam.exam_date).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} />
                  <span>{exam.duration_minutes} minutes</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Total Marks</p>
                  <p className="text-sm font-medium text-gray-800">{exam.total_marks}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Passing Marks</p>
                  <p className="text-sm font-medium text-gray-800">{exam.passing_marks}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Attempts</p>
                  <p className="text-sm font-medium text-gray-800">
                    {exam.attempt_count} / {exam.max_attempts}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-medium text-gray-800">
                    {exam.is_passed ? 'Passed' : 'Not Passed'}
                  </p>
                </div>
              </div>

              {exam.best_score !== null && (
                <div className={`mb-4 p-3 rounded-lg border ${
                  exam.is_passed 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Award size={16} className={exam.is_passed ? 'text-emerald-600' : 'text-amber-600'} />
                    <span className={`text-sm font-medium ${
                      exam.is_passed ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      Best Score: {exam.best_score}%
                    </span>
                  </div>
                </div>
              )}

              {canTakeExam(exam) ? (
                exam.can_access_exam === false ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800 mb-1">
                          Complete Required Materials First
                        </p>
                        <p className="text-xs text-amber-700">
                          You need to complete {exam.material_stats?.mandatory_materials || 0} mandatory materials 
                          ({exam.material_stats?.completed_mandatory || 0} completed) before taking this exam.
                        </p>
                        <a 
                          href="/student/materials" 
                          className="inline-block mt-2 text-xs font-medium text-amber-800 hover:text-amber-900 underline"
                        >
                          Go to Learning Materials →
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleStartExam(exam)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                  >
                    <Target size={16} />
                    {exam.attempt_count > 0 ? 'Retake Exam' : 'Start Exam'}
                  </button>
                )
              ) : !isExamAvailable(exam.exam_date) ? (
                <div className="flex items-center justify-center gap-2 text-blue-600 text-sm">
                  <AlertCircle size={16} />
                  Exam scheduled for {new Date(exam.exam_date).toLocaleString()}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-amber-600 text-sm">
                  <AlertCircle size={16} />
                  Maximum attempts reached
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Exam Taking Modal */}
      {showExamModal && currentExam && examAttempt && (
        <Modal
          isOpen={showExamModal}
          onClose={() => {
            if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
              setShowExamModal(false);
              setCurrentExam(null);
              setExamAttempt(null);
              setAnswers({});
            }
          }}
          title={currentExam.title}
        >
          <div className="space-y-4">
            {/* Timer and Progress */}
            <div className="sticky top-0 bg-white border-b pb-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock size={18} className={timeRemaining < 300 ? 'text-red-600' : 'text-indigo-600'} />
                  <span className={`font-mono text-lg font-bold ${
                    timeRemaining < 300 ? 'text-red-600' : 'text-indigo-600'
                  }`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Answered: {getAnsweredCount()} / {examAttempt.questions.length}
                </div>
              </div>
              
              {timeRemaining < 300 && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                  <AlertCircle size={14} />
                  <span>Less than 5 minutes remaining!</span>
                </div>
              )}
            </div>

            {/* Questions */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {examAttempt.questions.map((question, qIndex) => (
                <div key={question.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-800">
                      Question {qIndex + 1}
                      <span className="ml-2 text-sm text-gray-500">({question.marks} marks)</span>
                    </h4>
                    {answers[qIndex] !== undefined && (
                      <CheckCircle size={16} className="text-emerald-600" />
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{question.question}</p>

                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          answers[qIndex] === optIndex
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          checked={answers[qIndex] === optIndex}
                          onChange={() => setAnswers({ ...answers, [qIndex]: optIndex })}
                          className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <span className="flex-1 text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="sticky bottom-0 bg-white border-t pt-4 mt-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
                      setShowExamModal(false);
                      setCurrentExam(null);
                      setExamAttempt(null);
                      setAnswers({});
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  disabled={submitting || getAnsweredCount() === 0}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Exam'}
                </button>
              </div>
              {getAnsweredCount() < examAttempt.questions.length && (
                <p className="text-xs text-amber-600 mt-2 text-center">
                  You have {examAttempt.questions.length - getAnsweredCount()} unanswered questions
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
