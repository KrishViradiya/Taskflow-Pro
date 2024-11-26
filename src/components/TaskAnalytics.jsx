import { useTask } from '../context/TaskContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function TaskAnalytics() {
  const { columns } = useTask();

  // Calculate statistics
  const stats = {
    total: 0,
    byPriority: { High: 0, Medium: 0, Low: 0 },
    byStatus: {},
    byAssignee: {},
    overdue: 0
  };

  Object.entries(columns).forEach(([columnId, column]) => {
    stats.byStatus[column.title] = column.items.length;
    stats.total += column.items.length;

    column.items.forEach(task => {
      // Priority stats
      stats.byPriority[task.priority]++;

      // Assignee stats
      const assigneeName = task.assignee.name;
      stats.byAssignee[assigneeName] = (stats.byAssignee[assigneeName] || 0) + 1;

      // Overdue tasks
      if (new Date(task.dueDate) < new Date() && columnId !== 'done') {
        stats.overdue++;
      }
    });
  });

  // Enhanced chart configurations with better dark mode colors
  const statusChartData = {
    labels: Object.keys(stats.byStatus),
    datasets: [
      {
        label: 'Tasks by Status',
        data: Object.values(stats.byStatus),
        backgroundColor: [
          'rgba(59, 130, 246, 0.9)', // Bright blue
          'rgba(245, 158, 11, 0.9)', // Bright amber
          'rgba(16, 185, 129, 0.9)', // Bright green
          'rgba(139, 92, 246, 0.9)', // Bright purple
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const priorityChartData = {
    labels: Object.keys(stats.byPriority),
    datasets: [
      {
        label: 'Tasks by Priority',
        data: Object.values(stats.byPriority),
        backgroundColor: [
          'rgba(239, 68, 68, 0.9)',  // Bright red for High
          'rgba(245, 158, 11, 0.9)', // Bright amber for Medium
          'rgba(16, 185, 129, 0.9)', // Bright green for Low
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151',
          padding: 20,
          font: {
            size: 12,
            weight: 500
          }
        }
      }
    }
  };

  return (
    <div className="mt-8 border-t border-purple-600 p-3">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Task Analytics
      </h2>

      {/* Stats Overview with enhanced colors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Tasks</h3>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{stats.total}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">High Priority</h3>
          <p className="text-3xl font-bold text-red-500 dark:text-red-400 mt-2">
            {stats.byPriority.High}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">In Progress</h3>
          <p className="text-3xl font-bold text-blue-500 dark:text-blue-400 mt-2">
            {stats.byStatus['In Progress'] || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Overdue</h3>
          <p className="text-3xl font-bold text-orange-500 dark:text-orange-400 mt-2">
            {stats.overdue}
          </p>
        </div>
      </div>

      {/* Charts with enhanced containers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Tasks by Status
          </h3>
          <div className="h-64">
            <Doughnut 
              data={statusChartData}
              options={{
                ...chartOptions,
                cutout: '60%',
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Tasks by Priority
          </h3>
          <div className="h-64">
            <Bar 
              data={priorityChartData}
              options={{
                ...chartOptions,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: document.documentElement.classList.contains('dark') 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)',
                    },
                    ticks: {
                      color: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                      color: document.documentElement.classList.contains('dark') ? '#E5E7EB' : '#374151'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Assignee Table */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Tasks by Assignee
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-gray-600 dark:text-gray-300 font-semibold">Assignee</th>
                <th className="pb-3 text-gray-600 dark:text-gray-300 font-semibold">Tasks</th>
                <th className="pb-3 text-gray-600 dark:text-gray-300 font-semibold">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.byAssignee).map(([assignee, count], index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 text-gray-800 dark:text-gray-200">{assignee}</td>
                  <td className="py-3 text-gray-800 dark:text-gray-200">{count}</td>
                  <td className="py-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 dark:bg-blue-400 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TaskAnalytics;