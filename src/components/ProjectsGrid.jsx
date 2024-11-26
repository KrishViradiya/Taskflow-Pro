function ProjectsGrid() {
  const projects = [
    {
      title: "Mobile App Redesign",
      description: "Redesigning the mobile app interface for better user experience",
      progress: 75,
      team: [
        { name: "John D.", color: "bg-blue-500" },
        { name: "Sarah M.", color: "bg-green-500" },
        { name: "Mike R.", color: "bg-purple-500" }
      ],
      dueDate: "Dec 24",
      priority: "High",
      priorityColor: "text-red-500"
    },
    {
      title: "Dashboard Development",
      description: "Creating an analytics dashboard with real-time data",
      progress: 10,
      team: [
        { name: "Alex K.", color: "bg-yellow-500" },
        { name: "Lisa P.", color: "bg-pink-500" }
      ],
      dueDate: "Jan 12",
      priority: "Medium",
      priorityColor: "text-yellow-500"
    },
    // Add more projects as needed
  ];

  return (
    <div className="mt-8 border-t border-purple-600 p-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Active Projects</h2>
        <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg 
                         hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl 
                                    shadow-sm hover:shadow-md transition-shadow duration-300 
                                    border border-gray-100 dark:border-gray-700">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                  {project.title}
                </h3>
                <span className={`text-sm font-medium ${project.priorityColor}`}>
                  {project.priority}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {project.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 dark:bg-blue-500 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Team Members */}
              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  {project.team.map((member, idx) => (
                    <div 
                      key={idx}
                      className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center 
                                text-white text-sm font-medium border-2 border-white dark:border-gray-800`}
                    >
                      {member.name.charAt(0)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Due {project.dueDate}
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="border-t border-gray-100 dark:border-gray-700 p-4">
              <div className="flex justify-between items-center">
                <button className="text-sm text-gray-600 dark:text-gray-400 
                                 hover:text-gray-900 dark:hover:text-white">
                  View Details
                </button>
                <button className="text-sm text-blue-600 dark:text-blue-400 
                                 hover:text-blue-700 dark:hover:text-blue-300">
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsGrid; 