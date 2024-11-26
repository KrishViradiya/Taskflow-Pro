import { useState } from "react";
import { useTask } from "../context/TaskContext";

function TaskModal({ isOpen, onClose }) {
  const { addTask } = useTask();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignee: { name: "", color: "bg-blue-500" },
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(taskData);
    onClose();
    setTaskData({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
      assignee: { name: "", color: "bg-blue-500" },
      tags: [],
    });
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTaskData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTaskData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Create New Task
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         dark:bg-gray-700 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskData.title}
                onChange={(e) =>
                  setTaskData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         dark:bg-gray-700 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={taskData.description}
                onChange={(e) =>
                  setTaskData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            {/* Priority & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           dark:bg-gray-700 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={taskData.priority}
                  onChange={(e) =>
                    setTaskData((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           dark:bg-gray-700 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={taskData.dueDate}
                  onChange={(e) =>
                    setTaskData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assignee Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         dark:bg-gray-700 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskData.assignee.name}
                onChange={(e) =>
                  setTaskData((prev) => ({
                    ...prev,
                    assignee: { ...prev.assignee, name: e.target.value },
                  }))
                }
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (Press Enter to add)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         dark:bg-gray-700 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {taskData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-sm
                             bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                         dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         transition-colors"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
