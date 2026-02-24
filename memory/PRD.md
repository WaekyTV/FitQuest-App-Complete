# FITQUEST - Application Fitness & Nutrition avec IA

## Problem Statement
Application sportive FITQUEST complète avec génération de repas par IA, planning sportif, suivi des performances, système XP avec sons rétro, trophées, défis hebdomadaires et onboarding personnalisé.

## Core Features Implemented ✅

### Authentification
- ✅ Google OAuth avec Emergent Auth
- ✅ Sessions persistantes avec cookies

### Onboarding Personnalisé
Flow de 13 étapes pour configurer le profil nutritionnel :
1. Objectif Principal (perte/maintien/prise de poids, muscle, endurance)
2. Objectifs Secondaires (bien-être, énergie, santé intestinale, etc.)
3. Expérience Comptage Calories
4. Connaissance Jeûne Intermittent
5. Informations Personnelles (genre, âge, taille, poids, objectif)
6. Niveau d'Activité & Rythme de Perte
7. Configuration des Rappels
8. Repas par Jour & Horaires
9. Lieu des Repas (maison, livraison, extérieur)
10. Régime Alimentaire (équilibré, végétarien, keto, etc.)
11. Restrictions Alimentaires
12. Habitudes à Changer
13. Récapitulatif & Validation

### Nutrition
- ✅ Génération de repas IA (Gemini 2.5 Flash via Emergent LLM Key)
- ✅ Calcul automatique TDEE et objectifs macros
- ✅ Régimes multiples (végétarien, vegan, paléo, keto, etc.)
- ✅ Restrictions alimentaires personnalisables

### Sport
- ✅ **334 exercices** (yoga, crossfit, TRX, machines...)
- ✅ Création de séances personnalisées
- ✅ Recherche d'exercices avancée
- ✅ 6 programmes d'entraînement prédéfinis
- ✅ **Lecteur vidéo YouTube embarqué** (iframe) dans modal exercice
- ✅ 16 vidéos cassées corrigées
- ✅ Chronomètre d'intervalle professionnel avec:
  - Format MM:SS pour saisie de durée
  - Notifications push en arrière-plan
  - Sons vocaux et bips

### Suivi Quotidien
- ✅ **Hydratation** - Verres d'eau cliquables (objectif personnalisable)
- ✅ **Tracker de Pas** - Objectif modifiable (défaut: 10 000)
- ✅ **Rappels** - Entraînement, eau, personnalisés

### Défis Hebdomadaires (NOUVEAU)
- ✅ 10 templates de défis prédéfinis
- ✅ Catégories: Hydratation, Pas, Entraînement, Streak, Nutrition
- ✅ Récompenses XP (150 à 700 XP)
- ✅ Suivi de progression
- ✅ Notifications de complétion
- ✅ Son de victoire 8-bit

### Gamification
- ✅ Système XP dynamique avec sons rétro 8-bit
- ✅ **125 trophées** avec filtres par catégorie
- ✅ **6 sons 8-bit**: XP Gain, Level Up, Mega Level, Trophy, Notification, Challenge Complete
- ✅ Badges et niveaux

### Paramètres (NOUVEAU)
- ✅ **Audio**: Volume, activation/désactivation sons, test de tous les sons
- ✅ **Notifications**: Activation push, test de notification
- ✅ **Rappel de streak**: Notification automatique si pas d'entraînement, heure personnalisable
- ✅ **Compte**: Infos utilisateur, export données JSON
- ✅ **Gestion Historique**: Suppression sélective (entraînements/repas/pas/eau/tout)
- ✅ **Zone Danger**: Suppression de compte

### Données & Export
- ✅ Export JSON complet des données
- ✅ **Export PDF** avec jsPDF (rapport utilisateur avec profil, stats, entraînements, repas)
- ✅ Suppression d'historique (séances, repas, pas, eau)
- ✅ Danger Zone (suppression de compte)

