import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Target, Activity, Flame, Heart } from 'lucide-react';

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ goal: '', level: '', weight: '', height: '' });

  const steps = [
    {
      title: 'Quel est votre objectif ?',
      options: [
        { id: 'lose', label: 'Perdre du poids', icon: Flame },
        { id: 'muscle', label: 'Prendre du muscle', icon: Activity },
        { id: 'fit', label: 'Être en forme', icon: Heart },
      ]
    },
    {
      title: 'Votre niveau actuel ?',
      options: [
        { id: 'beg', label: 'Débutant', sub: 'Jamais pratiqué' },
        { id: 'int', label: 'Intermédiaire', sub: '1-2 ans de pratique' },
        { id: 'adv', label: 'Avancé', sub: 'Plus de 2 ans' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl">
          <div className="flex justify-between items-center mb-12">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((s) => (
                <div key={s} className={`h-2 w-12 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-100'}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-400">Étape {step + 1} / 4</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-4xl font-black text-gray-900 mb-8">{steps[step].title}</h2>
              <div className="grid grid-cols-1 gap-4">
                {steps[step].options.map((opt) => (
                  <button
                    key={opt.id}
                    className="p-6 border-2 border-gray-100 rounded-3xl flex items-center justify-between hover:border-blue-600 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      {opt.icon && <opt.icon className="w-6 h-6 text-blue-600" />}
                      <div className="text-left">
                        <div className="font-bold text-lg">{opt.label}</div>
                        {opt.sub && <div className="text-sm text-gray-400 font-medium">{opt.sub}</div>}
                      </div>
                    </div>
                    <div className="w-6 h-6 border-2 border-gray-200 rounded-full group-hover:border-blue-600" />
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex justify-between">
            <button 
              onClick={() => setStep(s => Math.max(0, s - 1))}
              className="px-8 py-4 flex items-center gap-2 font-bold text-gray-400 hover:text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" /> Retour
            </button>
            <button 
              onClick={() => setStep(s => Math.min(3, s + 1))}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors"
            >
              Suivant <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}