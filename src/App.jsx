import { useState } from "react";

import "./App.css";
import StatsGrid from "./components/StatsGrid";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProjectsGrid from './components/ProjectsGrid';
import { DarkModeProvider } from './context/DarkModeContext';
import KanbanBoard from "./components/KanbanBoard";
import { TaskProvider } from "./context/TaskContext";
import TaskAnalytics from "./components/TaskAnalytics";
import TaskCalendar from "./components/TaskCalendar";
import TaskTimeline from "./components/TaskTimeline";
import ProjectOverview from "./components/ProjectOverview";
import TeamHub from "./components/TeamHub";
import ResourceManagement from "./components/ResourceManagement";
import ProjectTimeline3D from "./components/ProjectTimeline3D";
import Settings from "./components/Settings";

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
    <DarkModeProvider>
      <TaskProvider >
      <div className="min-h-screen  bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <Header setIsOpen={setSidebarOpen} />
        
        <main className="pt-16 md:pl-64 w-full overflow-x-hidden">
          <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
            <div id="dashboard" className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatsGrid />
            </div>
            
            <div id="analytics" className="w-full">
              <TaskAnalytics />
            </div>
            
            <div id="projects" className="w-full">
              <ProjectOverview />
              <ProjectsGrid />
            </div>
            
            <div id="tasks" className="w-full">
              <KanbanBoard />
            </div>
            
            <div id="team" className="w-full">
              <TeamHub />
              <ResourceManagement />
            </div>
            
            <div id="calendar" className="w-full">
              <TaskCalendar />
            </div>
            
            <div id="timeline" className="w-full">
              <TaskTimeline />
              <ProjectTimeline3D />
            </div>
            
            <div id="settings" className="w-full">
              <Settings />
            </div>
          </div>
        </main>
      </div>
      </TaskProvider>
    </DarkModeProvider>
  );
}

export default App;
