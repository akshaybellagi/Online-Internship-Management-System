'use client';
import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import Badge from '@/components/Badge';
import { Award, Download, Share2, CheckCircle } from 'lucide-react';

interface Certificate {
  id: number;
  certificate_number: string;
  internship_id: number;
  internship_title: string;
  company_name: string;
  issue_date: string;
  completion_date: string;
  grade: string;
  performance_score: number;
  verification_code: string;
  certificate_url: string | null;
  remarks: string | null;
}

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/student/certificates');
      const data = await res.json();
      setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
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
          .footer { margin-top: 60px; display: flex; justify-space-between; }
          .signature { text-align: center; }
          .signature-line { border-top: 2px solid #333; width: 200px; margin: 10px auto; }
          .meta { margin-top: 40px; padding-top: 20px; border-top: 2px solid #f0f0f0; font-size: 12px; color: #999; text-align: center; }
          .grade-badge { display: inline-block; padding: 8px 20px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; margin: 10px 0; }
          .company { font-size: 18px; color: #667eea; font-weight: 600; margin: 10px 0; }
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
            <div class="student-name">Certificate Holder</div>
            <div class="details">
              has successfully completed the internship program<br/>
              <strong style="font-size: 20px; color: #333;">${cert.internship_title}</strong><br/>
              <div class="company">${cert.company_name}</div>
              with outstanding performance and dedication
            </div>
            <div class="grade-badge">Grade: ${cert.grade} | Score: ${cert.performance_score}%</div>
            <div class="details" style="margin-top: 30px;">
              <strong>Completion Date:</strong> ${new Date(cert.completion_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
              <strong>Issue Date:</strong> ${new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            ${cert.remarks ? `<div class="details" style="margin-top: 20px; font-style: italic; color: #10b981;">"${cert.remarks}"</div>` : ''}
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

  const handleShare = (cert: Certificate) => {
    const shareText = `I've completed ${cert.internship_title} at ${cert.company_name} with grade ${cert.grade}! Certificate: ${cert.certificate_number}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Certificate',
        text: shareText,
      }).catch(() => {});
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Certificate details copied to clipboard!');
      });
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
        title="My Certificates"
        subtitle="View and download your internship completion certificates"
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Award size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No certificates yet</p>
          <p className="text-sm text-gray-500 mt-2">Complete internships to earn certificates</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certificates.map(cert => (
            <div key={cert.id} className="bg-gradient-to-br from-white to-indigo-50 rounded-xl border-2 border-indigo-200 p-6 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Certificate</p>
                    <p className="font-mono text-sm font-bold text-gray-800">{cert.certificate_number}</p>
                  </div>
                </div>
                <Badge text={cert.grade} className={gradeColors[cert.grade] || gradeColors['Pass']} />
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-1">{cert.internship_title}</h3>
              <p className="text-sm text-gray-600 mb-4">{cert.company_name}</p>

              <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-white/50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Issue Date</p>
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(cert.issue_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completion</p>
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(cert.completion_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Performance</p>
                  <p className="text-sm font-medium text-gray-800">{cert.performance_score}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Verification</p>
                  <p className="text-xs font-mono text-gray-600">{cert.verification_code}</p>
                </div>
              </div>

              {cert.remarks && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-emerald-600 mt-0.5" />
                    <p className="text-sm text-emerald-700">{cert.remarks}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(cert)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium"
                >
                  <Download size={16} />
                  Download
                </button>
                <button
                  onClick={() => handleShare(cert)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all text-sm font-medium"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
