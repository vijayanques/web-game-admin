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
  const series = data.map(d => d.value);
  const labels = data.map(d => d.name);

  const options: any = {
    chart: {
      type: 'donut',
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 900,
        animateGradually: { enabled: true, delay: 120 },
        dynamicAnimation: { enabled: true, speed: 180 },
      },
    },
    colors: ['#ec4899', '#f43f5e', '#06b6d4', '#8b5cf6', '#10b981', '#14b8a6'],
    stroke: {
      width: 2,
      colors: ['#0f172a'],
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'nunito',
              color: '#94a3b8',
            },
            value: {
              show: true,
              fontSize: '18px',
              fontFamily: 'nunito',
              fontWeight: 600,
              color: '#ffffff',
              formatter: (v: number) => `${v.toLocaleString()}`,
            },
            total: {
              show: true,
              label: 'Total Players',
              fontSize: '12px',
              fontFamily: 'nunito',
              color: '#64748b',
              formatter: () => {
                const total = series.reduce((a, b) => a + b, 0);
                return `${total.toLocaleString()}`;
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (v: number) => `${v.toFixed(2)}%`,
      style: {
        fontSize: '11px',
        fontFamily: 'nunito',
        fontWeight: 600,
        colors: ['#ffffff'],
      },
    },
    labels: labels,
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontFamily: 'nunito',
      labels: {
        colors: '#94a3b8',
      },
      markers: {
        width: 8,
        height: 8,
        radius: 2,
      },
    },
    tooltip: {
      theme: 'dark',
      style: { fontSize: '12px' },
      y: { formatter: (v: number) => `${v.toLocaleString()} players` },
    },
  };

  return (
    <div className="relative bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 overflow-hidden group transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.12)]">
      {/* Background dot grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-500/60 to-transparent" />

      {/* Corner glow */}
      <div className="absolute -top-10 -right-10 w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 rounded-full bg-emerald-600/10 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 sm:mb-5 md:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative w-8 sm:w-9 h-8 sm:h-9 shrink-0">
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-emerald-500/20 animate-pulse" />
              <div className="relative w-8 sm:w-9 h-8 sm:h-9 bg-linear-to-br from-emerald-600 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white font-[nunito] truncate">Active Players</h3>
              <p className="text-slate-400 text-[12px] sm:text-[13px] font-[nunito] font-semibold truncate">Real-time activity</p>
            </div>
          </div>
        </div>

        <Chart options={options} series={series} type="donut" height={280} />
      </div>
    </div>
  );
}