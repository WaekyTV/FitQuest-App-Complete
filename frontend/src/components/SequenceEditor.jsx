import React, { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import {
    Save,
    X,
    Plus,
    Trash2,
    Copy,
    Edit2,
    MoreHorizontal,
    ArrowBigUp,
    ArrowBigDown,
    StepBack,
    StepForward,
    Menu,
    Minus,
    Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import axios from 'axios';

// Sub-component for each interval to manage its own drag controls
const IntervalItem = ({
    interval,
    blockId,
    updateInterval,
    duplicateInterval,
    deleteInterval,
    transition
}) => {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            key={interval.id}
            value={interval}
            dragListener={false}
            dragControls={dragControls}
            layout
            transition={transition}
            className="relative rounded-md overflow-hidden select-none border border-white/5"
            whileDrag={{ scale: 1.02 }}
            style={{
                backgroundColor: interval.color || '#D95F0E',
                willChange: "transform"
            }}
        >
            <div className="flex flex-col p-4 pb-3">
                {/* Top Row: Name & Drag Handle */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 mr-4 border-b border-black/30 pb-1">
                        <Input
                            value={interval.name}
                            onChange={e => updateInterval(blockId, interval.id, 'name', e.target.value.toUpperCase())}
                            className="bg-transparent border-none text-white focus:outline-none placeholder:text-white/50 p-0 h-auto focus:ring-0 text-lg shadow-none w-full"
                            placeholder="NOM"
                        />
                    </div>
                    {/* Handle Icon - Drag trigger ONLY */}
                    <div
                        className="text-white/50 hover:text-white transition-colors pt-1 cursor-grab active:cursor-grabbing p-2 -m-2 touch-none"
                        onPointerDown={(e) => dragControls.start(e)}
                    >
                        <Menu className="w-5 h-5 drop-shadow-md" />
                    </div>
                </div>

                {/* Middle Row: Time Info */}
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-white font-bold text-sm tracking-wider">TIME</span>
                    <span className="text-white/50 font-bold text-sm tracking-wider">REPS</span>
                </div>

                {/* Time Control Row */}
                <div className="flex items-center gap-3 mb-6">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white bg-black/20 hover:bg-black/30 rounded flex items-center justify-center"
                        onClick={() => updateInterval(blockId, interval.id, 'duration_seconds', Math.max(1, (interval.duration_seconds || 30) - 5))}>
                        <Minus className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            value={Math.floor((interval.duration_seconds || 0) / 60).toString().padStart(2, '0')}
                            onChange={(e) => {
                                const mins = parseInt(e.target.value) || 0;
                                const secs = (interval.duration_seconds || 0) % 60;
                                updateInterval(blockId, interval.id, 'duration_seconds', Math.max(1, (mins * 60) + secs));
                            }}
                            className="w-16 bg-transparent text-white font-bold text-3xl text-center focus:outline-none focus:ring-0 p-0 border-none drop-shadow-md hide-arrows"
                            min="0"
                        />
                        <span className="text-white font-bold text-3xl pb-1">:</span>
                        <input
                            type="number"
                            value={((interval.duration_seconds || 0) % 60).toString().padStart(2, '0')}
                            onChange={(e) => {
                                let secs = parseInt(e.target.value) || 0;
                                if (secs > 59) secs = 59;
                                const mins = Math.floor((interval.duration_seconds || 0) / 60);
                                updateInterval(blockId, interval.id, 'duration_seconds', Math.max(1, (mins * 60) + secs));
                            }}
                            className="w-16 bg-transparent text-white font-bold text-3xl text-center focus:outline-none focus:ring-0 p-0 border-none drop-shadow-md hide-arrows"
                            min="0"
                            max="59"
                        />
                    </div>

                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white bg-black/20 hover:bg-black/30 rounded flex items-center justify-center"
                        onClick={() => updateInterval(blockId, interval.id, 'duration_seconds', (interval.duration_seconds || 30) + 5)}>
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>

                {/* Bottom Row: Actions */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm tracking-wider">COLOR</span>
                        <button
                            className="text-white/80 hover:text-white transition-all active:scale-95 flex items-center"
                            onClick={() => {
                                const colors = [
                                    '#B0E301', '#009E60', '#00BFFF', '#6441a5',
                                    '#D95F0E', '#FF3333', '#FF00FF', '#FFD700',
                                    '#FF4500', '#008080', '#1E1E1E'
                                ];
                                const currIdx = colors.indexOf(interval.color);
                                const nextColor = colors[(currIdx + 1) % colors.length];
                                updateInterval(blockId, interval.id, 'color', nextColor);
                            }}
                        >
                            <Edit2 className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button className="text-white/80 hover:text-white transition-all active:scale-95 drop-shadow-sm" onClick={() => duplicateInterval(blockId, interval.id)}>
                            <Copy className="w-5 h-5" />
                        </button>
                        <button className="text-white/80 hover:text-red-400 transition-all active:scale-95 drop-shadow-sm" onClick={() => deleteInterval(blockId, interval.id)}>
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </Reorder.Item>
    );
};

// Storage key for saved sequences (needs to match usage in ChronoPage)
const STORAGE_KEY = 'fitquest_chrono_sequences';
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const SequenceEditor = ({ onClose, initialSequence, savedSequences, setSavedSequences, formatTime }) => {
    // State for blocks (sections)
    const [blocks, setBlocks] = useState(initialSequence?.blocks || [
        {
            id: Date.now(),
            repetitions: 1,
            intervals: initialSequence?.intervals ?
                // Try to map flat intervals to first block if no blocks exist
                initialSequence.intervals.map(i => ({ ...i, id: i.id || Date.now() + Math.random() }))
                : []
        }
    ]);
    const [editorName, setEditorName] = useState(initialSequence?.name || '');
    const [isMenuMoving, setIsMenuMoving] = useState(false);

    // Add Block
    const addBlock = () => {
        setBlocks(prev => [...prev, {
            id: Date.now(),
            repetitions: 1,
            intervals: []
        }]);
    };

    // Add Interval to Block
    const addIntervalToBlock = (blockId) => {
        setBlocks(prev => prev.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    intervals: [...block.intervals, {
                        id: Date.now(),
                        name: 'TRAVAIL',
                        duration_seconds: 30, // Default 30s
                        color: '#B0E301',
                        instruction: ''
                    }]
                };
            }
            return block;
        }));
    };

    // Update Interval
    const updateInterval = (blockId, intervalId, field, value) => {
        setBlocks(prev => prev.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    intervals: block.intervals.map(int => int.id === intervalId ? { ...int, [field]: value } : int)
                };
            }
            return block;
        }));
    };

    // Delete Interval
    const deleteInterval = (blockId, intervalId) => {
        setBlocks(prev => prev.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    intervals: block.intervals.filter(int => int.id !== intervalId)
                };
            }
            return block;
        }));
    };

    // Duplicate Interval
    const duplicateInterval = (blockId, intervalId) => {
        setBlocks(prev => prev.map(block => {
            if (block.id === blockId) {
                const interval = block.intervals.find(i => i.id === intervalId);
                if (!interval) return block;
                return {
                    ...block,
                    intervals: [...block.intervals, { ...interval, id: Date.now() }]
                };
            }
            return block;
        }));
    };

    // Update Block Repetitions
    const updateBlockReps = (blockId, delta) => {
        setBlocks(prev => prev.map(block => {
            if (block.id === blockId) {
                return { ...block, repetitions: Math.max(1, block.repetitions + delta) };
            }
            return block;
        }));
    };

    // New Block Controls: Move, Duplicate, Delete
    const moveBlock = (index, direction) => {
        if (index === 0 && direction === -1) return;
        if (index === blocks.length - 1 && direction === 1) return;

        setIsMenuMoving(true);
        const newBlocks = [...blocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + direction];
        newBlocks[index + direction] = temp;
        setBlocks(newBlocks);

        // Reset animation suppression after a short delay
        setTimeout(() => setIsMenuMoving(false), 50);
    };

    const duplicateBlock = (blockId) => {
        const blockIndex = blocks.findIndex(b => b.id === blockId);
        if (blockIndex === -1) return;

        const blockToDuplicate = blocks[blockIndex];
        const newBlock = {
            ...blockToDuplicate,
            id: Date.now(),
            intervals: blockToDuplicate.intervals.map(i => ({ ...i, id: Date.now() + Math.random() }))
        };

        const newBlocks = [...blocks];
        newBlocks.splice(blockIndex + 1, 0, newBlock);
        setBlocks(newBlocks);
    };

    const deleteBlock = (blockId) => {
        if (blocks.length <= 1) {
            toast.error("Au moins une section est requise");
            return;
        }
        setBlocks(prev => prev.filter(b => b.id !== blockId));
    };

    // DnD Handlers (Framer Motion)
    const handleReorder = (blockId, newIntervals) => {
        setBlocks(prev => prev.map(block => {
            if (block.id === blockId) {
                return { ...block, intervals: newIntervals };
            }
            return block;
        }));
    };

    // Save Logic
    const handleSave = async () => {
        if (!editorName.trim()) {
            toast.error("Nom requis");
            return;
        }

        // Compile flat list
        const flatIntervals = [];
        blocks.forEach(block => {
            for (let i = 0; i < block.repetitions; i++) {
                block.intervals.forEach(int => {
                    flatIntervals.push({
                        name: int.name,
                        duration_seconds: int.duration_seconds,
                        color: int.color,
                        instruction: int.instruction,
                        id: Date.now() + Math.random() // Unique ID for runtime
                    });
                });
            }
        });

        const newSequence = {
            id: initialSequence?.id || Date.now(),
            name: editorName,
            blocks: blocks,
            intervals: flatIntervals,
            createdAt: new Date().toISOString(),
            position: initialSequence?.position !== undefined ? initialSequence.position : savedSequences.length
        };

        try {
            const response = await axios.post(`${API}/sequences`, newSequence);
            const savedDoc = response.data;

            const existingIndex = savedSequences.findIndex(s => s.id === newSequence.id);
            let updated;
            if (existingIndex >= 0) {
                updated = [...savedSequences];
                updated[existingIndex] = savedDoc;
            } else {
                updated = [...savedSequences, savedDoc];
            }

            setSavedSequences(updated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); // Fallback cache
            toast.success("Séquence sauvegardée");
            onClose();
        } catch (e) {
            console.error(e);
            toast.error("Erreur lors de la sauvegarde");
        }
    };

    // Calculate total duration for preview
    const totalPreviewTime = blocks.reduce((acc, block) => {
        const blockDuration = block.intervals.reduce((bAcc, int) => bAcc + (int.duration_seconds || 0), 0);
        return acc + (blockDuration * block.repetitions);
    }, 0);

    // Unified container for full screen on mobile, mockup on desktop
    const containerClass = `
        flex-1 w-full h-full flex flex-col overflow-hidden bg-[#151515]
        md:max-w-[500px] md:h-auto md:min-h-[85vh] md:mx-auto md:my-auto md:border-x md:border-white/10 md:shadow-2xl md:rounded-[2rem]
        animate-in fade-in slide-in-from-bottom-4 duration-300
    `;

    return (
        <div className={containerClass}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#1E1E1E] border-b border-white/10">
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-6 h-6 text-white" />
                </Button>
                <div className="flex-1 px-4">
                    <Input
                        value={editorName}
                        onChange={e => setEditorName(e.target.value)}
                        className="bg-transparent border-none text-center text-xl font-bold text-white focus:outline-none placeholder:text-white/30 truncate"
                        placeholder="NOM DE LA SÉQUENCE"
                    />
                </div>
                <Button variant="ghost" size="icon" onClick={handleSave} className="text-[#B0E301] hover:text-[#B0E301] hover:bg-[#B0E301]/10">
                    <Save className="w-6 h-6" />
                </Button>
            </div>

            {/* Content area: less padding on mobile to widen cards */}
            <div className="flex-1 overflow-y-auto px-1 md:px-4 py-4 space-y-6">
                {blocks.map((block, bIdx) => (
                    <div key={block.id} className="bg-[#1E1E1E] rounded-none md:rounded-lg overflow-hidden border border-white/5">
                        {/* Block Header (Reps & Controls) */}
                        <div className="flex items-center justify-between p-2 bg-[#252525] border-b border-white/5 relative">
                            {/* Spacer (Left) */}
                            <div className="w-8"></div>

                            {/* Center: Reps */}
                            <div className="flex items-center gap-4">
                                <span className="text-xs uppercase text-[#A1A1AA] font-bold tracking-wider hidden sm:inline">RÉPÉTITIONS</span>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white bg-white/10 hover:bg-white/20" onClick={() => updateBlockReps(block.id, -1)}><StepBack className="w-4 h-4" /></Button>
                                <span className="text-xl font-bold font-mono text-white w-8 text-center">{block.repetitions}</span>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white bg-white/10 hover:bg-white/20" onClick={() => updateBlockReps(block.id, 1)}><StepForward className="w-4 h-4" /></Button>
                            </div>

                            {/* Right: Menu */}
                            <div className="w-8 flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 rounded-full">
                                            <MoreHorizontal className="w-5 h-5 text-white/50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-white/10 text-white min-w-[200px] z-[300]">
                                        <DropdownMenuItem
                                            onClick={() => moveBlock(bIdx, -1)}
                                            disabled={bIdx === 0}
                                            className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white"
                                        >
                                            <ArrowBigUp className="w-4 h-4 mr-2" /> Monter
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => moveBlock(bIdx, 1)}
                                            disabled={bIdx === blocks.length - 1}
                                            className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white"
                                        >
                                            <ArrowBigDown className="w-4 h-4 mr-2" /> Descendre
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => duplicateBlock(block.id)}
                                            className="cursor-pointer hover:bg-white/10 focus:bg-white/10 focus:text-white"
                                        >
                                            <Copy className="w-4 h-4 mr-2" /> Dupliquer
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => deleteBlock(block.id)}
                                            className="text-red-400 focus:text-red-400 cursor-pointer hover:bg-white/10 focus:bg-white/10"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Intervals List Wrapper: tighter padding on mobile */}
                        <div className="p-1 sm:p-2 space-y-2">
                            <Reorder.Group axis="y" values={block.intervals} onReorder={(newIntervals) => handleReorder(block.id, newIntervals)} className="space-y-2">
                                {block.intervals.map((interval) => (
                                    <IntervalItem
                                        key={interval.id}
                                        interval={interval}
                                        blockId={block.id}
                                        updateInterval={updateInterval}
                                        duplicateInterval={duplicateInterval}
                                        deleteInterval={deleteInterval}
                                        transition={isMenuMoving ? { duration: 0 } : undefined}
                                    />
                                ))}
                            </Reorder.Group>

                            {/* Add Interval Button (In Block) */}
                            <Button
                                onClick={() => addIntervalToBlock(block.id)}
                                className="w-full mt-2 bg-[#252525] hover:bg-[#333] border border-dashed border-white/10 text-white/50 hover:text-white hover:border-white/30 h-10"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Ajouter Intervalle
                            </Button>

                            <div className="text-right text-xs text-[#A1A1AA] font-mono px-2 pb-1 pt-2">
                                Durée section: {formatTime(block.intervals.reduce((acc, i) => acc + (i.duration_seconds || 0), 0) * block.repetitions)}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Section Button (Bottom) */}
                <div className="flex justify-center pb-8">
                    <Button
                        onClick={addBlock}
                        className="w-16 h-16 rounded-full bg-[#B0E301] hover:bg-[#B0E301]/90 flex items-center justify-center shadow-xl text-black"
                    >
                        <Plus className="w-8 h-8" />
                    </Button>
                </div>

            </div>

            {/* Footer: Total */}
            <div className="p-4 bg-[#121212] border-t border-white/10 text-right flex justify-between items-center md:rounded-b-[2rem] mt-auto shrink-0">
                <span className="text-[#A1A1AA] text-sm">Durée Totale Estimée</span>
                <span className="text-xl font-bold font-mono text-white">{formatTime(totalPreviewTime)}</span>
            </div>
        </div>
    );
};
