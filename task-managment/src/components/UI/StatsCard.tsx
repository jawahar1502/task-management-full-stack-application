import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'brand' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'slate';
  trend?: string;
  index?: number;
}

const colorMap = {
  brand:   { icon: 'text-brand-400',   bg: 'bg-brand-500/15',   ring: 'ring-brand-500/20',   glow: 'shadow-brand-500/10' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/15', ring: 'ring-emerald-500/20', glow: 'shadow-emerald-500/10' },
  amber:   { icon: 'text-amber-400',   bg: 'bg-amber-500/15',   ring: 'ring-amber-500/20',   glow: 'shadow-amber-500/10' },
  rose:    { icon: 'text-rose-400',    bg: 'bg-rose-500/15',    ring: 'ring-rose-500/20',    glow: 'shadow-rose-500/10' },
  cyan:    { icon: 'text-cyan-400',    bg: 'bg-cyan-500/15',    ring: 'ring-cyan-500/20',    glow: 'shadow-cyan-500/10' },
  slate:   { icon: 'text-slate-400',   bg: 'bg-slate-500/15',   ring: 'ring-slate-500/20',   glow: 'shadow-slate-500/10' },
};

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, color, trend, index = 0 }) => {
  const c = colorMap[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}>
          <Icon size={20} className={c.icon} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-slate-500 bg-dark-700 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-sm text-slate-400 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
