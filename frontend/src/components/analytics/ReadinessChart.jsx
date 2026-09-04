import React, { useEffect, useRef } from 'react';

const ReadinessChart = ({ score = 68, label = "AI/ML Engineer" }) => {
  const svgRef = useRef(null);
  const centerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      if (svgRef.current) {
        const progressCircle = svgRef.current.querySelector('.progress-ring');
        if (progressCircle) {
          const circumference = 2 * Math.PI * 84;
          progressCircle.style.strokeDasharray = circumference;
          progressCircle.style.strokeDashoffset = circumference - (circumference * score) / 100;
        }
      }
    };
    animate();
  }, [score]);

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col items-center justify-center relative overflow-hidden group">
      
      {/* Liquid Glass Ambient Glow Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-orange-500/5 to-red-500/10 rounded-[2rem] animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/20 via-orange-500/10 to-red-500/20 rounded-full filter blur-[100px] opacity-30 animate-glow-breathe" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-300/10 rounded-full filter blur-[80px] animate-float-1" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-red-400/10 rounded-full filter blur-[60px] animate-float-2" />

      <div className="w-full flex justify-between items-start absolute top-8 left-8 right-8 z-20">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest relative z-20">Career Readiness</h3>
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 animate-pulse-glow" />
      </div>
      
      {/* Liquid Glass Circular Gauge Container */}
      <div className="relative w-48 h-48 flex items-center justify-center rounded-full mb-6 mt-8 z-20">
        {/* Outer Glass Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.05)] animate-ring-rotate" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-yellow-400/10 via-transparent to-red-400/10 border border-yellow-300/20 animate-shimmer-ring" />
        
        <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 192 192">
          <defs>
            {/* Liquid Glass Gradient for Progress Ring */}
            <linearGradient id="glassProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#FBBF24" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#FB923C" stopOpacity="1" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.95" />
              <animate attributeName="x1" values="0%;100%;0%" dur="8s" repeatCount="indefinite" />
              <animate attributeName="y1" values="0%;100%;0%" dur="8s" repeatCount="indefinite" />
              <animate attributeName="x2" values="100%;0%;100%" dur="8s" repeatCount="indefinite" />
              <animate attributeName="y2" values="100%;0%;100%" dur="8s" repeatCount="indefinite" />
            </linearGradient>
            {/* Glass Highlight Gradient */}
            <linearGradient id="glassHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              <animate attributeName="stop-opacity" values="0.6;0.2;0.6" dur="6s" repeatCount="indefinite" />
            </linearGradient>
            {/* Inner Glow Filter */}
            <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Glass Reflection Filter */}
            <filter id="glassReflection" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
              <feSpecularLighting surfaceScale="5" specularConstant="1" specularExponent="20" lighting-color="#FDE047" result="spec">
                <fePointLight x="96" y="20" z="80" />
              </feSpecularLighting>
              <feComposite in="spec" in2="SourceAlpha" operator="in" />
              <feComposite in="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          </defs>
          
          {/* Background Track - Glass Style */}
          <circle 
            cx="96" cy="96" r="84" 
            fill="transparent" 
            stroke="url(#glassHighlight)" 
            strokeWidth="16" 
            strokeDasharray="527"
            opacity="0.4"
            className="bg-ring"
          />
          
          {/* Progress Track - Liquid Glass */}
          <circle 
            cx="96" cy="96" r="84" 
            fill="transparent" 
            stroke="url(#glassProgressGradient)" 
            strokeWidth="16" 
            strokeDasharray="527"
            strokeDashoffset="527"
            strokeLinecap="round"
            className="progress-ring"
            style={{ 
              transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'url(#innerGlow)'
            }}
          />
          
          {/* Animated Light Sweep Overlay */}
          <circle 
            cx="96" cy="96" r="84" 
            fill="transparent" 
            stroke="url(#glassHighlight)" 
            strokeWidth="16" 
            strokeDasharray="100, 427"
            strokeDashoffset="0"
            strokeLinecap="round"
            opacity="0.6"
            className="light-sweep"
            style={{ 
              animation: 'sweep 4s ease-in-out infinite',
              filter: 'url(#glassReflection)'
            }}
          />
        </svg>
        
        {/* Center Glass Core */}
        <div ref={centerRef} className="text-center flex flex-col items-center bg-gradient-to-br from-white/40 via-white/20 to-white/10 backdrop-blur-2xl w-[130px] h-[130px] rounded-full justify-center shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-4px_16px_rgba(0,0,0,0.05)] border border-white/30 relative z-20 animate-core-breathe">
          {/* Inner Glass Reflection */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/10 via-transparent to-red-300/10 animate-core-shimmer" />
          <div className="absolute top-4 left-4 w-8 h-8 bg-white/30 rounded-full blur-xl animate-reflection-move" />
          
          <span className="text-5xl font-black text-slate-900 tracking-tighter relative z-10">
            {score}<span className="text-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent animate-gradient-flow">%</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 relative z-10">Ready</span>
        </div>
      </div>
      
      <div className="text-center z-20">
        <p className="text-sm font-bold text-slate-500">Target Trajectory</p>
        <p className="text-base font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 bg-clip-text text-transparent mt-1">{label}</p>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.02); }
        }
        @keyframes glow-breathe {
          0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(10px, -10px); }
          66% { transform: translate(-5px, 5px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-8px, 8px); }
          66% { transform: translate(5px, -5px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px #FDE047, 0 0 16px #FB923C; opacity: 1; }
          50% { box-shadow: 0 0 20px #EF4444, 0 0 32px #FBBF24; opacity: 0.7; }
        }
        @keyframes ring-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shimmer-ring {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        @keyframes sweep {
          0% { stroke-dashoffset: -527; opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { stroke-dashoffset: 527; opacity: 0; }
        }
        @keyframes core-breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -4px 16px rgba(0,0,0,0.05); }
          50% { transform: scale(1.015); box-shadow: 0 12px 40px rgba(253,224,71,0.15), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -4px 16px rgba(0,0,0,0.05); }
        }
        @keyframes core-shimmer {
          0% { opacity: 0.3; transform: rotate(0deg); }
          50% { opacity: 0.6; transform: rotate(180deg); }
          100% { opacity: 0.3; transform: rotate(360deg); }
        }
        @keyframes reflection-move {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(15px, 15px); opacity: 0.1; }
        }
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-glow-breathe { animation: glow-breathe 5s ease-in-out infinite; }
        .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 10s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-ring-rotate { animation: ring-rotate 20s linear infinite; }
        .animate-shimmer-ring { animation: shimmer-ring 3s ease-in-out infinite; }
        .animate-core-breathe { animation: core-breathe 4s ease-in-out infinite; }
        .animate-core-shimmer { animation: core-shimmer 6s linear infinite; }
        .animate-reflection-move { animation: reflection-move 5s ease-in-out infinite; }
        .animate-gradient-flow { background-size: 200% 200%; animation: gradient-flow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default ReadinessChart;