import React from 'react';
import RoadmapTimeline from '../components/learning/RoadmapTimeline';

const LearningPath = () => {
  // Complete AI/ML Engineer Curriculum with sequential video resources
  const phases = [
    { 
      id: 1, 
      phase: "Phase 1", 
      title: "Python & Applied Mathematics", 
      status: "Completed", 
      duration: "4 Weeks", 
      skills: ["Python", "Linear Algebra", "Calculus", "Pandas"],
      resources: [
        { title: "Python for Beginners - Full Course", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc", duration: "6 hrs" },
        { title: "Essence of Linear Algebra", channel: "3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", duration: "Playlist" }
      ]
    },
    { 
      id: 2, 
      phase: "Phase 2", 
      title: "Machine Learning Fundamentals", 
      status: "In Progress", 
      duration: "6 Weeks", 
      progress: 65, 
      skills: ["Scikit-Learn", "Regression", "Classification", "EDA"],
      resources: [
        { title: "Machine Learning for Everybody", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=i_LwzRmA_08", duration: "3.5 hrs" },
        { title: "StatQuest: Machine Learning Intro", channel: "StatQuest with Josh Starmer", url: "https://www.youtube.com/watch?v=Gv9_4yMHFhI", duration: "Playlist" }
      ]
    },
    { 
      id: 3, 
      phase: "Phase 3", 
      title: "Deep Learning & Neural Networks", 
      status: "Locked", 
      duration: "8 Weeks", 
      skills: ["TensorFlow", "Keras", "CNNs", "Computer Vision"],
      resources: [
        { title: "Neural Networks / Deep Learning", channel: "3Blue1Brown", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", duration: "Playlist" },
        { title: "TensorFlow 2.0 Complete Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=tPYj3fFJGjk", duration: "7 hrs" }
      ]
    },
    { 
      id: 4, 
      phase: "Phase 4", 
      title: "Full-Stack AI Deployment", 
      status: "Locked", 
      duration: "4 Weeks", 
      skills: ["Streamlit", "Flask API", "Model Serving", "Git"],
      resources: [
        { title: "Build a Machine Learning Web App with Streamlit", channel: "Data Professor", url: "https://www.youtube.com/watch?v=ZZ4B0ZUvs5E", duration: "45 min" },
        { title: "Deploy ML Models using Flask", channel: "Ken Jee", url: "https://www.youtube.com/watch?v=bA7-DEtYCNM", duration: "1 hr" }
      ]
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen font-sans animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-sm border border-slate-200">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-widest mb-4 inline-block">Dynamic Roadmap</span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI/ML Engineer</h1>
        <p className="text-slate-500 font-medium text-sm mt-2 max-w-2xl">
          A structured sequence from foundational mathematics to deploying live deep learning models via Flask and Streamlit.
        </p>
      </div>
      
      <RoadmapTimeline phases={phases} />
    </div>
  );
};

export default LearningPath;
