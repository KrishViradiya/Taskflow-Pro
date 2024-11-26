import { useState, useMemo } from 'react';
import { useTask } from '../context/TaskContext';
import TaskModal from './TaskModal';
import FilterBar from './FilterBar';

function KanbanBoard() {
  const { columns, moveTask } = useTask();
  const [draggingItem, setDraggingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    priority: 'all',
    assignee: 'all'
  });

  // Filter tasks based on current filters
  const filteredColumns = useMemo(() => {
    const filtered = {};
    
    Object.entries(columns).forEach(([columnId, column]) => {
      filtered[columnId] = {
        ...column,
        items: column.items.filter(task => {
          // Search term filter
          const matchesSearch = filters.searchTerm === '' ||
            task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            task.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));

          // Priority filter
          const matchesPriority = filters.priority === 'all' ||
            task.priority === filters.priority;

          // Assignee filter
          const matchesAssignee = filters.assignee === 'all' ||
            task.assignee.name === filters.assignee;

          return matchesSearch && matchesPriority && matchesAssignee;
        })
      };
    });

    return filtered;
  }, [columns, filters]);

  const handleDragStart = (item) => {
    setDraggingItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (columnId) => {
    if (!draggingItem) return;
    moveTask(draggingItem.id, columnId);
    setDraggingItem(null);
  };

  return (
    <div className="mt-8 border-t border-purple-600 p-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Task Board</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          + Add Task
        </button>
      </div>

      <FilterBar onFilterChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(filteredColumns).map(([columnId, column]) => (
          <div
            key={columnId}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(columnId)}
          >
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {column.title} ({column.items.length})
            </h3>

            <div className="space-y-3">
              {column.items.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm 
                           border border-gray-200 dark:border-gray-700
                           cursor-move hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {item.title}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded-full 
                      ${item.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                        item.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                        'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                      {item.priority}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 
                                 text-gray-600 dark:text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className={`w-8 h-8 rounded-full ${item.assignee.color} 
                                   flex items-center justify-center text-white text-sm font-medium`}>
                      {item.assignee.name.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Due {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default KanbanBoard; 