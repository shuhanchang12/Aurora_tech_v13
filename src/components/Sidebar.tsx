import React from 'react';
import { Database, ShieldCheck, Zap, BrainCircuit, LayoutDashboard, Share2, Briefcase, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const Sidebar = ({ activeBloc, setActiveBloc }: { activeBloc: number, setActiveBloc: (id: number) => void }) => {
  const navItems = [
    { id: 0, title: 'Global Operations Dashboard', icon: LayoutDashboard },
    { id: 5, title: 'ERP Architecture Overview', icon: Share2 },
    { id: 2, title: 'Bloc 2: IT Infrastructure', icon: Database },
    { id: 3, title: 'Bloc 3: Global Procurement', icon: Zap },
    { id: 4, title: 'Bloc 4: AI Risk Engine', icon: BrainCircuit },
  ];

  return (
    <div className="w-72 bg-[#0f172a] border-r border-slate-800 text-slate-300 flex flex-col h-full shrink-0 shadow-2xl z-10 relative overflow-hidden">
      {/* Abstract Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="p-6 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Briefcase size={16} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight font-display">AuroraTech</h1>
        </div>
        <p className="text-[10px] text-blue-400 font-mono mt-1 uppercase tracking-widest px-1">Global Supply Chain ERP</p>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="mb-4 px-2 text-[10px] font-semibold font-mono uppercase tracking-widest text-slate-500/80">
            Core Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeBloc === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveBloc(item.id)}
              className="w-full relative group"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-blue-600/10 border border-blue-500/20 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive 
                  ? 'text-blue-400' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}>
                <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-400 drop-shadow-md' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="truncate">{item.title}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-blue-500/50" />}
              </div>
            </button>
          );
        })}
      </nav>

    </div>
  );
};

export default Sidebar;
