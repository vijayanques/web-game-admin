'use client';

import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartDataPoint {
  name: string;
  value: number;
}

interface RevenueDistributionChartProps {
  data: ChartDataPoint[];
}

export default function RevenueDistributionChart({ data }: RevenueDistributionChartProps) {
  const series = data.map(d => d.value);
  const labels = data.map(d => d.name);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const options: any = {
    chart: {
      type: 'donut',
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
    labels: labels,
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#94a3b8',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '20px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#ffffff',
              offsetY: 16,
              formatter: (val: string) => `${parseFloat(val).toFixed(1)}%`,
            },
            total: {
              show: true,
              label: 'Total Revenue',
              fontSize: '14px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#94a3b8',
              formatter: () => `$${(total / 1000).toFixed(1)}K`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
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
      y: {
        formatter: (value: number) => `${value.toFixed(1)}%`,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
  };

  return (
    <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500/30 transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Revenue Distribution</h3>
        <p className="text-sm text-slate-400 mt-1">Revenue breakdown by source</p>
      </div>
      <Chart options={options} series={series} type="donut" height={350} />
    </div>
  );
}
