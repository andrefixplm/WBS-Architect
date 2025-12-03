import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
} from 'reactflow';

import Sidebar from './components/Sidebar';
import CustomWBSNode from './components/CustomWBSNode';
import Toolbar from './components/Toolbar';
import PropertyPanel from './components/PropertyPanel';
import { INITIAL_NODES, INITIAL_EDGES, NODE_CONFIG } from './constants';
import { WBSType, WBSNode, WBSNodeData } from './types';
import { calculateWBSCodes, exportToJSON, exportToPLMXML } from './services/wbsService';

const nodeTypes = {
  wbsNode: CustomWBSNode,
};

const WBSFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<WBSNodeData>(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<WBSNode | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Recalculate WBS codes whenever topology changes (nodes/edges) or user moves nodes (reordering)
  useEffect(() => {
    // Calculate codes based on current structure
    const updatedNodes = calculateWBSCodes(nodes as WBSNode[], edges);
    
    // Check if codes actually changed to avoid infinite loops if setNodes triggers this
    const hasChanges = updatedNodes.some((node, i) => {
        const original = nodes.find(n => n.id === node.id);
        // We only care if the wbsCode changed, not other data
        return original && original.data.wbsCode !== node.data.wbsCode;
    });

    if (hasChanges) {
        setNodes(nds => nds.map(n => {
            const updated = updatedNodes.find(un => un.id === n.id);
            // Preserve other properties like selected state or position that might have changed concurrently
            return updated ? { ...n, data: { ...n.data, wbsCode: updated.data.wbsCode } } : n;
        }));
    }
  }, [edges, nodes.length, refreshTrigger, setNodes]); // Removed 'nodes' from dependency to avoid loop, added refreshTrigger

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#94a3b8' } }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow') as WBSType;
      
      if (!type || !Object.values(WBSType).includes(type)) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowWrapper.current.getBoundingClientRect().left,
        y: event.clientY - reactFlowWrapper.current.getBoundingClientRect().top,
      });

      const newNode: Node<WBSNodeData> = {
        id: `node_${Date.now()}`,
        type: 'wbsNode',
        position,
        data: { 
            label: NODE_CONFIG[type].defaultLabel, 
            type: type,
            description: '',
            progress: 0,
            wbsCode: '' 
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as WBSNode);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Trigger WBS recalculation when dragging stops (to handle reordering)
  const onNodeDragStop = useCallback(() => {
    setRefreshTrigger(t => t + 1);
  }, []);

  const updateNodeData = useCallback((id: string, data: Partial<WBSNodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          // If updating label or data, update local state
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
          if (selectedNode?.id === id) {
              setSelectedNode(updatedNode as WBSNode);
          }
          return updatedNode;
        }
        return node;
      })
    );
  }, [setNodes, selectedNode]);

  const handleExportJSON = () => {
    const jsonString = exportToJSON(nodes as WBSNode[], edges);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wbs-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportXML = () => {
    const xmlString = exportToPLMXML(nodes as WBSNode[], edges);
    const blob = new Blob([xmlString], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wbs-export-${Date.now()}.plmxml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas">
      <Sidebar />
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#cbd5e1" />
          <Controls className="!bg-white !shadow-md !border-slate-200 !text-slate-600 !rounded-lg overflow-hidden" />
          
          <Panel position="top-right">
             <Toolbar onExportJSON={handleExportJSON} onExportXML={handleExportXML} />
          </Panel>
        </ReactFlow>

        {selectedNode && (
            <PropertyPanel 
                selectedNode={selectedNode} 
                onUpdateNode={updateNodeData} 
                onClose={() => setSelectedNode(null)} 
            />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <WBSFlow />
    </ReactFlowProvider>
  );
}