import React from 'react';
import './auth-split.css';

const AuthSplit = ({ children }) => {
  return (
    <div className="auth-split-container">
      <div className="auth-split-grid">
        {children}
      </div>
    </div>
  );
};

export default AuthSplit;