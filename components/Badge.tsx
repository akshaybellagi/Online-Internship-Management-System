type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'default';

interface BadgeProps {
  label?: string;
  text?: string; // Support both label and text for backwards compatibility
  variant?: BadgeVariant;
  className?: string; // Support custom className
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-700',
  default: 'bg-gray-100 text-gray-700',
};

export default function Badge({ label, text, variant = 'default', className }: BadgeProps) {
  const displayText = text || label || '';
  const badgeClass = className || `${variants[variant]}`;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}>
      {displayText}
    </span>
  );
}
