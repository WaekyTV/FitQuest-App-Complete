import { useState, useEffect, useCallback } from 'react';
import {
    Droplet,
    Minus,
    Plus,
    CheckCircle2,
    Settings2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GLASS_VOLUME = 0.25; // Liters

const WaterGlass = ({ filled, onClick, index }) => {
    // State machine to replicate user's JS logic: 'empty' -> 'filling' -> 'full' -> 'emptying' -> 'empty'
    const [status, setStatus] = useState(filled ? 'full' : 'empty');

    useEffect(() => {
        let timer;
        if (filled) {
            // If already full, ensure status is 'full'. If empty or emptying, start filling.
            if (status !== 'full' && status !== 'filling') {
                setStatus('filling');
                timer = setTimeout(() => {
                    setStatus('full');
                }, 1500);
            } else if (status === 'filling') {
                // Ensure we finish the transition if re-mounting or weird state
                timer = setTimeout(() => {
                    setStatus('full');
                }, 1500);
            }
        } else {
            // If already empty, ensure status is 'empty'. If full or filling, start emptying.
            if (status !== 'empty' && status !== 'emptying') {
                setStatus('emptying');
                timer = setTimeout(() => {
                    setStatus('empty');
                }, 1500);
            } else if (status === 'emptying') {
                timer = setTimeout(() => {
                    setStatus('empty');
                }, 1500);
            }
        }
        return () => clearTimeout(timer);
    }, [filled]); // Re-run when filled prop changes

    return (
        // Container to position and scale the glass in the grid
        // The original glass is 140px x 220px. We scale it down to ~49px x 77px (scale 0.35)
        <div className="relative w-[50px] h-[80px] flex items-center justify-center">

            <style>{`
                /* Design du Verre (Scoped with prefix hg-) */
                .hg-wrapper {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    filter: drop-shadow(0px 10px 20px rgba(0,0,0,0.05));
                    /* height: 100vh; REMOVED - Controlled by container */
                    /* body styles ignored */
                }

                .hg-glass {
                    width: 140px;
                    height: 220px;
                    background-color: #F4F7F9;
                    clip-path: polygon(5% 0, 95% 0, 85% 100%, 15% 100%);
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                    z-index: 2;
                    transition: transform 0.1s ease;
                    touch-action: manipulation; /* Prevent double-tap zoom/delay */
                }

                /* REMOVED :active scale to prevent sticking state */
                /* .hg-glass:active { transform: scale(0.95); } */

                /* Le "+" central */
                .hg-cross {
                    position: absolute;
                    top: 45%; left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 70px;
                    font-weight: bold;
                    color: #2D3748;
                    z-index: 10;
                    transition: opacity 0.3s ease;
                    user-select: none;
                }

                .hg-wrapper.hg-filling .hg-cross, 
                .hg-wrapper.hg-full .hg-cross, 
                .hg-wrapper.hg-emptying .hg-cross { opacity: 0; }

                /* Conteneur d'eau (Gère le niveau à 95%) */
                .hg-water-container {
                    position: absolute;
                    top: 0; 
                    left: 0;
                    width: 100%; 
                    height: 100%; 
                    transform: translateY(105%); 
                    transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 5;
                }

                .hg-wrapper.hg-filling .hg-water-container, 
                .hg-wrapper.hg-full .hg-water-container {
                    transform: translateY(5%);
                }

                /* Corps de l'eau */
                .hg-water-body {
                    position: absolute;
                    top: 28px; left: 0; right: 0; bottom: -50px;
                    background-color: #90E0EF;
                    z-index: 2;
                }

                /* Bulles */
                .hg-bubbles {
                    position: absolute;
                    bottom: 50px; 
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                    z-index: 3;
                }

                .hg-wrapper.hg-filling .hg-bubbles,
                .hg-wrapper.hg-full .hg-bubbles {
                    opacity: 1;
                }

                .hg-bubble {
                    position: absolute;
                    bottom: 0;
                    background-color: rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    animation: hg-float-up infinite ease-in;
                }

                .hg-b1 { left: 20%; width: 6px; height: 6px; animation-duration: 2s; animation-delay: 0.1s; }
                .hg-b2 { left: 45%; width: 4px; height: 4px; animation-duration: 2.5s; animation-delay: 0.5s; }
                .hg-b3 { left: 70%; width: 7px; height: 7px; animation-duration: 1.8s; animation-delay: 0.8s; }
                .hg-b4 { left: 30%; width: 5px; height: 5px; animation-duration: 2.2s; animation-delay: 1.2s; }
                .hg-b5 { left: 60%; width: 6px; height: 6px; animation-duration: 2.6s; animation-delay: 0.3s; }
                .hg-b6 { left: 80%; width: 4px; height: 4px; animation-duration: 1.9s; animation-delay: 0.6s; }

                @keyframes hg-float-up {
                    0% { transform: translateY(0) scale(1); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateY(-170px) scale(0.5); opacity: 0; }
                }

                /* Vagues SVG */
                .hg-wave-back-wrapper {
                    position: absolute;
                    top: 0; left: 0; 
                    width: 100%; height: 30px;
                    z-index: 1; 
                    transform-origin: bottom center;
                    transition: transform 0.4s ease, opacity 0.2s ease;
                }

                .hg-wave-front-wrapper {
                    position: absolute;
                    top: 0; left: 0; 
                    width: 100%; height: 30px;
                    z-index: 4;
                    transform-origin: bottom center;
                    transition: transform 0.4s ease;
                }

                .hg-svg-wave {
                    width: 400px;
                    height: 30px;
                    display: block;
                }

                .hg-wave-front {
                    fill: #90E0EF;
                    animation: hg-slide-left 2s infinite linear;
                }

                .hg-wave-back {
                    fill: #76C8E0;
                    animation: hg-slide-right 2.5s infinite linear;
                }
                
                /* Aplatissement progressif quand plein */
                .hg-wrapper.hg-full .hg-wave-front-wrapper {
                    transform: scaleY(0.25);
                    transition: transform 2.5s ease-out;
                }

                .hg-wrapper.hg-full .hg-wave-back-wrapper {
                    transform: scaleY(0.25) translateY(20px);
                    opacity: 0; 
                    transition: transform 2.5s ease-out, opacity 2.5s ease-out;
                }

                @keyframes hg-slide-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-200px); }
                }
                @keyframes hg-slide-right {
                    0% { transform: translateX(-200px); }
                    100% { transform: translateX(0); }
                }
            `}</style>

            <div
                className={`hg-wrapper ${status === 'filling' ? 'hg-filling' : ''} ${status === 'full' ? 'hg-full' : ''} ${status === 'emptying' ? 'hg-emptying' : ''} ${status === 'empty' ? 'hg-empty' : ''}`}
                style={{ transform: 'scale(0.35)', transformOrigin: 'center' }}
            >
                <div className="hg-glass" onClick={onClick} data-testid={`water-glass-${index}`}>
                    <div className="hg-cross">+</div>

                    <div className="hg-water-container">
                        <div className="hg-wave-back-wrapper">
                            <svg className="hg-svg-wave hg-wave-back" viewBox="0 0 400 30" preserveAspectRatio="none">
                                <path d="M 0 15 C 25 0, 75 0, 100 15 C 125 30, 175 30, 200 15 C 225 0, 275 0, 300 15 C 325 30, 375 30, 400 15 L 400 30 L 0 30 Z" />
                            </svg>
                        </div>

                        <div className="hg-water-body">
                            <div className="hg-bubbles">
                                <div className="hg-bubble hg-b1"></div>
                                <div className="hg-bubble hg-b2"></div>
                                <div className="hg-bubble hg-b3"></div>
                                <div className="hg-bubble hg-b4"></div>
                                <div className="hg-bubble hg-b5"></div>
                                <div className="hg-bubble hg-b6"></div>
                            </div>
                        </div>

                        <div className="hg-wave-front-wrapper">
                            <svg className="hg-svg-wave hg-wave-front" viewBox="0 0 400 30" preserveAspectRatio="none">
                                <path d="M 0 15 C 25 0, 75 0, 100 15 C 125 30, 175 30, 200 15 C 225 0, 275 0, 300 15 C 325 30, 375 30, 400 15 L 400 30 L 0 30 Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const HydrationSystem = () => {
    const { user, lastSync } = useAuth();
    const [hydration, setHydration] = useState({ glasses: 0, target: 8 });
    const [modalOpen, setModalOpen] = useState(false);
    const [tempTarget, setTempTarget] = useState(1.5); // Liters
    const [loading, setLoading] = useState(false);

    // Recommended goal: 1.5L = 6 glasses
    const recommendedGoal = 1.5;

    const fetchHydration = useCallback(async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${API}/hydration`, { withCredentials: true });
            if (res.data) {
                setHydration({
                    glasses: res.data.glasses || 0,
                    target: res.data.target || 8
                });
                setTempTarget((res.data.target || 8) * GLASS_VOLUME);
            }
        } catch (error) {
            console.error('Error fetching hydration:', error);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchHydration();
        }
    }, [user, lastSync, fetchHydration]);

    const updateHydration = async (newGlasses) => {
        // Prevent negative values
        if (newGlasses < 0) return;

        // Optimistic update
        const oldGlasses = hydration.glasses;
        setHydration(prev => ({ ...prev, glasses: newGlasses }));

        try {
            const delta = newGlasses - oldGlasses;

            // We need to execute these sequentially to ensure backend sync
            if (delta > 0) {
                for (let i = 0; i < delta; i++) {
                    await axios.post(`${API}/hydration/add`, {}, { withCredentials: true });
                }
            } else if (delta < 0) {
                for (let i = 0; i < Math.abs(delta); i++) {
                    await axios.post(`${API}/hydration/remove`, {}, { withCredentials: true });
                }
            }
        } catch (error) {
            console.error('Error updating hydration:', error);
            setHydration(prev => ({ ...prev, glasses: oldGlasses })); // Revert on error
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const toggleGlass = (index) => {
        if (index < hydration.glasses) {
            // Already filled: set level to this index (emptying this glass and all after it)
            updateHydration(index);
        } else {
            // Glass is empty. Fill up to this glass.
            updateHydration(index + 1);
        }
    };

    const handleGoalSave = async () => {
        try {
            setLoading(true);
            const targetGlasses = Math.round(tempTarget / GLASS_VOLUME);
            await axios.put(`${API}/hydration/target?target=${targetGlasses}`, {}, { withCredentials: true });
            setHydration(prev => ({ ...prev, target: targetGlasses }));
            setModalOpen(false);
            toast.success('Objectif hydratation mis à jour !');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour de l\'objectif');
        } finally {
            setLoading(false);
        }
    };

    const fillPercentage = Math.min((hydration.glasses / hydration.target) * 100, 100);

    // Calculate how many glasses to display.
    // Minimum: target OR current glasses (if more than target), capped at 12.
    const displayGlassesCount = Math.min(12, Math.max(hydration.target, hydration.glasses));

    return (
        <>
            <Card className="card-stat relative overflow-hidden group" data-testid="hydration-card">
                {/* Clickable area for modal */}
                <button
                    onClick={() => setModalOpen(true)}
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-[#00BFFF] transition-colors z-10"
                >
                    <Settings2 className="w-4 h-4" />
                </button>

                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Droplet className="w-4 h-4 text-[#00BFFF]" />
                            HYDRATATION
                        </CardTitle>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold">{(hydration.glasses * GLASS_VOLUME).toFixed(2)} L</span>
                        <span className="text-xs text-muted-foreground">/ {(hydration.target * GLASS_VOLUME).toFixed(2)} L</span>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Controls & Progress */}
                    <div className="flex flex-col items-center gap-6 mb-6">
                        {/* Liquid Progress Bar */}
                        <div className="w-full relative h-3 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-[#00BFFF] transition-all duration-500 ease-out"
                                style={{ width: `${fillPercentage}%` }}
                            />
                        </div>

                        {/* Glasses Display */}
                        <div className="flex flex-col gap-4 w-full items-center">

                            {/* Row 1: First 8 glasses */}
                            <div className="flex flex-wrap justify-center gap-3">
                                {Array.from({ length: Math.min(displayGlassesCount, 8) }).map((_, i) => (
                                    <WaterGlass
                                        key={i}
                                        index={i}
                                        filled={i < hydration.glasses}
                                        onClick={() => toggleGlass(i)}
                                    />
                                ))}
                            </div>

                            {/* Row 2: Remaining glasses (centered) */}
                            {displayGlassesCount > 8 && (
                                <div className="flex flex-wrap justify-center gap-3">
                                    {Array.from({ length: displayGlassesCount - 8 }).map((_, i) => {
                                        const globalIndex = i + 8;
                                        return (
                                            <WaterGlass
                                                key={globalIndex}
                                                index={globalIndex}
                                                filled={globalIndex < hydration.glasses}
                                                onClick={() => toggleGlass(globalIndex)}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Manual Controls */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                className="w-10 h-10 rounded-full border-2 border-[#00BFFF]/30 bg-transparent text-[#00BFFF] md:hover:border-[#00BFFF]/50 md:hover:bg-[#00BFFF]/10 focus:outline-none focus:ring-0 active:scale-95 active:bg-[#00BFFF] active:text-white active:shadow-[0_0_20px_rgba(0,191,255,0.6)] transition-all duration-500"
                                onClick={() => updateHydration(Math.max(0, hydration.glasses - 1))}
                            >
                                <Minus className="w-5 h-5" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="w-10 h-10 rounded-full border-2 border-[#00BFFF]/30 bg-transparent text-[#00BFFF] md:hover:border-[#00BFFF]/50 md:hover:bg-[#00BFFF]/10 focus:outline-none focus:ring-0 active:scale-95 active:bg-[#00BFFF] active:text-white active:shadow-[0_0_20px_rgba(0,191,255,0.6)] transition-all duration-500"
                                onClick={() => updateHydration(hydration.glasses + 1)}
                            >
                                <Plus className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>

                    {hydration.glasses >= hydration.target && (
                        <div className="flex items-center justify-center gap-2 text-[#B0E301] animate-fade-in">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Objectif atteint !</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Goal Setting Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="bg-[#0A0A0A] border-white/10 max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl">Challenges</DialogTitle>
                        <p className="text-center text-[#A1A1AA] text-sm">
                            Suivez votre consommation au quotidien
                        </p>
                    </DialogHeader>

                    <div className="py-6 space-y-8">
                        <div className="text-center space-y-2">
                            <p className="text-[#00BFFF] text-sm font-medium">Objectif quotidien</p>
                            <div className="flex items-center justify-center gap-4">
                                <div className="text-center">
                                    <span className="text-3xl font-bold block">{tempTarget.toFixed(2)} <span className="text-base font-normal text-muted-foreground">L</span></span>
                                </div>
                                <div className="bg-white/10 rounded-full p-2">
                                    <span className="text-xl">=</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-3xl font-bold block">{Math.round(tempTarget / GLASS_VOLUME)} <span className="text-base font-normal text-muted-foreground">Verres</span></span>
                                </div>
                            </div>
                        </div>

                        <div className="px-4">
                            <Slider
                                value={[tempTarget]}
                                min={0.5}
                                max={3}
                                step={0.25}
                                onValueChange={([val]) => setTempTarget(val)}
                                className="py-4"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 bg-white/5 border-transparent hover:bg-white/10"
                                onClick={() => setTempTarget(recommendedGoal)}
                            >
                                Recommandé
                            </Button>
                            <Button
                                variant="brand"
                                className="flex-1"
                                onClick={handleGoalSave}
                                disabled={loading}
                            >
                                {loading ? 'Validation...' : 'Valider'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
