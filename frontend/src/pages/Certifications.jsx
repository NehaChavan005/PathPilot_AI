import React, { useEffect, useState, useCallback } from 'react';
import { Award } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import CredentialCard from '../components/certifications/CredentialCard';

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCerts = useCallback(async () => {
    try {
      const res = await apiClient('/roadmaps/certificates');
      setCerts((res && res.certificates) || []);
    } catch (err) {
      setError(err.detail || err.message || 'Unable to load certificates.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCerts();
  }, [fetchCerts]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Award className="w-5 h-5" aria-hidden="true" />
        </span> Certifications
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl">{error}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-[2rem] p-16 border border-slate-200 text-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-500">Loading certifications...</p>
        </div>
      ) : certs.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-6 shadow-sm">🎓</div>
          <h2 className="text-xl font-black text-slate-900 mb-2">No Certificates Yet</h2>
          <p className="text-slate-500 font-medium text-sm mb-6 max-w-md mx-auto">
            Complete all phases of your learning roadmap to earn your PathPilot certificate.
          </p>
          <a href="/learning-path" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm">
            Go to Learning Path
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((cert) => (
            <CredentialCard
              key={cert.id}
              title={cert.title}
              career={cert.career}
              certificateCode={cert.certificate_code}
              issuedAt={cert.issued_at}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Certifications;
