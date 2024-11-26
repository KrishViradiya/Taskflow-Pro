import { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTask } from '../context/TaskContext';
import gsap from 'gsap';

function ProjectOverview() {
  const { columns } = useTask();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const progressRef = useRef(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    highPriority: 0,
    progress: 0,
    byWeek: [],
    byPriority: [],
    recentActivity: []
  });

  useEffect(() => {
    calculateStats();
  }, [columns]);

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        strokeDashoffset: 440 - (440 * stats.progress) / 100,
        duration: 1.5,
        ease: "power3.out"
      });
    }
  }, [stats.progress]);

  const calculateStats = () => {
    const total = Object.values(columns).reduce((acc, col) => acc + col.items.length, 0);
    const completed = columns.done?.items.length || 0;
    const high = Object.values(columns).reduce(
      (acc, col) => acc + col.items.filter(task => task.priority === 'High').length, 0
    );

    // Priority distribution
    const priorities = ['High', 'Medium', 'Low'].map(priority => ({
      name: priority,
      value: Object.values(columns).reduce(
        (acc, col) => acc + col.items.filter(task => task.priority === priority).length, 0
      )
    }));

    // Recent activity simulation
    const activities = [
      { type: 'completed', user: 'Sarah M.', task: 'Design Updates', time: '2h ago', color: 'bg-green-500' },
      { type: 'created', user: 'John D.', task: 'API Integration', time: '4h ago', color: 'bg-blue-500' },
      { type: 'updated', user: 'Emily R.', task: 'Documentation', time: '5h ago', color: 'bg-amber-500' }
    ];

    // Weekly progress data
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: Math.floor(Math.random() * 5),
        inProgress: Math.floor(Math.random() * 3)
      };
    }).reverse();

    setStats({
      totalTasks: total,
      completedTasks: completed,
      highPriority: high,
      progress: total ? (completed / total) * 100 : 0,
      byWeek: weeklyData,
      byPriority: priorities,
      recentActivity: activities
    });
  };

  const PRIORITY_COLORS = ['#EF4444', '#F59E0B', '#3B82F6'];

  return (
    <div className="mt-8 border-t border-purple-600 p-3">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Project Overview
            </h2>
            <div className="flex items-center space-x-2">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium">
                Last Updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Circular Progress */}
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 transform transition-all duration-300 hover:scale-105">
              <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                  />
                  <circle
                    ref={progressRef}
                    className="text-blue-500"
                    strokeWidth="12"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                    style={{
                      strokeDasharray: 440,
                      strokeDashoffset: 440,
                    }}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">
                    {stats.progress.toFixed(1)}%
                  </span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">Completed</span>
                </div>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Priority Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.byPriority}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                    >
                      {stats.byPriority.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PRIORITY_COLORS[index]}
                          opacity={index === activeIndex ? 1 : 0.8}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ payload }) => {
                        if (payload && payload[0]) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                              <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {payload[0].name}: {payload[0].value} tasks
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800/50 rounded-lg transform transition-all duration-200 hover:scale-105"
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className={`w-2 h-2 rounded-full ${activity.color}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {activity.user} {activity.type} <span className="font-bold">{activity.task}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Weekly Progress</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.byWeek}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="date" className="text-gray-600 dark:text-gray-400" />
                  <YAxis className="text-gray-600 dark:text-gray-400" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                    name="Completed"
                  />
                  <Area
                    type="monotone"
                    dataKey="inProgress"
                    stroke="#F59E0B"
                    fillOpacity={1}
                    fill="url(#colorInProgress)"
                    name="In Progress"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectOverview; 