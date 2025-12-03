import React from 'react';
import { WBSType } from '../types';
import { NODE_CONFIG } from '../constants';

const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: WBSType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full z-10 shadow-sm">
      <div className="p-5 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">WBS <span className="text-primary">Architect</span></h1>
        <p className="text-xs text-slate-500 mt-1">Drag elements to the canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {Object.values(WBSType).map((type) => {
          const config = NODE_CONFIG[type];
          const Icon = config.icon;
          
          return (
            <div
              key={type}
              className="group flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-primary hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
              onDragStart={(event) => onDragStart(event, type)}
              draggable
            >
              <div className={`p-2 rounded-md ${config.color} text-white`}>
                <Icon size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-700">{config.label}</span>
                <span className="text-[10px] text-slate-400">Add new {config.label.toLowerCase()}</span>
              </div>
            </div>
          );
        })}

        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-500">
          <h3 className="font-semibold text-slate-700 mb-2">Tips</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Drag & drop to add nodes</li>
            <li>Connect bottom handles to top handles to create hierarchy</li>
            <li>Select a node and press Backspace to delete</li>
          </ul>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 text-[10px] text-center text-slate-400">
        v1.0.0 &bull; Local Storage Only
      </div>
    </aside>
  );
};

export default Sidebar;
