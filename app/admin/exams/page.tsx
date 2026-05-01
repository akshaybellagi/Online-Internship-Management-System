'use client';
import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';
import { Target, Plus, Edit, Trash2, Users, Calendar, Clock, X } from 'lucide-react';

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
  is_proctored: boolean;
  max_attempts: number;
  is_active: boolean;
  attempt_count: number;
  questions?: string;
  instructions?: string;
}

interface Internship {
  id: number;
  title: string;
}

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [formData, setFormData] = useState({
    internship_id: '',
    title: '',
    description: '',
    exam_date: '',
    duration_minutes: 60,
    total_marks: 100,
    passing_marks: 50,
    instructions: '',
    is_proctored: false,
    max_attempts: 1,
    is_active: true
  });

  useEffect(() => {
    fetchExams();
    fetchInternships();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/admin/exams');
      const data = await res.json();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInternships = async () => {
    try {
      const res = await fetch('/api/admin/internships?status=all');
      const data = await res.json();
      setInternships(data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    // Calculate total marks from questions
    const calculatedTotalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    
    try {
      const url = editingExam ? '/api/admin/exams' : '/api/admin/exams';
      const method = editingExam ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        total_marks: calculatedTotalMarks,
        questions: questions,
        ...(editingExam && { id: editingExam.id })
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        setEditingExam(null);
        resetForm();
        fetchExams();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save exam');
      }
    } catch (error) {
      console.error('Error saving exam:', error);
      alert('Failed to save exam');
    }
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    
    // Parse questions if they exist
    let parsedQuestions: MCQQuestion[] = [];
    try {
      if (exam.questions) {
        const parsed = JSON.parse(exam.questions);
        // Ensure each question has proper structure
        parsedQuestions = parsed.map((q: any) => ({
          id: q.id || Date.now().toString(),
          question: q.question || '',
          options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
          correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
          marks: typeof q.marks === 'number' ? q.marks : 1
        }));
      }
    } catch (e) {
      console.error('Error parsing questions:', e);
    }
    
    setQuestions(parsedQuestions);
    setFormData({
      internship_id: exam.internship_id.toString(),
      title: exam.title,
      description: exam.description,
      exam_date: exam.exam_date.slice(0, 16), // Format for datetime-local
      duration_minutes: exam.duration_minutes,
      total_marks: exam.total_marks,
      passing_marks: exam.passing_marks,
      instructions: exam.instructions || '',
      is_proctored: exam.is_proctored,
      max_attempts: exam.max_attempts,
      is_active: exam.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    try {
      await fetch(`/api/admin/exams?id=${id}`, { method: 'DELETE' });
      fetchExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      internship_id: '',
      title: '',
      description: '',
      exam_date: '',
      duration_minutes: 60,
      total_marks: 100,
      passing_marks: 50,
      instructions: '',
      is_proctored: false,
      max_attempts: 1,
      is_active: true
    });
    setQuestions([]);
  };

  const addQuestion = () => {
    const newQuestion: MCQQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof MCQQuestion, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...(q.options || ['', '', '', ''])];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const getTotalMarks = () => {
    return questions.reduce((sum, q) => sum + q.marks, 0);
  };

  const isUpcoming = (examDate: string) => {
    return new Date(examDate) > new Date();
  };

  return (
    <div>
      <PageHeader
        title="Exams"
        subtitle="Create and manage exams for internships"
      />

      {/* Actions */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setEditingExam(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
        >
          <Plus size={18} />
          Create Exam
        </button>
      </div>

      {/* Exams List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No exams scheduled yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {exams.map(exam => {
            let questionCount = 0;
            try {
              if (exam.questions) {
                const parsed = JSON.parse(exam.questions);
                questionCount = Array.isArray(parsed) ? parsed.length : 0;
              }
            } catch (e) {
              // ignore parse errors
            }
            
            return (
              <div key={exam.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{exam.title}</h3>
                    <p className="text-sm text-gray-600">{exam.internship_title}</p>
                  </div>
                  <Badge 
                    text={isUpcoming(exam.exam_date) ? 'Upcoming' : 'Completed'} 
                    className={isUpcoming(exam.exam_date)
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
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
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target size={14} />
                    <span>{questionCount} MCQ questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={14} />
                    <span>{exam.attempt_count} attempts</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    <span className="text-gray-500">Total Marks:</span>
                    <span className="ml-2 font-medium text-gray-800">{exam.total_marks}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Passing:</span>
                    <span className="ml-2 font-medium text-gray-800">{exam.passing_marks}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Max Attempts:</span>
                    <span className="ml-2 font-medium text-gray-800">{exam.max_attempts}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Proctored:</span>
                    <span className="ml-2 font-medium text-gray-800">{exam.is_proctored ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <Badge 
                    text={exam.is_active ? 'Active' : 'Inactive'} 
                    className={exam.is_active 
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                    } 
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(exam)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Exam Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingExam(null);
          resetForm();
        }}
        title={editingExam ? 'Edit Exam' : 'Create Exam'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Internship *</label>
            <select
              required
              value={formData.internship_id}
              onChange={e => setFormData({ ...formData, internship_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select Internship</option>
              {internships.map(internship => (
                <option key={internship.id} value={internship.id}>
                  {internship.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Final Assessment"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the exam..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.exam_date}
                onChange={e => setFormData({ ...formData, exam_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration_minutes || ''}
                onChange={e => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 60 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
              <input
                type="number"
                disabled
                value={getTotalMarks()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-calculated from questions</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.passing_marks || ''}
                onChange={e => setFormData({ ...formData, passing_marks: parseInt(e.target.value) || 50 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Attempts</label>
            <input
              type="number"
              min="1"
              value={formData.max_attempts || ''}
              onChange={e => setFormData({ ...formData, max_attempts: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            <textarea
              rows={3}
              value={formData.instructions}
              onChange={e => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Add exam instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_proctored}
                onChange={e => setFormData({ ...formData, is_proctored: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Proctored Exam</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          {/* MCQ Questions Section */}
          <div className="border-t pt-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">MCQ Questions</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-all"
              >
                <Plus size={16} />
                Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Target size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 text-sm">No questions added yet</p>
                <p className="text-gray-500 text-xs mt-1">Click "Add Question" to create MCQ questions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-700">Question {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Question Text *</label>
                        <textarea
                          required
                          rows={2}
                          value={q.question}
                          onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                          placeholder="Enter your question..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Options *</label>
                        <div className="space-y-2">
                          {(q.options || ['', '', '', '']).map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={q.correctAnswer === optIndex}
                                onChange={() => updateQuestion(q.id, 'correctAnswer', optIndex)}
                                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                              />
                              <input
                                type="text"
                                required
                                value={option}
                                onChange={e => updateOption(q.id, optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Select the radio button for the correct answer</p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Marks *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={q.marks || ''}
                          onChange={e => updateQuestion(q.id, 'marks', parseInt(e.target.value) || 1)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {questions.length > 0 && (
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-700 font-medium">Total Questions: {questions.length}</span>
                  <span className="text-indigo-700 font-medium">Total Marks: {getTotalMarks()}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingExam(null);
                resetForm();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
            >
              {editingExam ? 'Update Exam' : 'Create Exam'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
