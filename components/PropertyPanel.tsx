import React, { useEffect, useState } from 'react';
import { WBSNode, WBSNodeData } from '../types';
import { X } from 'lucide-react';

interface PropertyPanelProps {
  selectedNode: WBSNode | null;
  onUpdateNode: (id: string, data: Partial<WBSNodeData>) => void;
  onClose: () => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedNode, onUpdateNode, onClose }) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label);
      setDescription(selectedNode.data.description || '');
      setProgress(selectedNode.data.progress || 0);
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleSave = () => {
    onUpdateNode(selectedNode.id, {
      label,
      description,
      progress: Number(progress)
    });
  };

  return (
    <div className="absolute top-4 right-4 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-30 flex flex-col overflow-hidden animate-in slide-in-from-right fade-in duration-200">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
        <h2 className="font-semibold text-slate-800">Edit Node</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
          <div className="px-3 py-2 bg-slate-100 rounded text-sm text-slate-600 font-medium">
            {selectedNode.data.type}
          </div>
        </div>

         {selectedNode.data.wbsCode && (
            <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">WBS Code</label>
            <div className="px-3 py-2 bg-slate-100 rounded text-sm font-mono text-slate-600">
                {selectedNode.data.wbsCode}
            </div>
            </div>
         )}

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
          <input
            type="text"
            value={label}
            onChange={(e) => {
                setLabel(e.target.value);
                onUpdateNode(selectedNode.id, { label: e.target.value });
            }}
            className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => {
                setDescription(e.target.value);
                onUpdateNode(selectedNode.id, { description: e.target.value });
            }}
            rows={3}
            className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none"
          />
        </div>
        
        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Progress (%)</label>
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress} 
                onChange={(e) => {
                    const val = Number(e.target.value);
                    setProgress(val);
                    onUpdateNode(selectedNode.id, { progress: val });
                }}
                className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right text-xs text-slate-500 mt-1">{progress}%</div>
        </div>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 text-center">
        Changes are auto-saved
      </div>
    </div>
  );
};

export default PropertyPanel;
