import React, { useState } from 'react';

const ResumeUploader = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    if (onUpload) onUpload(droppedFile);
  };

  return (
    <div className="w-full text-center animate-in fade-in zoom-in-95 duration-500">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Data Ingestion</h2>
      <p className="text-slate-500 text-sm mb-6">Upload your resume to auto-configure your profile (Optional).</p>
      
      <div 
        className={`border-2 border-dashed rounded-3xl p-10 transition-all cursor-pointer ${
          isDragging || file 
            ? 'border-indigo-400 bg-indigo-50/50 shadow-sm' 
            : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('resume-upload').click()}
      >
        <input type="file" id="resume-upload" className="hidden" onChange={(e) => {
          setFile(e.target.files[0]);
          if (onUpload) onUpload(e.target.files[0]);
        }} />
        <span className="text-4xl mb-3 block drop-shadow-sm">{file ? '✅' : '📄'}</span>
        <p className={`font-bold text-sm ${file ? 'text-indigo-600' : 'text-slate-700'}`}>
          {file ? `${file.name} Indexed successfully.` : 'Click or Drag to Upload Document'}
        </p>
        {!file && <p className="text-xs text-slate-400 mt-2 font-medium">PDF, DOCX up to 5MB</p>}
      </div>
    </div>
  );
};

export default ResumeUploader;
