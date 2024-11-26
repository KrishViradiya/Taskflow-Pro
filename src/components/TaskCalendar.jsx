import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useTask } from "../context/TaskContext";

function TaskCalendar() {
  const { columns } = useTask();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarHeight, setCalendarHeight] = useState(800);

  // Adjust calendar height based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // mobile
        setCalendarHeight(600);
      } else {
        setCalendarHeight(800);
      }
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Transform tasks into calendar events
  const events = Object.values(columns).flatMap((column) =>
    column.items.map((task) => ({
      id: task.id,
      title: task.title,
      start: task.dueDate,
      backgroundColor: getEventColor(task.priority, column.title),
      borderColor: getEventColor(task.priority, column.title),
      extendedProps: {
        priority: task.priority,
        status: column.title,
        assignee: task.assignee,
        tags: task.tags,
      },
    }))
  );

  function getEventColor(priority, status) {
    if (status === "Done") return "#10B981"; // Green
    switch (priority) {
      case "High":
        return "#EF4444"; // Red
      case "Medium":
        return "#F59E0B"; // Amber
      case "Low":
        return "#3B82F6"; // Blue
      default:
        return "#6B7280"; // Gray
    }
  }

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  return (
    <div className="mt-8 w-full border-t border-purple-600 p-3">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Task Calendar
          </h2>

          {/* Calendar with responsive settings */}
          <div className="task-calendar overflow-x-auto">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              height="auto"
              contentHeight={800}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
              }}
              classNames={{
                view: 'dark:text-white'
              }}
            />
          </div>

          {/* Modal with improved mobile styling */}
          {selectedEvent && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div
                className="fixed inset-0 bg-black/50 dark:bg-black/70"
                onClick={() => setSelectedEvent(null)}
              />
              <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 p-4 md:p-6">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-gray-500 
                             dark:hover:text-gray-300 p-2"
                  >
                    <svg
                      className="h-5 w-5 md:h-6 md:w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4 pr-8">
                    {selectedEvent.title}
                  </h3>

                  <div className="space-y-3 text-sm md:text-base">
                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 w-24">
                        Due Date:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {new Date(selectedEvent.start).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 w-24">
                        Priority:
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium
                        ${
                          selectedEvent.extendedProps.priority === "High"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            : selectedEvent.extendedProps.priority === "Medium"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        }
                      `}
                      >
                        {selectedEvent.extendedProps.priority}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 w-24">
                        Status:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {selectedEvent.extendedProps.status}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 w-24">
                        Assignee:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {selectedEvent.extendedProps.assignee}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-500 dark:text-gray-400 w-24">
                        Tags:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {selectedEvent.extendedProps.tags.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCalendar;
