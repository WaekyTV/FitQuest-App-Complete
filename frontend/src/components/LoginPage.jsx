import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Github, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Bienvenue sur FitQuest</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Connectez-vous pour continuer votre progression</p>
          </div>

          <div className="space-y-4 mb-8">
            <button className="w-full py-4 bg-gray-900 dark:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
              <Github className="w-5 h-5" /> Continuer avec GitHub
            </button>
            <button className="w-full py-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-600 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Mail className="w-5 h-5" /> Continuer avec Google
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-700"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white dark:bg-gray-800 text-gray-500 uppercase tracking-widest font-bold">Ou</span></div>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-4">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 rounded-2xl outline-none transition-all text-gray-900 dark:text-white font-medium"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-4">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 rounded-2xl outline-none transition-all text-gray-900 dark:text-white font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95 group">
              Se connecter <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-medium">
            Pas encore de compte ? <button className="text-blue-600 font-bold hover:underline">S'inscrire gratuitement</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}