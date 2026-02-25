import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { play8BitBirthday } from '../utils/audio';
import { toast } from 'sonner';

export const BirthdayCelebration = () => {
    const { user } = useAuth();
    const celebratedRef = useRef(false);

    useEffect(() => {
        if (!user?.birthdate || celebratedRef.current) return;

        try {
            const today = new Date();
            const birthDate = new Date(user.birthdate);

            // Check if month and day match
            if (today.getDate() === birthDate.getDate() &&
                today.getMonth() === birthDate.getMonth()) {

                celebratedRef.current = true;

                // Delay slightly for user interaction if needed, but auto-play usually blocked
                // We hope user has interacted with the app by now
                setTimeout(() => {
                    play8BitBirthday();

                    toast.success("🎂 JOYEUX ANNIVERSAIRE ! 🎉", {
                        description: "Toute l'équipe FitQuest te souhaite une excellente journée !",
                        duration: 8000,
                        style: {
                            background: 'linear-gradient(135deg, #6441a5, #B0E301)',
                            color: 'white',
                            border: 'none',
                            fontSize: '16px'
                        }
                    });
                }, 1000);
            }
        } catch (e) {
            console.error("Birthday check failed", e);
        }
    }, [user]);

    return null;
};
