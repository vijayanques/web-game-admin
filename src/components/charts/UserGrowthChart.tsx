'use client';

import dynamic from 'next/dynamic';

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
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
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
    colors: ['#8b5cf6'],
    stroke: {
      curve: 'smooth',
      width: 3,
      lineCap: 'round',
      lineJoin: 'round',
    },
    markers: {
      size: 6,
      colors: ['#8b5cf6'],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      strokeOpacity: 1,
      fillOpacity: 1,
      discrete: [],
      shape: 'circle',
      radius: 3,
      offsetX: 0,
      offsetY: 0,
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: true,
      hover: {
        size: 10,
        sizeOffset: 3,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: '#334155',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: data.map(d => d.name),
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '12px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '12px',
        },
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: (value: number) => `${value.toLocaleString()} users`,
      },
      marker: {
        show: true,
        fillColors: ['#8b5cf6'],
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
          markers: {
            size: 5,
            hover: {
              size: 8,
            },
          },
        },
      },
    ],
  };

  return (
    <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500/30 transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">User Growth</h3>
        <p className="text-sm text-slate-400 mt-1">Monthly user acquisition trend</p>
      </div>
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
}
