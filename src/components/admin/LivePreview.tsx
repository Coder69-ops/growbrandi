import React, { useEffect, useRef, useState } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

interface LivePreviewProps {
    previewData: any;
    section?: string;
    onLoad?: () => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const LivePreview: React.FC<LivePreviewProps> = ({ previewData, section, onLoad }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
    const [isLoading, setIsLoading] = useState(true);

    // Device dimensions
    const deviceSizes = {
        desktop: { width: '100%', height: '100%' },
        tablet: { width: '768px', height: '1024px' },
        mobile: { width: '375px', height: '667px' }
    };

    // Send preview data to iframe
    useEffect(() => {
        if (iframeRef.current && iframeRef.current.contentWindow && !isLoading) {
            iframeRef.current.contentWindow.postMessage(
                {
                    type: 'PREVIEW_UPDATE',
                    data: previewData,
                    section
                },
                window.location.origin
            );
        }
    }, [previewData, section, isLoading]);

    // Handle iframe load
    const handleIframeLoad = () => {
        setIsLoading(false);
        onLoad?.();
    };

    return (
        <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900">
            {/* Device Mode Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setDeviceMode('desktop')}
                        className={`p-2 rounded-lg transition-colors ${deviceMode === 'desktop'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                        title="Desktop View"
                    >
                        <Monitor size={18} />
                    </button>
                    <button
                        onClick={() => setDeviceMode('tablet')}
                        className={`p-2 rounded-lg transition-colors ${deviceMode === 'tablet'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                        title="Tablet View"
                    >
                        <Tablet size={18} />
                    </button>
                    <button
                        onClick={() => setDeviceMode('mobile')}
                        className={`p-2 rounded-lg transition-colors ${deviceMode === 'mobile'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                        title="Mobile View"
                    >
                        <Smartphone size={18} />
                    </button>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    {deviceMode === 'desktop' && 'Desktop'}
                    {deviceMode === 'tablet' && 'Tablet (768px)'}
                    {deviceMode === 'mobile' && 'Mobile (375px)'}
                </div>
            </div>

            {/* Preview Container */}
            <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
                <div
                    className="bg-white dark:bg-slate-800 shadow-2xl transition-all duration-300"
                    style={{
                        width: deviceSizes[deviceMode].width,
                        height: deviceSizes[deviceMode].height,
                        maxWidth: '100%',
                        minHeight: '600px'
                    }}
                >
                    {isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-slate-500 dark:text-slate-400">
                                Loading preview...
                            </div>
                        </div>
                    )}
                    <iframe
                        ref={iframeRef}
                        src="/preview.html"
                        onLoad={handleIframeLoad}
                        className="w-full h-full border-0"
                        title="Live Preview"
                        sandbox="allow-same-origin allow-scripts"
                    />
                </div>
            </div>
        </div>
    );
};

export default LivePreview;
