import React, { useState } from 'react';
import { Plus, Search, Filter, Grid, List as ListIcon } from 'lucide-react';
import SavedSequenceCard from './SavedSequenceCard';
import SequenceEditor from './SequenceEditor';

export default function SequenceManager() {
  const [showEditor, setShowEditor] = useState(false);
  const [sequences] = useState([
    { id: 1, name: 'Cardio Brutal', totalTime: 25, exercises: [1, 2, 3, 4] },
    { id: 2, name: 'Abdos en béton', totalTime: 15, exercises: [1, 2, 3] },
    { id: 3, name: 'Full Body Explosif', totalTime: 45, exercises: [1, 2, 3, 4, 5, 6] },
  ]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter italic">Mes Séances</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mt-1">Gérez vos entraînements personnalisés</p>
        </div>
        <button 
          onClick={() => setShowEditor(true)}
          className="px-8 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" /> CRÉER UNE SÉANCE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sequences.map(seq => (
          <SavedSequenceCard key={seq.id} sequence={seq} />
        ))}
      </div>

      {showEditor && <SequenceEditor onClose={() => setShowEditor(false)} />}
    </div>
  );
}