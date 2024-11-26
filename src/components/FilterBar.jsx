import { useState } from 'react';
import { useTask } from '../context/TaskContext';

function FilterBar({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');
  const { columns } = useTask();

  // Get unique assignees from all tasks
  const getAllAssignees = () => {
    const assignees = new Set();
    Object.values(columns).forEach(column => {
      column.items.forEach(task => {
        assignees.add(task.assignee.name);
      });
    });
    return Array.from(assignees);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    onFilterChange({
      searchTerm: value,
      priority: selectedPriority,
      assignee: selectedAssignee
    });
  };

  const handlePriorityChange = (value) => {
    setSelectedPriority(value);
    onFilterChange({
      searchTerm,
      priority: value,
      assignee: selectedAssignee
    });
  };

  const handleAssigneeChange = (value) => {
    setSelectedAssignee(value);
    onFilterChange({
      searchTerm,
      priority: selectedPriority,
      assignee: value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg dark:bg-gray-700 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={selectedPriority}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg dark:bg-gray-700 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div>
          <select
            value={selectedAssignee}
            onChange={(e) => handleAssigneeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                     rounded-lg dark:bg-gray-700 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Assignees</option>
            {getAllAssignees().map((assignee, index) => (
              <option key={index} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterBar; 