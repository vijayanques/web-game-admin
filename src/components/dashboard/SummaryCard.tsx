"use client";

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
  color: string;
  subtitle?: string;
}

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color,
  subtitle,
}: SummaryCardProps) {
  return (
    <div className="group relative bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-600/20 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all duration-300" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <p className="text-slate-400 text-xs sm:text-sm font-semibold mb-1 uppercase tracking-wider font-[nunito]">
              {title}
            </p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white truncate font-[nunito]">
              {value}
            </h3>
            {subtitle && (
              <p className="text-slate-500 text-xs sm:text-sm mt-1 font-[nunito]">{subtitle}</p>
            )}
          </div>
          <div className={`bg-linear-to-br ${color} p-2 sm:p-3 rounded-lg shrink-0 ml-2 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-slate-700 via-slate-600 to-transparent mb-3 sm:mb-4" />

        {/* Stats footer */}
        <div className="flex items-center gap-2 flex-wrap">
          {trendUp ? (
            <TrendingUp className="w-4 h-4 shrink-0 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 shrink-0 text-red-500" />
          )}
          <span className={`text-xs sm:text-sm font-bold font-[nunito] ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
          <span className="text-slate-500 text-xs sm:text-sm font-[nunito]">from last month</span>
        </div>
      </div>
    </div>
  );
}
