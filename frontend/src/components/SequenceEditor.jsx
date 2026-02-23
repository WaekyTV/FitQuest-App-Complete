import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Plus, GripVertical, Trash2, Clock, Save, X } from 'lucide-react';

export default function SequenceEditor({ onClose }) {
  const [exercises, setExercises] = useState([
    { id: '1', name: 'Pompes', duration: 45 },
    { id: '2', name: 'Planche', duration: 30 },
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Éditeur de Séance</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Créez votre propre défi</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <Reorder.Group axis="y" values={exercises} onReorder={setExercises} className="space-y-3">
            {exercises.map((ex) => (
              <Reorder.Item 
                key={ex.id} 
                value={ex}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center gap-4 cursor-grab active:cursor-grabbing border-2 border-transparent hover:border-blue-500/30 transition-all"
              >
                <GripVertical className="text-gray-300" />
                <div className="flex-1">
                  <input 
                    className="bg-transparent font-black tracking-tight text-lg outline-none w-full"
                    value={ex.name}
                    onChange={(e) => setExercises(exercises.map(r => r.id === ex.id ? { ...r, name: e.target.value } : r))}
                  />
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-1.5 rounded-xl shadow-sm">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <input 
                    type="number"
                    className="bg-transparent w-12 font-black text-center outline-none"
                    value={ex.duration}
                  />
                  <span className="text-[10px] font-black text-gray-400 uppercase">s</span>
                </div>
                <button 
                  onClick={() => setExercises(exercises.filter(r => r.id !== ex.id))}
                  className="p-2 text-gray-300 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <button className="w-full mt-6 py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all">
            <Plus className="w-5 h-5" /> AJOUTER UN EXERCICE
          </button>
        </div>

        <div className="p-8 bg-gray-50 dark:bg-gray-800/50 flex gap-4">
          <button className="flex-1 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-200 active:scale-95 transition-all">
            <Save className="w-6 h-6" /> ENREGISTRER LA SÉANCE
          </button>
        </div>
      </motion.div>
    </div>
  );
}