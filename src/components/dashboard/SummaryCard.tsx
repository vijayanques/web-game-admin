// "use client";

// import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

// interface SummaryCardProps {
//   title: string;
//   value: string;
//   icon: LucideIcon;
//   trend: string;
//   trendUp: boolean;
//   color: string;
//   subtitle?: string;
// }

// export default function SummaryCard({
//   title,
//   value,
//   icon: Icon,
//   trend,
//   trendUp,
//   color,
//   subtitle,
// }: SummaryCardProps) {
//   return (
//     <div className="group relative bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-600/20 overflow-hidden">
//       {/* Animated background gradient */}
//       <div className="absolute inset-0 bg-linear-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300" />

//       {/* Decorative elements */}
//       <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-300" />
//       <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all duration-300" />

//       <div className="relative z-10">
//         <div className="flex items-start justify-between mb-3 sm:mb-4">
//           <div className="min-w-0 flex-1">
//             <p className="text-slate-400 text-xs sm:text-sm font-semibold mb-1 uppercase tracking-wider font-[nunito]">
//               {title}
//             </p>
//             <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white truncate font-[nunito]">
//               {value}
//             </h3>
//             {subtitle && (
//               <p className="text-slate-500 text-xs sm:text-sm mt-1 font-[nunito]">{subtitle}</p>
//             )}
//           </div>
//           <div className={`bg-linear-to-br ${color} p-2 sm:p-3 rounded-lg shrink-0 ml-2 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
//             <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="h-px bg-linear-to-r from-slate-700 via-slate-600 to-transparent mb-3 sm:mb-4" />

//         {/* Stats footer */}
//         <div className="flex items-center gap-2 flex-wrap">
//           {trendUp ? (
//             <TrendingUp className="w-4 h-4 shrink-0 text-green-500" />
//           ) : (
//             <TrendingDown className="w-4 h-4 shrink-0 text-red-500" />
//           )}
//           <span className={`text-xs sm:text-sm font-bold font-[nunito] ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
//             {trend}
//           </span>
//           <span className="text-slate-500 text-xs sm:text-sm font-[nunito]">from last month</span>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    for (let i = 0; i < 18; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="group relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/60 hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]"
      style={{ isolation: 'isolate' }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Holographic shimmer sweep */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </div>

      {/* Corner glow */}
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full blur-3xl bg-purple-600/20 group-hover:bg-purple-500/35 transition-all duration-500" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full blur-3xl bg-pink-600/15 group-hover:bg-pink-500/30 transition-all duration-500" />

      {/* Top accent line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <p className="text-slate-400 font-[nunito] text-xs font-bold uppercase tracking-[0.15em]">{title}</p>
            </div>
            <h3 className="text-4xl font-black text-white tracking-tight tabular-nums"
              style={{ fontFamily: "nunito", textShadow: '0 0 30px rgba(168,85,247,0.3)' }}
            >
              {value}
            </h3>
            {subtitle && (
              <p className="text-slate-500 text-xs mt-1.5 font-[nunito] font-bold">{subtitle}</p>
            )}
          </div>

          {/* Icon box with layered glow */}
          <div className="relative shrink-0 ml-3">
            <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-xl blur-md opacity-60 group-hover:opacity-90 transition-opacity duration-300`} />
            <div className={`relative bg-gradient-to-br ${color} p-3 rounded-xl shadow-lg `}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Divider with moving gradient */}
        <div className="relative h-px mb-4 overflow-hidden rounded-full bg-slate-800">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-purple-600/60 to-pink-500/60 group-hover:w-full transition-all duration-700 ease-in-out" />
        </div>

        {/* Trend badge */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center font-[nunito] gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${trendUp
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
            {trendUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend}
          </div>
          <span className="text-slate-500 text-xs font-[nunito] font-semibold">vs last month</span>
        </div>
      </div>
    </div>
  );
}
