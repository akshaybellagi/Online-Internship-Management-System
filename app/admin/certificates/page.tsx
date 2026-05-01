'use client';
import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Badge from '@/components/Badge';
import { Award, Download, Trash2 } from 'lucide-react';

interface Certificate {
  id: number;
  certificate_number: string;
  student_id: number;
  student_name: string;
  internship_id: number;
  internship_title: string;
  issue_date: string;
  completion_date: string;
  grade: string;
  performance_score: number;
  verification_code: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/admin/certificates');
      const data = await res.json();
      setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await fetch(`/api/admin/certificates?id=${id}`, { method: 'DELETE' });
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  const handleDownload = (cert: Certificate) => {
    // Create a printable certificate HTML
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${cert.certificate_number}</title>
        <style>
          body { 
            font-family: 'Georgia', serif; 
            margin: 0; 
            padding: 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .certificate {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            border: 20px solid #f0f0f0;
            box-shadow: 0 0 50px rgba(0,0,0,0.3);
          }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 48px; color: #667eea; font-weight: bold; }
          .title { font-size: 36px; color: #333; margin: 20px 0; letter-spacing: 2px; }
          .subtitle { font-size: 18px; color: #666; }
          .content { text-align: center; margin: 40px 0; }
          .student-name { font-size: 32px; color: #667eea; font-weight: bold; margin: 20px 0; }
          .details { font-size: 16px; color: #555; line-height: 1.8; }
          .footer { margin-top: 60px; display: flex; justify-content: space-between; }
          .signature { text-align: center; }
          .signature-line { border-top: 2px solid #333; width: 200px; margin: 10px auto; }
          .meta { margin-top: 40px; padding-top: 20px; border-top: 2px solid #f0f0f0; font-size: 12px; color: #999; text-align: center; }
          .grade-badge { display: inline-block; padding: 8px 20px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo">🏆 InternHub</div>
            <div class="title">CERTIFICATE OF COMPLETION</div>
            <div class="subtitle">This is to certify that</div>
          </div>
          
          <div class="content">
            <div class="student-name">${cert.student_name}</div>
            <div class="details">
              has successfully completed the internship program<br/>
              <strong style="font-size: 20px; color: #333;">${cert.internship_title}</strong><br/>
              with outstanding performance and dedication
            </div>
            <div class="grade-badge">Grade: ${cert.grade} | Score: ${cert.performance_score}%</div>
            <div class="details" style="margin-top: 30px;">
              <strong>Completion Date:</strong> ${new Date(cert.completion_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
              <strong>Issue Date:</strong> ${new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <div class="footer">
            <div class="signature">
              <div class="signature-line"></div>
              <div>Program Director</div>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <div>Academic Head</div>
            </div>
          </div>
          
          <div class="meta">
            Certificate Number: ${cert.certificate_number} | Verification Code: ${cert.verification_code}<br/>
            This certificate can be verified at internhub.com/verify
          </div>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing/saving
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(certificateHTML);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  const gradeColors: Record<string, string> = {
    'A+': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'A': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'B+': 'bg-blue-100 text-blue-700 border-blue-200',
    'B': 'bg-blue-100 text-blue-700 border-blue-200',
    'C': 'bg-amber-100 text-amber-700 border-amber-200',
    'Pass': 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <div>
      <PageHeader
        title="Certificates"
        subtitle="View and manage auto-generated internship completion certificates"
      />

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Auto-Generated:</strong> Certificates are automatically generated when students pass their internship exams. No manual generation needed.
        </p>
      </div>

      {/* Certificates List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Award size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No certificates issued yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Certificate #</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Internship</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {certificates.map(cert => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-mono text-sm font-medium text-gray-800">{cert.certificate_number}</p>
                      <p className="text-xs text-gray-500">{cert.verification_code}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{cert.student_name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{cert.internship_title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">
                      {new Date(cert.issue_date).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge text={cert.grade} className={gradeColors[cert.grade] || gradeColors['Pass']} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{cert.performance_score}%</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDownload(cert)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
