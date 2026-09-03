import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StreamSelector from '../components/onboarding/StreamSelector';
import SkillLevelInput from '../components/onboarding/SkillLevelInput';
import ResumeUploader from '../components/onboarding/ResumeUploader';
import DomainRatingStep from '../components/onboarding/DomainRatingStep';

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4; // Expanded to 4 steps
  
  const [formData, setFormData] = useState({ 
    stream: '', 
    skills: { Python: 50, SQL: 50, Java: 50, "React JS": 50 },
    domainRating: 0,
    feedbackTags: []
  });

  const handleNext = () => step < totalSteps ? setStep(step + 1) : navigate('/dashboard');
  const handleBack = () => step > 1 && setStep(step - 1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 transition-all duration-500 flex flex-col min-h-[520px]">
        
        <div className="mb-10 flex-shrink-0">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">
            <span>Step {step} of {totalSteps}</span>
            <span className="text-indigo-600">{Math.round((step / totalSteps) * 100)}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-0">
          {step === 1 && <StreamSelector selectedStream={formData.stream} onSelect={(val) => setFormData({...formData, stream: val})} />}
          {step === 2 && <SkillLevelInput skills={formData.skills} onChange={(k, v) => setFormData({...formData, skills: {...formData.skills, [k]: v}})} />}
          {step === 3 && <ResumeUploader onUpload={() => {}} />}
          {step === 4 && <DomainRatingStep rating={formData.domainRating} onRate={(r) => setFormData({...formData, domainRating: r})} />}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center flex-shrink-0">
          <button onClick={handleBack} className={`px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors ${step === 1 ? 'invisible' : ''}`}>← Back</button>
          <button onClick={handleNext} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
            {step === totalSteps ? 'Launch Dashboard' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
