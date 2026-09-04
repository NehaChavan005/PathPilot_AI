import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnerProfile } from '../context/LearnerProfileCtx';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';
import StreamSelector from '../components/onboarding/StreamSelector';
import SkillLevelInput from '../components/onboarding/SkillLevelInput';
import ToolsLanguagesStep from '../components/onboarding/ToolsLanguagesStep';
import DomainRatingStep from '../components/onboarding/DomainRatingStep';
import LearningPreferencesStep from '../components/onboarding/LearningPreferencesStep';
import GoalSettingStep from '../components/onboarding/GoalSettingStep';
import GeneratingScreen from '../components/onboarding/GeneratingScreen';

const TOTAL_STEPS = 6;

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useLearnerProfile();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    selectedStream: '',
    capabilities: {},
    selectedTools: [],
    selectedDomains: [],
    specializationTags: [],
    domainRating: 0,
    dailyStudyMinutes: 60,
    studyDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    preferredStudyTime: 'Morning',
    targetMonths: 3,
    careerGoal: ''
  });

  const canContinue = useCallback(() => {
    switch (step) {
      case 1: return !!formData.selectedStream;
      case 2: return Object.keys(formData.capabilities).length > 0;
      case 3: return true;
      case 4: return formData.selectedDomains.length > 0 && formData.domainRating > 0;
      case 5: return formData.dailyStudyMinutes > 0 && formData.studyDays.length > 0 && formData.targetMonths > 0;
      case 6: return formData.name.trim().length > 0;
      default: return true;
    }
  }, [step, formData]);

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setGenerating(true);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGenerationComplete = useCallback(() => {
    const profileData = {
      name: formData.name,
      selectedStream: formData.selectedStream,
      capabilities: formData.capabilities,
      tools: formData.selectedTools,
      selectedDomains: formData.selectedDomains,
      specializationTags: formData.specializationTags,
      domainRating: formData.domainRating,
      dailyStudyMinutes: formData.dailyStudyMinutes,
      studyDays: formData.studyDays,
      preferredStudyTime: formData.preferredStudyTime,
      targetMonths: formData.targetMonths,
      careerGoal: formData.careerGoal,
      targetRole: formData.careerGoal,
      progress: {
        completedCourses: [],
        currentCourse: null,
        currentPhase: 0,
        phaseProgress: {},
        streakDays: 0,
        weeklyMinutesStudied: 0,
        totalMinutesStudied: 0,
        lastStudyDate: null
      },
      notifications: [
        {
          id: 1,
          message: 'Welcome to PathPilot AI! Your personalized learning path has been generated.',
          type: 'info',
          read: false,
          timestamp: new Date().toISOString()
        }
      ]
    };
    completeOnboarding(profileData);
    if (isAuthenticated) {
      apiClient('/profile/me', {
        method: 'POST',
        body: JSON.stringify({
          target_role: formData.careerGoal,
          experience_level: 'beginner',
          interests: formData.selectedDomains.join(', ')
        })
      }).catch(() => {});
    }
    navigate('/dashboard');
  }, [formData, completeOnboarding, navigate, isAuthenticated]);

  if (generating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 font-sans">
        <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">
          <GeneratingScreen onComplete={handleGenerationComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 transition-all duration-500 flex flex-col min-h-[520px]">
        
        <div className="mb-10 flex-shrink-0">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">
            <span>Step {step} of {TOTAL_STEPS}</span>
            <span className="text-indigo-600">{Math.round((step / TOTAL_STEPS) * 100)}% Completed</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-0 overflow-y-auto">
          {step === 1 && (
            <StreamSelector
              selectedStream={formData.selectedStream}
              onSelect={(val) => setFormData({...formData, selectedStream: val, capabilities: {}, selectedTools: [], selectedDomains: [], specializationTags: []})}
            />
          )}
          {step === 2 && (
            <SkillLevelInput
              skills={formData.capabilities}
              onChange={(k, v) => setFormData({...formData, capabilities: {...formData.capabilities, [k]: v}})}
              selectedStream={formData.selectedStream}
            />
          )}
          {step === 3 && (
            <ToolsLanguagesStep
              selectedTools={formData.selectedTools}
              onToggleTool={(tool) => {
                const tools = formData.selectedTools.includes(tool)
                  ? formData.selectedTools.filter(t => t !== tool)
                  : [...formData.selectedTools, tool];
                setFormData({...formData, selectedTools: tools});
              }}
              selectedStream={formData.selectedStream}
            />
          )}
          {step === 4 && (
            <DomainRatingStep
              rating={formData.domainRating}
              onRate={(r) => setFormData({...formData, domainRating: r})}
              selectedDomains={formData.selectedDomains}
              onToggleDomain={(domain) => {
                const domains = formData.selectedDomains.includes(domain)
                  ? formData.selectedDomains.filter(d => d !== domain)
                  : [...formData.selectedDomains, domain];
                setFormData({...formData, selectedDomains: domains});
              }}
              selectedTags={formData.specializationTags}
              onToggleTag={(tag) => {
                const tags = formData.specializationTags.includes(tag)
                  ? formData.specializationTags.filter(t => t !== tag)
                  : [...formData.specializationTags, tag];
                setFormData({...formData, specializationTags: tags});
              }}
              selectedStream={formData.selectedStream}
            />
          )}
          {step === 5 && (
            <LearningPreferencesStep
              dailyStudyMinutes={formData.dailyStudyMinutes}
              onDailyTimeChange={(val) => setFormData({...formData, dailyStudyMinutes: val})}
              studyDays={formData.studyDays}
              onToggleDay={(day) => {
                const days = formData.studyDays.includes(day)
                  ? formData.studyDays.filter(d => d !== day)
                  : [...formData.studyDays, day];
                setFormData({...formData, studyDays: days});
              }}
              targetMonths={formData.targetMonths}
              onDurationChange={(val) => setFormData({...formData, targetMonths: val})}
              preferredStudyTime={formData.preferredStudyTime}
              onTimeChange={(val) => setFormData({...formData, preferredStudyTime: val})}
            />
          )}
          {step === 6 && (
            <GoalSettingStep
              name={formData.name}
              onNameChange={(val) => setFormData({...formData, name: val})}
              careerGoal={formData.careerGoal}
              onCareerGoalChange={(val) => setFormData({...formData, careerGoal: val})}
              selectedStream={formData.selectedStream}
            />
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center flex-shrink-0">
          <button 
            onClick={handleBack} 
            className={`px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors ${step === 1 ? 'invisible' : ''}`}
          >
            ← Back
          </button>
          <button 
            onClick={handleNext} 
            disabled={!canContinue()}
            className={`px-8 py-3 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
              canContinue()
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            {step === TOTAL_STEPS ? 'Generate My PathPilot' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
