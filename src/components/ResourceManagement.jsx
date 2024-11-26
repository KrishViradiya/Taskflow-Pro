import { useState, useEffect } from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { ResponsiveLine } from '@nivo/line';
import { timeFormat } from 'd3-time-format';
import { useInterval } from 'react-use';
import { motion, AnimatePresence } from 'framer-motion';
import { useTask } from '../context/TaskContext';
import { ResponsiveRadar } from '@nivo/radar';
import { ResponsiveStream } from '@nivo/stream';
import CountUp from 'react-countup';
import { Dialog, Transition } from '@headlessui/react';

const workloadData = [
  {
    id: 'Sarah M.',
    data: [
      { x: 'Mon', y: 80 },
      { x: 'Tue', y: 70 },
      { x: 'Wed', y: 90 },
      { x: 'Thu', y: 60 },
      { x: 'Fri', y: 85 }
    ]
  },
  {
    id: 'John D.',
    data: [
      { x: 'Mon', y: 65 },
      { x: 'Tue', y: 85 },
      { x: 'Wed', y: 75 },
      { x: 'Thu', y: 95 },
      { x: 'Fri', y: 55 }
    ]
  },
  {
    id: 'Emily R.',
    data: [
      { x: 'Mon', y: 95 },
      { x: 'Tue', y: 65 },
      { x: 'Wed', y: 85 },
      { x: 'Thu', y: 75 },
      { x: 'Fri', y: 80 }
    ]
  },
  {
    id: 'Michael K.',
    data: [
      { x: 'Mon', y: 70 },
      { x: 'Tue', y: 90 },
      { x: 'Wed', y: 60 },
      { x: 'Thu', y: 85 },
      { x: 'Fri', y: 75 }
    ]
  }
];

const generateCapacityData = () => {
  const data = [];
  const today = new Date();
  const formatDate = timeFormat('%Y-%m-%d');
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      day: formatDate(date),
      value: Math.floor(Math.random() * 40) + 60
    });
  }
  return data;
};