### PWA - Mode Hors-ligne (NOUVEAU 14 Fév 2026)
- ✅ **manifest.json** configuré pour installation sur mobile/desktop
- ✅ **Service Worker** avec stratégie network-first et cache fallback
- ✅ Icône personnalisée (⚡ sur fond noir)
- ✅ Support Apple iOS (apple-mobile-web-app tags)
- ✅ Background sync ready
- ✅ Push notifications ready

## Latest Updates (14 Fév 2026)

### P1: Amélioration Vue Programme Sportif (NOUVEAU ✅)

#### Calendrier de Suivi Programme Actif
- **Mini calendrier** intégré dans la carte du programme actif
- Jours d'entraînement marqués en **vert (#B0E301)**
- Navigation mois précédent/suivant
- Légende explicative
- Récupère les données via `/api/performance/workout-days`

#### Visualisation Exercices avec Vidéos
- **Boutons cliquables** sur chaque exercice suggéré dans les détails du programme
- **Modal d'exercice amélioré** avec:
  - Lecteur YouTube embarqué (iframe)
  - Infos: catégorie, difficulté, muscles ciblés
  - Description détaillée
  - Instructions numérotées
  - Conseils avec icône étoile
  - Lien externe vers YouTube

### P2: Fonctionnalités Avancées (NOUVEAU ✅)

#### Export PDF
- Bouton **"Exporter en PDF"** dans la page Paramètres
- Rapport PDF généré avec jsPDF incluant:
  - En-tête FitQuest coloré
  - Profil utilisateur (nom, email, objectif, niveau, poids, taille)
  - Statistiques globales
  - Liste des derniers entraînements
  - Liste des derniers repas
  - Pagination automatique
  - Footer avec numéro de page

#### Mode Hors-ligne (PWA)
- Application installable sur mobile et desktop
- Cache des pages statiques
- Fallback vers le cache en cas de perte de connexion
- Service worker enregistré automatiquement

### 5 NOUVELLES FONCTIONNALITÉS MAJEURES (VÉRIFIÉ ✅)

#### 1. Suivi du Sommeil (/sommeil)
- **Page SleepPage.jsx** avec formulaire complet
- **Champs**: Date, Heure coucher, Heure réveil, Qualité (1-5 étoiles), Notes
- **Statistiques**: Durée moyenne, Qualité moyenne, Objectif (8h), Nuits suivies
- **Barre de progression** vers l'objectif de sommeil
- **Liste des nuits** avec édition et suppression
- **XP**: +5 XP par entrée enregistrée
- **API**: `GET/POST /api/sleep`, `DELETE /api/sleep/{date}`

#### 2. Calendrier de Progression (/progression)
- **Page ProgressionPage.jsx** avec vue calendrier mensuelle
- **Couleurs par jour**: Vert (jour complet), Jaune (partiel), Rouge (peu actif)
- **Indicateurs par jour**: Points pour Workout, Repas, Sommeil
- **Statistiques mensuelles**: Total entraînements, Calories, Qualité sommeil, Jours actifs
- **Détails du jour**: Séances, Calories, Protéines, Sommeil, Pas
- **Navigation**: Mois précédent/suivant
- **API**: `GET /api/progression/calendar?month=N&year=N`

#### 3. Planning Intelligent avec IA (/planning)
- **Page SmartPlanningPage.jsx** avec génération IA
- **4 objectifs**: Forme Générale, Prise de Muscle, Perte de Graisse, Endurance
- **Jours par semaine**: 2 à 6 jours configurables
- **Plan généré**: Nom du jour, Focus, Exercices avec Sets/Reps/Repos
- **Conseils IA**: Tips personnalisés générés par l'IA
- **API**: `POST /api/planning/generate`, `GET /api/planning/current`, `GET /api/planning/history`

