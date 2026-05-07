// 'use client';

// import dynamic from 'next/dynamic';

// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// interface ChartDataPoint {
//   name: string;
//   value: number;
// }

// interface UserGrowthChartProps {
//   data: ChartDataPoint[];
// }

// export default function UserGrowthChart({ data }: UserGrowthChartProps) {
//   const series = [
//     {
//       name: 'Users',
//       data: data.map(d => d.value),
//     },
//   ];

//   const options: any = {
//     chart: {
//       type: 'line',
//       toolbar: {
//         show: false,
//       },
//       sparkline: {
//         enabled: false,
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
//     colors: ['#8b5cf6'],
//     stroke: {
//       curve: 'smooth',
//       width: 3,
//       lineCap: 'round',
//       lineJoin: 'round',
//     },
//     markers: {
//       size: 6,
//       colors: ['#8b5cf6'],
//       strokeColors: '#ffffff',
//       strokeWidth: 2,
//       strokeOpacity: 1,
//       fillOpacity: 1,
//       discrete: [],
//       shape: 'circle',
//       radius: 3,
//       offsetX: 0,
//       offsetY: 0,
//       onClick: undefined,
//       onDblClick: undefined,
//       showNullDataPoints: true,
//       hover: {
//         size: 10,
//         sizeOffset: 3,
//       },
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
//         formatter: (value: number) => `${value.toLocaleString()} users`,
//       },
//       marker: {
//         show: true,
//         fillColors: ['#8b5cf6'],
//       },
//     },
//     responsive: [
//       {
//         breakpoint: 1024,
//         options: {
//           chart: {
//             height: 300,
//           },
//           markers: {
//             size: 5,
//             hover: {
//               size: 8,
//             },
//           },
//         },
//       },
//     ],
//   };

//   return (
//     <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500/30 transition-all duration-300">
//       <div className="mb-6">
//         <h3 className="text-lg font-bold text-white">User Growth</h3>
//         <p className="text-sm text-slate-400 mt-1">Monthly user acquisition trend</p>
//       </div>
//       <Chart options={options} series={series} type="line" height={350} />
//     </div>
//   );
// }



'use client';

import dynamic from 'next/dynamic';
import { TrendingUp } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartDataPoint {
  name: string;
  value: number;
}

interface UserGrowthChartProps {
  data: ChartDataPoint[];
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  const series = [
    {
      name: 'Users',
      data: data.map(d => d.value),
    },
  ];

  const options: any = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 900,
        animateGradually: { enabled: true, delay: 120 },
        dynamicAnimation: { enabled: true, speed: 180 },
      },
    },
    colors: ['#a855f7'],
    stroke: { curve: 'smooth', width: 3, lineCap: 'round' },
    markers: {
      size: 5,
      colors: ['#a855f7'],
      strokeColors: '#0f172a',
      strokeWidth: 2.5,
      hover: { size: 8 },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.02,
        stops: [0, 95],
        colorStops: [
          { offset: 0, color: '#a855f7', opacity: 0.5 },
          { offset: 95, color: '#a855f7', opacity: 0.02 },
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
      y: { formatter: (v: number) => `${v.toLocaleString()} users` },
      marker: { show: true, fillColors: ['#a855f7'] },
    },
  };

  // Calculate growth %
  const growth = data.length >= 2
    ? (((data[data.length - 1].value - data[0].value) / data[0].value) * 100).toFixed(1)
    : null;

  return (
    <div className="relative bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 overflow-hidden group transition-all duration-500 hover:border-purple-500/40 ">
      {/* Background dot grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #a855f7 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-500/60 to-transparent" />

      {/* Corner glow */}
      <div className="absolute -top-10 -left-10 w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 rounded-full bg-purple-600/10 blur-3xl group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 sm:mb-5 md:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative w-8 sm:w-9 h-8 sm:h-9 shrink-0">
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-purple-500/20 animate-pulse" />
              <div className="relative w-8 sm:w-9 h-8 sm:h-9 bg-linear-to-br from-purple-600 to-violet-500 rounded-lg sm:rounded-xl flex items-center justify-center ">
                <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white font-[nunito] truncate">User Growth</h3>
              <p className="text-slate-400 text-[12px] sm:text-[13px] font-semibold font-[nunito] truncate">Monthly acquisition trend</p>
            </div>
          </div>
        </div>

        <Chart options={options} series={series} type="area" height={250} />
      </div>
    </div>
  );
}