"""
Complete database of 150+ exercises covering all gym machines and equipment.
Includes exercises for all muscle groups with detailed instructions.
"""

def get_all_exercises():
    """Return a comprehensive list of 150+ exercises with all gym machines and equipment."""
    return [
        # ==================== PECTORAUX (CHEST) - 20 exercices ====================
        {
            "exercise_id": "ex_bench_press_barbell",
            "name": "Développé Couché Barre",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "épaules avant"],
            "description": "Exercice fondamental pour développer la force et la masse des pectoraux.",
            "instructions": [
                "Allongez-vous sur un banc plat, pieds au sol",
                "Saisissez la barre avec une prise légèrement plus large que les épaules",
                "Descendez la barre jusqu'à toucher le milieu de la poitrine",
                "Poussez la barre vers le haut jusqu'à l'extension complète des bras"
            ],
            "tips": ["Gardez les omoplates serrées", "Ne rebondissez pas la barre sur la poitrine"],
            "video_url": "https://www.youtube.com/watch?v=rT7DgCr-3pg",
            "difficulty": "intermédiaire",
            "equipment": ["banc plat", "barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_bench_press_dumbbell",
            "name": "Développé Couché Haltères",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "épaules avant"],
            "description": "Variante avec haltères permettant une plus grande amplitude de mouvement.",
            "instructions": [
                "Allongez-vous sur un banc plat avec un haltère dans chaque main",
                "Poussez les haltères vers le haut jusqu'à l'extension des bras",
                "Descendez en contrôlant jusqu'à ce que les coudes soient à 90°"
            ],
            "tips": ["Gardez les poignets droits", "Les haltères peuvent se toucher en haut"],
            "video_url": "https://www.youtube.com/watch?v=VmB1G1K7v94",
            "difficulty": "intermédiaire",
            "equipment": ["banc plat", "haltères"]
        },
        {
            "exercise_id": "ex_incline_press_barbell",
            "name": "Développé Incliné Barre",
            "category": "chest",
            "muscle_groups": ["pectoraux supérieurs", "épaules avant", "triceps"],
            "description": "Cible particulièrement la partie supérieure des pectoraux avec une barre.",
            "instructions": [
                "Réglez le banc à 30-45 degrés",
                "Saisissez la barre avec une prise large",
                "Descendez jusqu'au niveau des clavicules",
                "Poussez vers le haut en contractant les pectoraux"
            ],
            "tips": ["Ne pas incliner le banc trop haut (max 45°)", "Gardez les coudes à 45° du corps"],
            "video_url": "https://www.youtube.com/watch?v=SrqOu55lrYU",
            "difficulty": "intermédiaire",
            "equipment": ["banc incliné", "barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_incline_press_dumbbell",
            "name": "Développé Incliné Haltères",
            "category": "chest",
            "muscle_groups": ["pectoraux supérieurs", "épaules avant", "triceps"],
            "description": "Développé incliné avec haltères pour un meilleur étirement.",
            "instructions": [
                "Réglez le banc à 30-45 degrés",
                "Tenez un haltère dans chaque main",
                "Poussez vers le haut en arc de cercle"
            ],
            "tips": ["Gardez le dos bien appuyé", "Contrôlez la descente"],
            "video_url": "https://www.youtube.com/watch?v=8iPEnn-ltC8",
            "difficulty": "intermédiaire",
            "equipment": ["banc incliné", "haltères"]
        },
        {
            "exercise_id": "ex_decline_press_barbell",
            "name": "Développé Décliné Barre",
            "category": "chest",
            "muscle_groups": ["pectoraux inférieurs", "triceps"],
            "description": "Cible la partie inférieure des pectoraux.",
            "instructions": [
                "Allongez-vous sur un banc décliné, pieds bloqués",
                "Saisissez la barre avec une prise large",
                "Descendez jusqu'au bas de la poitrine",
                "Poussez vers le haut"
            ],
            "tips": ["Utilisez un partenaire pour la sécurité", "Ne descendez pas trop bas"],
            "video_url": "https://www.youtube.com/watch?v=LfyQBUKR8SE",
            "difficulty": "intermédiaire",
            "equipment": ["banc décliné", "barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_decline_press_dumbbell",
            "name": "Développé Décliné Haltères",
            "category": "chest",
            "muscle_groups": ["pectoraux inférieurs", "triceps"],
            "description": "Variante avec haltères pour le bas des pectoraux.",
            "instructions": [
                "Allongez-vous sur un banc décliné",
                "Tenez un haltère dans chaque main",
                "Poussez vers le haut puis descendez lentement"
            ],
            "tips": ["Gardez les coudes légèrement fléchis en bas"],
            "video_url": "https://www.youtube.com/watch?v=OR6WM5Z2Hqs",
            "difficulty": "intermédiaire",
            "equipment": ["banc décliné", "haltères"]
        },
        {
            "exercise_id": "ex_chest_press_machine",
            "name": "Presse Pectorale Machine",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "épaules avant"],
            "description": "Machine guidée pour travailler les pectoraux en toute sécurité.",
            "instructions": [
                "Asseyez-vous sur la machine, dos contre le dossier",
                "Saisissez les poignées à hauteur de poitrine",
                "Poussez vers l'avant jusqu'à l'extension des bras",
                "Revenez lentement à la position de départ"
            ],
            "tips": ["Réglez le siège pour que les poignées soient au niveau de la poitrine", "Ne verrouillez pas les coudes"],
            "video_url": "https://www.youtube.com/watch?v=xUm0BiZCWlQ",
            "difficulty": "débutant",
            "equipment": ["machine presse pectorale"]
        },
        {
            "exercise_id": "ex_pec_deck",
            "name": "Pec Deck (Butterfly Machine)",
            "category": "chest",
            "muscle_groups": ["pectoraux"],
            "description": "Machine d'isolation pour les pectoraux avec mouvement de papillon.",
            "instructions": [
                "Asseyez-vous sur la machine, dos contre le dossier",
                "Placez les avant-bras contre les coussins",
                "Rapprochez les bras devant vous",
                "Contractez les pectoraux puis revenez lentement"
            ],
            "tips": ["Gardez une légère flexion des coudes", "Concentrez-vous sur la contraction"],
            "video_url": "https://www.youtube.com/watch?v=Z57CtFmRMxA",
            "difficulty": "débutant",
            "equipment": ["machine pec deck"]
        },
        {
            "exercise_id": "ex_cable_crossover_high",
            "name": "Crossover Poulie Haute",
            "category": "chest",
            "muscle_groups": ["pectoraux", "pectoraux inférieurs"],
            "description": "Exercice à la poulie pour cibler le bas des pectoraux.",
            "instructions": [
                "Position debout entre deux poulies hautes",
                "Saisissez les poignées, bras écartés",
                "Ramenez les mains vers le bas et devant vous",
                "Contractez les pectoraux en fin de mouvement"
            ],
            "tips": ["Penchez légèrement le buste en avant", "Croisez les mains pour une meilleure contraction"],
            "video_url": "https://www.youtube.com/watch?v=taI4XduLpTk",
            "difficulty": "intermédiaire",
            "equipment": ["poulie haute", "câbles"]
        },
        {
            "exercise_id": "ex_cable_crossover_low",
            "name": "Crossover Poulie Basse",
            "category": "chest",
            "muscle_groups": ["pectoraux", "pectoraux supérieurs"],
            "description": "Variante à la poulie basse pour le haut des pectoraux.",
            "instructions": [
                "Position debout entre deux poulies basses",
                "Saisissez les poignées",
                "Ramenez les mains vers le haut et devant vous",
                "Croisez les mains à hauteur de poitrine"
            ],
            "tips": ["Gardez les coudes légèrement fléchis", "Montez en arc de cercle"],
            "video_url": "https://www.youtube.com/watch?v=WEM9FCIPlxQ",
            "difficulty": "intermédiaire",
            "equipment": ["poulie basse", "câbles"]
        },
        {
            "exercise_id": "ex_cable_fly_flat",
            "name": "Écartés Poulie Position Couchée",
            "category": "chest",
            "muscle_groups": ["pectoraux"],
            "description": "Écartés sur banc avec câbles pour une tension constante.",
            "instructions": [
                "Allongez-vous sur un banc entre deux poulies basses",
                "Saisissez les poignées",
                "Écartez les bras puis ramenez-les au-dessus de la poitrine"
            ],
            "tips": ["Maintenez une légère flexion des coudes", "Tension constante tout au long"],
            "video_url": "https://www.youtube.com/watch?v=Iwe6AmxVf7o",
            "difficulty": "intermédiaire",
            "equipment": ["banc plat", "poulie basse", "câbles"]
        },
        {
            "exercise_id": "ex_dumbbell_fly_flat",
            "name": "Écartés Haltères Plat",
            "category": "chest",
            "muscle_groups": ["pectoraux"],
            "description": "Exercice d'isolation classique pour étirer et contracter les pectoraux.",
            "instructions": [
                "Allongez-vous sur un banc plat avec des haltères",
                "Bras tendus au-dessus de la poitrine",
                "Descendez les bras sur les côtés en arc de cercle",
                "Remontez en serrant les pectoraux"
            ],
            "tips": ["Gardez une légère flexion des coudes", "Contrôlez la descente"],
            "video_url": "https://www.youtube.com/watch?v=eozdVDA78K0",
            "difficulty": "débutant",
            "equipment": ["banc plat", "haltères"]
        },
        {
            "exercise_id": "ex_dumbbell_fly_incline",
            "name": "Écartés Haltères Incliné",
            "category": "chest",
            "muscle_groups": ["pectoraux supérieurs"],
            "description": "Écartés sur banc incliné pour le haut des pectoraux.",
            "instructions": [
                "Banc incliné à 30-45°",
                "Haltères au-dessus de la poitrine",
                "Descendez les bras sur les côtés",
                "Remontez en arc de cercle"
            ],
            "tips": ["Ne descendez pas trop bas", "Gardez le dos bien appuyé"],
            "video_url": "https://www.youtube.com/watch?v=bDaIL_zKbGs",
            "difficulty": "débutant",
            "equipment": ["banc incliné", "haltères"]
        },
        {
            "exercise_id": "ex_pushups_standard",
            "name": "Pompes Classiques",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "épaules", "core"],
            "description": "Exercice polyvalent au poids du corps pour les pectoraux.",
            "instructions": [
                "Position de planche, mains légèrement plus larges que les épaules",
                "Corps aligné de la tête aux talons",
                "Descendez jusqu'à ce que la poitrine frôle le sol",
                "Poussez pour revenir en position haute"
            ],
            "tips": ["Gardez le core engagé", "Ne laissez pas les hanches s'affaisser"],
            "video_url": "https://www.youtube.com/watch?v=IODxDxX7oi4",
            "difficulty": "débutant",
            "equipment": []
        },
        {
            "exercise_id": "ex_pushups_diamond",
            "name": "Pompes Diamant",
            "category": "chest",
            "muscle_groups": ["pectoraux intérieurs", "triceps"],
            "description": "Pompes avec mains rapprochées en forme de diamant.",
            "instructions": [
                "Position de pompe avec les mains jointes formant un diamant",
                "Descendez la poitrine vers les mains",
                "Remontez en extension complète"
            ],
            "tips": ["Gardez les coudes près du corps", "Plus difficile que les pompes classiques"],
            "video_url": "https://www.youtube.com/watch?v=J0DnG1_S92I",
            "difficulty": "intermédiaire",
            "equipment": []
        },
        {
            "exercise_id": "ex_pushups_decline",
            "name": "Pompes Déclinées",
            "category": "chest",
            "muscle_groups": ["pectoraux supérieurs", "épaules", "triceps"],
            "description": "Pompes avec les pieds surélevés pour cibler le haut des pectoraux.",
            "instructions": [
                "Pieds sur un banc ou une marche",
                "Mains au sol, plus larges que les épaules",
                "Descendez la poitrine vers le sol",
                "Remontez en extension"
            ],
            "tips": ["Plus les pieds sont hauts, plus c'est difficile", "Gardez le corps droit"],
            "video_url": "https://www.youtube.com/watch?v=SKPab2YC8BE",
            "difficulty": "intermédiaire",
            "equipment": ["banc", "step"]
        },
        {
            "exercise_id": "ex_pushups_incline",
            "name": "Pompes Inclinées",
            "category": "chest",
            "muscle_groups": ["pectoraux inférieurs", "triceps"],
            "description": "Pompes avec les mains surélevées, plus faciles pour les débutants.",
            "instructions": [
                "Mains sur un banc ou une barre",
                "Corps aligné, pieds au sol",
                "Descendez la poitrine vers le support",
                "Remontez en extension"
            ],
            "tips": ["Excellent pour les débutants", "Ajustez la hauteur selon votre niveau"],
            "video_url": "https://www.youtube.com/watch?v=5O7QVJ4s6iw",
            "difficulty": "débutant",
            "equipment": ["banc", "barre fixe basse"]
        },
        {
            "exercise_id": "ex_dips_chest",
            "name": "Dips Pectoraux",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "épaules"],
            "description": "Dips avec le buste penché en avant pour cibler les pectoraux.",
            "instructions": [
                "Sur des barres parallèles, bras tendus",
                "Penchez le buste vers l'avant",
                "Descendez en fléchissant les coudes",
                "Remontez jusqu'à l'extension complète"
            ],
            "tips": ["Plus vous vous penchez, plus les pectoraux travaillent", "Descendez jusqu'à 90° aux coudes"],
            "video_url": "https://www.youtube.com/watch?v=2z8JmcrW-As",
            "difficulty": "intermédiaire",
            "equipment": ["barres parallèles", "machine à dips"]
        },
        {
            "exercise_id": "ex_smith_bench_press",
            "name": "Développé Couché Smith Machine",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "épaules"],
            "description": "Développé couché sur la machine Smith pour un mouvement guidé.",
            "instructions": [
                "Allongez-vous sous la barre de la Smith Machine",
                "Décrochez la barre et descendez-la sur la poitrine",
                "Poussez vers le haut jusqu'à l'extension"
            ],
            "tips": ["Idéal pour s'entraîner seul en sécurité", "Permet de charger plus lourd"],
            "video_url": "https://www.youtube.com/watch?v=JBypZm5F4vg",
            "difficulty": "débutant",
            "equipment": ["smith machine"]
        },
        {
            "exercise_id": "ex_pullover_dumbbell",
            "name": "Pull-over Haltère",
            "category": "chest",
            "muscle_groups": ["pectoraux", "dorsaux", "triceps"],
            "description": "Exercice polyvalent travaillant pectoraux et dorsaux.",
            "instructions": [
                "Allongez-vous perpendiculairement sur un banc",
                "Tenez un haltère au-dessus de la poitrine",
                "Descendez l'haltère derrière la tête en arc de cercle",
                "Remontez en contractant pectoraux et dorsaux"
            ],
            "tips": ["Gardez une légère flexion des coudes", "Étirez bien en bas du mouvement"],
            "video_url": "https://www.youtube.com/watch?v=FK4rHfWKEac",
            "difficulty": "intermédiaire",
            "equipment": ["banc plat", "haltère"]
        },
        
        # ==================== DOS (BACK) - 22 exercices ====================
        {
            "exercise_id": "ex_pullups",
            "name": "Tractions Pronation",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps", "rhomboïdes"],
            "description": "Exercice roi pour développer le dos en largeur.",
            "instructions": [
                "Suspendez-vous à une barre, prise pronation plus large que les épaules",
                "Tirez-vous vers le haut jusqu'à ce que le menton dépasse la barre",
                "Descendez de manière contrôlée"
            ],
            "tips": ["Initiez le mouvement avec les dorsaux, pas les bras", "Évitez de vous balancer"],
            "video_url": "https://www.youtube.com/watch?v=eGo4IYlbE5g",
            "difficulty": "avancé",
            "equipment": ["barre de traction"]
        },
        {
            "exercise_id": "ex_chinups",
            "name": "Tractions Supination",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps"],
            "description": "Tractions avec prise supination, plus faciles et ciblant les biceps.",
            "instructions": [
                "Suspendez-vous avec les paumes vers vous",
                "Tirez jusqu'à ce que le menton dépasse la barre",
                "Descendez lentement"
            ],
            "tips": ["Plus facile que les tractions pronation", "Excellent pour les biceps aussi"],
            "video_url": "https://www.youtube.com/watch?v=brhRXlOhsAM",
            "difficulty": "intermédiaire",
            "equipment": ["barre de traction"]
        },
        {
            "exercise_id": "ex_pullups_neutral",
            "name": "Tractions Prise Neutre",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps", "brachial"],
            "description": "Tractions avec prise parallèle pour une position naturelle des poignets.",
            "instructions": [
                "Utilisez des poignées parallèles",
                "Tirez-vous vers le haut",
                "Descendez avec contrôle"
            ],
            "tips": ["Moins de stress sur les poignets", "Bon compromis entre pronation et supination"],
            "video_url": "https://www.youtube.com/watch?v=GIhKZFZwmEo",
            "difficulty": "intermédiaire",
            "equipment": ["barre de traction avec poignées neutres"]
        },
        {
            "exercise_id": "ex_lat_pulldown_wide",
            "name": "Tirage Vertical Prise Large",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps"],
            "description": "Alternative aux tractions pour développer la largeur du dos.",
            "instructions": [
                "Asseyez-vous face à la machine, genoux bloqués",
                "Saisissez la barre large en pronation",
                "Tirez la barre vers le haut de la poitrine",
                "Remontez lentement"
            ],
            "tips": ["Ne tirez pas la barre derrière la nuque", "Serrez les omoplates en bas"],
            "video_url": "https://www.youtube.com/watch?v=CAwf7n6Luuc",
            "difficulty": "débutant",
            "equipment": ["machine tirage vertical", "barre large"]
        },
        {
            "exercise_id": "ex_lat_pulldown_close",
            "name": "Tirage Vertical Prise Serrée",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps", "milieu du dos"],
            "description": "Tirage vertical avec prise serrée pour l'épaisseur du dos.",
            "instructions": [
                "Asseyez-vous et saisissez la barre en V",
                "Tirez vers le bas de la poitrine",
                "Serrez les omoplates en bas du mouvement"
            ],
            "tips": ["Excellent pour le milieu du dos", "Gardez le torse légèrement incliné"],
            "video_url": "https://www.youtube.com/watch?v=lueEJGjTuPQ",
            "difficulty": "débutant",
            "equipment": ["machine tirage vertical", "barre en V"]
        },
        {
            "exercise_id": "ex_lat_pulldown_underhand",
            "name": "Tirage Vertical Supination",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps"],
            "description": "Tirage vertical avec prise supination pour plus d'implication des biceps.",
            "instructions": [
                "Saisissez la barre paumes vers vous",
                "Tirez vers le haut de la poitrine",
                "Concentrez-vous sur la contraction des dorsaux"
            ],
            "tips": ["Permet un meilleur étirement des dorsaux", "Les biceps sont très sollicités"],
            "video_url": "https://www.youtube.com/watch?v=JEb-dwU3VMs",
            "difficulty": "débutant",
            "equipment": ["machine tirage vertical", "barre droite"]
        },
        {
            "exercise_id": "ex_seated_cable_row",
            "name": "Tirage Horizontal Poulie Basse",
            "category": "back",
            "muscle_groups": ["dorsaux", "rhomboïdes", "trapèzes", "biceps"],
            "description": "Exercice complet pour l'épaisseur du dos à la poulie.",
            "instructions": [
                "Asseyez-vous face à la poulie, pieds sur les supports",
                "Saisissez la poignée en V",
                "Tirez vers le nombril en gardant le dos droit",
                "Revenez lentement en étirant les dorsaux"
            ],
            "tips": ["Ne vous penchez pas trop en arrière", "Serrez les omoplates à chaque répétition"],
            "video_url": "https://www.youtube.com/watch?v=GZbfZ033f74",
            "difficulty": "débutant",
            "equipment": ["poulie basse", "poignée en V"]
        },
        {
            "exercise_id": "ex_single_arm_cable_row",
            "name": "Tirage Horizontal Unilatéral",
            "category": "back",
            "muscle_groups": ["dorsaux", "rhomboïdes"],
            "description": "Tirage à un bras pour corriger les déséquilibres.",
            "instructions": [
                "Debout face à une poulie basse",
                "Saisissez la poignée d'une main",
                "Tirez vers la hanche en tournant légèrement le torse",
                "Alternez les côtés"
            ],
            "tips": ["Permet de travailler chaque côté indépendamment", "Excellent pour la symétrie"],
            "video_url": "https://www.youtube.com/watch?v=ORssPzSDxWc",
            "difficulty": "intermédiaire",
            "equipment": ["poulie basse", "poignée simple"]
        },
        {
            "exercise_id": "ex_barbell_row",
            "name": "Rowing Barre Buste Penché",
            "category": "back",
            "muscle_groups": ["dorsaux", "rhomboïdes", "trapèzes", "biceps"],
            "description": "Exercice complet pour l'épaisseur du dos avec barre.",
            "instructions": [
                "Penchez-vous en avant, dos plat, genoux légèrement fléchis",
                "Saisissez la barre en pronation",
                "Tirez la barre vers le nombril",
                "Descendez en contrôlant"
            ],
            "tips": ["Gardez le dos droit tout au long", "Ne vous relevez pas pour tricher"],
            "video_url": "https://www.youtube.com/watch?v=FWJR5Ve8bnQ",
            "difficulty": "intermédiaire",
            "equipment": ["barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_dumbbell_row",
            "name": "Rowing Haltère",
            "category": "back",
            "muscle_groups": ["dorsaux", "rhomboïdes", "biceps"],
            "description": "Travail unilatéral du dos pour corriger les déséquilibres.",
            "instructions": [
                "Un genou et une main sur un banc",
                "Saisissez l'haltère avec l'autre main",
                "Tirez l'haltère vers la hanche",
                "Descendez en étirant le dorsal"
            ],
            "tips": ["Gardez le dos parallèle au sol", "Évitez la rotation du tronc"],
            "video_url": "https://www.youtube.com/watch?v=pYcpY20QaE8",
            "difficulty": "débutant",
            "equipment": ["haltère", "banc plat"]
        },
        {
            "exercise_id": "ex_t_bar_row",
            "name": "Rowing T-Bar",
            "category": "back",
            "muscle_groups": ["dorsaux", "rhomboïdes", "trapèzes"],
            "description": "Rowing avec la T-bar pour une charge lourde contrôlée.",
            "instructions": [
                "Positionnez-vous au-dessus de la T-bar",
                "Penchez le buste à 45°",
                "Tirez la barre vers la poitrine",
                "Descendez avec contrôle"
            ],
            "tips": ["Excellent pour charger lourd", "Gardez le dos neutre"],
            "video_url": "https://www.youtube.com/watch?v=j3Igk5nyZE4",
            "difficulty": "intermédiaire",
            "equipment": ["machine T-bar", "disques"]
        },
        {
            "exercise_id": "ex_chest_supported_row",
            "name": "Rowing Poitrine Supportée",
            "category": "back",
            "muscle_groups": ["dorsaux", "rhomboïdes"],
            "description": "Rowing sur banc incliné pour isoler le dos sans stress lombaire.",
            "instructions": [
                "Allongez-vous face contre un banc incliné",
                "Laissez pendre les bras avec des haltères",
                "Tirez les haltères vers les hanches"
            ],
            "tips": ["Élimine la triche avec le bas du dos", "Parfait pour les lombalgiques"],
            "video_url": "https://www.youtube.com/watch?v=H75im9fAUMc",
            "difficulty": "débutant",
            "equipment": ["banc incliné", "haltères"]
        },
        {
            "exercise_id": "ex_machine_row",
            "name": "Rowing Machine",
            "category": "back",
            "muscle_groups": ["dorsaux", "rhomboïdes"],
            "description": "Rowing sur machine guidée pour un mouvement sécurisé.",
            "instructions": [
                "Asseyez-vous sur la machine, poitrine contre le support",
                "Saisissez les poignées",
                "Tirez vers vous en serrant les omoplates",
                "Revenez lentement"
            ],
            "tips": ["Idéal pour les débutants", "Concentrez-vous sur la contraction"],
            "video_url": "https://www.youtube.com/watch?v=sP_4vybjVJs",
            "difficulty": "débutant",
            "equipment": ["machine rowing"]
        },
        {
            "exercise_id": "ex_deadlift_conventional",
            "name": "Soulevé de Terre Conventionnel",
            "category": "back",
            "muscle_groups": ["dorsaux", "lombaires", "fessiers", "ischio-jambiers", "trapèzes"],
            "description": "Le roi des exercices pour la force globale du corps.",
            "instructions": [
                "Pieds à largeur des hanches, barre au-dessus du milieu du pied",
                "Penchez-vous et saisissez la barre",
                "Poussez avec les jambes tout en gardant le dos droit",
                "Verrouillez hanches et genoux en haut"
            ],
            "tips": ["La barre doit rester proche du corps", "Ne jamais arrondir le dos"],
            "video_url": "https://www.youtube.com/watch?v=op9kVnSso6Q",
            "difficulty": "avancé",
            "equipment": ["barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_deadlift_sumo",
            "name": "Soulevé de Terre Sumo",
            "category": "back",
            "muscle_groups": ["dorsaux", "fessiers", "adducteurs", "quadriceps"],
            "description": "Variante avec pieds écartés, moins de stress sur le dos.",
            "instructions": [
                "Pieds très écartés, orteils vers l'extérieur",
                "Saisissez la barre entre les jambes",
                "Poussez avec les jambes et tirez",
                "Verrouillez en haut"
            ],
            "tips": ["Plus facile pour les personnes avec un torse long", "Moins de stress lombaire"],
            "video_url": "https://www.youtube.com/watch?v=lDt8HwxVST0",
            "difficulty": "avancé",
            "equipment": ["barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_romanian_deadlift",
            "name": "Soulevé de Terre Roumain",
            "category": "back",
            "muscle_groups": ["ischio-jambiers", "fessiers", "lombaires"],
            "description": "Variante pour cibler les ischio-jambiers et les fessiers.",
            "instructions": [
                "Debout avec la barre, genoux légèrement fléchis",
                "Descendez la barre le long des jambes en poussant les hanches en arrière",
                "Gardez le dos droit",
                "Remontez en contractant les fessiers"
            ],
            "tips": ["Les genoux restent fixes", "Sentez l'étirement des ischio-jambiers"],
            "video_url": "https://www.youtube.com/watch?v=JCXUYuzwNrM",
            "difficulty": "intermédiaire",
            "equipment": ["barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_hyperextension",
            "name": "Hyperextensions",
            "category": "back",
            "muscle_groups": ["lombaires", "fessiers", "ischio-jambiers"],
            "description": "Exercice pour renforcer le bas du dos.",
            "instructions": [
                "Positionnez-vous sur le banc à hyperextensions",
                "Croisez les bras sur la poitrine",
                "Descendez le buste vers le sol",
                "Remontez jusqu'à l'alignement du corps"
            ],
            "tips": ["Ne pas hyperextendre le dos", "Ajoutez du poids pour plus d'intensité"],
            "video_url": "https://www.youtube.com/watch?v=ph3pddpKzzw",
            "difficulty": "débutant",
            "equipment": ["banc à hyperextensions"]
        },
        {
            "exercise_id": "ex_reverse_hyperextension",
            "name": "Hyperextensions Inversées",
            "category": "back",
            "muscle_groups": ["lombaires", "fessiers"],
            "description": "Variante ciblant les fessiers et le bas du dos.",
            "instructions": [
                "Allongez-vous face contre un banc",
                "Laissez pendre les jambes",
                "Levez les jambes vers le haut",
                "Redescendez avec contrôle"
            ],
            "tips": ["Excellent pour décompresser la colonne", "Ne donnez pas d'élan"],
            "video_url": "https://www.youtube.com/watch?v=3d4L9kZQTqk",
            "difficulty": "intermédiaire",
            "equipment": ["machine reverse hyper", "banc"]
        },
        {
            "exercise_id": "ex_face_pulls",
            "name": "Face Pulls",
            "category": "back",
            "muscle_groups": ["deltoïdes postérieurs", "rhomboïdes", "rotateurs externes"],
            "description": "Excellent pour la posture et l'arrière des épaules.",
            "instructions": [
                "Face à une poulie haute avec corde",
                "Tirez vers le visage en écartant les mains",
                "Serrez les omoplates",
                "Revenez lentement"
            ],
            "tips": ["Gardez les coudes hauts", "Concentrez-vous sur la rotation externe"],
            "video_url": "https://www.youtube.com/watch?v=rep-qVOkqgk",
            "difficulty": "débutant",
            "equipment": ["poulie haute", "corde"]
        },
        {
            "exercise_id": "ex_straight_arm_pulldown",
            "name": "Tirage Bras Tendus",
            "category": "back",
            "muscle_groups": ["dorsaux"],
            "description": "Isolation des dorsaux avec bras tendus.",
            "instructions": [
                "Face à une poulie haute",
                "Bras tendus, saisissez la barre",
                "Tirez la barre vers les cuisses en gardant les bras tendus",
                "Remontez avec contrôle"
            ],
            "tips": ["Gardez une légère flexion des coudes", "Sentez la contraction des dorsaux"],
            "video_url": "https://www.youtube.com/watch?v=lueEJGjTuPQ",
            "difficulty": "intermédiaire",
            "equipment": ["poulie haute", "barre droite"]
        },
        {
            "exercise_id": "ex_pullover_machine",
            "name": "Pull-over Machine",
            "category": "back",
            "muscle_groups": ["dorsaux", "pectoraux"],
            "description": "Pull-over sur machine pour isoler les dorsaux.",
            "instructions": [
                "Asseyez-vous sur la machine",
                "Placez les coudes contre les coussins",
                "Tirez vers le bas en arc de cercle",
                "Remontez lentement"
            ],
            "tips": ["Mouvement guidé et sécurisé", "Excellent pour sentir la contraction"],
            "video_url": "https://www.youtube.com/watch?v=OXi_LsTyKcg",
            "difficulty": "débutant",
            "equipment": ["machine pull-over"]
        },
        {
            "exercise_id": "ex_assisted_pullup",
            "name": "Tractions Assistées Machine",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps"],
            "description": "Machine pour apprendre les tractions avec assistance.",
            "instructions": [
                "Agenouillez-vous sur le support",
                "Saisissez les poignées",
                "Tirez-vous vers le haut",
                "Descendez avec contrôle"
            ],
            "tips": ["Réduisez l'assistance progressivement", "Excellent pour progresser vers les tractions"],
            "video_url": "https://www.youtube.com/watch?v=Ryk_1_WmG28",
            "difficulty": "débutant",
            "equipment": ["machine tractions assistées"]
        },
        
        # ==================== JAMBES (LEGS) - 25 exercices ====================
        {
            "exercise_id": "ex_squat_barbell",
            "name": "Squat Barre",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "ischio-jambiers", "core"],
            "description": "Exercice fondamental pour les jambes et la force globale.",
            "instructions": [
                "Barre sur les trapèzes, pieds à largeur des épaules",
                "Descendez en poussant les hanches vers l'arrière",
                "Cuisses parallèles au sol minimum",
                "Remontez en poussant dans les talons"
            ],
            "tips": ["Genoux dans la direction des pieds", "Gardez la poitrine haute"],
            "video_url": "https://www.youtube.com/watch?v=ultWZbUMPL8",
            "difficulty": "intermédiaire",
            "equipment": ["barre olympique", "rack à squat", "disques"]
        },
        {
            "exercise_id": "ex_squat_front",
            "name": "Front Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "core"],
            "description": "Squat avec barre devant pour cibler les quadriceps.",
            "instructions": [
                "Barre sur les deltoïdes avant, coudes hauts",
                "Descendez en gardant le buste vertical",
                "Remontez en poussant"
            ],
            "tips": ["Travaille plus les quadriceps", "Demande de la mobilité aux poignets"],
            "video_url": "https://www.youtube.com/watch?v=m4ytaCJZpl0",
            "difficulty": "avancé",
            "equipment": ["barre olympique", "rack à squat", "disques"]
        },
        {
            "exercise_id": "ex_squat_goblet",
            "name": "Goblet Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "core"],
            "description": "Squat avec haltère ou kettlebell tenu devant la poitrine.",
            "instructions": [
                "Tenez un haltère ou kettlebell contre la poitrine",
                "Pieds légèrement plus larges que les hanches",
                "Descendez profondément",
                "Remontez en gardant le poids stable"
            ],
            "tips": ["Excellent pour apprendre le squat", "Garde le buste droit naturellement"],
            "video_url": "https://www.youtube.com/watch?v=MxsFDhcyFyE",
            "difficulty": "débutant",
            "equipment": ["haltère", "kettlebell"]
        },
        {
            "exercise_id": "ex_squat_hack",
            "name": "Hack Squat Machine",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Squat guidé sur machine Hack Squat.",
            "instructions": [
                "Placez vos épaules sous les coussins",
                "Pieds sur la plateforme, écartés comme un squat",
                "Descendez en fléchissant les genoux",
                "Remontez en poussant"
            ],
            "tips": ["Position des pieds modifie le ciblage", "Mouvement guidé et sécurisé"],
            "video_url": "https://www.youtube.com/watch?v=0tn5K9NlCfo",
            "difficulty": "intermédiaire",
            "equipment": ["machine hack squat"]
        },
        {
            "exercise_id": "ex_leg_press_45",
            "name": "Presse à Cuisses 45°",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "ischio-jambiers"],
            "description": "Presse à cuisses inclinée à 45 degrés.",
            "instructions": [
                "Asseyez-vous sur la machine, dos plaqué",
                "Pieds sur la plateforme, écartés",
                "Descendez jusqu'à 90° aux genoux",
                "Poussez sans verrouiller les genoux"
            ],
            "tips": ["Pieds hauts: plus de fessiers", "Pieds bas: plus de quadriceps"],
            "video_url": "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
            "difficulty": "débutant",
            "equipment": ["presse à cuisses 45°"]
        },
        {
            "exercise_id": "ex_leg_press_horizontal",
            "name": "Presse à Cuisses Horizontale",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Presse à cuisses avec position horizontale.",
            "instructions": [
                "Asseyez-vous sur la machine",
                "Placez les pieds sur la plateforme",
                "Poussez et revenez lentement"
            ],
            "tips": ["Moins de stress sur le dos", "Bon pour charger lourd"],
            "video_url": "https://www.youtube.com/watch?v=QQEW__B5y9I",
            "difficulty": "débutant",
            "equipment": ["presse à cuisses horizontale"]
        },
        {
            "exercise_id": "ex_leg_extension",
            "name": "Leg Extension",
            "category": "legs",
            "muscle_groups": ["quadriceps"],
            "description": "Isolation des quadriceps sur machine.",
            "instructions": [
                "Asseyez-vous sur la machine, dos contre le dossier",
                "Placez les chevilles sous le coussin",
                "Étendez les jambes jusqu'à l'extension complète",
                "Redescendez lentement"
            ],
            "tips": ["Ne verrouillez pas brutalement les genoux", "Contrôlez la descente"],
            "video_url": "https://www.youtube.com/watch?v=YyvSfVjQeL0",
            "difficulty": "débutant",
            "equipment": ["machine leg extension"]
        },
        {
            "exercise_id": "ex_leg_curl_lying",
            "name": "Leg Curl Allongé",
            "category": "legs",
            "muscle_groups": ["ischio-jambiers"],
            "description": "Isolation des ischio-jambiers en position allongée.",
            "instructions": [
                "Allongez-vous face contre la machine",
                "Placez les chevilles sous le coussin",
                "Fléchissez les genoux pour ramener les talons vers les fesses",
                "Redescendez lentement"
            ],
            "tips": ["Gardez les hanches collées au banc", "Contractez bien en haut"],
            "video_url": "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
            "difficulty": "débutant",
            "equipment": ["machine leg curl couché"]
        },
        {
            "exercise_id": "ex_leg_curl_seated",
            "name": "Leg Curl Assis",
            "category": "legs",
            "muscle_groups": ["ischio-jambiers"],
            "description": "Isolation des ischio-jambiers en position assise.",
            "instructions": [
                "Asseyez-vous sur la machine",
                "Placez les chevilles sur le coussin",
                "Fléchissez les genoux vers le bas",
                "Remontez avec contrôle"
            ],
            "tips": ["Plus grand étirement qu'en position couchée", "Gardez le dos droit"],
            "video_url": "https://www.youtube.com/watch?v=Orxowest56U",
            "difficulty": "débutant",
            "equipment": ["machine leg curl assis"]
        },
        {
            "exercise_id": "ex_leg_curl_standing",
            "name": "Leg Curl Debout",
            "category": "legs",
            "muscle_groups": ["ischio-jambiers"],
            "description": "Travail unilatéral des ischio-jambiers debout.",
            "instructions": [
                "Debout face à la machine",
                "Placez la cheville sous le coussin",
                "Fléchissez le genou",
                "Changez de jambe"
            ],
            "tips": ["Travail unilatéral pour équilibrer", "Gardez la hanche stable"],
            "video_url": "https://www.youtube.com/watch?v=CZVTv9T_Ml8",
            "difficulty": "débutant",
            "equipment": ["machine leg curl debout"]
        },
        {
            "exercise_id": "ex_lunges_barbell",
            "name": "Fentes Barre",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "ischio-jambiers"],
            "description": "Fentes avec barre sur les épaules.",
            "instructions": [
                "Barre sur les trapèzes",
                "Faites un grand pas en avant",
                "Descendez le genou arrière vers le sol",
                "Remontez et changez de jambe"
            ],
            "tips": ["Gardez le torse droit", "Le genou avant ne dépasse pas les orteils"],
            "video_url": "https://www.youtube.com/watch?v=D7KaRcUTQeE",
            "difficulty": "intermédiaire",
            "equipment": ["barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_lunges_dumbbell",
            "name": "Fentes Haltères",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "ischio-jambiers"],
            "description": "Fentes avec haltères le long du corps.",
            "instructions": [
                "Haltères dans chaque main",
                "Faites un pas en avant",
                "Descendez puis remontez",
                "Alternez les jambes"
            ],
            "tips": ["Plus facile à équilibrer que la barre", "Excellent pour l'équilibre"],
            "video_url": "https://www.youtube.com/watch?v=QOVaHwm-Q6U",
            "difficulty": "débutant",
            "equipment": ["haltères"]
        },
        {
            "exercise_id": "ex_lunges_walking",
            "name": "Fentes Marchées",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "ischio-jambiers"],
            "description": "Fentes en avançant continuellement.",
            "instructions": [
                "Avec ou sans poids",
                "Faites une fente puis enchaînez avec l'autre jambe",
                "Avancez à chaque répétition"
            ],
            "tips": ["Excellent pour le cardio aussi", "Maintenez un rythme régulier"],
            "video_url": "https://www.youtube.com/watch?v=L8fvypPrzzs",
            "difficulty": "intermédiaire",
            "equipment": ["haltères (optionnel)"]
        },
        {
            "exercise_id": "ex_bulgarian_split_squat",
            "name": "Bulgarian Split Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Squat unilatéral avec pied arrière surélevé.",
            "instructions": [
                "Pied arrière sur un banc",
                "Pied avant à 60-90cm du banc",
                "Descendez le genou arrière vers le sol",
                "Remontez en poussant"
            ],
            "tips": ["Très efficace pour les fessiers", "Travaille l'équilibre"],
            "video_url": "https://www.youtube.com/watch?v=2C-uNgKwPLE",
            "difficulty": "intermédiaire",
            "equipment": ["banc", "haltères (optionnel)"]
        },
        {
            "exercise_id": "ex_step_ups",
            "name": "Step-ups",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Montées sur banc avec ou sans poids.",
            "instructions": [
                "Face à un banc ou une box",
                "Montez avec une jambe",
                "Redescendez avec contrôle",
                "Alternez ou faites toutes les reps d'un côté"
            ],
            "tips": ["Plus le banc est haut, plus c'est difficile", "Gardez le torse droit"],
            "video_url": "https://www.youtube.com/watch?v=dQqApCGd5Ss",
            "difficulty": "débutant",
            "equipment": ["banc", "step", "haltères (optionnel)"]
        },
        {
            "exercise_id": "ex_hip_thrust",
            "name": "Hip Thrust",
            "category": "legs",
            "muscle_groups": ["fessiers", "ischio-jambiers"],
            "description": "Exercice ciblé pour les fessiers.",
            "instructions": [
                "Dos appuyé contre un banc",
                "Barre sur les hanches avec protection",
                "Pieds à plat, genoux à 90°",
                "Poussez les hanches vers le haut"
            ],
            "tips": ["Serrez les fessiers en haut", "Gardez le menton rentré"],
            "video_url": "https://www.youtube.com/watch?v=SEdqd1n0cvg",
            "difficulty": "intermédiaire",
            "equipment": ["banc", "barre olympique", "disques", "coussin"]
        },
        {
            "exercise_id": "ex_glute_bridge",
            "name": "Glute Bridge",
            "category": "legs",
            "muscle_groups": ["fessiers"],
            "description": "Pont fessier au sol.",
            "instructions": [
                "Allongé sur le dos, pieds à plat",
                "Levez les hanches vers le plafond",
                "Serrez les fessiers en haut",
                "Redescendez lentement"
            ],
            "tips": ["Excellent pour activation des fessiers", "Ajoutez un poids sur les hanches"],
            "video_url": "https://www.youtube.com/watch?v=8bbE64NuDTU",
            "difficulty": "débutant",
            "equipment": ["tapis", "haltère (optionnel)"]
        },
        {
            "exercise_id": "ex_hip_abduction_machine",
            "name": "Abduction Hanches Machine",
            "category": "legs",
            "muscle_groups": ["abducteurs", "moyen fessier"],
            "description": "Machine pour écarter les jambes et travailler l'extérieur des cuisses.",
            "instructions": [
                "Asseyez-vous sur la machine",
                "Placez les jambes contre les coussins",
                "Écartez les jambes contre la résistance",
                "Revenez lentement"
            ],
            "tips": ["Excellent pour le galbe des hanches", "Contrôlez le retour"],
            "video_url": "https://www.youtube.com/watch?v=FoLN3Qfv8T8",
            "difficulty": "débutant",
            "equipment": ["machine abduction"]
        },
        {
            "exercise_id": "ex_hip_adduction_machine",
            "name": "Adduction Hanches Machine",
            "category": "legs",
            "muscle_groups": ["adducteurs"],
            "description": "Machine pour rapprocher les jambes et travailler l'intérieur des cuisses.",
            "instructions": [
                "Asseyez-vous sur la machine, jambes écartées",
                "Rapprochez les jambes contre la résistance",
                "Serrez les adducteurs",
                "Écartez lentement"
            ],
            "tips": ["Important pour la stabilité des genoux", "Ne forcez pas l'écartement"],
            "video_url": "https://www.youtube.com/watch?v=2_i8gJ3aJzk",
            "difficulty": "débutant",
            "equipment": ["machine adduction"]
        },
        {
            "exercise_id": "ex_calf_raises_standing",
            "name": "Mollets Debout Machine",
            "category": "legs",
            "muscle_groups": ["mollets (gastrocnémiens)"],
            "description": "Extension des mollets debout sur machine.",
            "instructions": [
                "Épaules sous les coussins",
                "Pointes de pieds sur la plateforme",
                "Montez sur la pointe des pieds",
                "Descendez en étirant bien"
            ],
            "tips": ["Amplitude complète", "Pause en haut pour contraction maximale"],
            "video_url": "https://www.youtube.com/watch?v=-M4-G8p8fmc",
            "difficulty": "débutant",
            "equipment": ["machine mollets debout"]
        },
        {
            "exercise_id": "ex_calf_raises_seated",
            "name": "Mollets Assis Machine",
            "category": "legs",
            "muscle_groups": ["mollets (soléaire)"],
            "description": "Extension des mollets assis, cible le soléaire.",
            "instructions": [
                "Asseyez-vous sur la machine",
                "Genoux sous le coussin",
                "Montez sur la pointe des pieds",
                "Descendez lentement"
            ],
            "tips": ["Cible le soléaire (muscle profond)", "Complémentaire au mollet debout"],
            "video_url": "https://www.youtube.com/watch?v=Yh5TXz99xwY",
            "difficulty": "débutant",
            "equipment": ["machine mollets assis"]
        },
        {
            "exercise_id": "ex_calf_raises_leg_press",
            "name": "Mollets à la Presse",
            "category": "legs",
            "muscle_groups": ["mollets"],
            "description": "Extension des mollets sur la presse à cuisses.",
            "instructions": [
                "Sur la presse à cuisses, pieds en bas de la plateforme",
                "Seuls les orteils sur le bord",
                "Poussez avec les mollets",
                "Étirez en bas"
            ],
            "tips": ["Permet de charger lourd", "Soyez prudent avec la position"],
            "video_url": "https://www.youtube.com/watch?v=Xj0F2K17nJw",
            "difficulty": "intermédiaire",
            "equipment": ["presse à cuisses"]
        },
        {
            "exercise_id": "ex_sissy_squat",
            "name": "Sissy Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps"],
            "description": "Squat isolant les quadriceps avec le corps penché en arrière.",
            "instructions": [
                "Debout, tenez-vous à un support",
                "Montez sur la pointe des pieds",
                "Descendez en penchant le corps en arrière",
                "Remontez en contractant les quadriceps"
            ],
            "tips": ["Très intense pour les quadriceps", "Demande de la mobilité"],
            "video_url": "https://www.youtube.com/watch?v=dUcXYVh5pMs",
            "difficulty": "avancé",
            "equipment": ["support fixe", "machine sissy squat"]
        },
        {
            "exercise_id": "ex_pendulum_squat",
            "name": "Pendulum Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Machine de squat avec mouvement pendulaire.",
            "instructions": [
                "Placez-vous sur la machine",
                "Épaules sous les coussins",
                "Descendez en squat",
                "Remontez en poussant"
            ],
            "tips": ["Moins de stress sur le dos", "Excellent pour isoler les jambes"],
            "video_url": "https://www.youtube.com/watch?v=fU2gjpPcs_Y",
            "difficulty": "intermédiaire",
            "equipment": ["machine pendulum squat"]
        },
        {
            "exercise_id": "ex_belt_squat",
            "name": "Belt Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Squat avec ceinture attachée, zéro stress sur le dos.",
            "instructions": [
                "Attachez la ceinture à la taille",
                "Montez sur les plateformes",
                "Faites un squat normal",
                "Remontez en poussant"
            ],
            "tips": ["Parfait pour les problèmes de dos", "Permet de squatter lourd sans compression"],
            "video_url": "https://www.youtube.com/watch?v=FCIZZvIM-I0",
            "difficulty": "intermédiaire",
            "equipment": ["machine belt squat"]
        },
        
        # ==================== ÉPAULES (SHOULDERS) - 18 exercices ====================
        {
            "exercise_id": "ex_overhead_press_barbell",
            "name": "Développé Militaire Barre",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes", "triceps", "trapèzes"],
            "description": "Exercice de base pour les épaules avec barre.",
            "instructions": [
                "Debout, barre au niveau des clavicules",
                "Poussez la barre au-dessus de la tête",
                "Verrouillez les bras en haut",
                "Redescendez de manière contrôlée"
            ],
            "tips": ["Gardez le core engagé", "Ne vous penchez pas en arrière"],
            "video_url": "https://www.youtube.com/watch?v=2yjwXTZQDDI",
            "difficulty": "intermédiaire",
            "equipment": ["barre olympique", "disques", "rack"]
        },
        {
            "exercise_id": "ex_overhead_press_dumbbell",
            "name": "Développé Épaules Haltères",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes", "triceps"],
            "description": "Développé épaules avec haltères pour plus d'amplitude.",
            "instructions": [
                "Assis ou debout, haltères à hauteur des épaules",
                "Poussez vers le haut",
                "Les haltères peuvent se toucher en haut",
                "Redescendez aux épaules"
            ],
            "tips": ["Permet une plus grande amplitude", "Meilleur pour la stabilisation"],
            "video_url": "https://www.youtube.com/watch?v=qEwKCR5JCog",
            "difficulty": "intermédiaire",
            "equipment": ["haltères", "banc avec dossier"]
        },
        {
            "exercise_id": "ex_arnold_press",
            "name": "Arnold Press",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes antérieurs", "deltoïdes latéraux", "triceps"],
            "description": "Développé épaules avec rotation, inventé par Arnold Schwarzenegger.",
            "instructions": [
                "Haltères devant vous, paumes vers vous",
                "En poussant, tournez les poignets",
                "Terminez avec les paumes vers l'avant",
                "Inversez le mouvement pour descendre"
            ],
            "tips": ["Travaille les trois faisceaux des deltoïdes", "Mouvement fluide"],
            "video_url": "https://www.youtube.com/watch?v=6Z15_WdXmVw",
            "difficulty": "intermédiaire",
            "equipment": ["haltères", "banc avec dossier"]
        },
        {
            "exercise_id": "ex_shoulder_press_machine",
            "name": "Développé Épaules Machine",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes", "triceps"],
            "description": "Développé épaules sur machine guidée.",
            "instructions": [
                "Asseyez-vous sur la machine",
                "Saisissez les poignées",
                "Poussez vers le haut",
                "Redescendez avec contrôle"
            ],
            "tips": ["Parfait pour les débutants", "Mouvement sécurisé"],
            "video_url": "https://www.youtube.com/watch?v=Wqq43dKW1TU",
            "difficulty": "débutant",
            "equipment": ["machine épaules"]
        },
        {
            "exercise_id": "ex_lateral_raises_dumbbell",
            "name": "Élévations Latérales Haltères",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes latéraux"],
            "description": "Isolation pour élargir les épaules.",
            "instructions": [
                "Debout, haltères le long du corps",
                "Levez les bras sur les côtés jusqu'à hauteur des épaules",
                "Redescendez lentement"
            ],
            "tips": ["Légère flexion des coudes", "Ne montez pas plus haut que les épaules"],
            "video_url": "https://www.youtube.com/watch?v=3VcKaXpzqRo",
            "difficulty": "débutant",
            "equipment": ["haltères"]
        },
        {
            "exercise_id": "ex_lateral_raises_cable",
            "name": "Élévations Latérales Poulie",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes latéraux"],
            "description": "Élévations latérales à la poulie pour une tension constante.",
            "instructions": [
                "Poulie basse sur le côté",
                "Saisissez la poignée",
                "Levez le bras sur le côté",
                "Redescendez lentement"
            ],
            "tips": ["Tension constante", "Excellent pour la finition"],
            "video_url": "https://www.youtube.com/watch?v=PPrzBWodOyI",
            "difficulty": "intermédiaire",
            "equipment": ["poulie basse"]
        },
        {
            "exercise_id": "ex_lateral_raises_machine",
            "name": "Élévations Latérales Machine",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes latéraux"],
            "description": "Machine d'isolation pour les deltoïdes latéraux.",
            "instructions": [
                "Asseyez-vous sur la machine",
                "Bras contre les coussins",
                "Levez les bras sur les côtés",
                "Redescendez avec contrôle"
            ],
            "tips": ["Mouvement guidé", "Bon pour les débutants"],
            "video_url": "https://www.youtube.com/watch?v=FeJP4E4Z-PY",
            "difficulty": "débutant",
            "equipment": ["machine élévations latérales"]
        },
        {
            "exercise_id": "ex_front_raises_dumbbell",
            "name": "Élévations Frontales Haltères",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes antérieurs"],
            "description": "Isolation pour l'avant des épaules.",
            "instructions": [
                "Debout, haltères devant les cuisses",
                "Levez un bras devant vous jusqu'à hauteur des épaules",
                "Redescendez et alternez"
            ],
            "tips": ["Gardez le corps stable", "Contrôlez la descente"],
            "video_url": "https://www.youtube.com/watch?v=gzDSJWBQDOE",
            "difficulty": "débutant",
            "equipment": ["haltères"]
        },
        {
            "exercise_id": "ex_front_raises_plate",
            "name": "Élévations Frontales avec Disque",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes antérieurs"],
            "description": "Élévations frontales avec un disque tenu à deux mains.",
            "instructions": [
                "Tenez un disque à deux mains",
                "Levez le disque devant vous",
                "Montez jusqu'à hauteur des yeux",
                "Redescendez lentement"
            ],
            "tips": ["Bon pour le mind-muscle connection", "Gardez les bras tendus"],
            "video_url": "https://www.youtube.com/watch?v=6DXMBS7LUc4",
            "difficulty": "débutant",
            "equipment": ["disque de poids"]
        },
        {
            "exercise_id": "ex_front_raises_cable",
            "name": "Élévations Frontales Poulie",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes antérieurs"],
            "description": "Élévations frontales à la poulie basse.",
            "instructions": [
                "Dos à la poulie basse",
                "Saisissez la poignée entre les jambes",
                "Levez le bras devant vous",
                "Redescendez avec contrôle"
            ],
            "tips": ["Tension constante", "Travail unilatéral possible"],
            "video_url": "https://www.youtube.com/watch?v=vtH93qBItdk",
            "difficulty": "intermédiaire",
            "equipment": ["poulie basse"]
        },
        {
            "exercise_id": "ex_rear_delt_fly_dumbbell",
            "name": "Oiseau Haltères",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes postérieurs", "rhomboïdes"],
            "description": "Exercice d'isolation pour l'arrière des épaules.",
            "instructions": [
                "Penché en avant, haltères pendants",
                "Levez les bras sur les côtés",
                "Serrez les omoplates en haut",
                "Redescendez lentement"
            ],
            "tips": ["Gardez le dos droit", "Légère flexion des coudes"],
            "video_url": "https://www.youtube.com/watch?v=pYcpY20QaE8",
            "difficulty": "débutant",
            "equipment": ["haltères"]
        },
        {
            "exercise_id": "ex_rear_delt_fly_machine",
            "name": "Oiseau Machine (Reverse Pec Deck)",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes postérieurs"],
            "description": "Machine d'isolation pour l'arrière des épaules.",
            "instructions": [
                "Asseyez-vous face à la machine",
                "Saisissez les poignées",
                "Écartez les bras vers l'arrière",
                "Revenez lentement"
            ],
            "tips": ["Gardez une légère flexion des coudes", "Concentrez-vous sur la contraction"],
            "video_url": "https://www.youtube.com/watch?v=5YK4bgzXDp0",
            "difficulty": "débutant",
            "equipment": ["machine reverse pec deck"]
        },
        {
            "exercise_id": "ex_rear_delt_cable",
            "name": "Deltoïdes Postérieurs Poulie",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes postérieurs"],
            "description": "Travail de l'arrière des épaules à la poulie.",
            "instructions": [
                "Poulie haute, pas de poignée",
                "Tirez le câble vers l'arrière",
                "Serrez l'arrière de l'épaule",
                "Revenez lentement"
            ],
            "tips": ["Excellent pour la finition", "Tension constante"],
            "video_url": "https://www.youtube.com/watch?v=HSoNaVbNN2E",
            "difficulty": "intermédiaire",
            "equipment": ["poulie haute"]
        },
        {
            "exercise_id": "ex_upright_row_barbell",
            "name": "Rowing Vertical Barre",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes", "trapèzes"],
            "description": "Tirage vertical pour les épaules et trapèzes.",
            "instructions": [
                "Debout, barre devant les cuisses",
                "Tirez la barre vers le menton",
                "Coudes vers le haut",
                "Redescendez lentement"
            ],
            "tips": ["Ne montez pas plus haut que les épaules", "Prise large = plus de deltoïdes"],
            "video_url": "https://www.youtube.com/watch?v=amCU-ziHITM",
            "difficulty": "intermédiaire",
            "equipment": ["barre"]
        },
        {
            "exercise_id": "ex_upright_row_dumbbell",
            "name": "Rowing Vertical Haltères",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes", "trapèzes"],
            "description": "Tirage vertical avec haltères.",
            "instructions": [
                "Haltères devant les cuisses",
                "Tirez vers le haut, coudes hauts",
                "Redescendez avec contrôle"
            ],
            "tips": ["Plus de liberté que la barre", "Meilleur pour les poignets"],
            "video_url": "https://www.youtube.com/watch?v=k9nqjMwMVOM",
            "difficulty": "intermédiaire",
            "equipment": ["haltères"]
        },
        {
            "exercise_id": "ex_shrugs_barbell",
            "name": "Shrugs Barre",
            "category": "shoulders",
            "muscle_groups": ["trapèzes"],
            "description": "Haussements d'épaules pour les trapèzes.",
            "instructions": [
                "Debout, barre devant les cuisses",
                "Haussez les épaules vers les oreilles",
                "Maintenez en haut",
                "Redescendez lentement"
            ],
            "tips": ["Ne tournez pas les épaules", "Amplitude complète"],
            "video_url": "https://www.youtube.com/watch?v=cJRVVxmytaM",
            "difficulty": "débutant",
            "equipment": ["barre", "disques"]
        },
        {
            "exercise_id": "ex_shrugs_dumbbell",
            "name": "Shrugs Haltères",
            "category": "shoulders",
            "muscle_groups": ["trapèzes"],
            "description": "Haussements d'épaules avec haltères.",
            "instructions": [
                "Haltères le long du corps",
                "Haussez les épaules",
                "Contractez les trapèzes en haut",
                "Redescendez"
            ],
            "tips": ["Plus d'amplitude que la barre", "Peut charger lourd"],
            "video_url": "https://www.youtube.com/watch?v=cJRVVxmytaM",
            "difficulty": "débutant",
            "equipment": ["haltères"]
        },
        {
            "exercise_id": "ex_shrugs_machine",
            "name": "Shrugs Machine",
            "category": "shoulders",
            "muscle_groups": ["trapèzes"],
            "description": "Haussements d'épaules sur machine guidée.",
            "instructions": [
                "Saisissez les poignées de la machine",
                "Haussez les épaules",
                "Maintenez la contraction",
                "Redescendez"
            ],
            "tips": ["Mouvement guidé et sécurisé", "Permet de charger très lourd"],
            "video_url": "https://www.youtube.com/watch?v=LGIS8Q2L_f8",
            "difficulty": "débutant",
            "equipment": ["machine shrugs"]
        },
        
        # ==================== BRAS (ARMS) - 20 exercices ====================
        {
            "exercise_id": "ex_bicep_curl_barbell",
            "name": "Curl Barre Droite",
            "category": "arms",
            "muscle_groups": ["biceps"],
            "description": "Exercice classique pour les biceps avec barre droite.",
            "instructions": [
                "Debout, barre en prise supination",
                "Fléchissez les coudes pour monter la barre",
                "Contractez les biceps en haut",
                "Redescendez lentement"
            ],
            "tips": ["Gardez les coudes fixes", "Ne balancez pas le corps"],
            "video_url": "https://www.youtube.com/watch?v=LY1V6UbRHFM",
            "difficulty": "débutant",
            "equipment": ["barre droite", "disques"]
        },
        {
            "exercise_id": "ex_bicep_curl_ez",
            "name": "Curl Barre EZ",
            "category": "arms",
            "muscle_groups": ["biceps"],
            "description": "Curl avec barre EZ pour moins de stress sur les poignets.",
            "instructions": [
                "Saisissez la barre EZ aux prises coudées",
                "Curl classique avec les coudes fixes",
                "Contractez en haut"
            ],
            "tips": ["Plus confortable pour les poignets", "Position semi-supination"],
            "video_url": "https://www.youtube.com/watch?v=zG2xJ0Q5QtI",
            "difficulty": "débutant",
            "equipment": ["barre EZ", "disques"]
        },
        {
            "exercise_id": "ex_bicep_curl_dumbbell",
            "name": "Curl Haltères",
            "category": "arms",
            "muscle_groups": ["biceps"],
            "description": "Curl classique avec haltères.",
            "instructions": [
                "Debout, haltères le long du corps",
                "Fléchissez les coudes en supination",
                "Contractez les biceps en haut",
                "Redescendez lentement"
            ],
            "tips": ["Coudes fixes contre le corps", "Supinez pendant la montée"],
            "video_url": "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
            "difficulty": "débutant",
            "equipment": ["haltères"]
        },
        {
            "exercise_id": "ex_hammer_curl",
            "name": "Curl Marteau",
            "category": "arms",
            "muscle_groups": ["biceps", "brachial", "avant-bras"],
            "description": "Curl avec prise neutre pour biceps et brachial.",
            "instructions": [
                "Haltères en prise neutre (paumes face à face)",
                "Fléchissez les coudes sans tourner",
                "Montez jusqu'à la contraction"
            ],
            "tips": ["Travaille le brachial", "Donne de l'épaisseur aux bras"],
            "video_url": "https://www.youtube.com/watch?v=zC3nLlEvin4",
            "difficulty": "débutant",
            "equipment": ["haltères"]
        },
        {
            "exercise_id": "ex_preacher_curl",
            "name": "Curl au Pupitre (Larry Scott)",
            "category": "arms",
            "muscle_groups": ["biceps"],
            "description": "Curl isolé au pupitre pour cibler les biceps.",
            "instructions": [
                "Bras sur le pupitre incliné",
                "Saisissez la barre ou les haltères",
                "Fléchissez les coudes",
                "Redescendez en étirant"
            ],
            "tips": ["Élimine la triche", "Grand étirement en bas"],
            "video_url": "https://www.youtube.com/watch?v=fIWP-FRFNU0",
            "difficulty": "intermédiaire",
            "equipment": ["pupitre", "barre EZ", "haltères"]
        },
        {
            "exercise_id": "ex_concentration_curl",
            "name": "Curl Concentration",
            "category": "arms",
            "muscle_groups": ["biceps"],
            "description": "Curl isolé assis avec le coude contre la cuisse.",
            "instructions": [
                "Assis, coude contre l'intérieur de la cuisse",
                "Curl l'haltère vers l'épaule",
                "Contractez fort en haut",
                "Redescendez lentement"
            ],
            "tips": ["Excellent pour le pic du biceps", "Concentrez-vous sur la contraction"],
            "video_url": "https://www.youtube.com/watch?v=0AUGkch3tzc",
            "difficulty": "débutant",
            "equipment": ["haltère", "banc"]
        },
        {
            "exercise_id": "ex_incline_curl",
            "name": "Curl Incliné",
            "category": "arms",
            "muscle_groups": ["biceps (longue portion)"],
            "description": "Curl sur banc incliné pour étirer les biceps.",
            "instructions": [
                "Allongé sur banc incliné à 45°",
                "Bras pendants, haltères en supination",
                "Curl en gardant les coudes fixes",
                "Redescendez en étirant"
            ],
            "tips": ["Grand étirement des biceps", "Cible la longue portion"],
            "video_url": "https://www.youtube.com/watch?v=soxrZlIl35U",
            "difficulty": "intermédiaire",
            "equipment": ["banc incliné", "haltères"]
        },
        {
            "exercise_id": "ex_cable_curl",
            "name": "Curl Poulie Basse",
            "category": "arms",
            "muscle_groups": ["biceps"],
            "description": "Curl à la poulie basse pour tension constante.",
            "instructions": [
                "Face à la poulie basse",
                "Saisissez la barre ou les poignées",
                "Curl classique",
                "Tension constante tout au long"
            ],
            "tips": ["Tension constante", "Bon pour la finition"],
            "video_url": "https://www.youtube.com/watch?v=NFzTWp2qpiE",
            "difficulty": "débutant",
            "equipment": ["poulie basse", "barre droite"]
        },
        {
            "exercise_id": "ex_spider_curl",
            "name": "Spider Curl",
            "category": "arms",
            "muscle_groups": ["biceps"],
            "description": "Curl penché sur banc incliné, bras pendants.",
            "instructions": [
                "Allongé face contre banc incliné",
                "Bras pendants avec haltères",
                "Curl vers les épaules",
                "Redescendez avec contrôle"
            ],
            "tips": ["Élimine toute triche", "Contraction maximale"],
            "video_url": "https://www.youtube.com/watch?v=oPbXW5bJz9c",
            "difficulty": "intermédiaire",
            "equipment": ["banc incliné", "haltères"]
        },
        {
            "exercise_id": "ex_bicep_machine",
            "name": "Curl Machine",
            "category": "arms",
            "muscle_groups": ["biceps"],
            "description": "Curl sur machine guidée.",
            "instructions": [
                "Asseyez-vous sur la machine",
                "Bras sur le support",
                "Curl vers les épaules",
                "Redescendez lentement"
            ],
            "tips": ["Mouvement guidé", "Bon pour les débutants"],
            "video_url": "https://www.youtube.com/watch?v=lHKFv2RBv_0",
            "difficulty": "débutant",
            "equipment": ["machine biceps"]
        },
        {
            "exercise_id": "ex_tricep_pushdown_rope",
            "name": "Extensions Triceps Corde",
            "category": "arms",
            "muscle_groups": ["triceps"],
            "description": "Extension triceps à la poulie avec corde.",
            "instructions": [
                "Face à la poulie haute",
                "Saisissez la corde",
                "Poussez vers le bas, écartez en fin de mouvement",
                "Remontez lentement"
            ],
            "tips": ["Écartez la corde en bas pour plus de contraction", "Coudes fixes"],
            "video_url": "https://www.youtube.com/watch?v=2-LAMcpzODU",
            "difficulty": "débutant",
            "equipment": ["poulie haute", "corde"]
        },
        {
            "exercise_id": "ex_tricep_pushdown_bar",
            "name": "Extensions Triceps Barre",
            "category": "arms",
            "muscle_groups": ["triceps"],
            "description": "Extension triceps à la poulie avec barre droite.",
            "instructions": [
                "Saisissez la barre en pronation",
                "Poussez vers le bas",
                "Verrouillez les bras en bas",
                "Remontez lentement"
            ],
            "tips": ["Permet de charger plus lourd", "Coudes collés au corps"],
            "video_url": "https://www.youtube.com/watch?v=2-LAMcpzODU",
            "difficulty": "débutant",
            "equipment": ["poulie haute", "barre droite"]
        },
        {
            "exercise_id": "ex_overhead_tricep_extension",
            "name": "Extension Triceps au-dessus de la Tête",
            "category": "arms",
            "muscle_groups": ["triceps (longue portion)"],
            "description": "Extension triceps avec bras au-dessus de la tête.",
            "instructions": [
                "Assis ou debout, haltère ou barre au-dessus de la tête",
                "Descendez derrière la tête en fléchissant les coudes",
                "Remontez en extension"
            ],
            "tips": ["Excellent pour la longue portion", "Gardez les coudes fixes"],
            "video_url": "https://www.youtube.com/watch?v=YbX7Wd8jQ-Q",
            "difficulty": "intermédiaire",
            "equipment": ["haltère", "barre EZ", "poulie"]
        },
        {
            "exercise_id": "ex_skull_crushers",
            "name": "Barre au Front (Skull Crushers)",
            "category": "arms",
            "muscle_groups": ["triceps"],
            "description": "Exercice puissant pour la masse des triceps.",
            "instructions": [
                "Allongé sur un banc, barre au-dessus de la poitrine",
                "Descendez la barre vers le front",
                "Remontez en extension"
            ],
            "tips": ["Gardez les coudes fixes", "Contrôlez la descente"],
            "video_url": "https://www.youtube.com/watch?v=d_KZxkY_0cM",
            "difficulty": "intermédiaire",
            "equipment": ["banc", "barre EZ"]
        },
        {
            "exercise_id": "ex_tricep_kickback",
            "name": "Kickback Triceps",
            "category": "arms",
            "muscle_groups": ["triceps"],
            "description": "Extension triceps penché en arrière.",
            "instructions": [
                "Penché en avant, coude à 90°",
                "Étendez le bras vers l'arrière",
                "Contractez le triceps en haut",
                "Revenez à 90°"
            ],
            "tips": ["Gardez le coude fixe", "Mouvement lent et contrôlé"],
            "video_url": "https://www.youtube.com/watch?v=ZO81bExngMI",
            "difficulty": "débutant",
            "equipment": ["haltère"]
        },
        {
            "exercise_id": "ex_close_grip_bench",
            "name": "Développé Couché Prise Serrée",
            "category": "arms",
            "muscle_groups": ["triceps", "pectoraux"],
            "description": "Développé couché avec prise serrée pour les triceps.",
            "instructions": [
                "Allongé sur un banc",
                "Prise à largeur des épaules ou moins",
                "Descendez la barre sur le bas de la poitrine",
                "Poussez vers le haut"
            ],
            "tips": ["Coudes près du corps", "Excellent pour les triceps et la force"],
            "video_url": "https://www.youtube.com/watch?v=nEF0bv2FW94",
            "difficulty": "intermédiaire",
            "equipment": ["banc", "barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_dips_triceps",
            "name": "Dips Triceps (Corps Droit)",
            "category": "arms",
            "muscle_groups": ["triceps", "épaules"],
            "description": "Dips avec corps droit pour cibler les triceps.",
            "instructions": [
                "Sur des barres parallèles",
                "Corps vertical, coudes serrés",
                "Descendez jusqu'à 90° aux coudes",
                "Remontez en extension"
            ],
            "tips": ["Corps droit = plus de triceps", "Coudes près du corps"],
            "video_url": "https://www.youtube.com/watch?v=2z8JmcrW-As",
            "difficulty": "intermédiaire",
            "equipment": ["barres parallèles"]
        },
        {
            "exercise_id": "ex_tricep_machine",
            "name": "Extension Triceps Machine",
            "category": "arms",
            "muscle_groups": ["triceps"],
            "description": "Extension triceps sur machine guidée.",
            "instructions": [
                "Asseyez-vous sur la machine",
                "Saisissez les poignées",
                "Poussez vers le bas",
                "Remontez avec contrôle"
            ],
            "tips": ["Mouvement guidé et sécurisé", "Bon pour les débutants"],
            "video_url": "https://www.youtube.com/watch?v=0yaxe2HMdzA",
            "difficulty": "débutant",
            "equipment": ["machine triceps"]
        },
        {
            "exercise_id": "ex_wrist_curl",
            "name": "Curl Poignets (Avant-bras)",
            "category": "arms",
            "muscle_groups": ["avant-bras (fléchisseurs)"],
            "description": "Flexion des poignets pour les avant-bras.",
            "instructions": [
                "Assis, avant-bras sur les cuisses",
                "Paumes vers le haut, laissez pendre les mains",
                "Fléchissez les poignets vers le haut",
                "Redescendez"
            ],
            "tips": ["Mouvement lent et contrôlé", "Bon pour la préhension"],
            "video_url": "https://www.youtube.com/watch?v=F8VRfT-nPfI",
            "difficulty": "débutant",
            "equipment": ["haltères", "barre"]
        },
        {
            "exercise_id": "ex_reverse_wrist_curl",
            "name": "Curl Inversé Poignets",
            "category": "arms",
            "muscle_groups": ["avant-bras (extenseurs)"],
            "description": "Extension des poignets pour les avant-bras.",
            "instructions": [
                "Assis, avant-bras sur les cuisses",
                "Paumes vers le bas",
                "Levez les mains vers le haut",
                "Redescendez"
            ],
            "tips": ["Équilibre avec le curl normal", "Important pour la santé des coudes"],
            "video_url": "https://www.youtube.com/watch?v=L1Y1Vfa3Qgk",
            "difficulty": "débutant",
            "equipment": ["haltères", "barre"]
        },
        
        # ==================== ABDOMINAUX (CORE) - 15 exercices ====================
        {
            "exercise_id": "ex_plank",
            "name": "Planche",
            "category": "core",
            "muscle_groups": ["abdominaux", "obliques", "lombaires"],
            "description": "Exercice isométrique fondamental pour le core.",
            "instructions": [
                "Appui sur les avant-bras et les orteils",
                "Corps aligné de la tête aux talons",
                "Maintenez la position"
            ],
            "tips": ["Ne laissez pas les hanches s'affaisser", "Respirez normalement"],
            "video_url": "https://www.youtube.com/watch?v=ASdvN_XEl_c",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_side_plank",
            "name": "Planche Latérale",
            "category": "core",
            "muscle_groups": ["obliques", "abdominaux"],
            "description": "Planche sur le côté pour les obliques.",
            "instructions": [
                "Sur le côté, appui sur un avant-bras",
                "Corps aligné, hanches décollées",
                "Maintenez la position",
                "Changez de côté"
            ],
            "tips": ["Gardez les hanches hautes", "Empilez les pieds ou décalez-les"],
            "video_url": "https://www.youtube.com/watch?v=K2VljzCC16g",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_crunches",
            "name": "Crunchs",
            "category": "core",
            "muscle_groups": ["abdominaux"],
            "description": "Exercice d'isolation pour les abdominaux.",
            "instructions": [
                "Allongé sur le dos, genoux fléchis",
                "Mains derrière la tête",
                "Soulevez les épaules en contractant",
                "Redescendez lentement"
            ],
            "tips": ["Ne tirez pas sur la nuque", "Expirez en montant"],
            "video_url": "https://www.youtube.com/watch?v=Xyd_fa5zoEU",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_reverse_crunches",
            "name": "Crunchs Inversés",
            "category": "core",
            "muscle_groups": ["abdominaux inférieurs"],
            "description": "Crunchs ciblant le bas des abdominaux.",
            "instructions": [
                "Allongé sur le dos, jambes fléchies à 90°",
                "Ramenez les genoux vers la poitrine",
                "Soulevez légèrement les hanches",
                "Redescendez avec contrôle"
            ],
            "tips": ["Mouvement contrôlé", "Ne donnez pas d'élan"],
            "video_url": "https://www.youtube.com/watch?v=hyv14e2QDq0",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_bicycle_crunches",
            "name": "Crunchs Bicyclette",
            "category": "core",
            "muscle_groups": ["abdominaux", "obliques"],
            "description": "Crunchs avec rotation pour les obliques.",
            "instructions": [
                "Allongé, mains derrière la tête",
                "Amenez le coude vers le genou opposé",
                "Alternez en pédalant",
                "Contrôlez le mouvement"
            ],
            "tips": ["Tournez le torse, pas juste les coudes", "Rythme régulier"],
            "video_url": "https://www.youtube.com/watch?v=9FGilxCbdz8",
            "difficulty": "intermédiaire",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_leg_raises_lying",
            "name": "Relevés de Jambes Allongé",
            "category": "core",
            "muscle_groups": ["abdominaux inférieurs"],
            "description": "Cible le bas des abdominaux.",
            "instructions": [
                "Allongé sur le dos, jambes tendues",
                "Levez les jambes jusqu'à 90°",
                "Redescendez sans toucher le sol"
            ],
            "tips": ["Gardez le bas du dos plaqué", "Contrôlez la descente"],
            "video_url": "https://www.youtube.com/watch?v=JB2oyawG9KI",
            "difficulty": "intermédiaire",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_leg_raises_hanging",
            "name": "Relevés de Jambes Suspendu",
            "category": "core",
            "muscle_groups": ["abdominaux", "fléchisseurs de hanches"],
            "description": "Relevés de jambes suspendus à une barre.",
            "instructions": [
                "Suspendu à une barre de traction",
                "Levez les jambes tendues",
                "Montez jusqu'à l'horizontal ou plus",
                "Redescendez avec contrôle"
            ],
            "tips": ["Évitez de vous balancer", "Version genoux pour débutants"],
            "video_url": "https://www.youtube.com/watch?v=Pr1ieGZ5atk",
            "difficulty": "avancé",
            "equipment": ["barre de traction"]
        },
        {
            "exercise_id": "ex_russian_twist",
            "name": "Russian Twist",
            "category": "core",
            "muscle_groups": ["obliques", "abdominaux"],
            "description": "Exercice rotatif pour les obliques.",
            "instructions": [
                "Assis, genoux fléchis, pieds décollés",
                "Penchez le buste en arrière",
                "Tournez le torse de gauche à droite"
            ],
            "tips": ["Gardez le dos droit", "Ajoutez un poids pour plus d'intensité"],
            "video_url": "https://www.youtube.com/watch?v=wkD8rjkodUI",
            "difficulty": "intermédiaire",
            "equipment": ["tapis", "disque (optionnel)"]
        },
        {
            "exercise_id": "ex_ab_wheel",
            "name": "Roue Abdominale",
            "category": "core",
            "muscle_groups": ["abdominaux", "obliques", "épaules"],
            "description": "Exercice avancé avec la roue abdominale.",
            "instructions": [
                "À genoux, mains sur la roue",
                "Roulez vers l'avant en gardant le dos droit",
                "Étirez-vous le plus loin possible",
                "Revenez en contractant les abdos"
            ],
            "tips": ["Gardez le core engagé", "Ne cambrez pas le dos"],
            "video_url": "https://www.youtube.com/watch?v=R8-Vohr8Rqg",
            "difficulty": "avancé",
            "equipment": ["roue abdominale"]
        },
        {
            "exercise_id": "ex_cable_crunch",
            "name": "Crunch Poulie Haute",
            "category": "core",
            "muscle_groups": ["abdominaux"],
            "description": "Crunch à la poulie pour ajouter de la résistance.",
            "instructions": [
                "À genoux sous la poulie haute",
                "Saisissez la corde derrière la tête",
                "Enroulez le torse vers le bas",
                "Remontez avec contrôle"
            ],
            "tips": ["Gardez les hanches fixes", "Enroulez le torse, ne tirez pas avec les bras"],
            "video_url": "https://www.youtube.com/watch?v=2fbujeH3F0E",
            "difficulty": "intermédiaire",
            "equipment": ["poulie haute", "corde"]
        },
        {
            "exercise_id": "ex_cable_woodchop",
            "name": "Wood Chop Poulie",
            "category": "core",
            "muscle_groups": ["obliques", "abdominaux"],
            "description": "Mouvement de rotation à la poulie.",
            "instructions": [
                "Poulie haute ou basse",
                "Tirez en diagonale de haut en bas ou inversement",
                "Tournez le torse pendant le mouvement",
                "Contrôlez le retour"
            ],
            "tips": ["Gardez les bras tendus", "Rotation vient du core"],
            "video_url": "https://www.youtube.com/watch?v=pAplQXk3dkU",
            "difficulty": "intermédiaire",
            "equipment": ["poulie"]
        },
        {
            "exercise_id": "ex_mountain_climbers",
            "name": "Mountain Climbers",
            "category": "core",
            "muscle_groups": ["abdominaux", "épaules", "cardio"],
            "description": "Exercice cardio et core combiné.",
            "instructions": [
                "Position de planche haute",
                "Amenez un genou vers la poitrine",
                "Alternez rapidement les jambes"
            ],
            "tips": ["Gardez les hanches basses", "Maintenez le core engagé"],
            "video_url": "https://www.youtube.com/watch?v=nmwgirgXLYM",
            "difficulty": "intermédiaire",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_dead_bug",
            "name": "Dead Bug",
            "category": "core",
            "muscle_groups": ["abdominaux", "stabilisateurs"],
            "description": "Exercice de stabilisation du core.",
            "instructions": [
                "Allongé sur le dos, bras vers le plafond",
                "Genoux à 90°",
                "Étendez un bras et la jambe opposée",
                "Revenez et alternez"
            ],
            "tips": ["Gardez le bas du dos plaqué", "Mouvement lent et contrôlé"],
            "video_url": "https://www.youtube.com/watch?v=4XLEnwUr1d8",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_pallof_press",
            "name": "Pallof Press",
            "category": "core",
            "muscle_groups": ["obliques", "abdominaux", "stabilisateurs"],
            "description": "Exercice anti-rotation pour le core.",
            "instructions": [
                "Debout ou à genoux, poulie au niveau de la poitrine",
                "Saisissez la poignée des deux mains",
                "Poussez les bras devant vous",
                "Résistez à la rotation"
            ],
            "tips": ["Le core doit résister à la traction", "Excellent pour la stabilité"],
            "video_url": "https://www.youtube.com/watch?v=g921oqINXFQ",
            "difficulty": "intermédiaire",
            "equipment": ["poulie"]
        },
        {
            "exercise_id": "ex_ab_crunch_machine",
            "name": "Crunch Machine",
            "category": "core",
            "muscle_groups": ["abdominaux"],
            "description": "Crunch sur machine avec résistance.",
            "instructions": [
                "Asseyez-vous sur la machine",
                "Saisissez les poignées",
                "Enroulez le torse vers le bas",
                "Remontez avec contrôle"
            ],
            "tips": ["Permet d'ajouter de la résistance", "Bon pour la progression"],
            "video_url": "https://www.youtube.com/watch?v=3JJ8hnf4F9E",
            "difficulty": "débutant",
            "equipment": ["machine crunch abdominaux"]
        },
        
        # ==================== CARDIO - 10 exercices ====================
        {
            "exercise_id": "ex_treadmill_run",
            "name": "Course sur Tapis",
            "category": "cardio",
            "muscle_groups": ["cardio", "jambes"],
            "description": "Course à pied sur tapis de course.",
            "instructions": [
                "Réglez la vitesse souhaitée",
                "Commencez à marcher puis courez",
                "Ajustez l'inclinaison pour plus d'intensité"
            ],
            "tips": ["Commencez par un échauffement", "Variez la vitesse pour du HIIT"],
            "video_url": "https://www.youtube.com/watch?v=8iPEnn-ltC8",
            "difficulty": "débutant",
            "equipment": ["tapis de course"]
        },
        {
            "exercise_id": "ex_elliptical",
            "name": "Vélo Elliptique",
            "category": "cardio",
            "muscle_groups": ["cardio", "jambes", "bras"],
            "description": "Cardio à faible impact sur elliptique.",
            "instructions": [
                "Montez sur l'elliptique",
                "Saisissez les poignées",
                "Pédalez en mouvement fluide",
                "Ajustez la résistance"
            ],
            "tips": ["Faible impact sur les articulations", "Travaille tout le corps"],
            "video_url": "https://www.youtube.com/watch?v=GmRSV_n6eBY",
            "difficulty": "débutant",
            "equipment": ["vélo elliptique"]
        },
        {
            "exercise_id": "ex_stationary_bike",
            "name": "Vélo d'Appartement",
            "category": "cardio",
            "muscle_groups": ["cardio", "quadriceps"],
            "description": "Cardio sur vélo stationnaire.",
            "instructions": [
                "Réglez la selle à bonne hauteur",
                "Pédalez à rythme régulier",
                "Variez la résistance"
            ],
            "tips": ["Bon pour les genoux fragiles", "Excellent pour le HIIT"],
            "video_url": "https://www.youtube.com/watch?v=9D2ExDH0BjQ",
            "difficulty": "débutant",
            "equipment": ["vélo d'appartement"]
        },
        {
            "exercise_id": "ex_rowing_machine",
            "name": "Rameur",
            "category": "cardio",
            "muscle_groups": ["cardio", "dos", "jambes", "bras"],
            "description": "Cardio complet sur rameur.",
            "instructions": [
                "Asseyez-vous, pieds sangés",
                "Poussez avec les jambes puis tirez avec les bras",
                "Retour en ordre inverse",
                "Mouvement fluide"
            ],
            "tips": ["Travaille 80% des muscles", "Technique importante"],
            "video_url": "https://www.youtube.com/watch?v=H0r_-Nf4kH8",
            "difficulty": "intermédiaire",
            "equipment": ["rameur"]
        },
        {
            "exercise_id": "ex_stair_climber",
            "name": "Stepper / Escalier",
            "category": "cardio",
            "muscle_groups": ["cardio", "fessiers", "quadriceps"],
            "description": "Simulation de montée d'escalier.",
            "instructions": [
                "Montez sur le stepper",
                "Posez les pieds sur les marches",
                "Montez à rythme régulier",
                "Ne vous appuyez pas trop sur les poignées"
            ],
            "tips": ["Excellent pour les fessiers", "Intense pour le cardio"],
            "video_url": "https://www.youtube.com/watch?v=dQqApCGd5Ss",
            "difficulty": "intermédiaire",
            "equipment": ["stepper", "escalier machine"]
        },
        {
            "exercise_id": "ex_jump_rope",
            "name": "Corde à Sauter",
            "category": "cardio",
            "muscle_groups": ["cardio", "mollets", "épaules"],
            "description": "Cardio classique avec corde à sauter.",
            "instructions": [
                "Tenez la corde aux poignées",
                "Faites tourner avec les poignets",
                "Sautez juste assez pour passer la corde",
                "Gardez un rythme régulier"
            ],
            "tips": ["Restez sur la pointe des pieds", "Bon pour la coordination"],
            "video_url": "https://www.youtube.com/watch?v=u3zgHI8QnqE",
            "difficulty": "débutant",
            "equipment": ["corde à sauter"]
        },
        {
            "exercise_id": "ex_burpees",
            "name": "Burpees",
            "category": "cardio",
            "muscle_groups": ["corps entier", "cardio"],
            "description": "Exercice cardio intense full body.",
            "instructions": [
                "Debout, descendez en squat",
                "Posez les mains et sautez en planche",
                "Faites une pompe",
                "Ramenez les pieds et sautez en l'air"
            ],
            "tips": ["Maintenez un rythme soutenu", "Gardez le core engagé"],
            "video_url": "https://www.youtube.com/watch?v=dZgVxmf6jkA",
            "difficulty": "avancé",
            "equipment": []
        },
        {
            "exercise_id": "ex_jumping_jacks",
            "name": "Jumping Jacks",
            "category": "cardio",
            "muscle_groups": ["corps entier", "cardio"],
            "description": "Exercice cardio classique d'échauffement.",
            "instructions": [
                "Debout, pieds joints, bras le long du corps",
                "Sautez en écartant les pieds et en levant les bras",
                "Revenez à la position de départ en sautant"
            ],
            "tips": ["Gardez un rythme régulier", "Atterrissez en douceur"],
            "video_url": "https://www.youtube.com/watch?v=c4DAnQ6DtF8",
            "difficulty": "débutant",
            "equipment": []
        },
        {
            "exercise_id": "ex_high_knees",
            "name": "Montées de Genoux",
            "category": "cardio",
            "muscle_groups": ["quadriceps", "cardio"],
            "description": "Course sur place avec genoux hauts.",
            "instructions": [
                "Debout, courez sur place",
                "Levez les genoux le plus haut possible",
                "Pompez avec les bras"
            ],
            "tips": ["Gardez le rythme élevé", "Restez sur la pointe des pieds"],
            "video_url": "https://www.youtube.com/watch?v=D0bp9r-V9dE",
            "difficulty": "débutant",
            "equipment": []
        },
        {
            "exercise_id": "ex_box_jumps",
            "name": "Box Jumps",
            "category": "cardio",
            "muscle_groups": ["quadriceps", "fessiers", "mollets"],
            "description": "Exercice pliométrique explosif.",
            "instructions": [
                "Face à une box, pieds à largeur des épaules",
                "Fléchissez et sautez sur la box",
                "Atterrissez en douceur, genoux fléchis",
                "Redescendez et répétez"
            ],
            "tips": ["Commencez avec une hauteur basse", "Atterrissez avec tout le pied"],
            "video_url": "https://www.youtube.com/watch?v=52r_Ul5k03g",
            "difficulty": "intermédiaire",
            "equipment": ["box", "step"]
        },
        
        # ==================== EXERCICES ADDITIONNELS - MACHINES SPÉCIALISÉES ====================
        
        # Machines Pectoraux
        {
            "exercise_id": "ex_converging_chest_press",
            "name": "Presse Pectorale Convergente",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps"],
            "description": "Machine avec mouvement convergent imitant les écartés.",
            "instructions": [
                "Réglez le siège pour avoir les poignées au niveau de la poitrine",
                "Poussez vers l'avant et vers le centre",
                "Serrez les pectoraux en fin de mouvement"
            ],
            "tips": ["Mouvement fluide", "Contrôlez le retour"],
            "video_url": "https://www.youtube.com/watch?v=xUm0BiZCWlQ",
            "difficulty": "débutant",
            "equipment": ["machine presse convergente"]
        },
        {
            "exercise_id": "ex_hammer_strength_incline",
            "name": "Hammer Strength Incliné",
            "category": "chest",
            "muscle_groups": ["pectoraux supérieurs", "triceps"],
            "description": "Machine Hammer Strength pour le haut des pectoraux.",
            "instructions": [
                "Asseyez-vous et réglez le siège",
                "Poussez les poignées vers le haut et l'avant",
                "Descendez avec contrôle"
            ],
            "tips": ["Charge indépendante par côté", "Excellent pour corriger les déséquilibres"],
            "video_url": "https://www.youtube.com/watch?v=5r3cVZqTJkA",
            "difficulty": "débutant",
            "equipment": ["hammer strength incliné"]
        },
        {
            "exercise_id": "ex_hammer_strength_decline",
            "name": "Hammer Strength Décliné",
            "category": "chest",
            "muscle_groups": ["pectoraux inférieurs", "triceps"],
            "description": "Machine Hammer Strength pour le bas des pectoraux.",
            "instructions": [
                "Asseyez-vous face à la machine",
                "Poussez vers le bas et l'avant",
                "Serrez les pectoraux"
            ],
            "tips": ["Mouvement guidé et sécurisé"],
            "video_url": "https://www.youtube.com/watch?v=8rGGPSNJWkA",
            "difficulty": "débutant",
            "equipment": ["hammer strength décliné"]
        },
        
        # Machines Dos
        {
            "exercise_id": "ex_hammer_row",
            "name": "Hammer Strength Row",
            "category": "back",
            "muscle_groups": ["dorsaux", "rhomboïdes", "biceps"],
            "description": "Rowing sur machine Hammer Strength.",
            "instructions": [
                "Placez la poitrine contre le support",
                "Tirez les poignées vers les hanches",
                "Serrez les omoplates"
            ],
            "tips": ["Travail unilatéral possible", "Charge indépendante"],
            "video_url": "https://www.youtube.com/watch?v=xQNrFHEMhI4",
            "difficulty": "débutant",
            "equipment": ["hammer strength row"]
        },
        {
            "exercise_id": "ex_iso_lateral_row",
            "name": "Iso-Lateral Row Machine",
            "category": "back",
            "muscle_groups": ["dorsaux", "rhomboïdes"],
            "description": "Rowing avec mouvement iso-latéral.",
            "instructions": [
                "Asseyez-vous face à la machine",
                "Tirez un bras puis l'autre alternativement",
                "Ou tirez les deux ensemble"
            ],
            "tips": ["Permet de travailler chaque côté indépendamment"],
            "video_url": "https://www.youtube.com/watch?v=sP_4vybjVJs",
            "difficulty": "débutant",
            "equipment": ["machine iso-lateral row"]
        },
        {
            "exercise_id": "ex_low_row_machine",
            "name": "Low Row Machine",
            "category": "back",
            "muscle_groups": ["dorsaux", "rhomboïdes", "biceps"],
            "description": "Machine de rowing bas pour le dos.",
            "instructions": [
                "Asseyez-vous, poitrine contre le support",
                "Tirez les poignées vers le bas de la poitrine",
                "Serrez les omoplates"
            ],
            "tips": ["Cible le milieu du dos", "Mouvement contrôlé"],
            "video_url": "https://www.youtube.com/watch?v=GZbfZ033f74",
            "difficulty": "débutant",
            "equipment": ["machine low row"]
        },
        {
            "exercise_id": "ex_high_row_machine",
            "name": "High Row Machine",
            "category": "back",
            "muscle_groups": ["dorsaux", "trapèzes", "rhomboïdes"],
            "description": "Machine de rowing haut.",
            "instructions": [
                "Asseyez-vous et saisissez les poignées",
                "Tirez vers le haut de l'abdomen",
                "Gardez les coudes hauts"
            ],
            "tips": ["Cible le haut du dos et les trapèzes"],
            "video_url": "https://www.youtube.com/watch?v=H75im9fAUMc",
            "difficulty": "débutant",
            "equipment": ["machine high row"]
        },
        
        # Machines Jambes Avancées
        {
            "exercise_id": "ex_vertical_leg_press",
            "name": "Presse à Cuisses Verticale",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Presse à cuisses en position verticale.",
            "instructions": [
                "Allongez-vous sous la plateforme",
                "Pieds sur la plateforme, écartés",
                "Poussez vers le haut",
                "Ne verrouillez pas les genoux"
            ],
            "tips": ["Attention au poids en position haute", "Demandez un partenaire"],
            "video_url": "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
            "difficulty": "avancé",
            "equipment": ["presse verticale"]
        },
        {
            "exercise_id": "ex_smith_squat",
            "name": "Squat Smith Machine",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "ischio-jambiers"],
            "description": "Squat guidé sur Smith Machine.",
            "instructions": [
                "Positionnez-vous sous la barre",
                "Pieds légèrement en avant",
                "Descendez en squat",
                "Remontez en poussant"
            ],
            "tips": ["Plus sécurisé que le squat libre", "Idéal pour s'entraîner seul"],
            "video_url": "https://www.youtube.com/watch?v=IhK9Zcx9J0M",
            "difficulty": "intermédiaire",
            "equipment": ["smith machine"]
        },
        {
            "exercise_id": "ex_smith_lunges",
            "name": "Fentes Smith Machine",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Fentes guidées sur Smith Machine.",
            "instructions": [
                "Barre sur les trapèzes",
                "Faites une fente avant",
                "Alternez ou finissez toutes les reps d'un côté"
            ],
            "tips": ["Mouvement guidé et sécurisé"],
            "video_url": "https://www.youtube.com/watch?v=LZMEd5nY6_o",
            "difficulty": "intermédiaire",
            "equipment": ["smith machine"]
        },
        {
            "exercise_id": "ex_glute_drive",
            "name": "Glute Drive Machine",
            "category": "legs",
            "muscle_groups": ["fessiers", "ischio-jambiers"],
            "description": "Machine spécialisée pour les fessiers.",
            "instructions": [
                "Asseyez-vous sur la machine",
                "Placez la ceinture sur les hanches",
                "Poussez les hanches vers le haut",
                "Serrez les fessiers en haut"
            ],
            "tips": ["Excellente activation des fessiers", "Alternative au hip thrust"],
            "video_url": "https://www.youtube.com/watch?v=xDmFkJxPzeM",
            "difficulty": "débutant",
            "equipment": ["machine glute drive"]
        },
        {
            "exercise_id": "ex_glute_kickback_machine",
            "name": "Kickback Fessiers Machine",
            "category": "legs",
            "muscle_groups": ["fessiers"],
            "description": "Extension de hanche sur machine.",
            "instructions": [
                "Positionnez-vous sur la machine",
                "Placez le pied sur la plateforme",
                "Poussez vers l'arrière",
                "Contractez le fessier"
            ],
            "tips": ["Isolation parfaite des fessiers"],
            "video_url": "https://www.youtube.com/watch?v=U_lH0M0pwgA",
            "difficulty": "débutant",
            "equipment": ["machine kickback"]
        },
        {
            "exercise_id": "ex_donkey_calf_raise",
            "name": "Mollets Donkey Machine",
            "category": "legs",
            "muscle_groups": ["mollets"],
            "description": "Extension des mollets en position penchée.",
            "instructions": [
                "Penchez-vous sur la machine",
                "Pieds sur le rebord",
                "Montez sur la pointe des pieds",
                "Étirez bien en bas"
            ],
            "tips": ["Grand étirement des mollets", "Très efficace"],
            "video_url": "https://www.youtube.com/watch?v=2jERHGNrmhI",
            "difficulty": "intermédiaire",
            "equipment": ["machine donkey calf"]
        },
        {
            "exercise_id": "ex_tibia_raise_machine",
            "name": "Tibias Antérieurs Machine",
            "category": "legs",
            "muscle_groups": ["tibialis anterior"],
            "description": "Flexion dorsale pour le tibia antérieur.",
            "instructions": [
                "Asseyez-vous, pieds sous le coussin",
                "Relevez les pieds vers vous",
                "Descendez lentement"
            ],
            "tips": ["Important pour l'équilibre musculaire", "Prévention des blessures"],
            "video_url": "https://www.youtube.com/watch?v=gP3HvJrfzHA",
            "difficulty": "débutant",
            "equipment": ["machine tibia"]
        },
        
        # Machines Épaules
        {
            "exercise_id": "ex_hammer_shoulder_press",
            "name": "Hammer Strength Épaules",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes", "triceps"],
            "description": "Développé épaules sur Hammer Strength.",
            "instructions": [
                "Asseyez-vous, dos contre le dossier",
                "Poussez les poignées vers le haut",
                "Descendez avec contrôle"
            ],
            "tips": ["Charge indépendante par côté"],
            "video_url": "https://www.youtube.com/watch?v=Wqq43dKW1TU",
            "difficulty": "débutant",
            "equipment": ["hammer strength épaules"]
        },
        {
            "exercise_id": "ex_rear_delt_machine",
            "name": "Deltoïdes Postérieurs Machine",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes postérieurs", "rhomboïdes"],
            "description": "Machine pour l'arrière des épaules.",
            "instructions": [
                "Asseyez-vous face à la machine",
                "Saisissez les poignées",
                "Écartez vers l'arrière",
                "Serrez les omoplates"
            ],
            "tips": ["Concentrez-vous sur la contraction"],
            "video_url": "https://www.youtube.com/watch?v=5YK4bgzXDp0",
            "difficulty": "débutant",
            "equipment": ["machine deltoïdes postérieurs"]
        },
        
        # Machines Bras
        {
            "exercise_id": "ex_cable_tricep_overhead",
            "name": "Extension Triceps Overhead Câble",
            "category": "arms",
            "muscle_groups": ["triceps"],
            "description": "Extension triceps derrière la tête à la poulie.",
            "instructions": [
                "Face opposée à la poulie basse",
                "Corde derrière la tête",
                "Étendez les bras vers le haut",
                "Gardez les coudes fixes"
            ],
            "tips": ["Grand étirement de la longue portion"],
            "video_url": "https://www.youtube.com/watch?v=YbX7Wd8jQ-Q",
            "difficulty": "intermédiaire",
            "equipment": ["poulie basse", "corde"]
        },
        {
            "exercise_id": "ex_reverse_grip_pushdown",
            "name": "Extension Triceps Prise Supination",
            "category": "arms",
            "muscle_groups": ["triceps"],
            "description": "Extension triceps avec prise inversée.",
            "instructions": [
                "Face à la poulie haute",
                "Saisissez la barre paumes vers le haut",
                "Poussez vers le bas",
                "Gardez les coudes au corps"
            ],
            "tips": ["Cible différemment les triceps"],
            "video_url": "https://www.youtube.com/watch?v=2-LAMcpzODU",
            "difficulty": "débutant",
            "equipment": ["poulie haute", "barre droite"]
        },
        {
            "exercise_id": "ex_bayesian_curl",
            "name": "Bayesian Curl",
            "category": "arms",
            "muscle_groups": ["biceps"],
            "description": "Curl avec bras derrière le corps à la poulie.",
            "instructions": [
                "Dos à la poulie basse",
                "Bras en arrière, saisissez la poignée",
                "Curl vers l'épaule",
                "Gardez le coude fixe"
            ],
            "tips": ["Grand étirement des biceps", "Excellent pour la longue portion"],
            "video_url": "https://www.youtube.com/watch?v=soxrZlIl35U",
            "difficulty": "intermédiaire",
            "equipment": ["poulie basse"]
        },
        {
            "exercise_id": "ex_cross_body_curl",
            "name": "Curl Cross Body",
            "category": "arms",
            "muscle_groups": ["biceps", "brachial"],
            "description": "Curl en croisant le corps.",
            "instructions": [
                "Haltère dans une main",
                "Curl vers l'épaule opposée",
                "Croisez le corps",
                "Alternez"
            ],
            "tips": ["Cible le brachial", "Amplitude différente"],
            "video_url": "https://www.youtube.com/watch?v=Eh6qEh7hqjc",
            "difficulty": "débutant",
            "equipment": ["haltères"]
        },
        {
            "exercise_id": "ex_zottman_curl",
            "name": "Zottman Curl",
            "category": "arms",
            "muscle_groups": ["biceps", "avant-bras"],
            "description": "Curl avec rotation pour biceps et avant-bras.",
            "instructions": [
                "Curl classique en supination",
                "En haut, tournez les poignets en pronation",
                "Descendez en pronation",
                "Tournez en bas et répétez"
            ],
            "tips": ["Travaille biceps et avant-bras ensemble"],
            "video_url": "https://www.youtube.com/watch?v=ZrpRBgswtHs",
            "difficulty": "intermédiaire",
            "equipment": ["haltères"]
        },
        {
            "exercise_id": "ex_drag_curl",
            "name": "Drag Curl",
            "category": "arms",
            "muscle_groups": ["biceps"],
            "description": "Curl en tirant la barre le long du corps.",
            "instructions": [
                "Debout, barre devant les cuisses",
                "Montez la barre le long du corps",
                "Coudes vers l'arrière",
                "Descendez de la même façon"
            ],
            "tips": ["Isole les biceps", "Coudes mobiles vers l'arrière"],
            "video_url": "https://www.youtube.com/watch?v=2L2lnxIcNmo",
            "difficulty": "intermédiaire",
            "equipment": ["barre", "haltères"]
        },
        
        # Exercices Fonctionnels
        {
            "exercise_id": "ex_farmers_walk",
            "name": "Farmer's Walk",
            "category": "core",
            "muscle_groups": ["avant-bras", "trapèzes", "core", "jambes"],
            "description": "Marche avec charges lourdes dans chaque main.",
            "instructions": [
                "Saisissez des haltères ou des farmer's handles",
                "Marchez en gardant le dos droit",
                "Serrez fort les poignées",
                "Gardez les épaules en arrière"
            ],
            "tips": ["Excellent pour la force globale", "Travaille la préhension"],
            "video_url": "https://www.youtube.com/watch?v=Fkzk_RqlYig",
            "difficulty": "intermédiaire",
            "equipment": ["haltères", "farmer's handles"]
        },
        {
            "exercise_id": "ex_suitcase_carry",
            "name": "Suitcase Carry",
            "category": "core",
            "muscle_groups": ["obliques", "core", "avant-bras"],
            "description": "Marche avec charge d'un seul côté.",
            "instructions": [
                "Tenez un haltère ou kettlebell d'un côté",
                "Marchez en restant droit",
                "Résistez à l'inclinaison",
                "Changez de côté"
            ],
            "tips": ["Excellent pour les obliques", "Travail anti-latéral"],
            "video_url": "https://www.youtube.com/watch?v=E94UNm8fD-4",
            "difficulty": "intermédiaire",
            "equipment": ["haltère", "kettlebell"]
        },
        {
            "exercise_id": "ex_turkish_getup",
            "name": "Turkish Get-Up",
            "category": "core",
            "muscle_groups": ["corps entier", "core", "épaules"],
            "description": "Exercice fonctionnel complet de mobilité et force.",
            "instructions": [
                "Allongé, kettlebell dans une main vers le plafond",
                "Levez-vous en gardant le poids en l'air",
                "Passez par plusieurs positions",
                "Inversez le mouvement"
            ],
            "tips": ["Apprenez d'abord sans poids", "Excellent pour la mobilité"],
            "video_url": "https://www.youtube.com/watch?v=0bWRPC6gdPg",
            "difficulty": "avancé",
            "equipment": ["kettlebell"]
        },
        {
            "exercise_id": "ex_landmine_press",
            "name": "Landmine Press",
            "category": "shoulders",
            "muscle_groups": ["épaules", "pectoraux", "triceps"],
            "description": "Développé avec barre ancrée au sol.",
            "instructions": [
                "Barre dans la landmine ou dans un coin",
                "Tenez l'extrémité de la barre",
                "Poussez vers le haut et l'avant",
                "Descendez avec contrôle"
            ],
            "tips": ["Angle unique pour les épaules", "Moins de stress articulaire"],
            "video_url": "https://www.youtube.com/watch?v=Oy0tqIhIimI",
            "difficulty": "intermédiaire",
            "equipment": ["barre olympique", "landmine"]
        },
        {
            "exercise_id": "ex_landmine_row",
            "name": "Landmine Row",
            "category": "back",
            "muscle_groups": ["dorsaux", "rhomboïdes"],
            "description": "Rowing avec la barre en landmine.",
            "instructions": [
                "Barre ancrée, tenez l'extrémité",
                "Penchez-vous et tirez vers la hanche",
                "Serrez le dorsal",
                "Descendez lentement"
            ],
            "tips": ["Travail unilatéral ou bilatéral"],
            "video_url": "https://www.youtube.com/watch?v=j3Igk5nyZE4",
            "difficulty": "intermédiaire",
            "equipment": ["barre olympique", "landmine"]
        },
        {
            "exercise_id": "ex_landmine_squat",
            "name": "Landmine Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Squat avec barre en landmine.",
            "instructions": [
                "Tenez l'extrémité de la barre contre la poitrine",
                "Descendez en squat",
                "Gardez le buste droit",
                "Remontez en poussant"
            ],
            "tips": ["Bon pour apprendre le squat", "Moins de stress sur le dos"],
            "video_url": "https://www.youtube.com/watch?v=1s3c9wVkMd4",
            "difficulty": "débutant",
            "equipment": ["barre olympique", "landmine"]
        },
        
        # Kettlebell
        {
            "exercise_id": "ex_kettlebell_swing",
            "name": "Kettlebell Swing",
            "category": "cardio",
            "muscle_groups": ["fessiers", "ischio-jambiers", "core", "épaules"],
            "description": "Mouvement balistique avec kettlebell.",
            "instructions": [
                "Pieds plus larges que les hanches",
                "Kettlebell entre les jambes",
                "Balancez vers l'avant avec les hanches",
                "Bras tendus, poitrine haute"
            ],
            "tips": ["La puissance vient des hanches", "Ne soulevez pas avec les bras"],
            "video_url": "https://www.youtube.com/watch?v=YSxHifyI6s8",
            "difficulty": "intermédiaire",
            "equipment": ["kettlebell"]
        },
        {
            "exercise_id": "ex_kettlebell_clean",
            "name": "Kettlebell Clean",
            "category": "shoulders",
            "muscle_groups": ["épaules", "biceps", "core"],
            "description": "Épaulé avec kettlebell.",
            "instructions": [
                "Kettlebell entre les jambes",
                "Tirez avec les hanches",
                "Faites tourner autour du poignet",
                "Réceptionnez en position rack"
            ],
            "tips": ["Mouvement explosif", "Protégez le poignet"],
            "video_url": "https://www.youtube.com/watch?v=mge_NHFBQOI",
            "difficulty": "avancé",
            "equipment": ["kettlebell"]
        },
        {
            "exercise_id": "ex_kettlebell_snatch",
            "name": "Kettlebell Snatch",
            "category": "cardio",
            "muscle_groups": ["corps entier", "épaules", "fessiers"],
            "description": "Arraché avec kettlebell en un mouvement.",
            "instructions": [
                "Swing le kettlebell entre les jambes",
                "Tirez explosif vers le haut",
                "Insérez la main et verrouillez en haut",
                "Redescendez en contrôle"
            ],
            "tips": ["Mouvement technique", "Apprenez le swing et clean d'abord"],
            "video_url": "https://www.youtube.com/watch?v=0bYY8mxrUUY",
            "difficulty": "avancé",
            "equipment": ["kettlebell"]
        },
        {
            "exercise_id": "ex_kettlebell_windmill",
            "name": "Kettlebell Windmill",
            "category": "core",
            "muscle_groups": ["obliques", "épaules", "ischio-jambiers"],
            "description": "Flexion latérale avec kettlebell en l'air.",
            "instructions": [
                "Kettlebell au-dessus de la tête",
                "Tournez les pieds à 45°",
                "Penchez-vous vers le côté opposé",
                "Regardez le kettlebell"
            ],
            "tips": ["Excellent pour la mobilité", "Mouvement lent et contrôlé"],
            "video_url": "https://www.youtube.com/watch?v=EXnCzzST0oQ",
            "difficulty": "avancé",
            "equipment": ["kettlebell"]
        },
        
        # Cardio Supplémentaires
        {
            "exercise_id": "ex_assault_bike",
            "name": "Assault Bike / Air Bike",
            "category": "cardio",
            "muscle_groups": ["corps entier", "cardio"],
            "description": "Vélo à résistance air avec bras mobiles.",
            "instructions": [
                "Montez sur le vélo",
                "Pédalez et poussez/tirez avec les bras",
                "Plus vous allez vite, plus c'est dur"
            ],
            "tips": ["Parfait pour le HIIT", "Brûleur de calories intensif"],
            "video_url": "https://www.youtube.com/watch?v=HvFeE9VATKA",
            "difficulty": "intermédiaire",
            "equipment": ["assault bike", "air bike"]
        },
        {
            "exercise_id": "ex_ski_erg",
            "name": "Ski Erg",
            "category": "cardio",
            "muscle_groups": ["dorsaux", "triceps", "core", "cardio"],
            "description": "Machine simulant le ski de fond.",
            "instructions": [
                "Debout face à la machine",
                "Saisissez les poignées",
                "Tirez vers le bas en fléchissant les hanches",
                "Remontez et répétez"
            ],
            "tips": ["Excellent pour le haut du corps et cardio", "Utilisez les hanches"],
            "video_url": "https://www.youtube.com/watch?v=B0lIgT5PHc8",
            "difficulty": "intermédiaire",
            "equipment": ["ski erg"]
        },
        {
            "exercise_id": "ex_battle_ropes",
            "name": "Battle Ropes",
            "category": "cardio",
            "muscle_groups": ["épaules", "bras", "core", "cardio"],
            "description": "Exercice avec cordes ondulatoires.",
            "instructions": [
                "Tenez une corde dans chaque main",
                "Créez des vagues en alternant les bras",
                "Gardez les genoux légèrement fléchis",
                "Variez les mouvements (alternés, simultanés, slams)"
            ],
            "tips": ["Cardio intense", "Travaille tout le haut du corps"],
            "video_url": "https://www.youtube.com/watch?v=7hS5rZFLx2g",
            "difficulty": "intermédiaire",
            "equipment": ["battle ropes"]
        },
        {
            "exercise_id": "ex_sled_push",
            "name": "Poussée de Luge",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "mollets", "core"],
            "description": "Poussée de sled/luge chargée.",
            "instructions": [
                "Mains sur les poignées hautes ou basses",
                "Penchez-vous et poussez",
                "Marchez ou sprintez",
                "Gardez le core engagé"
            ],
            "tips": ["Excellent pour la puissance des jambes", "Peu de stress sur les genoux"],
            "video_url": "https://www.youtube.com/watch?v=VDLNPYdV9GU",
            "difficulty": "intermédiaire",
            "equipment": ["sled", "luge"]
        },
        {
            "exercise_id": "ex_sled_pull",
            "name": "Tirage de Luge",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps", "fessiers"],
            "description": "Tirage de sled vers soi avec corde.",
            "instructions": [
                "Face à la luge, corde en main",
                "Tirez la luge vers vous main par main",
                "Gardez le dos droit",
                "Reculez et répétez"
            ],
            "tips": ["Excellent pour le dos et la préhension"],
            "video_url": "https://www.youtube.com/watch?v=BSJIKV7h5po",
            "difficulty": "intermédiaire",
            "equipment": ["sled", "corde"]
        },
        
        # Exercices au sol
        {
            "exercise_id": "ex_v_ups",
            "name": "V-Ups",
            "category": "core",
            "muscle_groups": ["abdominaux", "fléchisseurs de hanches"],
            "description": "Crunch complet en V.",
            "instructions": [
                "Allongé, bras au-dessus de la tête",
                "Montez jambes et bras ensemble",
                "Touchez les orteils au sommet",
                "Redescendez avec contrôle"
            ],
            "tips": ["Gardez les jambes droites", "Mouvement coordonné"],
            "video_url": "https://www.youtube.com/watch?v=7UVgs18Y1P4",
            "difficulty": "intermédiaire",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_hollow_hold",
            "name": "Hollow Body Hold",
            "category": "core",
            "muscle_groups": ["abdominaux", "core"],
            "description": "Position creuse isométrique.",
            "instructions": [
                "Allongé, bras au-dessus de la tête",
                "Soulevez bras et jambes du sol",
                "Rentrez le nombril, dos plat au sol",
                "Maintenez la position"
            ],
            "tips": ["Base de la gymnastique", "Gardez le bas du dos plaqué"],
            "video_url": "https://www.youtube.com/watch?v=LlDNef_Ztsc",
            "difficulty": "intermédiaire",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_superman",
            "name": "Superman",
            "category": "back",
            "muscle_groups": ["lombaires", "fessiers"],
            "description": "Extension dorsale au sol.",
            "instructions": [
                "Allongé face au sol",
                "Bras tendus devant vous",
                "Soulevez bras et jambes simultanément",
                "Maintenez et redescendez"
            ],
            "tips": ["Ne pas hyperextendre", "Mouvement contrôlé"],
            "video_url": "https://www.youtube.com/watch?v=cc6UVRS7PW4",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_bird_dog",
            "name": "Bird Dog",
            "category": "core",
            "muscle_groups": ["core", "lombaires", "fessiers"],
            "description": "Extension alternée bras-jambe à quatre pattes.",
            "instructions": [
                "À quatre pattes, dos neutre",
                "Étendez un bras et la jambe opposée",
                "Maintenez aligné",
                "Alternez"
            ],
            "tips": ["Excellent pour la stabilité", "Gardez les hanches fixes"],
            "video_url": "https://www.youtube.com/watch?v=wiFNA3sqjCA",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_toe_touch",
            "name": "Toe Touch Crunch",
            "category": "core",
            "muscle_groups": ["abdominaux"],
            "description": "Crunch en touchant les orteils.",
            "instructions": [
                "Allongé, jambes verticales",
                "Montez les mains vers les pieds",
                "Soulevez les épaules",
                "Redescendez avec contrôle"
            ],
            "tips": ["Concentrez-vous sur la contraction abdominale"],
            "video_url": "https://www.youtube.com/watch?v=9F1I-b3-Z_k",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        
        # Mobilité et Étirements actifs
        {
            "exercise_id": "ex_hip_circles",
            "name": "Cercles de Hanches",
            "category": "legs",
            "muscle_groups": ["hanches", "fléchisseurs"],
            "description": "Mobilité des hanches en cercles.",
            "instructions": [
                "Debout sur une jambe",
                "Levez le genou et faites des cercles",
                "Dans les deux sens",
                "Changez de jambe"
            ],
            "tips": ["Échauffement idéal", "Améliore la mobilité"],
            "video_url": "https://www.youtube.com/watch?v=mVYzNUJF5Kg",
            "difficulty": "débutant",
            "equipment": []
        },
        {
            "exercise_id": "ex_arm_circles",
            "name": "Cercles de Bras",
            "category": "shoulders",
            "muscle_groups": ["épaules"],
            "description": "Mobilité des épaules en cercles.",
            "instructions": [
                "Bras tendus sur les côtés",
                "Faites des petits cercles",
                "Agrandissez progressivement",
                "Inversez le sens"
            ],
            "tips": ["Échauffement épaules", "Progressif"],
            "video_url": "https://www.youtube.com/watch?v=140RTsLSxrY",
            "difficulty": "débutant",
            "equipment": []
        },
        {
            "exercise_id": "ex_worlds_greatest_stretch",
            "name": "World's Greatest Stretch",
            "category": "core",
            "muscle_groups": ["hanches", "thoracique", "ischio-jambiers"],
            "description": "Étirement dynamique complet.",
            "instructions": [
                "Fente avant, main au sol",
                "Rotation thoracique vers le haut",
                "Redressez la jambe avant",
                "Répétez de l'autre côté"
            ],
            "tips": ["Excellent échauffement", "Mobilité complète"],
            "video_url": "https://www.youtube.com/watch?v=HqzTcz7aI8E",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        
        # Exercices avec élastiques
        {
            "exercise_id": "ex_band_pull_apart",
            "name": "Band Pull Apart",
            "category": "back",
            "muscle_groups": ["deltoïdes postérieurs", "rhomboïdes"],
            "description": "Écartement avec élastique.",
            "instructions": [
                "Élastique devant vous, bras tendus",
                "Écartez les mains",
                "Serrez les omoplates",
                "Revenez lentement"
            ],
            "tips": ["Excellent pour la posture", "Parfait pour l'échauffement"],
            "video_url": "https://www.youtube.com/watch?v=8lDC4Ri9zAQ",
            "difficulty": "débutant",
            "equipment": ["élastique de résistance"]
        },
        {
            "exercise_id": "ex_band_face_pull",
            "name": "Band Face Pull",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes postérieurs", "rotateurs externes"],
            "description": "Face pull avec élastique.",
            "instructions": [
                "Élastique à hauteur de visage",
                "Tirez vers le visage",
                "Écartez les mains en fin de mouvement",
                "Serrez les omoplates"
            ],
            "tips": ["Version portable du face pull câble"],
            "video_url": "https://www.youtube.com/watch?v=rep-qVOkqgk",
            "difficulty": "débutant",
            "equipment": ["élastique de résistance"]
        },
        {
            "exercise_id": "ex_band_good_morning",
            "name": "Band Good Morning",
            "category": "back",
            "muscle_groups": ["ischio-jambiers", "lombaires", "fessiers"],
            "description": "Good morning avec élastique.",
            "instructions": [
                "Élastique sous les pieds, autour du cou",
                "Penchez-vous en gardant le dos droit",
                "Poussez les hanches en arrière",
                "Remontez en contractant les fessiers"
            ],
            "tips": ["Bon échauffement pour les ischio-jambiers"],
            "video_url": "https://www.youtube.com/watch?v=vKPGe8zb2S4",
            "difficulty": "débutant",
            "equipment": ["élastique de résistance"]
        },
        {
            "exercise_id": "ex_band_squat",
            "name": "Band Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Squat avec élastique de résistance.",
            "instructions": [
                "Élastique sous les pieds, sur les épaules",
                "Descendez en squat",
                "La résistance augmente en montant",
                "Gardez le dos droit"
            ],
            "tips": ["Ajoute de la résistance en haut du mouvement"],
            "video_url": "https://www.youtube.com/watch?v=VWn6PKgXhfY",
            "difficulty": "débutant",
            "equipment": ["élastique de résistance"]
        },
        {
            "exercise_id": "ex_band_lateral_walk",
            "name": "Band Lateral Walk",
            "category": "legs",
            "muscle_groups": ["abducteurs", "moyen fessier"],
            "description": "Marche latérale avec élastique.",
            "instructions": [
                "Élastique autour des chevilles ou genoux",
                "Position semi-squat",
                "Marchez latéralement",
                "Gardez la tension constante"
            ],
            "tips": ["Excellent pour l'activation des fessiers"],
            "video_url": "https://www.youtube.com/watch?v=8J25RV0CHnA",
            "difficulty": "débutant",
            "equipment": ["élastique mini-band"]
        },
        
        # ==================== EXERCICES SUPPLÉMENTAIRES - EXTENSION MASSIVE ====================
        
        # === CALISTHENICS AVANCÉS ===
        {
            "exercise_id": "ex_muscle_up",
            "name": "Muscle Up",
            "category": "back",
            "muscle_groups": ["dorsaux", "pectoraux", "triceps", "biceps"],
            "description": "Mouvement explosif combinant traction et dip.",
            "instructions": [
                "Départ en suspension sur une barre",
                "Tirez explossivement en poussant les hanches vers la barre",
                "Passez au-dessus de la barre en transition",
                "Terminez par un dip"
            ],
            "tips": ["Mouvement avancé", "Travaillez d'abord les tractions explosives"],
            "video_url": "https://www.youtube.com/watch?v=NEJfsBPXfrc",
            "difficulty": "avancé",
            "equipment": ["barre de traction"]
        },
        {
            "exercise_id": "ex_front_lever",
            "name": "Front Lever",
            "category": "back",
            "muscle_groups": ["dorsaux", "abdominaux", "épaules"],
            "description": "Position statique horizontale face vers le haut.",
            "instructions": [
                "Suspendez-vous à une barre",
                "Levez le corps à l'horizontale face vers le haut",
                "Gardez les bras tendus",
                "Maintenez la position"
            ],
            "tips": ["Progressez avec les variantes tuck et straddle"],
            "video_url": "https://www.youtube.com/watch?v=K3EwjmqsPnw",
            "difficulty": "avancé",
            "equipment": ["barre de traction", "anneaux"]
        },
        {
            "exercise_id": "ex_back_lever",
            "name": "Back Lever",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps", "épaules"],
            "description": "Position statique horizontale face vers le bas.",
            "instructions": [
                "Suspendez-vous à une barre ou des anneaux",
                "Passez sous la barre et tendez le corps",
                "Maintenez la position horizontale face au sol"
            ],
            "tips": ["Plus accessible que le front lever", "Attention à la tension sur les biceps"],
            "video_url": "https://www.youtube.com/watch?v=Ev-Kv5BHnxQ",
            "difficulty": "avancé",
            "equipment": ["barre de traction", "anneaux"]
        },
        {
            "exercise_id": "ex_planche",
            "name": "Planche",
            "category": "shoulders",
            "muscle_groups": ["épaules", "pectoraux", "core", "bras"],
            "description": "Position horizontale en appui sur les mains.",
            "instructions": [
                "Position de pompe, pieds au sol",
                "Penchez-vous en avant en gardant les bras tendus",
                "Levez progressivement les pieds",
                "Maintenez le corps horizontal"
            ],
            "tips": ["Travaillez d'abord le lean et le tuck planche"],
            "video_url": "https://www.youtube.com/watch?v=LyqDYAfq0Zs",
            "difficulty": "avancé",
            "equipment": ["parallettes", "sol"]
        },
        {
            "exercise_id": "ex_handstand",
            "name": "Handstand (ATR)",
            "category": "shoulders",
            "muscle_groups": ["épaules", "triceps", "core"],
            "description": "Équilibre sur les mains.",
            "instructions": [
                "Mains au sol, largeur d'épaules",
                "Lancez les jambes vers le haut",
                "Alignez corps et bras",
                "Maintenez l'équilibre"
            ],
            "tips": ["Commencez contre un mur", "Travaillez l'équilibre progressivement"],
            "video_url": "https://www.youtube.com/watch?v=KNC5lkoE2Fs",
            "difficulty": "avancé",
            "equipment": ["sol", "mur"]
        },
        {
            "exercise_id": "ex_handstand_pushup",
            "name": "Handstand Push-up",
            "category": "shoulders",
            "muscle_groups": ["épaules", "triceps", "trapèzes"],
            "description": "Pompe en équilibre sur les mains.",
            "instructions": [
                "Position ATR contre un mur",
                "Fléchissez les bras pour descendre la tête",
                "Poussez pour remonter",
                "Gardez le corps gainé"
            ],
            "tips": ["Commencez avec pike push-ups", "Utilisez un mur pour la sécurité"],
            "video_url": "https://www.youtube.com/watch?v=Oy5sOi7GpM8",
            "difficulty": "avancé",
            "equipment": ["mur"]
        },
        {
            "exercise_id": "ex_pistol_squat",
            "name": "Pistol Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "core"],
            "description": "Squat sur une jambe.",
            "instructions": [
                "Debout sur une jambe",
                "Descendez en squat complet",
                "L'autre jambe reste tendue devant",
                "Remontez sans aide"
            ],
            "tips": ["Demande force et mobilité", "Utilisez un support au début"],
            "video_url": "https://www.youtube.com/watch?v=vq5-vdgJc0I",
            "difficulty": "avancé",
            "equipment": []
        },
        {
            "exercise_id": "ex_shrimp_squat",
            "name": "Shrimp Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Squat sur une jambe avec le pied arrière attrapé.",
            "instructions": [
                "Debout sur une jambe",
                "Attrapez le pied opposé derrière vous",
                "Descendez le genou vers le sol",
                "Remontez en poussant"
            ],
            "tips": ["Cible plus les quadriceps que le pistol"],
            "video_url": "https://www.youtube.com/watch?v=TKt_VlMWKno",
            "difficulty": "avancé",
            "equipment": []
        },
        {
            "exercise_id": "ex_human_flag",
            "name": "Human Flag (Drapeau)",
            "category": "core",
            "muscle_groups": ["obliques", "dorsaux", "épaules"],
            "description": "Position horizontale en agrippant un poteau vertical.",
            "instructions": [
                "Agrippez un poteau vertical à deux mains",
                "Main du haut en pronation, main du bas en supination",
                "Levez le corps à l'horizontale",
                "Maintenez la position"
            ],
            "tips": ["Mouvement très avancé", "Travaillez d'abord les côtés"],
            "video_url": "https://www.youtube.com/watch?v=9gFhL3CsPr4",
            "difficulty": "avancé",
            "equipment": ["poteau vertical", "barres"]
        },
        {
            "exercise_id": "ex_dragon_flag",
            "name": "Dragon Flag",
            "category": "core",
            "muscle_groups": ["abdominaux", "dorsaux"],
            "description": "Lever de corps horizontal en appui sur les épaules.",
            "instructions": [
                "Allongé sur un banc, agrippez au-dessus de la tête",
                "Levez le corps en gardant seules les épaules en contact",
                "Descendez lentement jusqu'à presque toucher le banc",
                "Remontez avec contrôle"
            ],
            "tips": ["Popularisé par Bruce Lee", "Gardez le corps parfaitement droit"],
            "video_url": "https://www.youtube.com/watch?v=moyFIvRrS0s",
            "difficulty": "avancé",
            "equipment": ["banc"]
        },
        {
            "exercise_id": "ex_l_sit",
            "name": "L-Sit",
            "category": "core",
            "muscle_groups": ["abdominaux", "hip flexors", "triceps"],
            "description": "Position statique en L sur supports.",
            "instructions": [
                "Mains sur parallettes ou sol",
                "Poussez pour soulever le corps",
                "Jambes tendues à l'horizontale",
                "Maintenez la position"
            ],
            "tips": ["Travaillez d'abord les genoux pliés"],
            "video_url": "https://www.youtube.com/watch?v=IUZJoSP66HI",
            "difficulty": "intermédiaire",
            "equipment": ["parallettes", "barres"]
        },
        {
            "exercise_id": "ex_v_sit",
            "name": "V-Sit",
            "category": "core",
            "muscle_groups": ["abdominaux", "hip flexors"],
            "description": "Position en V avec jambes levées.",
            "instructions": [
                "Mains au sol ou sur parallettes",
                "Soulevez le corps",
                "Montez les jambes au-dessus de l'horizontale",
                "Formez un V avec le corps"
            ],
            "tips": ["Progression du L-sit"],
            "video_url": "https://www.youtube.com/watch?v=5qn8XlQVxnQ",
            "difficulty": "avancé",
            "equipment": ["parallettes"]
        },
        {
            "exercise_id": "ex_ring_dips",
            "name": "Dips aux Anneaux",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "épaules"],
            "description": "Dips sur anneaux de gymnastique, très instables.",
            "instructions": [
                "Montez en appui sur les anneaux",
                "Descendez en fléchissant les coudes",
                "Gardez les anneaux près du corps",
                "Remontez en extension"
            ],
            "tips": ["Plus difficile que les dips classiques", "Travaillez d'abord le support"],
            "video_url": "https://www.youtube.com/watch?v=nj2OugnYMgA",
            "difficulty": "avancé",
            "equipment": ["anneaux de gymnastique"]
        },
        {
            "exercise_id": "ex_ring_rows",
            "name": "Ring Rows",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps", "rhomboïdes"],
            "description": "Tirage horizontal aux anneaux.",
            "instructions": [
                "Anneaux à hauteur de poitrine",
                "Inclinez-vous en arrière, corps gainé",
                "Tirez la poitrine vers les anneaux",
                "Descendez avec contrôle"
            ],
            "tips": ["Excellent exercice préparatoire"],
            "video_url": "https://www.youtube.com/watch?v=SptH_fYpTXI",
            "difficulty": "débutant",
            "equipment": ["anneaux de gymnastique"]
        },
        {
            "exercise_id": "ex_ring_pushups",
            "name": "Pompes aux Anneaux",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "core"],
            "description": "Pompes sur anneaux de gymnastique.",
            "instructions": [
                "Anneaux au sol, position de pompe",
                "Descendez la poitrine entre les anneaux",
                "Tournez les anneaux vers l'extérieur en bas",
                "Remontez en gardant le contrôle"
            ],
            "tips": ["L'instabilité augmente le travail du core"],
            "video_url": "https://www.youtube.com/watch?v=0W_Cs2TNNOM",
            "difficulty": "intermédiaire",
            "equipment": ["anneaux de gymnastique"]
        },
        
        # === KETTLEBELL AVANCÉ ===
        {
            "exercise_id": "ex_kb_snatch",
            "name": "Kettlebell Snatch",
            "category": "cardio",
            "muscle_groups": ["épaules", "dorsaux", "fessiers", "core"],
            "description": "Arraché kettlebell en un mouvement explosif.",
            "instructions": [
                "Départ en position de swing",
                "Tirez explossivement le kettlebell",
                "Guidez-le au-dessus de la tête",
                "Verrouillez le bras en haut"
            ],
            "tips": ["Mouvement technique", "Maîtrisez le swing d'abord"],
            "video_url": "https://www.youtube.com/watch?v=XGmJvF-F-6g",
            "difficulty": "avancé",
            "equipment": ["kettlebell"]
        },
        {
            "exercise_id": "ex_kb_windmill",
            "name": "Kettlebell Windmill",
            "category": "core",
            "muscle_groups": ["obliques", "épaules", "ischio-jambiers"],
            "description": "Moulin à vent avec kettlebell.",
            "instructions": [
                "Kettlebell en haut, bras tendu",
                "Pieds écartés, orteils vers un côté",
                "Penchez-vous latéralement vers le sol",
                "Gardez les yeux sur le kettlebell"
            ],
            "tips": ["Excellent pour la mobilité des hanches"],
            "video_url": "https://www.youtube.com/watch?v=iRFjX5WSKlg",
            "difficulty": "intermédiaire",
            "equipment": ["kettlebell"]
        },
        {
            "exercise_id": "ex_kb_bottoms_up_press",
            "name": "Bottoms Up Press",
            "category": "shoulders",
            "muscle_groups": ["épaules", "avant-bras", "core"],
            "description": "Développé avec kettlebell retourné.",
            "instructions": [
                "Tenez le kettlebell à l'envers (boule vers le haut)",
                "Gardez le poignet droit",
                "Poussez vers le haut",
                "Maintenez l'équilibre"
            ],
            "tips": ["Excellent pour la stabilité de l'épaule"],
            "video_url": "https://www.youtube.com/watch?v=k5PcL_WIx94",
            "difficulty": "intermédiaire",
            "equipment": ["kettlebell"]
        },
        {
            "exercise_id": "ex_kb_halo",
            "name": "Kettlebell Halo",
            "category": "shoulders",
            "muscle_groups": ["épaules", "trapèzes", "core"],
            "description": "Rotation du kettlebell autour de la tête.",
            "instructions": [
                "Tenez le kettlebell à l'envers devant vous",
                "Faites-le tourner autour de la tête",
                "Passez près des oreilles",
                "Alternez les directions"
            ],
            "tips": ["Excellent échauffement des épaules"],
            "video_url": "https://www.youtube.com/watch?v=p27rVbfOHFw",
            "difficulty": "débutant",
            "equipment": ["kettlebell"]
        },
        {
            "exercise_id": "ex_kb_renegade_row",
            "name": "Renegade Row",
            "category": "back",
            "muscle_groups": ["dorsaux", "core", "triceps"],
            "description": "Rowing en position de pompe avec kettlebells.",
            "instructions": [
                "Position de pompe sur deux kettlebells",
                "Tirez un kettlebell vers la hanche",
                "Gardez les hanches stables",
                "Alternez les côtés"
            ],
            "tips": ["Ne laissez pas les hanches tourner"],
            "video_url": "https://www.youtube.com/watch?v=eeH-SXPk2Mw",
            "difficulty": "intermédiaire",
            "equipment": ["kettlebells (2)"]
        },
        {
            "exercise_id": "ex_kb_figure_8",
            "name": "Kettlebell Figure 8",
            "category": "core",
            "muscle_groups": ["core", "fessiers", "épaules"],
            "description": "Passer le kettlebell en 8 autour des jambes.",
            "instructions": [
                "Position légèrement accroupie",
                "Passez le kettlebell autour d'une jambe",
                "Attrapez-le de l'autre main",
                "Continuez en formant un 8"
            ],
            "tips": ["Excellent pour la coordination"],
            "video_url": "https://www.youtube.com/watch?v=OJ6OKbODmNU",
            "difficulty": "intermédiaire",
            "equipment": ["kettlebell"]
        },
        {
            "exercise_id": "ex_kb_clean_and_press",
            "name": "Kettlebell Clean and Press",
            "category": "shoulders",
            "muscle_groups": ["épaules", "triceps", "core", "fessiers"],
            "description": "Clean puis développé en un mouvement.",
            "instructions": [
                "Départ bras tendus, kettlebell au sol",
                "Clean jusqu'à l'épaule",
                "Poussez au-dessus de la tête",
                "Redescendez en inversant"
            ],
            "tips": ["Mouvement complet du corps"],
            "video_url": "https://www.youtube.com/watch?v=HwLzAdriec0",
            "difficulty": "intermédiaire",
            "equipment": ["kettlebell"]
        },
        {
            "exercise_id": "ex_double_kb_swing",
            "name": "Double Kettlebell Swing",
            "category": "cardio",
            "muscle_groups": ["fessiers", "ischio-jambiers", "core", "dorsaux"],
            "description": "Swing avec deux kettlebells.",
            "instructions": [
                "Deux kettlebells entre les jambes",
                "Swing simultané des deux",
                "Extension explosive des hanches",
                "Contrôlez la descente"
            ],
            "tips": ["Double la charge et l'intensité"],
            "video_url": "https://www.youtube.com/watch?v=JNoG_v1PYlM",
            "difficulty": "intermédiaire",
            "equipment": ["kettlebells (2)"]
        },
        {
            "exercise_id": "ex_kb_thruster",
            "name": "Kettlebell Thruster",
            "category": "cardio",
            "muscle_groups": ["quadriceps", "fessiers", "épaules", "triceps"],
            "description": "Squat suivi d'un développé en un mouvement fluide.",
            "instructions": [
                "Kettlebells en position rack",
                "Descendez en squat",
                "En remontant, poussez les kettlebells au-dessus",
                "Mouvement fluide et explosif"
            ],
            "tips": ["Excellent exercice métabolique"],
            "video_url": "https://www.youtube.com/watch?v=M-7B9FEoXXI",
            "difficulty": "intermédiaire",
            "equipment": ["kettlebells (1-2)"]
        },
        
        # === MACHINES SPÉCIFIQUES HAMMER STRENGTH ===
        {
            "exercise_id": "ex_hammer_chest_press",
            "name": "Hammer Strength Chest Press",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "épaules"],
            "description": "Développé couché sur machine Hammer Strength.",
            "instructions": [
                "Asseyez-vous sur la machine, dos contre le dossier",
                "Saisissez les poignées à hauteur de poitrine",
                "Poussez vers l'avant",
                "Revenez lentement"
            ],
            "tips": ["Mouvement unilatéral possible", "Trajectoire convergente"],
            "video_url": "https://www.youtube.com/watch?v=qX9FSZJu448",
            "difficulty": "débutant",
            "equipment": ["Hammer Strength chest press"]
        },
        {
            "exercise_id": "ex_hammer_incline_press",
            "name": "Hammer Strength Incline Press",
            "category": "chest",
            "muscle_groups": ["pectoraux supérieurs", "épaules", "triceps"],
            "description": "Développé incliné sur machine Hammer Strength.",
            "instructions": [
                "Asseyez-vous sur la machine inclinée",
                "Poignées à hauteur des clavicules",
                "Poussez vers le haut et l'avant",
                "Contrôlez le retour"
            ],
            "tips": ["Excellent pour le haut des pectoraux"],
            "video_url": "https://www.youtube.com/watch?v=2NQZN6sOzZ8",
            "difficulty": "débutant",
            "equipment": ["Hammer Strength incline press"]
        },
        {
            "exercise_id": "ex_hammer_decline_press",
            "name": "Hammer Strength Decline Press",
            "category": "chest",
            "muscle_groups": ["pectoraux inférieurs", "triceps"],
            "description": "Développé décliné sur machine Hammer Strength.",
            "instructions": [
                "Asseyez-vous sur la machine déclinée",
                "Saisissez les poignées",
                "Poussez vers l'avant et le bas",
                "Retour contrôlé"
            ],
            "tips": ["Cible le bas des pectoraux"],
            "video_url": "https://www.youtube.com/watch?v=W0B9t2nXe0c",
            "difficulty": "débutant",
            "equipment": ["Hammer Strength decline press"]
        },
        {
            "exercise_id": "ex_hammer_shoulder_press",
            "name": "Hammer Strength Shoulder Press",
            "category": "shoulders",
            "muscle_groups": ["deltoïdes", "triceps"],
            "description": "Développé épaules sur machine Hammer Strength.",
            "instructions": [
                "Asseyez-vous, saisissez les poignées",
                "Poussez vers le haut",
                "Contrôlez la descente"
            ],
            "tips": ["Trajectoire naturelle", "Peut travailler un côté à la fois"],
            "video_url": "https://www.youtube.com/watch?v=Wqq43dKW1TU",
            "difficulty": "débutant",
            "equipment": ["Hammer Strength shoulder press"]
        },
        {
            "exercise_id": "ex_hammer_lat_pulldown",
            "name": "Hammer Strength Lat Pulldown",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps"],
            "description": "Tirage vertical sur machine Hammer Strength.",
            "instructions": [
                "Asseyez-vous sous les poignées",
                "Tirez vers le bas vers la poitrine",
                "Serrez les dorsaux",
                "Remontez lentement"
            ],
            "tips": ["Travail unilatéral possible"],
            "video_url": "https://www.youtube.com/watch?v=CAwf7n6Luuc",
            "difficulty": "débutant",
            "equipment": ["Hammer Strength lat pulldown"]
        },
        {
            "exercise_id": "ex_hammer_row",
            "name": "Hammer Strength Row",
            "category": "back",
            "muscle_groups": ["dorsaux", "rhomboïdes", "biceps"],
            "description": "Rowing sur machine Hammer Strength.",
            "instructions": [
                "Asseyez-vous poitrine contre le support",
                "Tirez les poignées vers vous",
                "Serrez les omoplates",
                "Retour contrôlé"
            ],
            "tips": ["Excellent pour l'épaisseur du dos"],
            "video_url": "https://www.youtube.com/watch?v=sP_4vybjVJs",
            "difficulty": "débutant",
            "equipment": ["Hammer Strength row"]
        },
        {
            "exercise_id": "ex_hammer_high_row",
            "name": "Hammer Strength High Row",
            "category": "back",
            "muscle_groups": ["dorsaux supérieurs", "rhomboïdes", "deltoïdes postérieurs"],
            "description": "Tirage haut sur machine Hammer Strength.",
            "instructions": [
                "Poitrine contre le support",
                "Tirez vers le haut de la poitrine",
                "Coudes vers l'extérieur",
                "Serrez en haut"
            ],
            "tips": ["Cible le haut du dos"],
            "video_url": "https://www.youtube.com/watch?v=Y7jG8fqlLFk",
            "difficulty": "débutant",
            "equipment": ["Hammer Strength high row"]
        },
        {
            "exercise_id": "ex_hammer_iso_row",
            "name": "Hammer Strength Iso-Lateral Row",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps"],
            "description": "Rowing unilatéral sur machine Hammer.",
            "instructions": [
                "Travaillez un bras à la fois",
                "Tirez vers la hanche",
                "Maximisez l'amplitude",
                "Alternez les côtés"
            ],
            "tips": ["Parfait pour corriger les déséquilibres"],
            "video_url": "https://www.youtube.com/watch?v=ORssPzSDxWc",
            "difficulty": "débutant",
            "equipment": ["Hammer Strength iso-lateral row"]
        },
        
        # === VARIATIONS DE POMPES ===
        {
            "exercise_id": "ex_archer_pushup",
            "name": "Archer Push-up",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "core"],
            "description": "Pompe avec un bras étendu sur le côté.",
            "instructions": [
                "Position large",
                "Descendez vers une main",
                "L'autre bras reste tendu",
                "Alternez les côtés"
            ],
            "tips": ["Progression vers la pompe à un bras"],
            "video_url": "https://www.youtube.com/watch?v=Kgs1YoxV7Dk",
            "difficulty": "avancé",
            "equipment": []
        },
        {
            "exercise_id": "ex_one_arm_pushup",
            "name": "One-Arm Push-up",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "core"],
            "description": "Pompe sur un seul bras.",
            "instructions": [
                "Position de pompe, une main derrière le dos",
                "Pieds écartés pour l'équilibre",
                "Descendez lentement",
                "Poussez pour remonter"
            ],
            "tips": ["Mouvement très avancé", "Gardez le corps aligné"],
            "video_url": "https://www.youtube.com/watch?v=SZrnejCoC5M",
            "difficulty": "avancé",
            "equipment": []
        },
        {
            "exercise_id": "ex_clap_pushup",
            "name": "Clap Push-up",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps"],
            "description": "Pompe explosive avec claquement de mains.",
            "instructions": [
                "Position de pompe standard",
                "Descendez puis poussez explosivement",
                "Claquez des mains en l'air",
                "Atterrissez en douceur"
            ],
            "tips": ["Développe la puissance"],
            "video_url": "https://www.youtube.com/watch?v=EYwWCgM198U",
            "difficulty": "intermédiaire",
            "equipment": []
        },
        {
            "exercise_id": "ex_pike_pushup",
            "name": "Pike Push-up",
            "category": "shoulders",
            "muscle_groups": ["épaules", "triceps"],
            "description": "Pompe en position de V inversé ciblant les épaules.",
            "instructions": [
                "Position de pompe, fesses vers le haut",
                "Formez un V inversé",
                "Descendez la tête vers le sol",
                "Poussez pour remonter"
            ],
            "tips": ["Excellente progression vers le HSPU"],
            "video_url": "https://www.youtube.com/watch?v=x7_I5SUAd00",
            "difficulty": "intermédiaire",
            "equipment": []
        },
        {
            "exercise_id": "ex_hindu_pushup",
            "name": "Hindu Push-up",
            "category": "chest",
            "muscle_groups": ["pectoraux", "épaules", "core", "dos"],
            "description": "Pompe fluide avec mouvement de plongeon.",
            "instructions": [
                "Départ en V inversé",
                "Plongez vers l'avant en descendant",
                "Relevez la poitrine, hanches basses",
                "Revenez en V inversé"
            ],
            "tips": ["Excellent pour la mobilité"],
            "video_url": "https://www.youtube.com/watch?v=73sFSTf3_6Y",
            "difficulty": "intermédiaire",
            "equipment": []
        },
        {
            "exercise_id": "ex_sphinx_pushup",
            "name": "Sphinx Push-up",
            "category": "arms",
            "muscle_groups": ["triceps", "pectoraux"],
            "description": "Pompe avec appui sur les avant-bras.",
            "instructions": [
                "Position de planche sur les avant-bras",
                "Poussez pour monter sur les mains",
                "Redescendez sur les avant-bras",
                "Gardez le corps gainé"
            ],
            "tips": ["Excellent pour les triceps"],
            "video_url": "https://www.youtube.com/watch?v=2sFR3l5Hgdw",
            "difficulty": "intermédiaire",
            "equipment": []
        },
        {
            "exercise_id": "ex_typewriter_pushup",
            "name": "Typewriter Push-up",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "core"],
            "description": "Pompe avec déplacement latéral en bas.",
            "instructions": [
                "Position large",
                "Descendez, puis déplacez-vous latéralement",
                "D'un côté à l'autre comme une machine à écrire",
                "Remontez et recommencez"
            ],
            "tips": ["Mouvement avancé"],
            "video_url": "https://www.youtube.com/watch?v=7ULWiI1wPKU",
            "difficulty": "avancé",
            "equipment": []
        },
        {
            "exercise_id": "ex_spiderman_pushup",
            "name": "Spiderman Push-up",
            "category": "chest",
            "muscle_groups": ["pectoraux", "obliques", "triceps"],
            "description": "Pompe avec genou ramené vers le coude.",
            "instructions": [
                "Position de pompe standard",
                "En descendant, ramenez un genou vers le coude",
                "Alternez les côtés",
                "Gardez le core engagé"
            ],
            "tips": ["Excellent pour le core"],
            "video_url": "https://www.youtube.com/watch?v=nV2gpfqvW0c",
            "difficulty": "intermédiaire",
            "equipment": []
        },
        
        # === EXERCICES FONCTIONNELS ===
        {
            "exercise_id": "ex_turkish_getup",
            "name": "Turkish Get-up",
            "category": "core",
            "muscle_groups": ["core", "épaules", "jambes", "dos"],
            "description": "Se lever du sol en maintenant un poids au-dessus de la tête.",
            "instructions": [
                "Allongé, bras tendu avec poids",
                "Levez-vous en gardant le poids au-dessus",
                "Passez par plusieurs positions",
                "Redescendez en inversant"
            ],
            "tips": ["Exercice complet", "Apprenez chaque étape"],
            "video_url": "https://www.youtube.com/watch?v=0bWRPC6-Ixw",
            "difficulty": "avancé",
            "equipment": ["kettlebell", "haltère"]
        },
        {
            "exercise_id": "ex_bear_crawl",
            "name": "Bear Crawl",
            "category": "cardio",
            "muscle_groups": ["core", "épaules", "quadriceps"],
            "description": "Déplacement à quatre pattes, genoux décollés.",
            "instructions": [
                "Position quadrupédique, genoux décollés",
                "Avancez main et pied opposés simultanément",
                "Gardez le dos plat",
                "Maintenez les genoux bas"
            ],
            "tips": ["Excellent pour le core et la coordination"],
            "video_url": "https://www.youtube.com/watch?v=Dv4IFhKTElo",
            "difficulty": "débutant",
            "equipment": []
        },
        {
            "exercise_id": "ex_crab_walk",
            "name": "Crab Walk",
            "category": "cardio",
            "muscle_groups": ["triceps", "fessiers", "core"],
            "description": "Déplacement en position de crabe.",
            "instructions": [
                "Assis, mains et pieds au sol",
                "Levez les hanches",
                "Déplacez-vous à reculons ou en avant",
                "Alternez mains et pieds"
            ],
            "tips": ["Travaille tout le corps"],
            "video_url": "https://www.youtube.com/watch?v=U0C9cltDXnI",
            "difficulty": "débutant",
            "equipment": []
        },
        {
            "exercise_id": "ex_inchworm",
            "name": "Inchworm",
            "category": "cardio",
            "muscle_groups": ["core", "ischio-jambiers", "épaules"],
            "description": "Déplacement en chenille.",
            "instructions": [
                "Debout, penchez-vous et marchez avec les mains",
                "Allez jusqu'en position de planche",
                "Marchez avec les pieds vers les mains",
                "Relevez-vous et répétez"
            ],
            "tips": ["Excellent échauffement"],
            "video_url": "https://www.youtube.com/watch?v=VSp06FUSdec",
            "difficulty": "débutant",
            "equipment": []
        },
        {
            "exercise_id": "ex_burpee",
            "name": "Burpee",
            "category": "cardio",
            "muscle_groups": ["full body"],
            "description": "Exercice complet combinant squat, planche et saut.",
            "instructions": [
                "Debout, descendez en squat",
                "Posez les mains et sautez en planche",
                "Faites une pompe (optionnel)",
                "Ramenez les pieds et sautez"
            ],
            "tips": ["Excellent pour le cardio et la force"],
            "video_url": "https://www.youtube.com/watch?v=TU8QYVW0gDU",
            "difficulty": "intermédiaire",
            "equipment": []
        },
        {
            "exercise_id": "ex_box_jump",
            "name": "Box Jump",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "mollets"],
            "description": "Saut explosif sur une box.",
            "instructions": [
                "Face à une box stable",
                "Fléchissez les genoux",
                "Sautez explosivement sur la box",
                "Descendez avec contrôle"
            ],
            "tips": ["Atterrissez en douceur", "Commencez avec une hauteur basse"],
            "video_url": "https://www.youtube.com/watch?v=52r_Ul5k03g",
            "difficulty": "intermédiaire",
            "equipment": ["plyo box"]
        },
        {
            "exercise_id": "ex_depth_jump",
            "name": "Depth Jump",
            "category": "legs",
            "muscle_groups": ["quadriceps", "mollets", "fessiers"],
            "description": "Saut réactif depuis une box.",
            "instructions": [
                "Debout sur une box",
                "Descendez (ne sautez pas) de la box",
                "À l'atterrissage, sautez immédiatement",
                "Minimisez le temps au sol"
            ],
            "tips": ["Exercice pliométrique avancé"],
            "video_url": "https://www.youtube.com/watch?v=MJSGMYkCqgY",
            "difficulty": "avancé",
            "equipment": ["plyo box"]
        },
        {
            "exercise_id": "ex_broad_jump",
            "name": "Broad Jump (Saut en longueur)",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "mollets"],
            "description": "Saut horizontal maximal.",
            "instructions": [
                "Position athlétique",
                "Balancez les bras vers l'arrière",
                "Sautez le plus loin possible",
                "Atterrissez en équilibre"
            ],
            "tips": ["Excellent pour la puissance"],
            "video_url": "https://www.youtube.com/watch?v=96zJo3nlmHI",
            "difficulty": "débutant",
            "equipment": []
        },
        {
            "exercise_id": "ex_tuck_jump",
            "name": "Tuck Jump",
            "category": "cardio",
            "muscle_groups": ["quadriceps", "core", "mollets"],
            "description": "Saut avec genoux ramenés vers la poitrine.",
            "instructions": [
                "Position debout",
                "Sautez et ramenez les genoux vers la poitrine",
                "Touchez les genoux si possible",
                "Atterrissez en douceur"
            ],
            "tips": ["Excellent pour la puissance et le cardio"],
            "video_url": "https://www.youtube.com/watch?v=b3Oc1I8Fm_U",
            "difficulty": "intermédiaire",
            "equipment": []
        },
        {
            "exercise_id": "ex_split_squat_jump",
            "name": "Split Squat Jump",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Fente sautée avec changement de jambe.",
            "instructions": [
                "Position de fente",
                "Sautez et changez de jambe",
                "Atterrissez en fente opposée",
                "Répétez sans pause"
            ],
            "tips": ["Atterrissage doux, genoux fléchis"],
            "video_url": "https://www.youtube.com/watch?v=CTdqqLMc6-Q",
            "difficulty": "intermédiaire",
            "equipment": []
        },
        {
            "exercise_id": "ex_sled_push",
            "name": "Sled Push (Poussée de traîneau)",
            "category": "cardio",
            "muscle_groups": ["quadriceps", "fessiers", "mollets", "core"],
            "description": "Poussée d'un traîneau lesté.",
            "instructions": [
                "Mains sur les poignées hautes ou basses",
                "Penchez le corps vers l'avant",
                "Poussez en faisant des petits pas rapides",
                "Gardez le core engagé"
            ],
            "tips": ["Excellent pour le conditionnement"],
            "video_url": "https://www.youtube.com/watch?v=hVxg3kVjlwk",
            "difficulty": "intermédiaire",
            "equipment": ["traîneau (sled)"]
        },
        {
            "exercise_id": "ex_sled_pull",
            "name": "Sled Pull (Tirage de traîneau)",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps", "fessiers"],
            "description": "Tirage d'un traîneau vers soi.",
            "instructions": [
                "Face au traîneau avec corde ou sangle",
                "Tirez main sur main",
                "Gardez le dos droit",
                "Continuez jusqu'à l'arrivée"
            ],
            "tips": ["Travaille le haut du corps différemment"],
            "video_url": "https://www.youtube.com/watch?v=YuA7hx6nBfg",
            "difficulty": "intermédiaire",
            "equipment": ["traîneau", "corde"]
        },
        {
            "exercise_id": "ex_farmers_walk",
            "name": "Farmer's Walk",
            "category": "core",
            "muscle_groups": ["avant-bras", "trapèzes", "core", "jambes"],
            "description": "Marche avec poids lourds dans chaque main.",
            "instructions": [
                "Saisissez des poids lourds",
                "Marchez en gardant le dos droit",
                "Épaules en arrière, core engagé",
                "Pas réguliers et contrôlés"
            ],
            "tips": ["Excellent pour la préhension et le core"],
            "video_url": "https://www.youtube.com/watch?v=Fkzk_RqlYig",
            "difficulty": "débutant",
            "equipment": ["haltères lourds", "trap bar", "farmers handles"]
        },
        {
            "exercise_id": "ex_suitcase_carry",
            "name": "Suitcase Carry",
            "category": "core",
            "muscle_groups": ["obliques", "avant-bras", "core"],
            "description": "Marche avec un poids d'un seul côté.",
            "instructions": [
                "Un poids lourd dans une main",
                "Marchez sans pencher",
                "Gardez les épaules niveau",
                "Changez de côté"
            ],
            "tips": ["Excellent anti-flexion latérale"],
            "video_url": "https://www.youtube.com/watch?v=WyVgS-rg4no",
            "difficulty": "débutant",
            "equipment": ["kettlebell", "haltère"]
        },
        {
            "exercise_id": "ex_waiter_carry",
            "name": "Waiter's Carry",
            "category": "shoulders",
            "muscle_groups": ["épaules", "core", "trapèzes"],
            "description": "Marche avec poids au-dessus de la tête.",
            "instructions": [
                "Poids tenu au-dessus de la tête, bras tendu",
                "Marchez en gardant le bras vertical",
                "Core engagé",
                "Changez de côté"
            ],
            "tips": ["Excellent pour la stabilité de l'épaule"],
            "video_url": "https://www.youtube.com/watch?v=RW6rSj-u2dU",
            "difficulty": "intermédiaire",
            "equipment": ["kettlebell", "haltère"]
        },
        
        # === EXERCICES ABDOMINAUX AVANCÉS ===
        {
            "exercise_id": "ex_hanging_leg_raise",
            "name": "Relevé de Jambes Suspendu",
            "category": "core",
            "muscle_groups": ["abdominaux", "hip flexors"],
            "description": "Lever les jambes tendues en suspension.",
            "instructions": [
                "Suspendu à une barre",
                "Levez les jambes tendues jusqu'à l'horizontale",
                "Contrôlez la descente",
                "Évitez le balancement"
            ],
            "tips": ["Commencez avec les genoux pliés"],
            "video_url": "https://www.youtube.com/watch?v=hdng3Nm1x_E",
            "difficulty": "intermédiaire",
            "equipment": ["barre de traction"]
        },
        {
            "exercise_id": "ex_toes_to_bar",
            "name": "Toes to Bar",
            "category": "core",
            "muscle_groups": ["abdominaux", "hip flexors", "dorsaux"],
            "description": "Toucher la barre avec les pieds en suspension.",
            "instructions": [
                "Suspendu à une barre",
                "Balancez légèrement (kip)",
                "Montez les pieds jusqu'à la barre",
                "Redescendez avec contrôle"
            ],
            "tips": ["Mouvement CrossFit populaire"],
            "video_url": "https://www.youtube.com/watch?v=m4LYHjW3P5M",
            "difficulty": "avancé",
            "equipment": ["barre de traction"]
        },
        {
            "exercise_id": "ex_windshield_wipers",
            "name": "Windshield Wipers",
            "category": "core",
            "muscle_groups": ["obliques", "abdominaux"],
            "description": "Balayage des jambes de gauche à droite en suspension.",
            "instructions": [
                "Suspendu, jambes à l'horizontale",
                "Balancez les jambes d'un côté à l'autre",
                "Comme un essuie-glace",
                "Contrôlez le mouvement"
            ],
            "tips": ["Mouvement avancé pour les obliques"],
            "video_url": "https://www.youtube.com/watch?v=SyP4qCZpFnM",
            "difficulty": "avancé",
            "equipment": ["barre de traction"]
        },
        {
            "exercise_id": "ex_ab_wheel_rollout",
            "name": "Ab Wheel Rollout",
            "category": "core",
            "muscle_groups": ["abdominaux", "dorsaux", "épaules"],
            "description": "Déroulement avec la roue abdominale.",
            "instructions": [
                "À genoux, mains sur la roue",
                "Roulez vers l'avant en gardant les bras tendus",
                "Descendez aussi loin que possible",
                "Revenez en contractant les abdos"
            ],
            "tips": ["Gardez le core engagé", "Ne cambrez pas le dos"],
            "video_url": "https://www.youtube.com/watch?v=rqiTPdK1c_I",
            "difficulty": "intermédiaire",
            "equipment": ["roue abdominale"]
        },
        {
            "exercise_id": "ex_pallof_press",
            "name": "Pallof Press",
            "category": "core",
            "muscle_groups": ["obliques", "core"],
            "description": "Presse anti-rotation à la poulie.",
            "instructions": [
                "Poulie à hauteur de poitrine, de côté",
                "Tenez la poignée contre la poitrine",
                "Poussez devant vous, bras tendus",
                "Résistez à la rotation"
            ],
            "tips": ["Excellent exercice anti-rotation"],
            "video_url": "https://www.youtube.com/watch?v=AH_QZLm_0-s",
            "difficulty": "débutant",
            "equipment": ["poulie", "câble"]
        },
        {
            "exercise_id": "ex_dead_bug",
            "name": "Dead Bug",
            "category": "core",
            "muscle_groups": ["abdominaux", "core"],
            "description": "Coordination bras/jambes en maintenant le dos plat.",
            "instructions": [
                "Allongé sur le dos, bras et genoux à 90°",
                "Étendez un bras et la jambe opposée",
                "Gardez le bas du dos collé au sol",
                "Alternez les côtés"
            ],
            "tips": ["Excellent pour la stabilité lombaire"],
            "video_url": "https://www.youtube.com/watch?v=I5xbsA71v5k",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_bird_dog",
            "name": "Bird Dog",
            "category": "core",
            "muscle_groups": ["lombaires", "core", "fessiers"],
            "description": "Extension simultanée bras/jambe opposés à quatre pattes.",
            "instructions": [
                "Position quadrupédique",
                "Étendez un bras et la jambe opposée",
                "Maintenez l'alignement",
                "Alternez"
            ],
            "tips": ["Excellent pour les lombaires"],
            "video_url": "https://www.youtube.com/watch?v=wiFNA3sqjCA",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_hollow_body_hold",
            "name": "Hollow Body Hold",
            "category": "core",
            "muscle_groups": ["abdominaux", "hip flexors"],
            "description": "Position statique en creux.",
            "instructions": [
                "Allongé sur le dos",
                "Levez les épaules et les jambes",
                "Bras tendus vers l'avant ou derrière",
                "Maintenez la position"
            ],
            "tips": ["Position fondamentale en gymnastique"],
            "video_url": "https://www.youtube.com/watch?v=LlDNef_Ztsc",
            "difficulty": "intermédiaire",
            "equipment": []
        },
        {
            "exercise_id": "ex_arch_body_hold",
            "name": "Arch Body Hold (Superman Hold)",
            "category": "back",
            "muscle_groups": ["lombaires", "fessiers"],
            "description": "Position statique en arc (opposé du hollow).",
            "instructions": [
                "Allongé sur le ventre",
                "Levez bras et jambes du sol",
                "Serrez les fessiers",
                "Maintenez la position"
            ],
            "tips": ["Renforce le bas du dos"],
            "video_url": "https://www.youtube.com/watch?v=z6PJMT2y8GQ",
            "difficulty": "débutant",
            "equipment": []
        },
        
        # === EXERCICES AVEC MACHINES CÂBLES ===
        {
            "exercise_id": "ex_cable_crunch",
            "name": "Crunch à la Poulie",
            "category": "core",
            "muscle_groups": ["abdominaux"],
            "description": "Crunch avec résistance de la poulie haute.",
            "instructions": [
                "À genoux face à la poulie",
                "Corde derrière la tête",
                "Enroulez le buste vers le bas",
                "Contractez les abdos, remontez"
            ],
            "tips": ["Ne tirez pas avec les bras"],
            "video_url": "https://www.youtube.com/watch?v=AV5PmZJIrrw",
            "difficulty": "débutant",
            "equipment": ["poulie haute", "corde"]
        },
        {
            "exercise_id": "ex_cable_woodchop",
            "name": "Cable Woodchop",
            "category": "core",
            "muscle_groups": ["obliques", "core"],
            "description": "Mouvement de bûcheron à la poulie.",
            "instructions": [
                "Poulie haute, de côté",
                "Tirez en diagonale vers le bas et l'opposé",
                "Tournez le torse",
                "Contrôlez le retour"
            ],
            "tips": ["Excellent pour la rotation"],
            "video_url": "https://www.youtube.com/watch?v=pAplQXk3dkU",
            "difficulty": "intermédiaire",
            "equipment": ["poulie", "poignée"]
        },
        {
            "exercise_id": "ex_cable_reverse_woodchop",
            "name": "Cable Reverse Woodchop",
            "category": "core",
            "muscle_groups": ["obliques", "épaules"],
            "description": "Woodchop inversé, du bas vers le haut.",
            "instructions": [
                "Poulie basse, de côté",
                "Tirez en diagonale vers le haut et l'opposé",
                "Rotation contrôlée du torse",
                "Redescendez lentement"
            ],
            "tips": ["Cible différemment les obliques"],
            "video_url": "https://www.youtube.com/watch?v=pAplQXk3dkU",
            "difficulty": "intermédiaire",
            "equipment": ["poulie basse"]
        },
        {
            "exercise_id": "ex_cable_pull_through",
            "name": "Cable Pull-through",
            "category": "legs",
            "muscle_groups": ["fessiers", "ischio-jambiers"],
            "description": "Extension de hanche à la poulie basse.",
            "instructions": [
                "Dos à la poulie basse",
                "Corde entre les jambes",
                "Penchez-vous en poussant les hanches",
                "Revenez en contractant les fessiers"
            ],
            "tips": ["Excellent pour apprendre le hip hinge"],
            "video_url": "https://www.youtube.com/watch?v=AySk2e_e9wk",
            "difficulty": "débutant",
            "equipment": ["poulie basse", "corde"]
        },
        {
            "exercise_id": "ex_cable_kickback",
            "name": "Cable Kickback",
            "category": "legs",
            "muscle_groups": ["fessiers"],
            "description": "Extension de la jambe vers l'arrière à la poulie.",
            "instructions": [
                "Sangle à la cheville, poulie basse",
                "Appui sur un support",
                "Étendez la jambe vers l'arrière",
                "Serrez le fessier en haut"
            ],
            "tips": ["Isolation parfaite des fessiers"],
            "video_url": "https://www.youtube.com/watch?v=V6H9wDsfj2k",
            "difficulty": "débutant",
            "equipment": ["poulie basse", "sangle de cheville"]
        },
        {
            "exercise_id": "ex_cable_hip_abduction",
            "name": "Cable Hip Abduction",
            "category": "legs",
            "muscle_groups": ["abducteurs", "moyen fessier"],
            "description": "Écartement de la jambe à la poulie.",
            "instructions": [
                "Sangle à la cheville, de côté à la poulie",
                "Écartez la jambe sur le côté",
                "Gardez le corps droit",
                "Contrôlez le retour"
            ],
            "tips": ["Travaille le galbe des hanches"],
            "video_url": "https://www.youtube.com/watch?v=6z2LLsZ_1J0",
            "difficulty": "débutant",
            "equipment": ["poulie basse", "sangle de cheville"]
        },
        
        # === ÉTIREMENTS ACTIFS ET MOBILITÉ ===
        {
            "exercise_id": "ex_jefferson_curl",
            "name": "Jefferson Curl",
            "category": "back",
            "muscle_groups": ["ischio-jambiers", "lombaires", "colonne"],
            "description": "Flexion vertèbre par vertèbre avec poids léger.",
            "instructions": [
                "Debout sur une plateforme surélevée",
                "Poids léger dans les mains",
                "Enroulez la colonne vertèbre par vertèbre",
                "Descendez aussi bas que possible"
            ],
            "tips": ["Poids très léger", "Mouvement thérapeutique"],
            "video_url": "https://www.youtube.com/watch?v=nYS0R4c3qCA",
            "difficulty": "intermédiaire",
            "equipment": ["haltère léger", "plateforme"]
        },
        {
            "exercise_id": "ex_couch_stretch",
            "name": "Couch Stretch",
            "category": "legs",
            "muscle_groups": ["hip flexors", "quadriceps"],
            "description": "Étirement profond des fléchisseurs de hanche.",
            "instructions": [
                "Un genou au sol, pied contre un mur",
                "L'autre pied devant, genou à 90°",
                "Serrez le fessier du côté étiré",
                "Maintenez 2 minutes par côté"
            ],
            "tips": ["Excellent pour ceux qui restent assis longtemps"],
            "video_url": "https://www.youtube.com/watch?v=M7m-6cIyFJQ",
            "difficulty": "débutant",
            "equipment": ["mur", "coussin"]
        },
        {
            "exercise_id": "ex_pigeon_stretch",
            "name": "Pigeon Stretch",
            "category": "legs",
            "muscle_groups": ["fessiers", "piriformis"],
            "description": "Étirement du pigeon pour les fessiers.",
            "instructions": [
                "Position de fente",
                "Posez le tibia avant au sol",
                "Descendez le buste",
                "Maintenez et changez de côté"
            ],
            "tips": ["Excellent pour la mobilité des hanches"],
            "video_url": "https://www.youtube.com/watch?v=n95_ozkKFQg",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        {
            "exercise_id": "ex_deep_squat_hold",
            "name": "Deep Squat Hold",
            "category": "legs",
            "muscle_groups": ["hanches", "chevilles", "quadriceps"],
            "description": "Maintien de la position basse du squat.",
            "instructions": [
                "Descendez en squat complet",
                "Talons au sol",
                "Maintenez la position",
                "Gardez le dos droit"
            ],
            "tips": ["Position ancestrale", "Améliore la mobilité"],
            "video_url": "https://www.youtube.com/watch?v=nPvK5Dkxmyw",
            "difficulty": "débutant",
            "equipment": []
        },
        {
            "exercise_id": "ex_cossack_squat",
            "name": "Cossack Squat",
            "category": "legs",
            "muscle_groups": ["adducteurs", "quadriceps", "fessiers"],
            "description": "Squat latéral profond.",
            "instructions": [
                "Pieds très écartés",
                "Descendez sur une jambe",
                "L'autre jambe reste tendue",
                "Alternez les côtés"
            ],
            "tips": ["Excellent pour la mobilité des hanches"],
            "video_url": "https://www.youtube.com/watch?v=tpczTeSkHz0",
            "difficulty": "intermédiaire",
            "equipment": []
        },
        {
            "exercise_id": "ex_90_90_stretch",
            "name": "90/90 Hip Stretch",
            "category": "legs",
            "muscle_groups": ["hanches", "fessiers"],
            "description": "Étirement des hanches en position 90/90.",
            "instructions": [
                "Assis, une jambe devant à 90°, l'autre sur le côté à 90°",
                "Penchez-vous vers la jambe avant",
                "Changez de côté",
                "Maintenez 1-2 minutes"
            ],
            "tips": ["Excellent pour la rotation interne/externe"],
            "video_url": "https://www.youtube.com/watch?v=EmwwuaD7Npk",
            "difficulty": "débutant",
            "equipment": ["tapis"]
        },
        
        # === VARIANTES DE SQUATS ===
        {
            "exercise_id": "ex_zercher_squat",
            "name": "Zercher Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "core", "biceps"],
            "description": "Squat avec barre dans le pli des coudes.",
            "instructions": [
                "Barre dans le pli des coudes",
                "Coudes serrés contre le corps",
                "Descendez en squat",
                "Remontez en gardant le dos droit"
            ],
            "tips": ["Excellent pour le core", "Utilisez un coussin"],
            "video_url": "https://www.youtube.com/watch?v=cdc6T3nvJ1c",
            "difficulty": "avancé",
            "equipment": ["barre", "rack"]
        },
        {
            "exercise_id": "ex_anderson_squat",
            "name": "Anderson Squat (Pin Squat)",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Squat démarrant depuis la position basse sur des pins.",
            "instructions": [
                "Réglez les pins au niveau souhaité",
                "Commencez sous la barre en position basse",
                "Poussez pour vous lever",
                "Redescendez sur les pins"
            ],
            "tips": ["Élimine l'élan", "Travaille la force de départ"],
            "video_url": "https://www.youtube.com/watch?v=8Dqj_8XzLIY",
            "difficulty": "avancé",
            "equipment": ["rack", "barre"]
        },
        {
            "exercise_id": "ex_pause_squat",
            "name": "Pause Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Squat avec pause en bas.",
            "instructions": [
                "Descendez en squat",
                "Maintenez la position basse 2-3 secondes",
                "Remontez explosivement",
                "Gardez la tension"
            ],
            "tips": ["Élimine l'élan", "Excellent pour la force"],
            "video_url": "https://www.youtube.com/watch?v=Dy28eq_PzjI",
            "difficulty": "intermédiaire",
            "equipment": ["barre", "rack"]
        },
        {
            "exercise_id": "ex_tempo_squat",
            "name": "Tempo Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Squat avec tempo contrôlé (ex: 4-1-2-0).",
            "instructions": [
                "Descendez lentement (ex: 4 secondes)",
                "Pause en bas (ex: 1 seconde)",
                "Remontez de manière contrôlée (ex: 2 secondes)",
                "Sans pause en haut"
            ],
            "tips": ["Excellent pour l'hypertrophie"],
            "video_url": "https://www.youtube.com/watch?v=bs_Ej32IYgo",
            "difficulty": "intermédiaire",
            "equipment": ["barre", "rack"]
        },
        {
            "exercise_id": "ex_smith_machine_squat",
            "name": "Smith Machine Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Squat sur machine Smith guidée.",
            "instructions": [
                "Placez-vous sous la barre Smith",
                "Pieds légèrement en avant",
                "Descendez en squat",
                "Remontez en poussant"
            ],
            "tips": ["Mouvement guidé", "Permet de cibler différemment"],
            "video_url": "https://www.youtube.com/watch?v=7pOj5f0dQAk",
            "difficulty": "débutant",
            "equipment": ["smith machine"]
        },
        
        # === EXERCICES BRAS SUPPLÉMENTAIRES ===
        {
            "exercise_id": "ex_bayesian_curl",
            "name": "Bayesian Curl",
            "category": "arms",
            "muscle_groups": ["biceps"],
            "description": "Curl à la poulie avec bras en arrière du corps.",
            "instructions": [
                "Dos à la poulie basse",
                "Bras tendu derrière vous",
                "Curl en gardant le coude fixe",
                "Étirement maximal du biceps"
            ],
            "tips": ["Excellent étirement du biceps"],
            "video_url": "https://www.youtube.com/watch?v=HCZrRkVlKcs",
            "difficulty": "intermédiaire",
            "equipment": ["poulie basse"]
        },
        {
            "exercise_id": "ex_drag_curl",
            "name": "Drag Curl",
            "category": "arms",
            "muscle_groups": ["biceps", "brachial"],
            "description": "Curl en tirant la barre le long du corps.",
            "instructions": [
                "Barre en main, position standard",
                "Montez la barre en la gardant contre le corps",
                "Les coudes reculent",
                "Descendez de la même façon"
            ],
            "tips": ["Cible différemment le biceps"],
            "video_url": "https://www.youtube.com/watch?v=7NrOB4kq0ew",
            "difficulty": "intermédiaire",
            "equipment": ["barre EZ", "haltères"]
        },
        {
            "exercise_id": "ex_zottman_curl",
            "name": "Zottman Curl",
            "category": "arms",
            "muscle_groups": ["biceps", "avant-bras"],
            "description": "Curl avec rotation du poignet en haut.",
            "instructions": [
                "Curl classique supination",
                "En haut, tournez les poignets en pronation",
                "Descendez en pronation",
                "Tournez en supination en bas"
            ],
            "tips": ["Travaille biceps et avant-bras"],
            "video_url": "https://www.youtube.com/watch?v=ZrpRBgswtHs",
            "difficulty": "intermédiaire",
            "equipment": ["haltères"]
        },
        {
            "exercise_id": "ex_jm_press",
            "name": "JM Press",
            "category": "arms",
            "muscle_groups": ["triceps", "pectoraux"],
            "description": "Hybride entre le close grip bench et le skull crusher.",
            "instructions": [
                "Allongé, barre au-dessus",
                "Descendez la barre vers le menton/gorge",
                "Coudes vers l'extérieur",
                "Poussez vers le haut"
            ],
            "tips": ["Excellent pour les triceps longs"],
            "video_url": "https://www.youtube.com/watch?v=Az2fZ1gPgMU",
            "difficulty": "avancé",
            "equipment": ["barre", "banc"]
        },
        {
            "exercise_id": "ex_tate_press",
            "name": "Tate Press",
            "category": "arms",
            "muscle_groups": ["triceps"],
            "description": "Extension triceps avec les coudes vers l'extérieur.",
            "instructions": [
                "Allongé, haltères au-dessus",
                "Descendez les haltères vers la poitrine",
                "Coudes pointant vers l'extérieur",
                "Poussez pour revenir"
            ],
            "tips": ["Variante originale pour les triceps"],
            "video_url": "https://www.youtube.com/watch?v=d_KZxkY_0cM",
            "difficulty": "intermédiaire",
            "equipment": ["haltères", "banc"]
        },
        {
            "exercise_id": "ex_overhead_rope_extension",
            "name": "Overhead Rope Triceps Extension",
            "category": "arms",
            "muscle_groups": ["triceps"],
            "description": "Extension triceps au-dessus de la tête à la poulie.",
            "instructions": [
                "Dos à la poulie basse",
                "Corde derrière la tête",
                "Étendez les bras au-dessus",
                "Revenez lentement"
            ],
            "tips": ["Excellent étirement des triceps"],
            "video_url": "https://www.youtube.com/watch?v=RjWrXYcbdIE",
            "difficulty": "débutant",
            "equipment": ["poulie", "corde"]
        },
        {
            "exercise_id": "ex_wrist_curl",
            "name": "Wrist Curl",
            "category": "arms",
            "muscle_groups": ["avant-bras (fléchisseurs)"],
            "description": "Flexion des poignets pour les avant-bras.",
            "instructions": [
                "Avant-bras sur un banc, paumes vers le haut",
                "Laissez descendre la barre",
                "Fléchissez les poignets pour remonter",
                "Contrôlez le mouvement"
            ],
            "tips": ["Travaille les fléchisseurs"],
            "video_url": "https://www.youtube.com/watch?v=7LshL3mNPd0",
            "difficulty": "débutant",
            "equipment": ["barre", "haltères"]
        },
        {
            "exercise_id": "ex_reverse_wrist_curl",
            "name": "Reverse Wrist Curl",
            "category": "arms",
            "muscle_groups": ["avant-bras (extenseurs)"],
            "description": "Extension des poignets pour les avant-bras.",
            "instructions": [
                "Avant-bras sur un banc, paumes vers le bas",
                "Laissez descendre la barre",
                "Étendez les poignets pour remonter",
                "Mouvement contrôlé"
            ],
            "tips": ["Travaille les extenseurs"],
            "video_url": "https://www.youtube.com/watch?v=FW-cxbhr_Ek",
            "difficulty": "débutant",
            "equipment": ["barre", "haltères"]
        },
        
        # ==================== EXTENSION MASSIVE - 130+ EXERCICES SUPPLÉMENTAIRES ====================
        
        # === EXERCICES DE YOGA ET FLEXIBILITÉ (15) ===
        {
            "exercise_id": "ex_downward_dog",
            "name": "Chien Tête en Bas (Downward Dog)",
            "category": "core",
            "muscle_groups": ["épaules", "ischio-jambiers", "mollets", "dos"],
            "description": "Posture fondamentale de yoga pour étirer tout le corps.",
            "instructions": [
                "À quatre pattes, mains largeur d'épaules",
                "Poussez les hanches vers le haut et l'arrière",
                "Formez un V inversé avec le corps",
                "Talons vers le sol, tête entre les bras"
            ],
            "tips": ["Gardez le dos droit", "Pliez les genoux si nécessaire"],
            "video_url": "https://www.youtube.com/watch?v=j97SSGsnCAQ",
            "difficulty": "débutant",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_warrior_1",
            "name": "Guerrier I (Warrior I)",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "épaules", "core"],
            "description": "Posture de yoga pour renforcer les jambes et ouvrir les hanches.",
            "instructions": [
                "Fente avant, pied arrière tourné à 45°",
                "Genou avant à 90°",
                "Bras tendus vers le ciel",
                "Hanches face à l'avant"
            ],
            "tips": ["Genou au-dessus de la cheville", "Gardez le bassin carré"],
            "video_url": "https://www.youtube.com/watch?v=k4qaVoAbeHM",
            "difficulty": "débutant",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_warrior_2",
            "name": "Guerrier II (Warrior II)",
            "category": "legs",
            "muscle_groups": ["quadriceps", "adducteurs", "épaules"],
            "description": "Posture de yoga pour renforcer et ouvrir les hanches.",
            "instructions": [
                "Pieds écartés, pied avant vers l'avant",
                "Genou avant à 90°",
                "Bras tendus parallèles au sol",
                "Regard par-dessus la main avant"
            ],
            "tips": ["Hanches ouvertes sur le côté"],
            "video_url": "https://www.youtube.com/watch?v=QfO4tMz6hD4",
            "difficulty": "débutant",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_warrior_3",
            "name": "Guerrier III (Warrior III)",
            "category": "legs",
            "muscle_groups": ["fessiers", "ischio-jambiers", "core", "épaules"],
            "description": "Posture d'équilibre avancée.",
            "instructions": [
                "Debout sur une jambe",
                "Penchez le torse et levez la jambe arrière",
                "Corps et jambe parallèles au sol",
                "Bras tendus vers l'avant"
            ],
            "tips": ["Travaillez l'équilibre progressivement"],
            "video_url": "https://www.youtube.com/watch?v=I-qOOmXxYdw",
            "difficulty": "intermédiaire",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_tree_pose",
            "name": "Posture de l'Arbre (Tree Pose)",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "core"],
            "description": "Posture d'équilibre sur une jambe.",
            "instructions": [
                "Debout, poids sur une jambe",
                "Pied opposé contre la cuisse",
                "Mains en prière ou vers le ciel",
                "Fixez un point devant vous"
            ],
            "tips": ["Ne posez jamais le pied sur le genou"],
            "video_url": "https://www.youtube.com/watch?v=wdln9qWYloU",
            "difficulty": "débutant",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_cobra_pose",
            "name": "Posture du Cobra",
            "category": "back",
            "muscle_groups": ["lombaires", "érecteurs du rachis"],
            "description": "Extension du dos pour renforcer le bas du dos.",
            "instructions": [
                "Allongé sur le ventre, mains sous les épaules",
                "Poussez pour lever la poitrine",
                "Gardez les hanches au sol",
                "Regard vers l'avant"
            ],
            "tips": ["Ne forcez pas l'extension"],
            "video_url": "https://www.youtube.com/watch?v=n6jrqLZZeXY",
            "difficulty": "débutant",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_childs_pose",
            "name": "Posture de l'Enfant (Child's Pose)",
            "category": "back",
            "muscle_groups": ["dos", "hanches", "cuisses"],
            "description": "Posture de repos et d'étirement.",
            "instructions": [
                "À genoux, fesses sur les talons",
                "Penchez-vous vers l'avant",
                "Bras tendus devant ou le long du corps",
                "Front au sol"
            ],
            "tips": ["Respirez profondément"],
            "video_url": "https://www.youtube.com/watch?v=2MJGg-dUKh0",
            "difficulty": "débutant",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_cat_cow",
            "name": "Chat-Vache (Cat-Cow)",
            "category": "back",
            "muscle_groups": ["colonne vertébrale", "abdominaux"],
            "description": "Mobilisation de la colonne vertébrale.",
            "instructions": [
                "À quatre pattes",
                "Inspirez: creusez le dos, tête vers le haut (vache)",
                "Expirez: arrondissez le dos, menton vers poitrine (chat)",
                "Alternez avec la respiration"
            ],
            "tips": ["Excellent échauffement"],
            "video_url": "https://www.youtube.com/watch?v=kqnua4rHVVA",
            "difficulty": "débutant",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_bridge_pose",
            "name": "Posture du Pont (Bridge)",
            "category": "legs",
            "muscle_groups": ["fessiers", "ischio-jambiers", "lombaires"],
            "description": "Extension des hanches au sol.",
            "instructions": [
                "Allongé sur le dos, genoux pliés",
                "Pieds au sol, largeur de hanches",
                "Levez les hanches vers le plafond",
                "Serrez les fessiers en haut"
            ],
            "tips": ["Gardez les genoux alignés"],
            "video_url": "https://www.youtube.com/watch?v=wPM8icPu6H8",
            "difficulty": "débutant",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_seated_forward_fold",
            "name": "Flexion Avant Assise",
            "category": "legs",
            "muscle_groups": ["ischio-jambiers", "lombaires"],
            "description": "Étirement des ischio-jambiers assis.",
            "instructions": [
                "Assis, jambes tendues devant",
                "Penchez le torse vers les jambes",
                "Attrapez les pieds ou les tibias",
                "Gardez le dos le plus droit possible"
            ],
            "tips": ["Pliez les genoux si nécessaire"],
            "video_url": "https://www.youtube.com/watch?v=1U8T5l0hIzY",
            "difficulty": "débutant",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_butterfly_stretch",
            "name": "Étirement Papillon",
            "category": "legs",
            "muscle_groups": ["adducteurs", "hanches"],
            "description": "Ouverture des hanches.",
            "instructions": [
                "Assis, plantes de pieds ensemble",
                "Genoux vers le sol",
                "Tenez les pieds avec les mains",
                "Penchez-vous vers l'avant"
            ],
            "tips": ["Utilisez les coudes pour pousser les genoux"],
            "video_url": "https://www.youtube.com/watch?v=iHNJLx2v6gU",
            "difficulty": "débutant",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_lizard_pose",
            "name": "Posture du Lézard",
            "category": "legs",
            "muscle_groups": ["hip flexors", "quadriceps", "hanches"],
            "description": "Étirement profond des fléchisseurs de hanche.",
            "instructions": [
                "Fente basse",
                "Les deux mains à l'intérieur du pied avant",
                "Descendez sur les avant-bras si possible",
                "Hanches vers le sol"
            ],
            "tips": ["Progression du pigeon"],
            "video_url": "https://www.youtube.com/watch?v=UmIjpSrGmto",
            "difficulty": "intermédiaire",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_half_splits",
            "name": "Demi-Grand Écart",
            "category": "legs",
            "muscle_groups": ["ischio-jambiers", "mollets"],
            "description": "Étirement des ischio-jambiers en fente.",
            "instructions": [
                "Position de fente basse",
                "Reculez les hanches",
                "Tendez la jambe avant",
                "Penchez le torse sur la jambe"
            ],
            "tips": ["Gardez le dos droit"],
            "video_url": "https://www.youtube.com/watch?v=VLIRr1Crrms",
            "difficulty": "intermédiaire",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_happy_baby",
            "name": "Bébé Heureux (Happy Baby)",
            "category": "legs",
            "muscle_groups": ["hanches", "adducteurs", "lombaires"],
            "description": "Ouverture des hanches allongé.",
            "instructions": [
                "Allongé sur le dos",
                "Attrapez l'extérieur des pieds",
                "Genoux vers les aisselles",
                "Balancez doucement"
            ],
            "tips": ["Relaxez le bas du dos au sol"],
            "video_url": "https://www.youtube.com/watch?v=aY0Ee8OBDPI",
            "difficulty": "débutant",
            "equipment": ["tapis de yoga"]
        },
        {
            "exercise_id": "ex_supine_twist",
            "name": "Torsion Allongée",
            "category": "core",
            "muscle_groups": ["obliques", "colonne vertébrale", "lombaires"],
            "description": "Torsion de la colonne au sol.",
            "instructions": [
                "Allongé sur le dos",
                "Genoux pliés vers un côté",
                "Épaules au sol",
                "Bras en croix, regard opposé aux genoux"
            ],
            "tips": ["Respirez dans la torsion"],
            "video_url": "https://www.youtube.com/watch?v=5aMjR2eUpLg",
            "difficulty": "débutant",
            "equipment": ["tapis de yoga"]
        },
        
        # === EXERCICES DE CROSSFIT (20) ===
        {
            "exercise_id": "ex_wall_ball",
            "name": "Wall Ball",
            "category": "cardio",
            "muscle_groups": ["quadriceps", "fessiers", "épaules", "core"],
            "description": "Squat explosif avec lancer de medecine ball.",
            "instructions": [
                "Face à un mur, medecine ball à la poitrine",
                "Squat complet",
                "En remontant, lancez la balle vers une cible haute",
                "Rattrapez et enchaînez"
            ],
            "tips": ["Cible généralement à 3m de haut"],
            "video_url": "https://www.youtube.com/watch?v=fpUD0mcFp_0",
            "difficulty": "intermédiaire",
            "equipment": ["medecine ball", "mur"]
        },
        {
            "exercise_id": "ex_double_under",
            "name": "Double Under (Corde à sauter)",
            "category": "cardio",
            "muscle_groups": ["mollets", "épaules", "core"],
            "description": "Saut à la corde avec deux passages par saut.",
            "instructions": [
                "Corde à sauter",
                "Sautez plus haut que d'habitude",
                "Faites passer la corde deux fois sous les pieds",
                "Gardez les coudes près du corps"
            ],
            "tips": ["Maîtrisez d'abord les singles"],
            "video_url": "https://www.youtube.com/watch?v=82jNjDS19lg",
            "difficulty": "avancé",
            "equipment": ["corde à sauter"]
        },
        {
            "exercise_id": "ex_kipping_pullup",
            "name": "Kipping Pull-up",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps", "core"],
            "description": "Traction avec balancement du corps.",
            "instructions": [
                "Suspension à la barre",
                "Balancement en arc (hollow-arch)",
                "Utilisez l'élan pour tirer",
                "Menton au-dessus de la barre"
            ],
            "tips": ["Apprenez d'abord le kip strict"],
            "video_url": "https://www.youtube.com/watch?v=GxA9DkSYvjc",
            "difficulty": "intermédiaire",
            "equipment": ["barre de traction"]
        },
        {
            "exercise_id": "ex_butterfly_pullup",
            "name": "Butterfly Pull-up",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps"],
            "description": "Traction avec mouvement circulaire continu.",
            "instructions": [
                "Suspension à la barre",
                "Mouvement circulaire du corps",
                "Tirez en continu sans pause",
                "Technique de compétition CrossFit"
            ],
            "tips": ["Très technique, apprenez d'abord le kipping"],
            "video_url": "https://www.youtube.com/watch?v=SFvonVkR-Xs",
            "difficulty": "avancé",
            "equipment": ["barre de traction"]
        },
        {
            "exercise_id": "ex_power_clean",
            "name": "Power Clean",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "trapèzes", "dos"],
            "description": "Épaulé puissance en haltérophilie.",
            "instructions": [
                "Barre au sol, prise large",
                "Tirez explossivement",
                "Passez sous la barre",
                "Réceptionnez en squat partiel"
            ],
            "tips": ["Gardez la barre près du corps"],
            "video_url": "https://www.youtube.com/watch?v=KUZqNHqFSfA",
            "difficulty": "avancé",
            "equipment": ["barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_hang_clean",
            "name": "Hang Clean",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "trapèzes"],
            "description": "Épaulé depuis la position suspendue.",
            "instructions": [
                "Barre aux cuisses, légère flexion des genoux",
                "Extension explosive des hanches",
                "Tirez la barre",
                "Réceptionnez en squat"
            ],
            "tips": ["Excellente variation technique"],
            "video_url": "https://www.youtube.com/watch?v=2dBkDPjgGho",
            "difficulty": "avancé",
            "equipment": ["barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_power_snatch",
            "name": "Power Snatch",
            "category": "shoulders",
            "muscle_groups": ["épaules", "quadriceps", "dos", "core"],
            "description": "Arraché puissance en haltérophilie.",
            "instructions": [
                "Barre au sol, prise très large",
                "Tirez explossivement",
                "Passez sous la barre",
                "Réceptionnez bras tendus au-dessus"
            ],
            "tips": ["Mouvement très technique"],
            "video_url": "https://www.youtube.com/watch?v=OAXkPiDSfno",
            "difficulty": "avancé",
            "equipment": ["barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_hang_snatch",
            "name": "Hang Snatch",
            "category": "shoulders",
            "muscle_groups": ["épaules", "trapèzes", "core"],
            "description": "Arraché depuis la position suspendue.",
            "instructions": [
                "Barre aux cuisses, prise large",
                "Extension explosive",
                "Tirez et passez sous la barre",
                "Réceptionnez bras tendus"
            ],
            "tips": ["Version simplifiée de l'arraché"],
            "video_url": "https://www.youtube.com/watch?v=9xQp2sldyts",
            "difficulty": "avancé",
            "equipment": ["barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_clean_and_jerk",
            "name": "Clean and Jerk (Épaulé-Jeté)",
            "category": "cardio",
            "muscle_groups": ["full body"],
            "description": "Mouvement olympique complet.",
            "instructions": [
                "Épaulé: amener la barre aux épaules",
                "Jeté: pousser la barre au-dessus de la tête",
                "Réceptionnez en fente ou squat",
                "Verrouillez en position debout"
            ],
            "tips": ["Mouvement de compétition olympique"],
            "video_url": "https://www.youtube.com/watch?v=b0d_BoMa6Vo",
            "difficulty": "avancé",
            "equipment": ["barre olympique", "disques"]
        },
        {
            "exercise_id": "ex_rope_climb",
            "name": "Grimper à la Corde",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps", "avant-bras", "core"],
            "description": "Montée sur une corde verticale.",
            "instructions": [
                "Agrippez la corde",
                "Bloquez avec les pieds (technique J-hook ou S-hook)",
                "Tirez avec les bras",
                "Alternez pieds et mains"
            ],
            "tips": ["La technique des pieds est essentielle"],
            "video_url": "https://www.youtube.com/watch?v=daSlIpFysjo",
            "difficulty": "avancé",
            "equipment": ["corde à grimper"]
        },
        {
            "exercise_id": "ex_legless_rope_climb",
            "name": "Legless Rope Climb",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps", "core"],
            "description": "Grimper à la corde sans utiliser les pieds.",
            "instructions": [
                "Agrippez la corde",
                "Montez uniquement avec les bras",
                "Jambes tendues ou en L-sit",
                "Descendez avec contrôle"
            ],
            "tips": ["Demande une grande force de préhension"],
            "video_url": "https://www.youtube.com/watch?v=7ckCqyAy_UU",
            "difficulty": "avancé",
            "equipment": ["corde à grimper"]
        },
        {
            "exercise_id": "ex_handstand_walk",
            "name": "Marche en Équilibre (Handstand Walk)",
            "category": "shoulders",
            "muscle_groups": ["épaules", "triceps", "core"],
            "description": "Se déplacer en équilibre sur les mains.",
            "instructions": [
                "Position ATR (équilibre sur les mains)",
                "Déplacez une main puis l'autre",
                "Gardez le regard devant",
                "Ajustez l'équilibre avec les doigts"
            ],
            "tips": ["Travaillez d'abord l'équilibre statique"],
            "video_url": "https://www.youtube.com/watch?v=Dr1cW-a1omo",
            "difficulty": "avancé",
            "equipment": []
        },
        {
            "exercise_id": "ex_ring_muscle_up",
            "name": "Ring Muscle Up",
            "category": "back",
            "muscle_groups": ["dorsaux", "pectoraux", "triceps"],
            "description": "Muscle up sur anneaux de gymnastique.",
            "instructions": [
                "Suspension aux anneaux",
                "Tirez explossivement avec kip",
                "Transition au-dessus des anneaux",
                "Terminez en dip"
            ],
            "tips": ["Plus difficile que sur barre fixe"],
            "video_url": "https://www.youtube.com/watch?v=2EPBdzRc6FU",
            "difficulty": "avancé",
            "equipment": ["anneaux de gymnastique"]
        },
        {
            "exercise_id": "ex_bar_muscle_up",
            "name": "Bar Muscle Up",
            "category": "back",
            "muscle_groups": ["dorsaux", "pectoraux", "triceps"],
            "description": "Muscle up sur barre fixe.",
            "instructions": [
                "Suspension à la barre",
                "Kip agressif",
                "Tirez les hanches vers la barre",
                "Passez au-dessus en dip"
            ],
            "tips": ["La transition est la partie clé"],
            "video_url": "https://www.youtube.com/watch?v=NEJfsBPXfrc",
            "difficulty": "avancé",
            "equipment": ["barre de traction"]
        },
        {
            "exercise_id": "ex_ghd_situp",
            "name": "GHD Sit-up",
            "category": "core",
            "muscle_groups": ["abdominaux", "hip flexors"],
            "description": "Sit-up sur machine GHD.",
            "instructions": [
                "Installez-vous sur le GHD, pieds bloqués",
                "Descendez jusqu'à toucher le sol",
                "Remontez en explosant",
                "Touchez le pad avec les mains"
            ],
            "tips": ["Amplitude complète demandée"],
            "video_url": "https://www.youtube.com/watch?v=1fbU_MKVg1Q",
            "difficulty": "intermédiaire",
            "equipment": ["GHD machine"]
        },
        {
            "exercise_id": "ex_ghd_hip_extension",
            "name": "GHD Hip Extension",
            "category": "back",
            "muscle_groups": ["fessiers", "ischio-jambiers", "lombaires"],
            "description": "Extension des hanches sur GHD.",
            "instructions": [
                "Position face au sol sur GHD",
                "Cuisses sur le pad, pieds bloqués",
                "Descendez le torse",
                "Remontez jusqu'à l'horizontale"
            ],
            "tips": ["Ne pas hyper-extension"],
            "video_url": "https://www.youtube.com/watch?v=yCoUpLutVo8",
            "difficulty": "intermédiaire",
            "equipment": ["GHD machine"]
        },
        {
            "exercise_id": "ex_assault_bike",
            "name": "Assault Bike",
            "category": "cardio",
            "muscle_groups": ["full body", "cardio"],
            "description": "Vélo d'assault avec bras.",
            "instructions": [
                "Asseyez-vous sur le vélo",
                "Poussez et tirez les poignées",
                "Pédalez avec les jambes",
                "Coordonnez bras et jambes"
            ],
            "tips": ["Plus d'effort = plus de résistance"],
            "video_url": "https://www.youtube.com/watch?v=7SPhqV5Fzjw",
            "difficulty": "débutant",
            "equipment": ["assault bike"]
        },
        {
            "exercise_id": "ex_ski_erg",
            "name": "Ski Erg",
            "category": "cardio",
            "muscle_groups": ["dorsaux", "triceps", "core"],
            "description": "Simulation de ski de fond.",
            "instructions": [
                "Debout face à la machine",
                "Tirez les poignées vers le bas",
                "Fléchissez légèrement les genoux",
                "Mouvement fluide et continu"
            ],
            "tips": ["Utilisez les hanches"],
            "video_url": "https://www.youtube.com/watch?v=4N4Y3b8X5Fs",
            "difficulty": "débutant",
            "equipment": ["ski erg"]
        },
        {
            "exercise_id": "ex_rowing_erg",
            "name": "Rameur (Rowing Erg)",
            "category": "cardio",
            "muscle_groups": ["full body"],
            "description": "Rameur d'intérieur.",
            "instructions": [
                "Pieds attachés, genoux pliés",
                "Poussez avec les jambes",
                "Penchez légèrement en arrière",
                "Tirez la poignée vers le sternum"
            ],
            "tips": ["Jambes, hanches, bras (dans l'ordre)"],
            "video_url": "https://www.youtube.com/watch?v=zQ82RYIFLN8",
            "difficulty": "débutant",
            "equipment": ["rameur (erg)"]
        },
        {
            "exercise_id": "ex_sandbag_clean",
            "name": "Sandbag Clean",
            "category": "cardio",
            "muscle_groups": ["quadriceps", "fessiers", "biceps", "core"],
            "description": "Épaulé avec sac de sable.",
            "instructions": [
                "Sandbag au sol",
                "Tirez vers les épaules",
                "Passez sous le sandbag",
                "Réceptionnez en position accroupie"
            ],
            "tips": ["Grip différent d'une barre"],
            "video_url": "https://www.youtube.com/watch?v=UoZ6cW3JN7k",
            "difficulty": "intermédiaire",
            "equipment": ["sandbag"]
        },
        
        # === EXERCICES AVEC BALLON (10) ===
        {
            "exercise_id": "ex_stability_ball_crunch",
            "name": "Crunch sur Swiss Ball",
            "category": "core",
            "muscle_groups": ["abdominaux"],
            "description": "Crunch sur ballon de stabilité.",
            "instructions": [
                "Dos sur le ballon, pieds au sol",
                "Mains derrière la tête",
                "Crunch en relevant les épaules",
                "Descendez lentement"
            ],
            "tips": ["Plus grande amplitude qu'au sol"],
            "video_url": "https://www.youtube.com/watch?v=KjBJg8X5p30",
            "difficulty": "débutant",
            "equipment": ["swiss ball"]
        },
        {
            "exercise_id": "ex_stability_ball_pike",
            "name": "Pike sur Swiss Ball",
            "category": "core",
            "muscle_groups": ["abdominaux", "épaules"],
            "description": "Pike avec pieds sur le ballon.",
            "instructions": [
                "Position de planche, pieds sur le ballon",
                "Levez les hanches vers le plafond",
                "Formez un V inversé",
                "Redescendez en planche"
            ],
            "tips": ["Gardez les jambes tendues"],
            "video_url": "https://www.youtube.com/watch?v=GJU_Pjvwg0Q",
            "difficulty": "intermédiaire",
            "equipment": ["swiss ball"]
        },
        {
            "exercise_id": "ex_stability_ball_hamstring_curl",
            "name": "Leg Curl sur Swiss Ball",
            "category": "legs",
            "muscle_groups": ["ischio-jambiers", "fessiers"],
            "description": "Curl des ischio-jambiers sur ballon.",
            "instructions": [
                "Allongé sur le dos, talons sur le ballon",
                "Levez les hanches",
                "Ramenez le ballon vers vous",
                "Étendez les jambes"
            ],
            "tips": ["Gardez les hanches levées"],
            "video_url": "https://www.youtube.com/watch?v=i6YoZyKFd8s",
            "difficulty": "intermédiaire",
            "equipment": ["swiss ball"]
        },
        {
            "exercise_id": "ex_slam_ball",
            "name": "Slam Ball",
            "category": "cardio",
            "muscle_groups": ["full body", "core", "épaules"],
            "description": "Lever et jeter un medecine ball au sol.",
            "instructions": [
                "Medecine ball au-dessus de la tête",
                "Jetez-le au sol avec force",
                "Utilisez tout le corps",
                "Ramassez et répétez"
            ],
            "tips": ["Utilisez un slam ball (ne rebondit pas)"],
            "video_url": "https://www.youtube.com/watch?v=ljO4AoZHvFY",
            "difficulty": "intermédiaire",
            "equipment": ["slam ball"]
        },
        {
            "exercise_id": "ex_med_ball_russian_twist",
            "name": "Russian Twist avec Medecine Ball",
            "category": "core",
            "muscle_groups": ["obliques", "abdominaux"],
            "description": "Rotation du torse avec medecine ball.",
            "instructions": [
                "Assis, pieds décollés ou au sol",
                "Medecine ball devant la poitrine",
                "Tournez d'un côté à l'autre",
                "Touchez le sol de chaque côté"
            ],
            "tips": ["Gardez le dos droit"],
            "video_url": "https://www.youtube.com/watch?v=Yo-MYEQDErQ",
            "difficulty": "intermédiaire",
            "equipment": ["medecine ball"]
        },
        {
            "exercise_id": "ex_med_ball_chest_pass",
            "name": "Chest Pass Medecine Ball",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "épaules"],
            "description": "Passe de poitrine explosive.",
            "instructions": [
                "Medecine ball à la poitrine",
                "Poussez explossivement vers un partenaire ou mur",
                "Étendez complètement les bras",
                "Rattrapez et répétez"
            ],
            "tips": ["Exercice de puissance"],
            "video_url": "https://www.youtube.com/watch?v=R7JHUIIS-s4",
            "difficulty": "débutant",
            "equipment": ["medecine ball", "mur"]
        },
        {
            "exercise_id": "ex_med_ball_overhead_throw",
            "name": "Lancer au-dessus de la Tête",
            "category": "core",
            "muscle_groups": ["core", "épaules", "dorsaux"],
            "description": "Lancer de medecine ball vers l'arrière.",
            "instructions": [
                "Medecine ball au-dessus de la tête",
                "Penchez-vous légèrement en arrière",
                "Lancez vers l'arrière",
                "Utilisez tout le corps"
            ],
            "tips": ["Excellent pour la puissance explosive"],
            "video_url": "https://www.youtube.com/watch?v=0ZRVZ3dSfPc",
            "difficulty": "intermédiaire",
            "equipment": ["medecine ball"]
        },
        {
            "exercise_id": "ex_bosu_squat",
            "name": "Squat sur BOSU",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers", "core"],
            "description": "Squat sur surface instable BOSU.",
            "instructions": [
                "Debout sur le côté plat du BOSU",
                "Descendez en squat",
                "Gardez l'équilibre",
                "Remontez avec contrôle"
            ],
            "tips": ["Travaille la stabilité"],
            "video_url": "https://www.youtube.com/watch?v=LbEk4SfXJi0",
            "difficulty": "intermédiaire",
            "equipment": ["BOSU ball"]
        },
        {
            "exercise_id": "ex_bosu_pushup",
            "name": "Push-up sur BOSU",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "core"],
            "description": "Pompe sur BOSU instable.",
            "instructions": [
                "Mains sur les bords du BOSU (côté plat en haut)",
                "Position de planche",
                "Descendez en pompe",
                "Poussez en gardant l'équilibre"
            ],
            "tips": ["Plus difficile que les pompes classiques"],
            "video_url": "https://www.youtube.com/watch?v=G8rHntW6dpU",
            "difficulty": "intermédiaire",
            "equipment": ["BOSU ball"]
        },
        {
            "exercise_id": "ex_bosu_plank",
            "name": "Planche sur BOSU",
            "category": "core",
            "muscle_groups": ["core", "épaules"],
            "description": "Planche sur surface instable.",
            "instructions": [
                "Avant-bras sur le côté mou du BOSU",
                "Position de planche",
                "Maintenez l'équilibre",
                "Corps aligné"
            ],
            "tips": ["Augmente le travail du core"],
            "video_url": "https://www.youtube.com/watch?v=E_j8VQQS8Nw",
            "difficulty": "intermédiaire",
            "equipment": ["BOSU ball"]
        },
        
        # === EXERCICES DE NATATION À SEC (5) ===
        {
            "exercise_id": "ex_swimmers",
            "name": "Swimmers (Nageur)",
            "category": "back",
            "muscle_groups": ["lombaires", "fessiers", "épaules"],
            "description": "Mouvement de natation au sol.",
            "instructions": [
                "Allongé sur le ventre",
                "Levez bras et jambes",
                "Battez les bras et jambes alternativement",
                "Comme si vous nagiez"
            ],
            "tips": ["Gardez le regard vers le sol"],
            "video_url": "https://www.youtube.com/watch?v=Y_7aHqXeCfQ",
            "difficulty": "débutant",
            "equipment": []
        },
        {
            "exercise_id": "ex_prone_i_y_t",
            "name": "I-Y-T Raises",
            "category": "back",
            "muscle_groups": ["trapèzes", "rhomboïdes", "deltoïdes postérieurs"],
            "description": "Élévations en I, Y et T pour le haut du dos.",
            "instructions": [
                "Allongé sur un banc incliné ou au sol",
                "Bras I: droit devant",
                "Bras Y: en diagonal",
                "Bras T: sur les côtés"
            ],
            "tips": ["Excellent pour la posture"],
            "video_url": "https://www.youtube.com/watch?v=o-GmgvAALLY",
            "difficulty": "débutant",
            "equipment": ["banc incliné"]
        },
        {
            "exercise_id": "ex_band_pull_apart",
            "name": "Band Pull-apart",
            "category": "back",
            "muscle_groups": ["deltoïdes postérieurs", "rhomboïdes", "trapèzes"],
            "description": "Écartement d'élastique devant soi.",
            "instructions": [
                "Élastique tenu bras tendus devant",
                "Écartez les bras sur les côtés",
                "Serrez les omoplates",
                "Revenez lentement"
            ],
            "tips": ["Excellent pour l'équilibre des épaules"],
            "video_url": "https://www.youtube.com/watch?v=JObYtU7Y7ag",
            "difficulty": "débutant",
            "equipment": ["élastique de résistance"]
        },
        {
            "exercise_id": "ex_band_dislocates",
            "name": "Shoulder Dislocates",
            "category": "shoulders",
            "muscle_groups": ["épaules", "pectoraux"],
            "description": "Rotation complète des épaules avec bâton ou élastique.",
            "instructions": [
                "Tenez un bâton ou élastique très large",
                "Passez-le devant, au-dessus, puis derrière",
                "Gardez les bras tendus",
                "Revenez par le même chemin"
            ],
            "tips": ["Excellent pour la mobilité des épaules"],
            "video_url": "https://www.youtube.com/watch?v=02HdChcpyBs",
            "difficulty": "débutant",
            "equipment": ["bâton", "élastique"]
        },
        {
            "exercise_id": "ex_band_face_pull",
            "name": "Band Face Pull",
            "category": "back",
            "muscle_groups": ["deltoïdes postérieurs", "trapèzes", "rotateurs externes"],
            "description": "Tirage vers le visage avec élastique.",
            "instructions": [
                "Élastique attaché à hauteur de visage",
                "Tirez vers le visage",
                "Écartez les mains en fin de mouvement",
                "Serrez les omoplates"
            ],
            "tips": ["Excellent pour la santé des épaules"],
            "video_url": "https://www.youtube.com/watch?v=V8dZ3pyiCBo",
            "difficulty": "débutant",
            "equipment": ["élastique de résistance"]
        },
        
        # === EXERCICES AVEC TRX/SANGLES (15) ===
        {
            "exercise_id": "ex_trx_row",
            "name": "TRX Row",
            "category": "back",
            "muscle_groups": ["dorsaux", "biceps", "rhomboïdes"],
            "description": "Tirage horizontal au TRX.",
            "instructions": [
                "Face aux sangles, corps incliné",
                "Bras tendus devant",
                "Tirez la poitrine vers les poignées",
                "Descendez avec contrôle"
            ],
            "tips": ["Plus le corps est horizontal, plus c'est dur"],
            "video_url": "https://www.youtube.com/watch?v=VHHRkCBvR90",
            "difficulty": "débutant",
            "equipment": ["TRX", "sangles de suspension"]
        },
        {
            "exercise_id": "ex_trx_pushup",
            "name": "TRX Push-up",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps", "core"],
            "description": "Pompe avec pieds dans les sangles TRX.",
            "instructions": [
                "Pieds dans les sangles",
                "Position de planche",
                "Descendez en pompe",
                "L'instabilité augmente le travail"
            ],
            "tips": ["Gardez le corps gainé"],
            "video_url": "https://www.youtube.com/watch?v=1XrfJlzL-90",
            "difficulty": "intermédiaire",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_chest_press",
            "name": "TRX Chest Press",
            "category": "chest",
            "muscle_groups": ["pectoraux", "triceps"],
            "description": "Développé de poitrine au TRX.",
            "instructions": [
                "Dos aux sangles, poignées en main",
                "Penchez-vous en avant",
                "Descendez comme une pompe inversée",
                "Poussez pour remonter"
            ],
            "tips": ["Ajustez l'angle pour la difficulté"],
            "video_url": "https://www.youtube.com/watch?v=Fg6K3sBCx0k",
            "difficulty": "intermédiaire",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_bicep_curl",
            "name": "TRX Bicep Curl",
            "category": "arms",
            "muscle_groups": ["biceps"],
            "description": "Curl biceps au TRX.",
            "instructions": [
                "Face aux sangles, corps incliné",
                "Coudes à hauteur d'épaules",
                "Fléchissez les coudes",
                "Amenez les mains vers la tête"
            ],
            "tips": ["Gardez les coudes fixes"],
            "video_url": "https://www.youtube.com/watch?v=3l4zB3bIyRw",
            "difficulty": "débutant",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_tricep_extension",
            "name": "TRX Tricep Extension",
            "category": "arms",
            "muscle_groups": ["triceps"],
            "description": "Extension triceps au TRX.",
            "instructions": [
                "Dos aux sangles, bras tendus",
                "Fléchissez les coudes",
                "Mains derrière la tête",
                "Étendez pour revenir"
            ],
            "tips": ["Gardez les coudes vers l'avant"],
            "video_url": "https://www.youtube.com/watch?v=6VrNKN1qf8E",
            "difficulty": "débutant",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_hamstring_curl",
            "name": "TRX Hamstring Curl",
            "category": "legs",
            "muscle_groups": ["ischio-jambiers", "fessiers"],
            "description": "Leg curl avec pieds dans les sangles.",
            "instructions": [
                "Allongé, talons dans les sangles",
                "Levez les hanches",
                "Fléchissez les genoux",
                "Tirez les talons vers les fessiers"
            ],
            "tips": ["Gardez les hanches levées"],
            "video_url": "https://www.youtube.com/watch?v=p2T8E7dFX8Q",
            "difficulty": "intermédiaire",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_lunge",
            "name": "TRX Lunge",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Fente avec pied arrière dans la sangle.",
            "instructions": [
                "Pied arrière dans la sangle",
                "Descendez en fente",
                "Genou avant à 90°",
                "Remontez avec contrôle"
            ],
            "tips": ["Similaire au Bulgarian split squat"],
            "video_url": "https://www.youtube.com/watch?v=7DgAHcv3GUQ",
            "difficulty": "intermédiaire",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_squat",
            "name": "TRX Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Squat assisté au TRX.",
            "instructions": [
                "Face aux sangles, poignées en main",
                "Descendez en squat",
                "Utilisez les sangles pour l'équilibre",
                "Remontez avec les jambes"
            ],
            "tips": ["Bon pour apprendre le squat"],
            "video_url": "https://www.youtube.com/watch?v=DTXphTGYd0g",
            "difficulty": "débutant",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_pike",
            "name": "TRX Pike",
            "category": "core",
            "muscle_groups": ["abdominaux", "épaules"],
            "description": "Pike avec pieds dans les sangles.",
            "instructions": [
                "Position de planche, pieds dans les sangles",
                "Levez les hanches vers le plafond",
                "Formez un V inversé",
                "Redescendez en planche"
            ],
            "tips": ["Gardez les jambes tendues"],
            "video_url": "https://www.youtube.com/watch?v=GJU_Pjvwg0Q",
            "difficulty": "avancé",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_knee_tuck",
            "name": "TRX Knee Tuck",
            "category": "core",
            "muscle_groups": ["abdominaux", "hip flexors"],
            "description": "Genoux à la poitrine au TRX.",
            "instructions": [
                "Position de planche, pieds dans les sangles",
                "Ramenez les genoux vers la poitrine",
                "Contractez les abdos",
                "Revenez en planche"
            ],
            "tips": ["Ne laissez pas les hanches tomber"],
            "video_url": "https://www.youtube.com/watch?v=Y2-AZLJZyU0",
            "difficulty": "intermédiaire",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_fallout",
            "name": "TRX Fallout",
            "category": "core",
            "muscle_groups": ["abdominaux", "épaules"],
            "description": "Extension du corps vers l'avant au TRX.",
            "instructions": [
                "Face aux sangles, bras tendus",
                "Laissez le corps tomber vers l'avant",
                "Bras au-dessus de la tête",
                "Revenez en tirant avec le core"
            ],
            "tips": ["Comme un ab wheel debout"],
            "video_url": "https://www.youtube.com/watch?v=4xvT8UhXP0Q",
            "difficulty": "avancé",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_plank",
            "name": "TRX Plank",
            "category": "core",
            "muscle_groups": ["core", "épaules"],
            "description": "Planche avec pieds dans les sangles.",
            "instructions": [
                "Pieds dans les sangles",
                "Position de planche",
                "Maintenez le corps aligné",
                "L'instabilité augmente le travail"
            ],
            "tips": ["Plus difficile qu'une planche normale"],
            "video_url": "https://www.youtube.com/watch?v=rqiTPdK1c_I",
            "difficulty": "intermédiaire",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_y_fly",
            "name": "TRX Y-Fly",
            "category": "back",
            "muscle_groups": ["deltoïdes postérieurs", "trapèzes"],
            "description": "Fly en Y au TRX.",
            "instructions": [
                "Face aux sangles, corps incliné",
                "Bras tendus devant",
                "Tirez les bras en Y au-dessus de la tête",
                "Serrez les omoplates"
            ],
            "tips": ["Excellent pour le haut du dos"],
            "video_url": "https://www.youtube.com/watch?v=b3AHF9eDlBg",
            "difficulty": "intermédiaire",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_single_leg_squat",
            "name": "TRX Single Leg Squat",
            "category": "legs",
            "muscle_groups": ["quadriceps", "fessiers"],
            "description": "Squat sur une jambe assisté au TRX.",
            "instructions": [
                "Face aux sangles, sur une jambe",
                "Descendez en squat",
                "Utilisez les sangles pour l'équilibre",
                "Remontez avec une jambe"
            ],
            "tips": ["Progression vers le pistol squat"],
            "video_url": "https://www.youtube.com/watch?v=oj5eF5HfyF8",
            "difficulty": "avancé",
            "equipment": ["TRX"]
        },
        {
            "exercise_id": "ex_trx_atomic_pushup",
            "name": "TRX Atomic Push-up",
            "category": "core",
            "muscle_groups": ["pectoraux", "abdominaux", "triceps"],
            "description": "Combinaison pompe + knee tuck.",
            "instructions": [
                "Pieds dans les sangles",
                "Faites une pompe",
                "En remontant, ramenez les genoux",
                "Revenez en planche et répétez"
            ],
            "tips": ["Mouvement avancé et complet"],
            "video_url": "https://www.youtube.com/watch?v=UPRqG0TUaVU",
            "difficulty": "avancé",
            "equipment": ["TRX"]
        }
    ]
