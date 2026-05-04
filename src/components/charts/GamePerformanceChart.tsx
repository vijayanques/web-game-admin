'use client';

import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface GamePerformanceChartProps {
  data: ChartDataPoint[];
}

export default function GamePerformanceChart({ data }: GamePerformanceChartProps) {
  // Extract unique game names from data
  const gameNames = [...new Set(data.map(d => Object.keys(d).filter(k => k !== 'name' && k !== 'value')).flat())];
  
  // Build series data for each game
  const series = gameNames.map(gameName => ({
    name: gameName,
    data: data.map(d => (d[gameName] as number) || 0),
  }));

  const categories = data.map(d => d.name);

  const options: any = {
    chart: {
      type: 'radar',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 150,
        },
      },
    },
    colors: ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'],
    stroke: {
      show: true,
      width: 2,
      colors: ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'],
      dashArray: 0,
    },
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeColors: '#334155',
          fill: {
            colors: ['#1e293b', '#0f172a'],
          },
        },
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '12px',
        },
      },
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontFamily: 'Helvetica, Arial, sans-serif',
      labels: {
        colors: '#94a3b8',
        useSeriesColors: true,
      },
      markers: {
        width: 8,
        height: 8,
        radius: 2,
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
    ],
  };

  return (
    <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500/30 transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Game Performance</h3>
        <p className="text-sm text-slate-400 mt-1">Weekly player engagement by game</p>
      </div>
      <Chart options={options} series={series} type="radar" height={350} />
    </div>
  );
}
