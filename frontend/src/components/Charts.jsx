import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Helper to get theme-aware chart configurations dynamically
const getBaseOptions = (isDark) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: isDark ? '#94a3b8' : '#475569',
        font: { family: 'Inter', size: 11 },
        padding: 16,
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    },
    tooltip: {
      backgroundColor: isDark ? '#000000' : '#ffffff',
      titleColor: isDark ? '#e2e8f0' : '#1e293b',
      bodyColor: isDark ? '#94a3b8' : '#475569',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 10,
      titleFont: { family: 'Inter', size: 12, weight: '600' },
      bodyFont: { family: 'Inter', size: 11 },
    },
  },
});

// Tasks Completed Trend — Line Chart
export const TasksTrendChart = ({ data }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const baseOptions = getBaseOptions(isDark);

  const chartData = {
    labels: data?.map((d) => d._id) || [],
    datasets: [
      {
        label: 'Tasks Completed',
        data: data?.map((d) => d.totalTasks) || [],
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#818cf8',
        pointBorderColor: isDark ? '#1e1b4b' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    ...baseOptions,
    scales: {
      x: {
        grid: { color: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)', drawBorder: false },
        ticks: { color: isDark ? '#64748b' : '#475569', font: { family: 'Inter', size: 10 } },
      },
      y: {
        grid: { color: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)', drawBorder: false },
        ticks: { color: isDark ? '#64748b' : '#475569', font: { family: 'Inter', size: 10 } },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

// Submission Status — Pie Chart
export const SubmissionStatusChart = ({ submitted, pending }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const baseOptions = getBaseOptions(isDark);

  const chartData = {
    labels: ['Submitted', 'Pending (Draft)'],
    datasets: [
      {
        data: [submitted || 0, pending || 0],
        backgroundColor: ['rgba(52, 211, 153, 0.8)', 'rgba(251, 191, 36, 0.8)'],
        borderColor: isDark ? '#000000' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      legend: {
        ...baseOptions.plugins.legend,
        position: 'bottom',
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

// Project Workload — Bar Chart
export const ProjectWorkloadChart = ({ data }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const baseOptions = getBaseOptions(isDark);

  const chartData = {
    labels: data?.map((d) => d._id) || [],
    datasets: [
      {
        label: 'Reports',
        data: data?.map((d) => d.count) || [],
        backgroundColor: [
          'rgba(129, 140, 248, 0.7)',
          'rgba(167, 139, 250, 0.7)',
          'rgba(244, 114, 182, 0.7)',
          'rgba(52, 211, 153, 0.7)',
          'rgba(251, 191, 36, 0.7)',
          'rgba(96, 165, 250, 0.7)',
        ],
        borderColor: [
          '#6366f1',
          '#8b5cf6',
          '#ec4899',
          '#10b981',
          '#f59e0b',
          '#3b82f6',
        ],
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    ...baseOptions,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDark ? '#64748b' : '#475569', font: { family: 'Inter', size: 10 } },
      },
      y: {
        grid: { color: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)', drawBorder: false },
        ticks: {
          color: isDark ? '#64748b' : '#475569',
          font: { family: 'Inter', size: 10 },
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
    plugins: {
      ...baseOptions.plugins,
      legend: { display: false },
    },
  };

  return <Bar data={chartData} options={options} />;
};
