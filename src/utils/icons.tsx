import React from 'react';
import { FaChartLine, FaVideo, FaPalette, FaCode, FaHeadset, FaComments, FaRocket, FaBullhorn, FaSearch, FaLightbulb, FaTools } from 'react-icons/fa';

// Map of icon names to components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    'FaChartLine': FaChartLine,
    'FaVideo': FaVideo,
    'FaPalette': FaPalette,
    'FaCode': FaCode,
    'FaHeadset': FaHeadset,
    'FaComments': FaComments,
    'FaRocket': FaRocket,
    'FaBullhorn': FaBullhorn,
    'FaSearch': FaSearch,
    'FaLightbulb': FaLightbulb,
    'FaTools': FaTools,
};

/**
 * Returns a React Element for the given icon name.
 * @param iconName - The name of the icon (e.g. 'FaChartLine')
 * @param className - Optional CSS class
 */
export const getIcon = (iconName: string, className: string = "w-8 h-8"): React.ReactElement | null => {
    const IconComponent = ICON_MAP[iconName];
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
};

/**
 * Returns the raw component (useful if you need to pass props later)
 */
export const getIconComponent = (iconName: string) => {
    return ICON_MAP[iconName] || FaRocket; // Default fallback
};