function ResourceManagement() {
  const { columns } = useTask();
  const [selectedMember, setSelectedMember] = useState(null);
  const [capacityData, setCapacityData] = useState(generateCapacityData());
  const [utilizationData, setUtilizationData] = useState([]);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);

  useEffect(() => {
    generateUtilizationData();
  }, [columns]);

  useInterval(() => {
    updateCapacityData();
  }, 5000);

  const generateUtilizationData = () => {
    const data = [];
    const today = new Date();
    const formatDay = timeFormat('%a');
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.unshift({
        x: formatDay(date),
        y: Math.floor(Math.random() * 30) + 70
      });
    }
    setUtilizationData([
      {
        id: 'utilization',
        color: 'hsl(211, 70%, 50%)',
        data
      }
    ]);
  };

  const updateCapacityData = () => {
    const newData = [...capacityData];
    const today = new Date();
    const formatDate = timeFormat('%Y-%m-%d');
    newData.shift();
    newData.push({
      day: formatDate(today),
      value: Math.floor(Math.random() * 40) + 60
    });
    setCapacityData(newData);
  };

  return (
    <div className="mt-8 w-full border-t border-purple-600 p-3">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Resource Management & Capacity
            </h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 
                               rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 
                               transition-colors">
                Export Report
              </button>
              <button className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 
                               rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 
                               transition-colors">
                Optimize Allocation
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Enhanced Team Capacity Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Team Capacity Overview
              </h3>
              <div className="h-[200px]">
                <ResponsiveCalendar
                  data={capacityData}
                  from={capacityData[0].day}
                  to={capacityData[capacityData.length - 1].day}
                  emptyColor="#e5e7eb"
                  colors={['#c7d2fe', '#818cf8', '#4f46e5', '#3730a3']}
                  margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
                  yearSpacing={40}
                  monthBorderColor="#ffffff"
                  dayBorderWidth={2}
                  dayBorderColor="#ffffff"
                  theme={{
                    textColor: '#111827',
                    fontSize: 14,
                    tooltip: {
                      container: {
                        background: '#ffffff',
                        color: '#111827',
                        fontSize: 14,
                        fontWeight: 500,
                        padding: '12px 16px',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                      }
                    },
                    labels: {
                      text: {
                        fill: '#111827',
                        fontSize: 14,
                        fontWeight: 600
                      }
                    }
                  }}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      translateY: 36,
                      itemCount: 4,
                      itemWidth: 42,
                      itemHeight: 36,
                      itemsSpacing: 14,
                      itemDirection: 'right-to-left',
                      textColor: '#111827',
                      fontSize: 14,
                      fontWeight: 500
                    }
                  ]}
                />
              </div>
            </motion.div>

            {/* Enhanced Resource Utilization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Resource Utilization
              </h3>
              <div className="h-[200px]">
                <ResponsiveLine
                  data={utilizationData}
                  margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
                  xScale={{ type: 'point' }}
                  yScale={{
                    type: 'linear',
                    min: 0,
                    max: 100,
                    stacked: false
                  }}
                  curve="monotoneX"
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Days',
                    legendOffset: 36,
                    legendPosition: 'middle',
                    textColor: '#111827',
                    fontSize: 14,
                    fontWeight: 500
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Utilization %',
                    legendOffset: -50,
                    legendPosition: 'middle',
                    textColor: '#111827',
                    fontSize: 14,
                    fontWeight: 500
                  }}
                  theme={{
                    textColor: '#111827',
                    fontSize: 14,
                    axis: {
                      domain: {
                        line: {
                          stroke: '#374151',
                          strokeWidth: 1
                        }
                      },
                      ticks: {
                        text: {
                          fill: '#111827',
                          fontSize: 14,
                          fontWeight: 500
                        }
                      },
                      legend: {
                        text: {
                          fill: '#111827',
                          fontSize: 14,
                          fontWeight: 600
                        }
                      }
                    },
                    grid: {
                      line: {
                        stroke: '#e5e7eb',
                        strokeWidth: 1
                      }
                    },
                    tooltip: {
                      container: {
                        background: '#ffffff',
                        color: '#111827',
                        fontSize: 14,
                        fontWeight: 500,
                        padding: '12px 16px',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                      }
                    }
                  }}
                  colors={['#4f46e5']}
                  lineWidth={3}
                  pointSize={8}
                  pointColor="#ffffff"
                  pointBorderWidth={2}
                  pointBorderColor="#4f46e5"
                  pointLabelYOffset={-12}
                  enableArea={true}
                  areaBaselineValue={0}
                  areaOpacity={0.15}
                  useMesh={true}
                  enableGridX={false}
                  gridYValues={[0, 25, 50, 75, 100]}
                />
              </div>
            </motion.div>
          </div>

          {/* Enhanced Team Workload Heatmap with better visibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Team Workload Distribution
            </h3>
            <div className="h-[300px] w-full chart-container">
              <ResponsiveHeatMap
                data={workloadData}
                margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
                valueFormat=">-.0f"
                axisTop={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: 'Workdays',
                  legendPosition: 'middle',
                  legendOffset: -40,
                  textColor: '#374151'
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Team Members',
                  legendPosition: 'middle',
                  legendOffset: -60,
                  textColor: '#374151'
                }}
                theme={{
                  textColor: '#374151',
                  fontSize: 12,
                  axis: {
                    ticks: {
                      text: {
                        fill: '#374151'
                      }
                    },
                    legend: {
                      text: {
                        fill: '#374151',
                        fontSize: 14
                      }
                    }
                  },
                  tooltip: {
                    container: {
                      background: '#ffffff',
                      color: '#374151',
                      fontSize: 12,
                      borderRadius: 6,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      padding: '8px 12px'
                    }
                  }
                }}
                colors={{
                  type: 'sequential',
                  scheme: 'purples',
                  minValue: 50,
                  maxValue: 100
                }}
                emptyColor="#f3f4f6"
                borderColor="#ffffff"
                borderWidth={2}
                borderRadius={4}
                enableLabels={true}
                labelTextColor={{
                  from: 'color',
                  modifiers: [['darker', 4]]
                }}
                legends={[
                  {
                    anchor: 'bottom',
                    translateX: 0,
                    translateY: 30,
                    length: 320,
                    thickness: 12,
                    direction: 'row',
                    tickPosition: 'after',
                    tickSize: 3,
                    tickSpacing: 4,
                    tickOverlap: false,
                    title: 'Workload Percentage →',
                    titleAlign: 'start',
                    titleOffset: 4,
                    textColor: '#374151'
                  }
                ]}
                annotations={[
                  {
                    type: 'rect',
                    match: {
                      id: 'Sarah M.',
                      value: 90
                    },
                    noteTextColor: '#374151',
                    noteColor: '#ef4444',
                    noteWidth: 2
                  }
                ]}
              />
            </div>
          </motion.div>

          {/* New Skill Distribution Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Team Skills Distribution
              </h3>
              <button
                onClick={() => setShowSkillsModal(true)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                View Details
              </button>
            </div>
            <div className="h-[400px]">
              <ResponsiveRadar
                data={[
                  {
                    skill: "Frontend",
                    Sarah: 90,
                    John: 60,
                    Emily: 80,
                    Michael: 70
                  },
                  {
                    skill: "Backend",
                    Sarah: 50,
                    John: 90,
                    Emily: 70,
                    Michael: 85
                  },
                  {
                    skill: "DevOps",
                    Sarah: 70,
                    John: 85,
                    Emily: 60,
                    Michael: 90
                  },
                  {
                    skill: "UI/UX",
                    Sarah: 95,
                    John: 50,
                    Emily: 85,
                    Michael: 60
                  },
                  {
                    skill: "Testing",
                    Sarah: 75,
                    John: 80,
                    Emily: 90,
                    Michael: 75
                  }
                ]}
                keys={["Sarah", "John", "Emily", "Michael"]}
                indexBy="skill"
                maxValue={100}
                margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                curve="linearClosed"
                borderWidth={2}
                borderColor={{ theme: 'grid.line.stroke' }}
                gridLevels={5}
                gridShape="circular"
                gridLabelOffset={36}
                enableDots={true}
                dotSize={8}
                dotColor={{ theme: 'background' }}
                dotBorderWidth={2}
                dotBorderColor={{ from: 'color' }}
                enableDotLabel={true}
                dotLabel="value"
                dotLabelYOffset={-12}
                colors={{ scheme: 'category10' }}
                fillOpacity={0.25}
                blendMode="multiply"
                animate={true}
                motionConfig="wobbly"
                theme={{
                  textColor: '#111827',
                  fontSize: 14,
                  fontWeight: 500,
                  dots: {
                    text: {
                      fontSize: 12,
                      fontWeight: 600,
                      fill: '#111827'
                    }
                  }
                }}
                legends={[
                  {
                    anchor: 'top-left',
                    direction: 'column',
                    translateX: -50,
                    translateY: -40,
                    itemWidth: 80,
                    itemHeight: 20,
                    itemTextColor: '#111827',
                    symbolSize: 12,
                    symbolShape: 'circle',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemTextColor: '#4f46e5'
                        }
                      }
                    ]
                  }
                ]}
              />
            </div>
          </motion.div>

          {/* Resource Allocation Stream */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Project Resource Allocation Stream
            </h3>
            <div className="h-[300px]">
              <ResponsiveStream
                data={[
                  {
                    Project_A: 20,
                    Project_B: 30,
                    Project_C: 25,
                    Project_D: 25
                  },
                  {
                    Project_A: 25,
                    Project_B: 20,
                    Project_C: 30,
                    Project_D: 25
                  },
                  {
                    Project_A: 30,
                    Project_B: 25,
                    Project_C: 20,
                    Project_D: 25
                  }
                ]}
                keys={['Project_A', 'Project_B', 'Project_C', 'Project_D']}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  orient: 'bottom',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Time',
                  legendOffset: 36
                }}
                axisLeft={{
                  orient: 'left',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Allocation',
                  legendOffset: -40
                }}
                offsetType="silhouette"
                colors={{ scheme: 'nivo' }}
                fillOpacity={0.85}
                borderColor={{ theme: 'background' }}
                dotSize={8}
                dotColor={{ from: 'color' }}
                dotBorderWidth={2}
                dotBorderColor={{ from: 'color', modifiers: [['darker', 0.7]] }}
                animate={true}
                motionConfig="stiff"
                legends={[
                  {
                    anchor: 'bottom-right',
                    direction: 'column',
                    translateX: 100,
                    itemWidth: 80,
                    itemHeight: 20,
                    itemTextColor: '#111827',
                    symbolSize: 12,
                    symbolShape: 'circle',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemTextColor: '#4f46e5'
                        }
                      }
                    ]
                  }
                ]}
              />
            </div>
          </motion.div>

          {/* Stats Cards with Animations */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Team Efficiency', value: 94, suffix: '%', color: 'blue' },
              { label: 'Resource Utilization', value: 87, suffix: '%', color: 'green' },
              { label: 'Project Completion', value: 92, suffix: '%', color: 'purple' },
              { label: 'Budget Adherence', value: 96, suffix: '%', color: 'indigo' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className={`bg-${stat.color}-50 dark:bg-${stat.color}-900/30 rounded-xl p-6 shadow-lg`}
              >
                <h4 className={`text-${stat.color}-900 dark:text-${stat.color}-100 text-sm font-semibold`}>
                  {stat.label}
                </h4>
                <div className={`mt-2 flex items-baseline text-${stat.color}-900 dark:text-${stat.color}-100`}>
                  <div className="text-3xl font-bold">
                    <CountUp end={stat.value} duration={2} />
                  </div>
                  <div className="ml-1 text-xl">{stat.suffix}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Update other sections with enhanced colors */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                Optimization Tips
              </h4>
              <ul className="list-disc list-inside text-indigo-800 dark:text-indigo-200 space-y-2">
                <li>Redistribute workload from overloaded team members</li>
                <li>Plan for upcoming project deadlines</li>
                <li>Consider skill-based task allocation</li>
              </ul>
            </div>

            <div className="bg-violet-100 dark:bg-violet-900/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-violet-900 dark:text-violet-100 mb-2">
                Capacity Insights
              </h4>
              <ul className="list-disc list-inside text-violet-800 dark:text-violet-200 space-y-2">
                <li>Team utilization is optimal at 85%</li>
                <li>Buffer time allocated for unexpected tasks</li>
                <li>Cross-training opportunities identified</li>
              </ul>
            </div>

            <div className="bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-fuchsia-900 dark:text-fuchsia-100 mb-2">
                Efficiency Metrics
              </h4>
              <ul className="list-disc list-inside text-fuchsia-800 dark:text-fuchsia-200 space-y-2">
                <li>Sprint velocity increased by 12%</li>
                <li>Resource conflicts reduced to 5%</li>
                <li>Team satisfaction score: 4.2/5</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Workload Details: {selectedMember.member}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedMember)
                    .filter(([key]) => key !== 'member')
                    .map(([day, hours]) => (
                      <div key={day} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {day.toUpperCase()}
                        </div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">
                          {hours}h
                        </div>
                      </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                             rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ResourceManagement; 