#### 4. Import/Export de Programmes JSON (/programmes)
- **Bouton "Importer JSON"** dans ProgramsPage.jsx
- **Modale d'import**: Textarea pour coller le JSON du programme
- **Export JSON**: Téléchargement du programme au format JSON
- **Copier dans presse-papier**: Bouton de copie rapide
- **XP**: +25 XP par programme importé
- **API**: `POST /api/programs/import`, `GET /api/programs/export/{id}`

#### 5. Analyse Nutritionnelle par IA (/repas)
- **Bouton "Analyse IA"** dans MealsPage.jsx
- **Score nutritionnel** calculé par l'IA (0-100)
- **Points forts**: Liste des bonnes habitudes détectées
- **Améliorations**: Liste des axes d'amélioration
- **Suggestions de repas**: Repas recommandés avec calories et protéines
- **Conseils pratiques**: Tips personnalisés selon l'objectif
- **API**: `POST /api/nutrition/analyze`

#### Navigation mise à jour (Sidebar.jsx)
Nouveaux liens ajoutés:
- **Planning IA** (icône Brain) → /planning
- **Progression** (icône CalendarDays) → /progression
- **Sommeil** (icône Moon) → /sommeil

### Score Nutritionnel avec Badges (NOUVEAU)
- **Score quotidien** basé sur: calories (40%), protéines (30%), équilibre macros (30%)
- **Score hebdomadaire** avec statistiques détaillées
- **5 badges nutritionnels** à débloquer et réclamer :
  | Badge | Condition | XP |
  |-------|-----------|-----|
  | Premier Équilibre 🥗 | 1 jour équilibré | 50 |
  | Roi des Protéines 💪 | 7 jours objectif protéines | 200 |
  | Équilibriste ⚖️ | 10 jours équilibrés | 300 |
  | Maître des Calories 🔥 | 14 jours objectif calories | 400 |
  | Champion Nutrition 🏆 | 30 jours score > 80% | 1000 |
- Interface intégrée sur la page **Repas** avec barres de progression
- API: `GET /api/nutrition/score`, `POST /api/nutrition/claim-badge/{badge_id}`

### Pages Défis et Rappels (VÉRIFIÉ)
- **Page Défis** : 10 templates de défis (hydratation, pas, workout, streak, nutrition)
- **Page Rappels** : Création, modification, suppression de rappels avec jours personnalisables
- Templates rapides pour entraînement et hydratation

### Refactorisation Badges de Streak → Page Trophées (NOUVEAU)
- Les **badges de streak** ont été déplacés de la page **Paramètres** vers la page **Trophées**
- La section affiche :
  - Le streak actuel en jours
  - 4 niveaux de badges : 7 jours (100 XP), 30 jours (500 XP), 100 jours (2000 XP), 365 jours (10000 XP)
  - Progression visuelle vers le prochain badge
  - Boutons pour réclamer les récompenses XP
- API utilisées : `GET /api/performance/streak-badges`, `POST /api/performance/claim-streak-badge/{days}`

### Bug Fix: Suppression d'historique (VÉRIFIÉ)
- L'endpoint `DELETE /api/history/all?type={type}` fonctionne correctement
- Types supportés : workouts, meals, steps, hydration, all
- Frontend : `handleDeleteHistory()` dans SettingsPage avec confirmation Dialog

### Bug Fix: Boucle d'onboarding (VÉRIFIÉ)
- Double vérification implémentée :
  1. `user.onboarding_completed === true` depuis le backend
  2. Backup `localStorage` (`fitquest_onboarding_${user.user_id}`)
- L'onboarding ne réapparaît plus après rechargement de page

### Badges de Streak (NOUVEAU)
- **4 niveaux de badges** : 7 jours (100 XP), 30 jours (500 XP), 100 jours (2000 XP), 365 jours (10000 XP)
- Boutons pour **réclamer les récompenses XP** quand un badge est débloqué
- Progression visuelle vers le prochain badge
- API dédiées : `GET /api/performance/streak-badges`, `POST /api/performance/claim-streak-badge/{days}`

