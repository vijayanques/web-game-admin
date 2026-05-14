'use client';

import dynamic from 'next/dynamic';
import { Activity } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TrafficChartProps {
  type: 'daily' | 'weekly' | 'monthly';
  chartData?: any[];
}

export default function TrafficChart({ type, chartData }: TrafficChartProps) {
  // Generate dummy data based on type if no dynamic data provided
  const getCategories = () => {
    if (chartData && chartData.length > 0) {
      return chartData.map(d => {
        // format date string "YYYY-MM-DD" to "MMM DD"
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
    }

    switch (type) {
      case 'daily':
        return ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
      case 'weekly':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case 'monthly':
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    }
  };

  const getData = () => {
    if (chartData && chartData.length > 0) {
      return chartData.map(d => parseInt(d.count, 10));
    }

    switch (type) {
      case 'daily':
        return [120, 80, 450, 890, 1200, 950, 400];
      case 'weekly':
        return [4500, 5200, 4800, 6100, 7200, 8500, 7800];
      case 'monthly':
        return [25000, 28000, 32000, 38000];
    }
  };

  const title = type === 'daily' ? 'Daily Traffic' : type === 'weekly' ? 'Weekly Traffic' : 'Monthly Traffic';

  const series = [
    {
      name: 'Visitors',
      data: getData(),
    },
  ];

  const options: any = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 250 },
      },
    },
    colors: ['#06b6d4'], // Cyan color for traffic
    stroke: { curve: 'smooth', width: 3, lineCap: 'round' },
    markers: {
      size: 4,
      colors: ['#06b6d4'],
      strokeColors: '#0f172a',
      strokeWidth: 2,
      hover: { size: 7 },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#1e293b',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: getCategories(),
      labels: { style: { colors: '#64748b', fontSize: '12px', fontWeight: 500 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#64748b', fontSize: '12px', fontWeight: 500 } },
    },
    tooltip: {
      theme: 'dark',
      y: { formatter: (v: number) => `${v.toLocaleString()} visitors` },
      marker: { show: true, fillColors: ['#06b6d4'] },
    },
  };

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-hidden group hover:border-cyan-500/30 transition-all duration-300 shadow-lg">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-white font-bold font-[nunito]">{title}</h3>
          <p className="text-slate-400 text-xs font-[nunito]">Visitor analytics</p>
        </div>
      </div>

      <Chart options={options} series={series} type="area" height={250} />
    </div>
  );
}
