import React, { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';

const ReorderItem = ({ seq, onDelete, onSave }) => {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={seq}
            dragListener={false}
            dragControls={dragControls}
            layout
            className="group w-full block bg-black/20 border-b border-black/20 select-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileDrag={{ scale: 1.02 }}
            style={{ willChange: "transform" }}
        >
            <div className="flex items-center h-16 px-6 gap-6">
                {/* Delete button (fixed placement) */}
                <button
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking delete
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(seq.id);
                    }}
                    className="flex shrink-0 hover:scale-110 active:scale-90 transition-transform p-3 -ml-3 text-white/80 hover:text-red-500"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 4V3H15V4M4 6H20M19 6V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 11L14 15M14 11L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Name */}
                <div className="flex-1 min-w-0 pointer-events-none">
                    <h3 className="text-white text-xl font-black uppercase tracking-tight truncate">
                        {seq.name}
                    </h3>
                </div>

                {/* Handle Icon - Drag trigger */}
                <div
                    className="shrink-0 p-3 -mr-3 cursor-grab active:cursor-grabbing hover:bg-white/5 rounded-full transition-colors touch-none"
                    onPointerDown={(e) => dragControls.start(e)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/40 group-hover:text-white/80 transition-colors">
                        <path d="M5 10H19M5 14H19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </Reorder.Item>
    );
};

export const SequenceManager = ({ sequences, onSave, onCancel }) => {
    const [items, setItems] = useState([...sequences]);

    // Ensure items stay synced if sequences prop updates
    React.useEffect(() => {
        setItems([...sequences]);
    }, [sequences]);

    const handleDelete = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleSave = () => {
        onSave(items);
    };

    // Unified container: Full screen on mobile, phone mockup on desktop
    const containerClass = `
        flex-1 w-full h-full flex flex-col overflow-hidden bg-[#0D161F]
        md:max-w-[500px] md:h-auto md:min-h-[85vh] md:mx-auto md:my-auto md:border-x md:border-white/10 md:shadow-2xl md:rounded-[2rem]
        animate-in fade-in slide-in-from-bottom-4 duration-300
    `;

    return (
        <div className={containerClass}>
            {/* Header */}
            <div className="flex w-full h-16 shrink-0 font-bold border-b border-white/5">
                <button
                    onClick={onCancel}
                    className="flex-1 bg-[#EE1B24] text-white text-lg tracking-widest font-black uppercase hover:brightness-110 active:opacity-80 transition-all"
                >
                    ANNULER
                </button>
                <button
                    onClick={handleSave}
                    className="flex-1 bg-[#B0E301] text-black text-lg tracking-widest font-black uppercase hover:brightness-110 active:opacity-80 transition-all"
                >
                    SAUVEGARDER
                </button>
            </div>

            {/* Content list */}
            <div className="flex-1 w-full overflow-y-auto p-4 custom-scrollbar min-h-0">
                <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3 w-full block">
                    {items.map((seq) => (
                        <ReorderItem
                            key={seq.id}
                            seq={seq}
                            onDelete={handleDelete}
                        />
                    ))}
                </Reorder.Group>

                {items.length === 0 && (
                    <div className="text-center py-24 text-white/20 font-black uppercase tracking-widest animate-pulse">
                        Aucun programme
                    </div>
                )}
            </div>
        </div>
    );
};
