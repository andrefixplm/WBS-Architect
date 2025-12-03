import React from 'react';
import { Download, Upload, Maximize, FileJson, FileCode } from 'lucide-react';

interface ToolbarProps {
  onExportJSON: () => void;
  onExportXML: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onExportJSON, onExportXML }) => {
  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-slate-200/60">
      
      <div className="h-6 w-px bg-slate-200 mx-1"></div>

      <button
        onClick={onExportJSON}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-md transition-colors"
        title="Export to JSON"
      >
        <FileJson size={16} />
        <span className="hidden sm:inline">JSON</span>
      </button>

      <button
        onClick={onExportXML}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-md transition-colors"
        title="Export to PLMXML"
      >
        <FileCode size={16} />
        <span className="hidden sm:inline">XML</span>
      </button>
      
      <div className="h-6 w-px bg-slate-200 mx-1"></div>

       <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-md transition-colors"
        onClick={() => alert("Fit View logic not implemented in this snippet but built-in to ReactFlow controls")}
      >
        <Maximize size={16} />
      </button>

    </div>
  );
};

export default Toolbar;
