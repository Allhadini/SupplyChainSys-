import React from 'react';

export const Badge = ({ children, variant = 'default' }) => {
  const getColors = () => {
    switch (variant.toLowerCase()) {
      case 'good':
      case 'on time':
      case 'delivered':
      case 'low':
      case 'active':
        return 'bg-mint-dim/20 border-mint-dim text-mint';
      case 'warning':
      case 'delayed':
      case 'medium':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500';
      case 'critical':
      case 'high':
      case 'severe':
        return 'bg-alert-red/20 border-alert-red/50 text-alert-red';
      default:
        return 'bg-violet-support text-soft-gray border-violet-hover';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getColors()}`}>
      {children}
    </span>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-carbon/80 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      ></div>
      <div className="relative z-10 glass-card animate-slide-right w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-violet-support bg-carbon-light/50">
          <h3 className="text-xl font-heading font-bold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-soft-gray hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
