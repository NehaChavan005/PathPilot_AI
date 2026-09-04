import React, { useState } from 'react';

const RAGFileUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 mb-4">Context Injection</h3>
      <p className="text-xs font-medium text-slate-500 mb-4">Upload a Job Description to tailor the interview.</p>
      
      <div 
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          isDragging || file ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); setFile(e.dataTransfer.files[0]); }}
      >
        <div className="text-3xl mb-2">{file ? '📄' : '📁'}</div>
        <p className="text-sm font-bold text-slate-700">
          {file ? file.name : "Drag & Drop JD PDF"}
        </p>
      </div>
    </div>
  );
};

export default RAGFileUploader;
