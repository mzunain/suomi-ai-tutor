interface ProgressBarProps {
  progress: number;
  className?: string;
  variant?: 'default' | 'success' | 'warning';
}

export function ProgressBar({ progress, className = '', variant = 'default' }: ProgressBarProps) {
  const variants = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${variants[variant]}`}
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
    </div>
  );
}
