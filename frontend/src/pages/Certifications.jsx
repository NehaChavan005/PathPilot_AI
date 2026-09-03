import React from 'react';
import { Award, Lock, GraduationCap } from 'lucide-react';
import CredentialCard from '../components/certifications/CredentialCard';

const Certifications = () => {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Award className="w-5 h-5" aria-hidden="true" />
        </span> Certifications
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CredentialCard title="Machine Learning Specialization" provider="Stanford" progress={65} locked={false} targetDate="Q3 2026" />
        <CredentialCard title="Deep Learning" provider="DeepLearning.AI" locked={true} targetDate="Q4 2026" />
      </div>
    </div>
  );
};
export default Certifications;
