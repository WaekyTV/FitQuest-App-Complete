import {
    MoreHorizontal,
    Edit2,
    Copy,
    Trash2,
    Play
} from 'lucide-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const SavedSequenceCard = ({ sequence, onLoad, onDelete, onEdit, onDuplicate, formatTime }) => {
    const totalDuration = sequence.intervals.reduce((acc, int) => acc + (int.duration_seconds || 0), 0);

    // Group intervals by block for the "Interval Timer" fused look
    const blocks = sequence.blocks && sequence.blocks.length > 0
        ? sequence.blocks
        : [{ id: 'default', repetitions: 1, intervals: sequence.intervals }];

    return (
        <div className="bg-[#2D3E4B] rounded-none md:rounded-lg overflow-hidden mb-4 shadow-none md:shadow-lg border-b border-black/30 md:border md:border-white/5 transition-colors w-full">
            {/* Header: Title and Overall Time */}
            <div className="flex justify-between items-end p-4 pb-2">
                <h3 className="text-xl font-bold text-white tracking-tight truncate pr-4">{sequence.name}</h3>
                <span className="text-lg font-mono text-[#A1A1AA]">{formatTime(totalDuration)}</span>
            </div>

            {/* Visual Strip: Fused Blocks */}
            <div className="flex w-full h-[72px] items-center bg-[#151F28] overflow-x-auto no-scrollbar gap-1 p-1">
                {blocks.map((block, bIdx) => {
                    const firstInterval = block.intervals[0];
                    if (!firstInterval) return null;

                    return (
                        <div key={block.id || bIdx} className="flex h-full shrink-0">
                            {/* Repetition Block (Fused) */}
                            {block.repetitions > 1 && (
                                <div className="h-full px-3 flex items-center justify-center bg-[#3D4F5C] border-r border-black/20">
                                    <span className="text-lg font-bold text-[#A1A1AA] font-mono">{block.repetitions}x</span>
                                </div>
                            )}

                            {/* Intervals in this block */}
                            {block.intervals.map((int, iIdx) => (
                                <div
                                    key={int.id || `${bIdx}-${iIdx}`}
                                    className="h-full min-w-[120px] flex flex-col justify-center items-center px-4 relative border-r border-black/10 last:border-none"
                                    style={{ backgroundColor: int.color || '#D95F0E' }}
                                >
                                    <span className="text-xs font-bold text-white uppercase tracking-wider drop-shadow-sm mb-0.5">
                                        {int.name}
                                    </span>
                                    <span className="text-base font-bold text-white drop-shadow-sm font-mono">
                                        {formatTime(int.duration_seconds).replace(/^00:/, '')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* Footer Actions: Interval Timer Style */}
            <div className="flex justify-between items-center px-2 py-1 bg-[#2D3E4B]">
                <div className="flex items-center gap-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-[#A1A1AA] hover:text-white rounded-none">
                                <MoreHorizontal className="w-6 h-6" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1E2B34] border-white/10 text-white min-w-[150px] z-[400]">
                            <DropdownMenuItem onClick={() => onEdit && onEdit(sequence)} className="cursor-pointer hover:bg-white/5 focus:bg-white/10">
                                <Edit2 className="w-4 h-4 mr-2 text-[#A1A1AA]" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicate && onDuplicate(sequence)} className="cursor-pointer hover:bg-white/5 focus:bg-white/10">
                                <Copy className="w-4 h-4 mr-2 text-[#A1A1AA]" /> Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete && onDelete(sequence.id)} className="cursor-pointer hover:bg-white/5 focus:bg-white/10 text-red-400">
                                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Button
                    onClick={() => onLoad && onLoad(sequence)}
                    variant="ghost"
                    className="h-10 text-white font-bold tracking-wider flex items-center gap-2 px-4 hover:bg-white/5 group"
                >
                    <Play className="w-5 h-5 fill-current" />
                    <span>COMMENCER</span>
                </Button>
            </div>
        </div>
    );
};
