import React from 'react';
import { BrainCircuit } from 'lucide-react';
import Bloc4AIDemo from './demos/Bloc4AIDemo';
import { motion } from 'motion/react';

const Bloc4AISolutions = () => {
  return (
    <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto w-full p-8 lg:p-12 h-full flex flex-col"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
           <div className="flex items-center space-x-4 mb-3">
             <div className="p-3 bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-lg shadow-purple-500/20 text-white rounded-xl">
               <BrainCircuit className="w-7 h-7" />
             </div>
             <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-display">Bloc 4: Enterprise AI Solutions</h1>
           </div>
           <p className="text-slate-600 text-lg max-w-2xl font-sans leading-relaxed">
             Industrialize an end-to-end AI solution: design, deployment, CI/CD, and real-time production monitoring.
           </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative rounded-2xl">
         <Bloc4AIDemo />
      </div>
    </motion.div>
  );
};

export default Bloc4AISolutions;
