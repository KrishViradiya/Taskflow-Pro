import { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext();

const initialColumns = {
  todo: {
    title: "To Do",
    items: [
      {
        id: 1,
        title: "Research competitors",
        priority: "High",
        dueDate: "2024-04-01",
        assignee: { name: "John D.", color: "bg-blue-500" },
        tags: ["Research", "Marketing"],
        dependencies: []
      },
      {
        id: 2,
        title: "Design system update",
        priority: "Medium",
        dueDate: "2024-04-05",
        assignee: { name: "Sarah M.", color: "bg-purple-500" },
        tags: ["Design", "UI"],
        dependencies: [1]
      },
    ],
  },
  inProgress: {
    title: "In Progress",
    items: [
      {
        id: 3,
        title: "Mobile app redesign",
        priority: "High",
        dueDate: "2024-03-30",
        assignee: { name: "Mike R.", color: "bg-green-500" },
        tags: ["Mobile", "Design"],
      },
    ],
  },
  review: {
    title: "In Review",
    items: [
      {
        id: 4,
        title: "Landing page copy",
        priority: "Low",
        dueDate: "2024-03-28",
        assignee: { name: "Lisa P.", color: "bg-pink-500" },
        tags: ["Content", "Marketing"],
      },
    ],
  },
  done: {
    title: "Done",
    items: [],
  },
};

export function TaskProvider({ children }) {
  const [columns, setColumns] = useState(() => {
    // Try to get saved state from localStorage
    const savedColumns = localStorage.getItem("kanbanColumns");
    return savedColumns ? JSON.parse(savedColumns) : initialColumns;
  });

  // Save to localStorage whenever columns change
  useEffect(() => {
    localStorage.setItem("kanbanColumns", JSON.stringify(columns));
  }, [columns]);

  const moveTask = (taskId, targetColumnId) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      let movedTask = null;

      // Find and remove task from its current column
      Object.keys(newColumns).forEach((columnId) => {
        const column = newColumns[columnId];
        const taskIndex = column.items.findIndex((item) => item.id === taskId);
        if (taskIndex !== -1) {
          [movedTask] = column.items.splice(taskIndex, 1);
        }
      });

      // Add task to target column
      if (movedTask) {
        newColumns[targetColumnId].items.push(movedTask);
      }

      return newColumns;
    });
  };

  const addTask = (task) => {
    setColumns((prev) => ({
      ...prev,
      todo: {
        ...prev.todo,
        items: [...prev.todo.items, { ...task, id: Date.now() }],
      },
    }));
  };

  const updateTask = (taskId, updatedTask) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      Object.keys(newColumns).forEach((columnId) => {
        newColumns[columnId].items = newColumns[columnId].items.map((item) =>
          item.id === taskId ? { ...item, ...updatedTask } : item
        );
      });
      return newColumns;
    });
  };

  const deleteTask = (taskId) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      Object.keys(newColumns).forEach((columnId) => {
        newColumns[columnId].items = newColumns[columnId].items.filter(
          (item) => item.id !== taskId
        );
      });
      return newColumns;
    });
  };

  const updateTaskDependencies = (taskId, dependencyId) => {
    setColumns(prev => {
      const newColumns = { ...prev };
      
      // Find the task and update its dependencies
      Object.keys(newColumns).forEach(columnId => {
        const taskIndex = newColumns[columnId].items.findIndex(
          item => item.id === taskId
        );
        
        if (taskIndex !== -1) {
          const task = newColumns[columnId].items[taskIndex];
          const dependencies = task.dependencies || [];
          
          if (!dependencies.includes(dependencyId)) {
            newColumns[columnId].items[taskIndex] = {
              ...task,
              dependencies: [...dependencies, dependencyId]
            };
          }
        }
      });
      
      return newColumns;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        columns,
        moveTask,
        addTask,
        updateTask,
        deleteTask,
        updateTaskDependencies
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