### Réorganisation Profil → Paramètres
- Sections déplacées de ProfilePage vers SettingsPage :
  - Mode sombre (toggle)
  - Langue
  - Danger Zone (confirmation SUPPRIMER)
- ProfilePage allégée : ne contient plus que les infos profil et objectifs

### Notifications de Rappel Streak
- **Rappel automatique** si tu n'as pas fait ton entraînement à l'heure choisie
- Toggle on/off dans la page Paramètres
- Sélecteur d'heure personnalisable
- Notification push avec message motivant

### Amélioration Suppression Historique
- Boutons plus visibles et clairs
- Modale de confirmation améliorée avec warning visible
- Feedback utilisateur (toast) après suppression

### Calendrier de Streak (NOUVEAU)
- **Calendrier visuel** sur le Dashboard montrant les jours d'entraînement en vert
- Navigation entre les mois (boutons précédent/suivant)
- Aujourd'hui mis en évidence avec une bordure
- Légende explicative
- Nouvel endpoint API `/api/performance/workout-days` pour récupérer les jours

### Bug Fix: Onboarding Loop (Deuxième Correction)
- Double vérification pour éviter la répétition de l'onboarding au rechargement
- Vérifie `onboarding_completed === true` depuis le backend
- Backup dans `localStorage` pour gérer les race conditions

### Bug Fix: Vidéos YouTube Non Disponibles
- **16 vidéos YouTube cassées** ont été remplacées par des URLs valides
- **Lecteur YouTube embarqué** ajouté dans la modal d'exercice (au lieu d'un simple lien externe)
- Toutes les 334 vidéos sont maintenant vérifiées fonctionnelles

### Gestion de l'Historique (NOUVEAU)
Nouvelle section dans la page Paramètres permettant de supprimer:
- Historique des entraînements
- Historique des repas
- Historique des pas
- Historique de l'hydratation
- Tout l'historique

### Bug Fix: Onboarding Loop
- Corrigé avec `onboardingChecked` state pour éviter la boucle infinie
- L'onboarding ne s'affiche qu'une fois pour les nouveaux utilisateurs

### Système de Défis Hebdomadaires
10 défis disponibles avec récompenses XP:
| Défi | Description | XP |
|------|-------------|-----|
| Hydra Master | 8 verres d'eau x 7 jours | 500 |
| Bien Hydraté | 3 jours d'hydratation | 150 |
| Marcheur Pro | 10k pas x 5 jours | 400 |
| Marathon Hebdo | 50k pas/semaine | 350 |
| Régulier | 3 séances/semaine | 300 |
| Athlète | 5 séances/semaine | 600 |
| Semaine Parfaite | 7 jours connecté | 250 |
| Deux Semaines | 14 jours connecté | 700 |
| Suivi Nutrition | 7 jours repas logués | 350 |
| Objectif Atteint | 5 jours objectif cal | 400 |

### Page Paramètres
Remplace "Test Sons" avec:
- Contrôle du volume (0-100%)
- Activation/désactivation des sons
- Test de tous les sons 8-bit
- Activation des notifications push
- Export des données
- Suppression de compte

## API Endpoints

### Challenges (NOUVEAU)
- `GET /api/challenges` - Défis actifs et complétés
- `GET /api/challenges/stats` - Statistiques
- `POST /api/challenges/start` - Démarrer un défi
- `POST /api/challenges/{id}/claim` - Réclamer récompense
- `PUT /api/challenges/{id}/progress` - Mettre à jour progression

