import { motion } from 'framer-motion';

// ─── Skeleton Loader ───
export function Skeleton({ className = '', width = '100%', height = '20px' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, minHeight: height }}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="glass p-5 space-y-4">
      <Skeleton height="14px" width="40%" />
      <Skeleton height="32px" width="60%" />
      {Array.from({ length: lines - 2 }).map((_, i) => (
        <Skeleton key={i} height="12px" width={`${70 + Math.random() * 30}%`} />
      ))}
    </div>
  );
}

// ─── Badge ───
export function Badge({ children, variant = 'default', pulse = false }) {
  const variants = {
    'in transit': 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    'delivered': 'bg-emerald/15 border-emerald/30 text-emerald',
    'delayed': 'bg-rose/15 border-rose/30 text-rose',
    'customs hold': 'bg-amber/15 border-amber/30 text-amber',
    'critical': 'bg-rose/15 border-rose/30 text-rose',
    'high': 'bg-amber/15 border-amber/30 text-amber',
    'normal': 'bg-slate-light border-glass-border text-text-secondary',
    'success': 'bg-emerald/15 border-emerald/30 text-emerald',
    'warning': 'bg-amber/15 border-amber/30 text-amber',
    'info': 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    'sea': 'bg-cyan-accent/15 border-cyan-accent/30 text-cyan-accent',
    'air': 'bg-purple-start/15 border-purple-start/30 text-purple-start',
    'road': 'bg-amber/15 border-amber/30 text-amber',
  };

  const style = variants[variant?.toLowerCase()] || variants.normal;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${style}`}>
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse-dot" />
      )}
      {children}
    </span>
  );
}

// ─── Glass Card (motion-enabled) ───
export function GlassCard({ children, className = '', hover = false, delay = 0, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover ? { y: -3, scale: 1.005 } : {}}
      onClick={onClick}
      className={`glass ${hover ? 'glass-hover cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Progress Bar ───
export function ProgressBar({ value = 0, size = 'md', color = 'purple', showLabel = true }) {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };
  const colors = {
    purple: 'from-purple-start to-blue-end',
    emerald: 'from-emerald to-cyan-accent',
    rose: 'from-rose to-amber',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-white/5 rounded-full ${heights[size]} overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`${heights[size]} rounded-full bg-gradient-to-r ${colors[color]}`}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-text-muted">Progress</span>
          <span className="text-[11px] font-semibold text-text-secondary">{Math.round(value)}%</span>
        </div>
      )}
    </div>
  );
}

// ─── Modal ───
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 glass w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-lg font-bold gradient-text">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </motion.div>
    </div>
  );
}

// ─── Status Dot ───
export function StatusDot({ status }) {
  const colors = {
    'In Transit': 'bg-blue-400',
    'Delivered': 'bg-emerald',
    'Delayed': 'bg-rose',
    'Customs Hold': 'bg-amber',
  };
  return (
    <span className={`w-2 h-2 rounded-full ${colors[status] || 'bg-text-muted'} ${status === 'In Transit' ? 'animate-pulse-dot' : ''}`} />
  );
}
