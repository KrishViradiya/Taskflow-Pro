import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Tab } from '@headlessui/react';
import { useTask } from '../context/TaskContext';

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Miller',
    role: 'Lead Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    performance: 92,
    tasks: { completed: 24, inProgress: 3 },
    recentActivity: ['Completed UI redesign', 'Started new dashboard layout'],
    availability: 'Available',
    skills: ['UI/UX', 'Figma', 'Prototyping'],
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 2,
    name: 'John Davidson',
    role: 'Frontend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    performance: 88,
    tasks: { completed: 18, inProgress: 5 },
    recentActivity: ['Fixed navigation bug', 'Implemented dark mode'],
    availability: 'In Meeting',
    skills: ['React', 'Tailwind', 'TypeScript'],
    color: 'from-blue-500 to-cyan-500'
  },
  // Add more team members as needed
];

function TeamHub() {
  const { columns } = useTask();
  const [selectedMember, setSelectedMember] = useState(null);
  const [teamStats, setTeamStats] = useState({
    totalCompleted: 0,
    efficiency: 0,
    collaboration: 0
  });

  useEffect(() => {
    calculateTeamStats();
  }, [columns]);

  const calculateTeamStats = () => {
    // Simulate team statistics calculation
    setTeamStats({
      totalCompleted: Object.values(columns).reduce(
        (acc, col) => acc + col.items.filter(task => task.status === 'completed').length,
        0
      ),
      efficiency: Math.floor(Math.random() * 20) + 80, // 80-100%
      collaboration: Math.floor(Math.random() * 30) + 70 // 70-100%
    });
  };

  return (
    <div className="mt-8 border-t border-purple-600 p-3 mx-3">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Team Collaboration Hub
            </h2>
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium">
              {teamMembers.length} Active Members
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Team Performance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Team Performance
              </h3>
              <div className="flex items-center justify-center space-x-8">
                <div className="w-24">
                  <CircularProgressbar
                    value={teamStats.efficiency}
                    text={`${teamStats.efficiency}%`}
                    styles={buildStyles({
                      pathColor: '#3B82F6',
                      textColor: '#3B82F6',
                      trailColor: '#E5E7EB'
                    })}
                  />
                  <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
                </div>
                <div className="w-24">
                  <CircularProgressbar
                    value={teamStats.collaboration}
                    text={`${teamStats.collaboration}%`}
                    styles={buildStyles({
                      pathColor: '#10B981',
                      textColor: '#10B981',
                      trailColor: '#E5E7EB'
                    })}
                  />
                  <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">Collaboration</p>
                </div>
              </div>
            </motion.div>

            {/* Active Projects Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Active Projects
              </h3>
              <div className="space-y-4">
                {Object.entries(columns).map(([key, column], index) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{column.title}</span>
                    <span className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300">
                      {column.items.length} tasks
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Team Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Team Availability
              </h3>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{member.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{member.availability}</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${
                      member.availability === 'Available' 
                        ? 'bg-green-500' 
                        : 'bg-amber-500'
                    }`} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                layoutId={`member-${member.id}`}
                onClick={() => setSelectedMember(member)}
                className={`bg-gradient-to-br ${member.color} rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full border-4 border-white"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-white">{member.name}</h4>
                    <p className="text-white/80">{member.role}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-white/90">
                    <span>Performance</span>
                    <span>{member.performance}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2"
                      style={{ width: `${member.performance}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/20 rounded-full text-xs text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
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
              layoutId={`member-${selectedMember.id}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full"
            >
              {/* Modal content */}
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {selectedMember.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedMember.role}</p>
                </div>
              </div>

              <Tab.Group>
                <Tab.List className="flex space-x-2 mb-6">
                  {['Overview', 'Activity', 'Performance'].map((tab) => (
                    <Tab
                      key={tab}
                      className={({ selected }) =>
                        `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`
                      }
                    >
                      {tab}
                    </Tab>
                  ))}
                </Tab.List>

                <Tab.Panels>
                  <Tab.Panel>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Current Tasks
                        </h4>
                        <div className="flex justify-between text-gray-800 dark:text-white">
                          <span>Completed</span>
                          <span>{selectedMember.tasks.completed}</span>
                        </div>
                        <div className="flex justify-between text-gray-800 dark:text-white">
                          <span>In Progress</span>
                          <span>{selectedMember.tasks.inProgress}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-400"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="space-y-4">
                      {selectedMember.recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <p className="text-gray-800 dark:text-white">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Overall Performance
                        </h4>
                        <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                          <div
                            className="h-4 bg-blue-500 rounded-full"
                            style={{ width: `${selectedMember.performance}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TeamHub;