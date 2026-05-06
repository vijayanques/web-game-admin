// 'use client';

// import dynamic from 'next/dynamic';

// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// interface ChartDataPoint {
//   name: string;
//   value: number;
// }

// interface ActivePlayersChartProps {
//   data: ChartDataPoint[];
// }

// export default function ActivePlayersChart({ data }: ActivePlayersChartProps) {
//   const series = [
//     {
//       name: 'Active Players',
//       data: data.map(d => d.value),
//     },
//   ];

//   const options: any = {
//     chart: {
//       type: 'area',
//       toolbar: {
//         show: false,
//       },
//       animations: {
//         enabled: true,
//         speed: 800,
//         animateGradually: {
//           enabled: true,
//           delay: 150,
//         },
//         dynamicAnimation: {
//           enabled: true,
//           speed: 150,
//         },
//       },
//     },
//     colors: ['#10b981'],
//     stroke: {
//       curve: 'smooth',
//       width: 3,
//       lineCap: 'round',
//     },
//     fill: {
//       type: 'gradient',
//       gradient: {
//         shadeIntensity: 1,
//         opacityFrom: 0.45,
//         opacityTo: 0.05,
//         stops: [20, 100, 100, 100],
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     grid: {
//       borderColor: '#334155',
//       strokeDashArray: 4,
//       xaxis: {
//         lines: {
//           show: false,
//         },
//       },
//     },
//     xaxis: {
//       categories: data.map(d => d.name),
//       labels: {
//         style: {
//           colors: '#94a3b8',
//           fontSize: '12px',
//         },
//       },
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//     yaxis: {
//       labels: {
//         style: {
//           colors: '#94a3b8',
//           fontSize: '12px',
//         },
//       },
//     },
//     tooltip: {
//       theme: 'dark',
//       style: {
//         fontSize: '12px',
//       },
//       y: {
//         formatter: (value: number) => `${value.toLocaleString()} players`,
//       },
//     },
//     responsive: [
//       {
//         breakpoint: 1024,
//         options: {
//           chart: {
//             height: 300,
//           },
//         },
//       },
//     ],
//   };

//   return (
//     <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500/30 transition-all duration-300">
//       <div className="mb-6">
//         <h3 className="text-lg font-bold text-white">Active Players</h3>
//         <p className="text-sm text-slate-400 mt-1">Real-time player activity</p>
//       </div>
//       <Chart options={options} series={series} type="area" height={350} />
//     </div>
//   );
// }





'use client';

import dynamic from 'next/dynamic';
import { Zap } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartDataPoint {
  name: string;
  value: number;
}

interface ActivePlayersChartProps {
  data: ChartDataPoint[];
}

export default function ActivePlayersChart({ data }: ActivePlayersChartProps) {
  const peak = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;

  const series = [
    {
      name: 'Active Players',
      data: data.map(d => d.value),
    },
  ];

  const options: any = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 900,
        animateGradually: { enabled: true, delay: 120 },
        dynamicAnimation: { enabled: true, speed: 180 },
      },
    },
    colors: ['#10b981'],
    stroke: { curve: 'smooth', width: 3, lineCap: 'round' },
    markers: {
      size: 5,
      colors: ['#10b981'],
      strokeColors: '#0f172a',
      strokeWidth: 2.5,
      hover: { size: 8 },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.02,
        stops: [0, 95],
        colorStops: [
          { offset: 0, color: '#10b981', opacity: 0.45 },
          { offset: 95, color: '#10b981', opacity: 0.02 },
        ],
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#1e293b',
      strokeDashArray: 5,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 10, bottom: 0, left: 10 },
    },
    xaxis: {
      categories: data.map(d => d.name),
      labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } },
    },
    tooltip: {
      theme: 'dark',
      style: { fontSize: '12px' },
      y: { formatter: (v: number) => `${v.toLocaleString()} players` },
    },
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-2xl p-6 overflow-hidden group transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.12)]">
      {/* Background dot grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

      {/* Corner glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-600/10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 shrink-0">
              <div className="absolute inset-0 rounded-xl bg-emerald-500/20 animate-pulse" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Zap className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-[nunito]">Active Players</h3>
              <p className="text-slate-400 text-[13px]   font-[nunito] font-semibold">Real-time activity</p>
            </div>
          </div>

          {/* Live + peak */}
          
        </div>

        <Chart options={options} series={series} type="area" height={300} />
      </div>
    </div>
  );
}