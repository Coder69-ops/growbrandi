import React, { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
    item: any;
    children: React.ReactNode;
}

export const SortableItem = ({ item, children }: SortableItemProps) => {
    const dragControls = useDragControls();
    const [isDragging, setIsDragging] = useState(false);

    return (
        <Reorder.Item
            value={item}
            id={item.id}
            dragListener={false}
            dragControls={dragControls}
            whileDrag={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", zIndex: 50 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            className="relative"
            style={{ position: 'relative' }} // Fixes some layout thrashing
        >
            <div className={`relative group ${isDragging ? 'z-50' : ''}`}>
                <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 cursor-grab active:cursor-grabbing p-3 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors ${isDragging ? 'opacity-100 text-blue-600' : 'opacity-0 group-hover:opacity-100'}`}
                    onPointerDown={(event) => dragControls.start(event)}
                    style={{ touchAction: 'none' }}
                >
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-md shadow-sm border border-slate-200 dark:border-slate-700">
                        <GripVertical size={20} />
                    </div>
                </div>
                <div className={isDragging ? 'pointer-events-none' : ''}>
                    {children}
                </div>
            </div>
        </Reorder.Item>
    );
};
