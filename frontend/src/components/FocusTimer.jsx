import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import {
    Play,
    Pause,
    Volume2,
    Volume1,
    VolumeX,
    SkipBack,
    SkipForward,
    RotateCcw,
    Bell,
    BellOff,
    Mic,
    MicOff,
    Square,
    Lock,
    Vibrate
} from 'lucide-react';
import { Button } from './ui/button';

// Sub-component for the exit circle to isolate animations from main timer render
const ExitCircularProgress = memo(({ progress }) => {
    if (progress === 0) return null;
    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="80"
                        fill="black"
                        fillOpacity="0.3"
                        stroke="black"
                        strokeOpacity="0.2"
                        strokeWidth="8"
                    />
                    <circle
                        cx="96"
                        cy="96"
                        r="80"
                        fill="none"
                        stroke="black"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 80}
                        strokeDashoffset={2 * Math.PI * 80 * (1 - progress / 100)}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <Lock className="w-12 h-12 text-black fill-black/20 drop-shadow-lg" />
                </div>
            </div>
        </div>
    );
});

// Helper for Volume choosing
const VolumeIcon = ({ volume, muted, vibrationEnabled, className = "w-6 h-6" }) => {
    if (!muted && vibrationEnabled) {
        return (
            <div className="relative">
                <Volume2 className={className} />
                <Vibrate className="w-3 h-3 absolute -bottom-1 -right-1 text-[#B0E301] drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
            </div>
        );
    }
    if (vibrationEnabled) return <Vibrate className={className} />;
    if (muted || volume === 0) return <VolumeX className={className} />;
    if (volume < 0.5) return <Volume1 className={className} />;
    return <Volume2 className={className} />;
};

// Specialized slider for FocusTimer
const TimerSlider = ({ ...props }) => (
    <SliderPrimitive.Root
        className={cn(
            "relative flex items-center select-none touch-none w-full h-10",
            props.className
        )}
        {...props}
    >
        <SliderPrimitive.Track className="bg-white/40 relative grow rounded-full h-1.5 overflow-hidden">
            <SliderPrimitive.Range className="absolute bg-white h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
            className="block w-4 h-4 bg-white rounded-full shadow-lg focus:outline-none transition-transform active:scale-125 hover:scale-110"
            style={{
                display: 'block',
                position: 'relative'
            }}
            aria-label="Volume"
        />
    </SliderPrimitive.Root>
);

