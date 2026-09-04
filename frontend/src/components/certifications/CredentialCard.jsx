import React, { useState } from 'react';
import { Award } from 'lucide-react';

const CredentialCard = ({ title, career, certificateCode, issuedAt }) => {
  const [showCert, setShowCert] = useState(false);

  const formatDate = (iso) => {
    if (!iso) return 'N/A';
    try {
      return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return iso; }
  };

  return (
    <>
      <div className="p-6 rounded-3xl border transition-all duration-300 bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Award className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{career || 'PathPilot'}</p>
            <h3 className="text-lg font-black leading-tight mt-1 text-slate-900">{title}</h3>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Issued: {formatDate(issuedAt)}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Certificate Code</p>
            <p className="text-sm font-mono font-bold text-slate-700">{certificateCode}</p>
          </div>
          <button
            onClick={() => setShowCert(true)}
            className="w-full px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors border border-indigo-200"
          >
            View Certificate
          </button>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowCert(false)}>
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900">Certificate of Completion</h2>
              <button onClick={() => setShowCert(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {/* Printable Certificate */}
            <div id="certificate-content" className="p-8 md:p-12 text-center">
              <div className="border-4 border-indigo-200 rounded-2xl p-8 md:p-12 bg-gradient-to-br from-indigo-50/50 to-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400 mb-4">PathPilot AI</p>
                <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-3xl mb-6 border-2 border-indigo-200">🎓</div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Certificate of Completion</h2>
                <p className="text-sm font-bold text-slate-500 mb-6">This certifies that the learner has successfully completed</p>
                <p className="text-xl md:text-2xl font-black text-indigo-700 mb-6">{title}</p>
                <p className="text-sm font-bold text-slate-600 mb-2">Career Track: <span className="text-indigo-600">{career}</span></p>
                <div className="flex items-center justify-center gap-8 mt-8">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Issued</p>
                    <p className="text-sm font-bold text-slate-700 mt-1">{formatDate(issuedAt)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Certificate ID</p>
                    <p className="text-sm font-mono font-bold text-indigo-600 mt-1">{certificateCode}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowCert(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
                Close
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('certificate-content');
                  if (el) {
                    const w = window.open('', '_blank', 'width=800,height=600');
                    w.document.write('<html><head><title>Certificate</title><style>body{font-family:system-ui;padding:20px;}</style></head><body>' + el.innerHTML + '</body></html>');
                    w.document.close();
                    w.print();
                  }
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CredentialCard;
