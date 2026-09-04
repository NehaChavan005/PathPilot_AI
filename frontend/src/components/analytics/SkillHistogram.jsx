import React, { useRef, useEffect } from 'react';

const SkillHistogram = ({ data }) => {
  const chartData = (data && data.length > 0 ? data : [
    { label: "Algorithms", value: 40 },
    { label: "Python/Flask", value: 90 },
    { label: "Deep Learning", value: 30 },
    { label: "Data Eng", value: 75 },
    { label: "MLOps", value: 20 },
    { label: "Streamlit UI", value: 85 },
  ]);

  const barRefs = useRef([]);

  useEffect(() => {
    chartData.forEach((_, idx) => {
      setTimeout(() => {
        if (barRefs.current[idx]) {
          barRefs.current[idx].style.setProperty('--target-height', `${chartData[idx].value}%`);
          barRefs.current[idx].classList.add('bar-animate-in');
        }
      }, idx * 120 + 200);
    });
  }, []);

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col relative overflow-hidden">
      
{/* Liquid Glass Interior Background */}
      <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none z-0">
        {/* Base Frosted Glass Layer - Premium White Frost */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/60 backdrop-blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/30 backdrop-blur-xl" />
        
        {/* Premium Warm Ambient Gradient - Yellow/Orange/Soft Red */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/15 via-orange-100/10 to-red-100/12 animate-bg-gradient-drift" />
        <div className="absolute inset-0 bg-gradient-to-bl from-yellow-100/12 via-transparent to-orange-50/10 animate-bg-gradient-drift-reverse" />
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-100/18 via-transparent to-orange-50/12 animate-bg-vertical-drift" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-100/15 via-orange-50/10 to-transparent animate-bg-horizontal-drift" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-50/8 to-transparent animate-bg-diagonal-drift" />
        
        {/* Radial Light Blooms - Soft Diffused */}
        <div className="absolute top-1/5 left-1/4 w-80 h-80 bg-gradient-to-r from-yellow-200/20 to-transparent rounded-full blur-[140px] animate-bloom-1" />
        <div className="absolute bottom-1/4 right-1/5 w-72 h-72 bg-gradient-to-r from-orange-200/15 to-transparent rounded-full blur-[120px] animate-bloom-2" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-100/12 via-transparent to-red-50/8 rounded-full blur-[180px] animate-bloom-3" />
        <div className="absolute bottom-1/5 left-1/3 transform -translate-x-1/3 w-56 h-56 bg-gradient-to-t from-red-100/10 to-transparent rounded-full blur-[100px] animate-bloom-4" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-bl from-yellow-100/15 to-transparent rounded-full blur-[130px] animate-bloom-5" />
        <div className="absolute left-1/2 bottom-1/4 transform -translate-x-1/2 w-48 h-48 bg-gradient-to-tr from-orange-100/12 to-transparent rounded-full blur-[90px] animate-bloom-6" />
        
        {/* Subtle Glass Haze Layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/15 to-transparent animate-haze-drift-1" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-haze-drift-2" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/6 to-transparent animate-haze-drift-3" />
        
        {/* Soft Reflection Streaks */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-40 bg-gradient-to-b from-white/20 via-white/8 to-transparent animate-reflection-streak-1" />
        <div className="absolute bottom-0 left-1/3 transform -translate-x-1/3 w-full h-28 bg-gradient-to-t from-white/12 to-transparent animate-reflection-streak-2" />
        <div className="absolute top-1/4 left-0 w-1/2 h-1 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-reflection-streak-3" />
        <div className="absolute bottom-1/3 right-0 w-1/3 h-0.5 bg-gradient-to-l from-transparent via-white/18 to-transparent animate-reflection-streak-4" />
        
        {/* Premium Caustic Light Patterns */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22caustic%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.02%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3CfeColorMatrix type=%22matrix%22 values=%221 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23caustic)%22/%3E%3C/svg%22)] opacity-15 animate-caustic-drift" />
        
        {/* Fine Grain Texture - Subtle */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.015%22/%3E%3C/svg%22)] opacity-40 animate-grain-shift" />
        
        {/* Subtle Vignette for Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/3 rounded-[2rem]" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/2 rounded-[2rem]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/2 rounded-[2rem]" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/2 rounded-[2rem]" />
      </div>

      <div className="flex justify-between items-center mb-10 relative z-10">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">PROFICIENCY DISTRIBUTION</h3>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Live Sync</span>
      </div>
      
      <div className="flex-1 flex items-end justify-between gap-4 border-b border-slate-100 pb-4 mt-8 relative z-10">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 group cursor-pointer">
            <div className="w-full flex justify-center relative">
              
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20 flex flex-col items-center">
                <span className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                  {item.label}: {item.value}%
                </span>
                <div className="w-2 h-2 bg-slate-900 transform rotate-45 -mt-1"></div>
              </div>

              {/* Liquid Glass Bar Container */}
              <div 
                className="w-full max-w-[2.5rem] rounded-t-xl relative overflow-hidden"
                style={{ height: '180px' }}
              >
                {/* Background Track - Frosted Glass */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-t-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.03)]" />
                
                {/* Subtle Container Reflection */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/5 animate-container-reflection" />
                <div className="absolute left-1 top-1 bottom-1 w-1 bg-white/30 rounded-l-full blur-sm animate-container-highlight" />

                {/* Animated Liquid Glass Fill */}
                <div 
                  ref={(el) => { barRefs.current[idx] = el; }}
                  className="absolute bottom-0 left-0 w-full rounded-t-xl"
                  style={{ 
                    height: '0%',
                    background: 'linear-gradient(180deg, #FDE047 0%, #FBBF24 15%, #FB923C 35%, #F97316 55%, #F87171 70%, #EF4444 85%, #DC2626 100%)',
                    backgroundSize: '100% 250%',
                    opacity: '0.88',
                    boxShadow: 'inset 0 -2px 8px rgba(0,0,0,0.15), 0 0 16px rgba(253,224,71,0.4), 0 0 32px rgba(251,191,36,0.25), 0 0 48px rgba(239,68,68,0.15)',
                    filter: 'drop-shadow(0 4px 12px rgba(239,68,68,0.2))'
                  }}
                >
                  {/* Internal Fluid Flow - Vertical */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-yellow-200/40 via-orange-200/30 to-transparent animate-fluid-flow-vertical" />
                  
                  {/* Internal Fluid Shift - Horizontal */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/30 via-transparent to-red-200/30 animate-fluid-shift-horizontal" />
                  
                  {/* Bright Glossy Highlight */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/40 to-transparent animate-glossy-sweep" />
                  
                  {/* Edge Glow Inner */}
                  <div className="absolute left-0 right-0 bottom-0 h-2 bg-gradient-to-t from-yellow-300/60 to-transparent rounded-b-xl animate-edge-glow" />
                </div>
                
                {/* Top Glass Cap on Hover */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white/50 to-transparent rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            
            {/* Glass Skill Indicator Dot */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 animate-indicator-pulse shadow-[0_0_8px_rgba(253,224,71,0.6),0_0_16px_rgba(239,68,68,0.4)]" />
          </div>
        ))}
      </div>
      
      {/* Horizontal Labels */}
      <div className="flex justify-between mt-4 px-1 relative z-10">
        {chartData.map((item, idx) => (
          <div key={idx} className="text-[10px] font-bold text-slate-500 text-center flex-1 px-1 group relative">
            <span className="hidden sm:block transition-colors duration-300 group-hover:text-slate-700">{item.label}</span>
            <span className="block sm:hidden truncate">{item.label.substring(0, 4)}...</span>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full transition-all duration-300 group-hover:w-full" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes container-reflection {
          0% { opacity: 0.15; transform: translateX(-30%); }
          50% { opacity: 0.35; transform: translateX(30%); }
          100% { opacity: 0.15; transform: translateX(-30%); }
        }
        @keyframes container-highlight {
          0%, 100% { opacity: 0.3; height: 100%; }
          50% { opacity: 0.6; height: 95%; }
        }
        @keyframes fluid-flow-vertical {
          0% { background-position: 0% 100%; opacity: 0.4; }
          50% { background-position: 0% 0%; opacity: 0.7; }
          100% { background-position: 0% 100%; opacity: 0.4; }
        }
        @keyframes fluid-shift-horizontal {
          0% { background-position: 0% 50%; opacity: 0.25; }
          50% { background-position: 100% 50%; opacity: 0.55; }
          100% { background-position: 0% 50%; opacity: 0.25; }
        }
        @keyframes glossy-sweep {
          0% { opacity: 0; transform: translateY(100%); }
          15% { opacity: 0.5; }
          50% { opacity: 0.6; transform: translateY(-20%); }
          85% { opacity: 0.5; }
          100% { opacity: 0; transform: translateY(-100%); }
        }
        @keyframes edge-glow {
          0%, 100% { opacity: 0.5; transform: scaleX(1); }
          50% { opacity: 0.9; transform: scaleX(1.02); }
        }
        @keyframes indicator-pulse {
          0%, 100% { transform: translateX(-50%) translateY(0) scale(1); box-shadow: 0 0 8px #FDE047, 0 0 16px #FB923C; }
          50% { transform: translateX(-50%) translateY(-3px) scale(1.15); box-shadow: 0 0 14px #EF4444, 0 0 28px #FBBF24; }
        }
        @keyframes bar-animate-in {
          0% { height: 0%; opacity: 0; transform: scaleY(0.9); }
          40% { opacity: 0.88; transform: scaleY(1.02); }
          100% { height: var(--target-height); opacity: 0.88; transform: scaleY(1); }
        }
        @keyframes bg-gradient-drift {
          0%, 100% { background-position: 0% 0%; opacity: 1; }
          25% { background-position: 100% 50%; opacity: 0.7; }
          50% { background-position: 50% 100%; opacity: 0.85; }
          75% { background-position: 100% 0%; opacity: 0.7; }
        }
        @keyframes bg-gradient-drift-reverse {
          0%, 100% { background-position: 100% 100%; opacity: 1; }
          25% { background-position: 0% 50%; opacity: 0.6; }
          50% { background-position: 50% 0%; opacity: 0.8; }
          75% { background-position: 0% 100%; opacity: 0.6; }
        }
        @keyframes bg-vertical-drift {
          0%, 100% { background-position: 50% 0%; opacity: 1; }
          50% { background-position: 50% 100%; opacity: 0.6; }
        }
        @keyframes bg-horizontal-drift {
          0%, 100% { background-position: 0% 50%; opacity: 1; }
          50% { background-position: 100% 50%; opacity: 0.5; }
        }
        @keyframes bg-diagonal-drift {
          0%, 100% { background-position: 0% 0%; opacity: 1; }
          50% { background-position: 100% 100%; opacity: 0.5; }
        }
        @keyframes bloom-1 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.7; }
        }
        @keyframes bloom-2 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.35; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.65; }
        }
        @keyframes bloom-3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          33% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.55; }
          66% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.45; }
        }
        @keyframes bloom-4 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.25); opacity: 0.6; }
        }
        @keyframes bloom-5 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.35; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.6; }
        }
        @keyframes bloom-6 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.25; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
        }
        @keyframes haze-drift-1 {
          0%, 100% { background-position: 50% 0%; opacity: 1; }
          50% { background-position: 50% 100%; opacity: 0.5; }
        }
        @keyframes haze-drift-2 {
          0%, 100% { background-position: 0% 50%; opacity: 1; }
          50% { background-position: 100% 50%; opacity: 0.4; }
        }
        @keyframes haze-drift-3 {
          0%, 100% { background-position: 100% 100%; opacity: 1; }
          50% { background-position: 0% 0%; opacity: 0.45; }
        }
        @keyframes reflection-streak-1 {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) translateY(0); }
          50% { opacity: 0.7; transform: translateX(-50%) translateY(8px); }
        }
        @keyframes reflection-streak-2 {
          0%, 100% { opacity: 0.25; transform: translateX(-33%) translateY(0); }
          50% { opacity: 0.6; transform: translateX(-33%) translateY(-6px); }
        }
        @keyframes reflection-streak-3 {
          0%, 100% { opacity: 0.2; transform: translateX(0); }
          50% { opacity: 0.5; transform: translateX(10%); }
        }
        @keyframes reflection-streak-4 {
          0%, 100% { opacity: 0.15; transform: translateX(0); }
          50% { opacity: 0.45; transform: translateX(-8%); }
        }
        @keyframes caustic-drift {
          0%, 100% { background-position: 0% 0%; transform: rotate(0deg) scale(1); opacity: 1; }
          25% { background-position: 50% 50%; transform: rotate(2deg) scale(1.02); opacity: 0.7; }
          50% { background-position: 100% 100%; transform: rotate(0deg) scale(1); opacity: 0.85; }
          75% { background-position: 50% 50%; transform: rotate(-2deg) scale(1.02); opacity: 0.7; }
        }
        @keyframes grain-shift {
          0%, 100% { background-position: 0% 0%; }
          25% { background-position: 50% 25%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 25% 75%; }
        }
        .animate-container-reflection { animation: container-reflection 5s ease-in-out infinite; }
        .animate-container-highlight { animation: container-highlight 4s ease-in-out infinite; }
        .animate-fluid-flow-vertical { animation: fluid-flow-vertical 4s ease-in-out infinite; }
        .animate-fluid-shift-horizontal { animation: fluid-shift-horizontal 6s ease-in-out infinite; }
        .animate-glossy-sweep { animation: glossy-sweep 5s ease-in-out infinite; }
        .animate-edge-glow { animation: edge-glow 3s ease-in-out infinite; }
        .animate-indicator-pulse { animation: indicator-pulse 2.5s ease-in-out infinite; }
        .bar-animate-in { animation: bar-animate-in 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-bg-gradient-drift { animation: bg-gradient-drift 20s ease-in-out infinite; background-size: 200% 200%; }
        .animate-bg-gradient-drift-reverse { animation: bg-gradient-drift-reverse 25s ease-in-out infinite; background-size: 200% 200%; }
        .animate-bg-vertical-drift { animation: bg-vertical-drift 15s ease-in-out infinite; background-size: 100% 200%; }
        .animate-bg-horizontal-drift { animation: bg-horizontal-drift 18s ease-in-out infinite; background-size: 200% 100%; }
        .animate-bg-diagonal-drift { animation: bg-diagonal-drift 22s ease-in-out infinite; background-size: 200% 200%; }
        .animate-bloom-1 { animation: bloom-1 8s ease-in-out infinite; }
        .animate-bloom-2 { animation: bloom-2 10s ease-in-out infinite; }
        .animate-bloom-3 { animation: bloom-3 12s ease-in-out infinite; }
        .animate-bloom-4 { animation: bloom-4 9s ease-in-out infinite; }
        .animate-bloom-5 { animation: bloom-5 11s ease-in-out infinite; }
        .animate-bloom-6 { animation: bloom-6 13s ease-in-out infinite; }
        .animate-haze-drift-1 { animation: haze-drift-1 14s ease-in-out infinite; background-size: 100% 200%; }
        .animate-haze-drift-2 { animation: haze-drift-2 16s ease-in-out infinite; background-size: 200% 100%; }
        .animate-haze-drift-3 { animation: haze-drift-3 18s ease-in-out infinite; background-size: 200% 200%; }
        .animate-reflection-streak-1 { animation: reflection-streak-1 6s ease-in-out infinite; }
        .animate-reflection-streak-2 { animation: reflection-streak-2 7s ease-in-out infinite; }
        .animate-reflection-streak-3 { animation: reflection-streak-3 5s ease-in-out infinite; }
        .animate-reflection-streak-4 { animation: reflection-streak-4 8s ease-in-out infinite; }
        .animate-caustic-drift { animation: caustic-drift 30s ease-in-out infinite; background-size: 200% 200%; }
        .animate-grain-shift { animation: grain-shift 8s linear infinite; background-size: 300% 300%; }
      `}</style>
    </div>
  );
};

export default SkillHistogram;