### Auth
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/session`

### User
- `PUT /api/users/me` - Mise à jour profil
- `GET /api/users/me/export` - Export données
- `DELETE /api/users/me` - Supprimer compte

### Exercices
- `GET /api/exercises` - 334 exercices
- `GET /api/exercises/search/query?q={query}` - Recherche

### Hydratation
- `GET /api/hydration`
- `POST /api/hydration/add`
- `POST /api/hydration/remove`

### Steps
- `GET /api/steps`
- `POST /api/steps`
- `PUT /api/steps/target` - Modifier objectif

### Rappels
- `GET /api/reminders`
- `POST /api/reminders`
- `PUT /api/reminders/{id}`
- `DELETE /api/reminders/{id}`
- `PATCH /api/reminders/{id}/toggle`

## Tech Stack
- **Frontend**: React, TailwindCSS, Shadcn/UI, Web Audio API, Web Notifications API
- **Backend**: FastAPI, MongoDB
- **Auth**: Emergent Google OAuth
- **AI**: Emergent LLM Key (Gemini 2.5 Flash)
- **Sons**: Web Audio API (8-bit rétro)

## File Structure
```
frontend/src/
├── components/
│   ├── OnboardingFlow.jsx     # Flow 13 étapes
│   ├── Dashboard.jsx          # Hydratation + Pas + Stats
│   ├── ChronoPage.jsx         # Format MM:SS + notifications
│   ├── ChallengesPage.jsx     # Défis hebdomadaires (NOUVEAU)
│   ├── SettingsPage.jsx       # Paramètres (NOUVEAU)
│   ├── RemindersPage.jsx
│   ├── TrophiesPage.jsx
│   └── ...
├── context/
│   ├── AuthContext.jsx        # + refreshUser
│   └── XPContext.jsx
└── App.js                     # Onboarding check + routes

backend/
├── server.py                  # APIs complètes + challenges
├── exercises_data.py          # 334 exercices
└── trophies.py                # 125 trophées
```

## Test Reports
- `/app/test_reports/iteration_19.json` - 100% passed - 5 nouvelles fonctionnalités (Sommeil, Progression, Planning IA, Import/Export, Analyse Nutrition)
- `/app/test_reports/iteration_18.json` - 100% passed - Score nutritionnel avec badges
- `/app/test_reports/iteration_17.json` - 100% passed - Badges streak refacto
- `/app/test_reports/iteration_16.json` - 100% passed (12/12 backend) - Streak badges + Settings reorganization
- `/app/test_reports/iteration_15.json` - 100% passed (13/13 backend) - History deletion + Streak reminder
- `/app/test_reports/iteration_14.json` - 100% passed (20/20 backend) - Streak calendar + onboarding fix

## Navigation (Sidebar)
1. Accueil
2. Repas
3. Sport
4. Programmes
5. **Planning IA** (NOUVEAU)
6. Chronomètre
7. Défis
8. Trophées
9. Performance
10. **Progression** (NOUVEAU)
11. **Sommeil** (NOUVEAU)
12. Rappels
13. Profil
14. Paramètres

## Next Tasks (P1)
- [ ] Refactorisation backend (server.py → routeurs séparés) - Structure créée mais pas migrée

## Future (P2)
- Améliorer les icônes PWA avec de vraies images PNG
- Notifications push côté serveur
- Sync offline des données avec IndexedDB
- Google Calendar sync (dé-priorisé par utilisateur)

## Completed Tasks ✅
- [x] Score nutritionnel avec badges
- [x] Suivi du sommeil
- [x] Calendrier de progression
- [x] Planning intelligent IA
- [x] Import/Export programmes JSON
- [x] Analyse nutritionnelle IA
- [x] Calendrier suivi programme actif (P1a)
- [x] Modal vidéo exercices amélioré (P1a)
- [x] Export PDF (P2)
- [x] PWA mode hors-ligne (P2)

## Notes Importantes
- **Emergent LLM Key**: Utilisée pour génération repas IA (pas de problème de quota)
- **Onboarding**: S'affiche une seule fois pour les nouveaux utilisateurs
- **Sons 8-bit**: Générés en temps réel avec Web Audio API
