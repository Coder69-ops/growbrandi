import React, { useState, ReactNode } from 'react';
import { Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import LivePreview from './LivePreview';

interface PreviewLayoutProps {
    children: ReactNode;
    previewData: any;
    section?: string;
    showPreview?: boolean;
}

const PreviewLayout: React.FC<PreviewLayoutProps> = ({
    children,
    previewData,
    section,
    showPreview: initialShowPreview = true
}) => {
    const [showPreview, setShowPreview] = useState(initialShowPreview);
    const [previewWidth, setPreviewWidth] = useState(50); // Percentage
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isResizing) {
            const container = e.currentTarget as HTMLElement;
            const rect = container.getBoundingClientRect();
            const newWidth = ((e.clientX - rect.left) / rect.width) * 100;

            // Constrain between 30% and 70%
            if (newWidth >= 30 && newWidth <= 70) {
                setPreviewWidth(newWidth);
            }
        }
    };

    React.useEffect(() => {
        if (isResizing) {
            document.addEventListener('mouseup', handleMouseUp);
            return () => document.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isResizing]);

    return (
        <div className="flex flex-col h-full">
            {/* Preview Toggle Button */}
            <div className="flex justify-end px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                    {showPreview ? (
                        <>
                            <EyeOff size={16} />
                            Hide Preview
                        </>
                    ) : (
                        <>
                            <Eye size={16} />
                            Show Preview
                        </>
                    )}
                </button>
            </div>

            {/* Main Content Area */}
            <div
                className="flex-1 flex overflow-hidden"
                onMouseMove={showPreview ? handleMouseMove : undefined}
                onMouseUp={showPreview ? handleMouseUp : undefined}
            >
                {/* Edit Form Panel */}
                <div
                    className="overflow-auto bg-white dark:bg-slate-800"
                    style={{
                        width: showPreview ? `${previewWidth}%` : '100%',
                        transition: isResizing ? 'none' : 'width 0.3s ease'
                    }}
                >
                    <div className="p-6">
                        {children}
                    </div>
                </div>

                {/* Resize Handle */}
                {showPreview && (
                    <div
                        className="w-1 bg-slate-200 dark:bg-slate-700 hover:bg-blue-500 dark:hover:bg-blue-500 cursor-col-resize transition-colors relative group"
                        onMouseDown={handleMouseDown}
                    >
                        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-blue-500 rounded-full p-1">
                                <ChevronLeft size={12} className="text-white" />
                                <ChevronRight size={12} className="text-white -ml-3" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview Panel */}
                {showPreview && (
                    <div
                        className="overflow-hidden"
                        style={{
                            width: `${100 - previewWidth}%`,
                            transition: isResizing ? 'none' : 'width 0.3s ease'
                        }}
                    >
                        <LivePreview
                            previewData={previewData}
                            section={section}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviewLayout;
