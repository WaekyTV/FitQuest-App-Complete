import React from 'react';
import { Bell, Shield, User, Globe, Moon, ChevronRight, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    { title: 'Compte', items: [
      { name: 'Profil', sub: 'Nom, avatar, informations personnelles', icon: User, color: 'bg-blue-100 text-blue-600' },
      { name: 'Sécurité', sub: 'Mot de passe, double authentification', icon: Shield, color: 'bg-red-100 text-red-600' },
    ]},
    { title: 'Application', items: [
      { name: 'Notifications', sub: 'Alertes séances, rappels repas', icon: Bell, color: 'bg-yellow-100 text-yellow-600' },
      { name: 'Apparence', sub: 'Mode sombre, thème couleur', icon: Moon, color: 'bg-purple-100 text-purple-600' },
      { name: 'Langue', sub: 'Français (FR)', icon: Globe, color: 'bg-green-100 text-green-600' },
    ]}
  ];

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-12">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-gray-900 rounded-2xl text-white"><Sparkles className="w-6 h-6" /></div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Paramètres</h1>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{section.title}</h2>
          <div className="space-y-2">
            {section.items.map((item, i) => (
              <button key={i} className="w-full bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm flex items-center justify-between group border border-gray-100 dark:border-gray-700 hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-lg tracking-tight">{item.name}</div>
                    <div className="text-gray-400 text-sm font-bold">{item.sub}</div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
        <button className="w-full py-5 bg-gray-50 dark:bg-gray-800 text-red-500 font-black tracking-widest rounded-2xl hover:bg-red-50 transition-colors">
          SUPPRIMER MON COMPTE
        </button>
      </div>
    </div>
  );
}