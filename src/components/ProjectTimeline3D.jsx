import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { useSpring, animated } from '@react-spring/web';
import gsap from 'gsap';

function Milestone({ position, text, progress, isActive, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: hovered ? 1.2 : 1,
        y: hovered ? 1.2 : 1,
        z: hovered ? 1.2 : 1,
        duration: 0.3
      });
    }
  }, [hovered]);

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={isActive ? "#4f46e5" : "#94a3b8"}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <Float speed={5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, 1, 0]}
          fontSize={0.3}
          color={isActive ? "#4f46e5" : "#64748b"}
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
        <Text
          position={[0, 0.7, 0]}
          fontSize={0.2}
          color={isActive ? "#4f46e5" : "#64748b"}
          anchorX="center"
          anchorY="middle"
        >
          {`${progress}%`}
        </Text>
      </Float>
    </group>
  );
}

function ProjectTimeline3D() {
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      name: "Project Initiation",
      progress: 100,
      status: "completed",
      date: "2024-01-15",
      position: [-4, 0, 0]
    },
    {
      id: 2,
      name: "Design Phase",
      progress: 85,
      status: "in-progress",
      date: "2024-02-01",
      position: [-2, 0, 0]
    },
    {
      id: 3,
      name: "Development",
      progress: 60,
      status: "in-progress",
      date: "2024-02-15",
      position: [0, 0, 0]
    },
    {
      id: 4,
      name: "Testing",
      progress: 30,
      status: "in-progress",
      date: "2024-03-01",
      position: [2, 0, 0]
    },
    {
      id: 5,
      name: "Deployment",
      progress: 0,
      status: "pending",
      date: "2024-03-15",
      position: [4, 0, 0]
    }
  ]);

  return (
    <div className="mt-8 w-full border-t border-purple-600 p-3">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Project Timeline & Milestones
            </h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                Add Milestone
              </button>
            </div>
          </div>

          {/* 3D Timeline View */}
          <div className="h-[500px] rounded-xl overflow-hidden bg-gradient-to-b from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <Suspense fallback={null}>
                {milestones.map((milestone, index) => (
                  <Milestone
                    key={milestone.id}
                    position={milestone.position}
                    text={milestone.name}
                    progress={milestone.progress}
                    isActive={selectedMilestone?.id === milestone.id}
                    onClick={() => setSelectedMilestone(milestone)}
                  />
                ))}
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  maxPolarAngle={Math.PI / 2}
                  minPolarAngle={Math.PI / 3}
                />
              </Suspense>
            </Canvas>
          </div>

          {/* Milestone Details */}
          <AnimatePresence>
            {selectedMilestone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
                      {selectedMilestone.name}
                    </h3>
                    <p className="mt-2 text-indigo-700 dark:text-indigo-300">
                      Due Date: {selectedMilestone.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedMilestone.progress}%
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium
                      ${selectedMilestone.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                        : selectedMilestone.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
                      }`}
                    >
                      {selectedMilestone.status}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tasks Completed
                    </h4>
                    <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      12/15
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Team Members
                    </h4>
                    <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      8
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Days Remaining
                    </h4>
                    <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                      5
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ProjectTimeline3D; 