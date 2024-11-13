import React from 'react';
import './StepIndicator.css';

const StepIndicator = ({ currentStep, labels }) => {
  return (
    <div className="step-indicator">
      {labels.map((label, index) => (
        <div
          key={index}
          className={`step-label-container ${index < currentStep ? 'completed' : ''}`}
        >
          <div className={`step-circle ${index === currentStep ? 'active' : ''}`}>
            {index + 1}
          </div>
          <span className="step-label">{label}</span>
          {index < labels.length - 1 && <div className="step-line"></div>}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