export const FocusTimer = memo(({
    interval,
    remainingTime,
    totalRemaining,
    currentIntervalIndex,
    totalIntervals,
    onPause,
    onNext,
    onPrev,
    onExit,
    onRestartInterval,
    onToggleSound,
    onVolumeChange,
    onToggleVoice,
    onToggleNotifications,
    settings,
    isPaused,
    isPreCount,
    preCountTime,
    formatTime,
    isFinished,
    onSkipPreCount,
    onRestartProgram
}) => {
    const [showControls, setShowControls] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const holdStartTimeRef = useRef(null);
    const holdAnimationFrameRef = useRef(null);
    const holdTimeoutRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const isHoldingRef = useRef(false);

    // Handle screen tap to toggle controls
    const handleScreenTap = (e) => {
        // Check if interaction target is interactive to avoid fighting clicks
        if (e.target.closest('button') || e.target.closest('[role="slider"]') || e.target.closest('.no-tap-trigger') || e.target.closest('.slider-container')) return;

        setShowControls(prev => {
            const next = !prev;
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            if (next) {
                controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 4000); // 4 seconds timeout
            }
            return next;
        });
    };

    const endHold = useCallback(() => {
        // Stop EVERYTHING immediately
        isHoldingRef.current = false;
        holdStartTimeRef.current = null;
        if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        if (holdAnimationFrameRef.current) cancelAnimationFrame(holdAnimationFrameRef.current);
        setHoldProgress(0);

        // Remove ALL possible global listeners
        window.removeEventListener('pointerup', endHold);
        window.removeEventListener('pointercancel', endHold);
        window.removeEventListener('pointerleave', endHold);
        window.removeEventListener('touchend', endHold);
        window.removeEventListener('touchcancel', endHold);
        window.removeEventListener('mouseup', endHold);
    }, []);

    const startHold = useCallback((e) => {
        if (isHoldingRef.current) return;

        // Prevent default browser behaviors (scrolling, zooming, context menus)
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();

        isHoldingRef.current = true;
        const startTime = Date.now();
        holdStartTimeRef.current = startTime;
        setHoldProgress(0);

        // Attach EVERY possible listener to ensure cancellation
        window.addEventListener('pointerup', endHold);
        window.addEventListener('pointercancel', endHold);
        window.addEventListener('pointerleave', endHold);
        window.addEventListener('touchend', endHold, { passive: false });
        window.addEventListener('touchcancel', endHold, { passive: false });
        window.addEventListener('mouseup', endHold);

        // 1. Logic: Strict timeout
        if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = setTimeout(() => {
            if (holdStartTimeRef.current === startTime && isHoldingRef.current) {
                onExit();
                endHold();
            }
        }, 500);

        // 2. Visual: Animation
        if (holdAnimationFrameRef.current) cancelAnimationFrame(holdAnimationFrameRef.current);
        const animate = () => {
            if (holdStartTimeRef.current !== startTime || !isHoldingRef.current) {
                setHoldProgress(0);
                return;
            }

            const elapsed = Date.now() - startTime;
            const progress = Math.min(100, (elapsed / 500) * 100);
            setHoldProgress(progress);

            if (progress < 100) {
                holdAnimationFrameRef.current = requestAnimationFrame(animate);
            }
        };
        holdAnimationFrameRef.current = requestAnimationFrame(animate);
    }, [endHold, onExit]);

    useEffect(() => {
        return () => {
            if (holdAnimationFrameRef.current) cancelAnimationFrame(holdAnimationFrameRef.current);
            if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, []);

    const bgColor = interval?.color || '#B0E301';

    // Desktop Wrapper
    const wrapperClass = "fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-all duration-300";

    // Phone Container Class
    const containerClass = `
    relative w-full h-full 
    md:w-[400px] md:h-[85vh] md:max-h-[900px] 
    md:rounded-[3rem] md:shadow-2xl md:ring-8 md:ring-[#121212]
    flex flex-col items-center justify-center 
    transition-colors duration-500 touch-none select-none overflow-hidden
  `;

    // Controls Visibility Class - hidden if finished OR if user is holding
    const controlsClass = `transition-opacity duration-300 ${(showControls && !isFinished && holdProgress === 0) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`;

    const timerContent = (
        <div className={wrapperClass}>
            <div
                className={containerClass}
                style={{ backgroundColor: bgColor }}
                onClick={handleScreenTap}
            >
                {/* TOP BAR: Volume Slider Row [Speaker] [Slider] [Bell] */}
                <div className={`absolute top-4 left-0 right-0 flex justify-center z-50 ${controlsClass}`}>
                    <div className="bg-black/60 backdrop-blur-xl rounded-full px-5 flex items-center gap-3 border border-white/10 shadow-2xl h-12 w-auto min-w-[300px] max-w-[90%] mx-auto">
                        {/* Volume Toggle Icon */}
                        <div className="shrink-0 flex items-center justify-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`w-10 h-10 rounded-full flex items-center justify-center no-tap-trigger ${(!settings.soundEnabled && !settings.vibrationEnabled) ? 'text-white/40' : 'text-white'}`}
                                onClick={(e) => { e.stopPropagation(); onToggleSound(); }}
                            >
                                <VolumeIcon
                                    volume={settings.volume}
                                    muted={!settings.soundEnabled}
                                    vibrationEnabled={settings.vibrationEnabled}
                                    className="w-5 h-5"
                                />
                            </Button>
                        </div>

                        {/* Slider Container */}
                        <div
                            className="flex-1 h-full flex items-center no-tap-trigger"
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                            }}
                            onPointerUp={() => {
                                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
                                controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 4000);
                            }}
                        >
                            <TimerSlider
                                max={100}
                                step={1}
                                value={[settings.volume * 100]}
                                onValueChange={(vals) => onVolumeChange && onVolumeChange(vals[0] / 100)}
                            />
                        </div>

                        {/* Notification Bell Icon */}
                        <div className="shrink-0 flex items-center justify-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/10 w-10 h-10 p-0 flex items-center justify-center no-tap-trigger"
                                onClick={(e) => { e.stopPropagation(); onToggleNotifications(); }}
                            >
                                {settings.notificationsEnabled ?
                                    <Bell className="w-5 h-5 text-white" /> :
                                    <BellOff className="w-5 h-5 text-white" />
                                }
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Hold to Quit Circle Animation (Center) */}
                <ExitCircularProgress progress={holdProgress} />


                {/* SECOND ROW: Navigation & Hold Hint */}
                {/* Positioned absolutely near top, below volume slider */}
                {!isFinished && holdProgress === 0 && (
                    <div className={`absolute top-20 left-0 right-0 px-4 flex justify-between items-center z-40 ${controlsClass}`}>
                        {/* Prev Button */}
                        <Button
                            size="icon"
                            variant="ghost"
                            className="w-12 h-12 rounded-full bg-black/60 text-white hover:bg-black/80 no-tap-trigger backdrop-blur-xl border border-white/10"
                            onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        >
                            <SkipBack className="w-6 h-6" />
                        </Button>

                        {/* Hold Hint (Center) */}
                        <div
                            className="hold-to-exit-zone relative bg-black/60 text-white px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-xs backdrop-blur-xl shadow-lg cursor-pointer active:scale-95 transition-transform no-tap-trigger select-none border border-white/10 mx-2 truncate whitespace-nowrap overflow-hidden group touch-none"
                            onPointerDown={startHold}
                            onTouchStart={startHold}
                            onContextMenu={(e) => e.preventDefault()}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Progress Bar Background */}
                            <div
                                className="absolute inset-0 bg-white/30 transition-all duration-75 ease-linear"
                                style={{ width: `${holdProgress}%` }}
                            />
                            <span className="relative z-10 drop-shadow-md">Maintenir pour sortir</span>
                        </div>
                        {/* Next Button */}
                        <Button
                            size="icon"
                            variant="ghost"
                            className="w-12 h-12 rounded-full bg-black/60 text-white hover:bg-black/80 no-tap-trigger backdrop-blur-xl border border-white/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isPreCount) onSkipPreCount();
                                else onNext();
                            }}
                        >
                            <SkipForward className="w-6 h-6" />
                        </Button>
                    </div>
                )}


                {/* Main Content (Timer) - Centered */}
                <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 pb-20 pt-32 px-4">
                    {isFinished ? (
                        <div className="flex flex-col items-center justify-center space-y-12">
                            <h1 className="text-8xl font-black text-white tracking-tighter drop-shadow-2xl animate-in zoom-in-50 duration-500">
                                FINI
                            </h1>
                            <div className="flex gap-6">
                                {/* Quit/Stop Button */}
                                <Button
                                    onClick={(e) => { e.stopPropagation(); onExit(); }}
                                    className="w-24 h-24 rounded-2xl bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition-all active:scale-90 backdrop-blur-xl border border-white/10 shadow-2xl"
                                >
                                    <Square className="w-10 h-10 fill-white" />
                                </Button>
                                {/* Restart Button */}
                                <Button
                                    onClick={(e) => { e.stopPropagation(); onRestartProgram(); }}
                                    className="w-24 h-24 rounded-2xl bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition-all active:scale-90 backdrop-blur-xl border border-white/10 shadow-2xl"
                                >
                                    <RotateCcw className="w-10 h-10" />
                                </Button>
                            </div>
                        </div>
                    ) : isPreCount ? (
                        <div className="space-y-4 text-center">
                            <h2 className="text-white/80 text-2xl uppercase font-bold tracking-widest">PRÉPAREZ-VOUS</h2>
                            <div className="text-9xl font-bold text-white leading-none font-mono">
                                {preCountTime}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full space-y-4 text-center">
                            {/* Timer Display */}
                            <div className="text-[7rem] sm:text-[8rem] font-bold text-white leading-none font-mono tracking-tighter drop-shadow-lg select-none">
                                {formatTime(remainingTime)}
                            </div>

                            {/* Interval Name */}
                            <h2 className="text-white/90 text-4xl sm:text-5xl uppercase font-black tracking-wide break-words drop-shadow-md pb-2 px-2 line-clamp-2">
                                {interval?.name || 'Intervalle'}
                            </h2>

                            {/* Instruction */}
                            {interval?.instruction && (
                                <p className="text-white/80 text-lg sm:text-xl font-medium max-w-[90%] mx-auto italic bg-black/10 p-2 rounded">
                                    "{interval.instruction}"
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom Area: Restart & Play/Pause */}
                {/* Restart Button (Bottom Centerish) - Hidden if finished */}
                {!isFinished && (
                    <div className={`absolute bottom-32 sm:bottom-40 transition-opacity duration-300 z-50 ${controlsClass}`}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); onRestartInterval(); }}
                            className="bg-black/60 text-white hover:bg-black/80 no-tap-trigger px-6 py-2.5 h-auto rounded-full backdrop-blur-xl border border-white/10 shadow-lg transition-all active:scale-95"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" /> Recommencer
                        </Button>
                    </div>
                )}

                {/* Bottom Play/Pause - Floating Fab Bottom Right - Hidden if finished */}
                {!isFinished && (
                    <div className="absolute bottom-6 right-6 z-50">
                        <Button
                            size="lg"
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-black hover:bg-white/90 shadow-2xl no-tap-trigger flex items-center justify-center p-0 transition-transform active:scale-95 animate-in zoom-in duration-300"
                            onClick={(e) => { e.stopPropagation(); onPause(); }}
                        >
                            {isPaused ? <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-black ml-1" /> : <Pause className="w-6 h-6 sm:w-8 sm:h-8 fill-black" />}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
    return ReactDOM.createPortal(timerContent, document.body);
});
