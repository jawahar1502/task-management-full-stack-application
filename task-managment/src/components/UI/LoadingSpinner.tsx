import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  fullPage?: boolean;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, fullPage = false, text }) => {
  if (fullPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-dark-900">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow animate-pulse-slow">
            <Loader2 size={28} className="text-white animate-spin" />
          </div>
        </div>
        {text && <p className="text-slate-400 text-sm animate-pulse">{text}</p>}
      </div>
    );
  }
  return <Loader2 size={size} className="text-brand-400 animate-spin" />;
};

export default LoadingSpinner;
