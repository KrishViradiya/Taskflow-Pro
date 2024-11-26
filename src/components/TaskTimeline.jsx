import { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTask } from '../context/TaskContext';

// Custom Node Component
const TaskNode = ({ data }) => {
  const priorityColors = {
    High: 'bg-red-100 dark:bg-red-900/30 border-red-500',
    Medium: 'bg-amber-100 dark:bg-amber-900/30 border-amber-500',
    Low: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500'
  };

  return (
    <div className={`px-4 py-2 rounded-lg shadow-sm border ${priorityColors[data.priority]} min-w-[200px]`}>
      <div className="flex flex-col gap-2">
        <div className="font-medium text-gray-800 dark:text-white">
          {data.title}
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-6 h-6 rounded-full ${data.assignee.color} flex items-center justify-center text-white`}>
            {data.assignee.name.charAt(0)}
          </div>
          <span className="text-gray-600 dark:text-gray-300">
            {data.assignee.name}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {new Date(data.dueDate).toLocaleDateString()}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs
                         ${data.priority === 'High' 
                           ? 'bg-red-100 dark:bg-red-900/30 text-red-600' 
                           : data.priority === 'Medium'
                           ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                           : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
            {data.priority}
          </span>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  taskNode: TaskNode,
};

function TaskTimeline() {
  const { columns } = useTask();
  const [selectedNode, setSelectedNode] = useState(null);

  // Create initial nodes and edges
  const getInitialNodes = () => {
    const nodes = [];
    let xPos = 0;
    let yPos = 0;

    Object.entries(columns).forEach(([columnId, column]) => {
      column.items.forEach((task) => {
        nodes.push({
          id: task.id.toString(),
          type: 'taskNode',
          position: { x: xPos, y: yPos },
          data: { ...task },
        });
        yPos += 120;
      });
      xPos += 300;
      yPos = 0;
    });

    return nodes;
  };

  const getInitialEdges = () => {
    const edges = [];
    Object.values(columns).forEach((column) => {
      column.items.forEach((task) => {
        if (task.dependencies) {
          task.dependencies.forEach((depId) => {
            edges.push({
              id: `e${depId}-${task.id}`,
              source: depId.toString(),
              target: task.id.toString(),
              animated: true,
              style: { stroke: '#64748b' },
            });
          });
        }
      });
    });
    return edges;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(getInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(getInitialEdges());

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="mt-8 w-full border-t border-purple-600 p-3">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Task Dependencies
            </h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm rounded-md bg-blue-100 dark:bg-blue-900/30 
                               text-blue-600 dark:text-blue-400">
                Auto Layout
              </button>
              <button className="px-3 py-1 text-sm rounded-md bg-green-100 dark:bg-green-900/30 
                               text-green-600 dark:text-green-400">
                Critical Path
              </button>
            </div>
          </div>

          <div className="h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              fitView
              attributionPosition="bottom-left"
              className="dark:bg-gray-900"
            >
              <Background />
              <Controls />
              <MiniMap 
                nodeColor={node => {
                  switch (node.data.priority) {
                    case 'High': return '#EF4444';
                    case 'Medium': return '#F59E0B';
                    case 'Low': return '#3B82F6';
                    default: return '#6B7280';
                  }
                }}
                maskColor="rgba(0, 0, 0, 0.2)"
                className="dark:bg-gray-800"
              />
            </ReactFlow>
          </div>

          {/* Task Details Panel */}
          {selectedNode && (
            <div className="absolute right-6 top-24 w-80 bg-white dark:bg-gray-800 
                          rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Task Details
                </h3>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Title</label>
                  <div className="text-gray-800 dark:text-white">{selectedNode.data.title}</div>
                </div>

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
                  <div className="text-gray-800 dark:text-white">{selectedNode.data.status}</div>
                </div>

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Dependencies</label>
                  <div className="text-gray-800 dark:text-white">
                    {selectedNode.data.dependencies?.length || 0} tasks
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Blocked By</label>
                  <div className="text-gray-800 dark:text-white">
                    {edges.filter(edge => edge.target === selectedNode.id).length} tasks
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

export default TaskTimeline; 