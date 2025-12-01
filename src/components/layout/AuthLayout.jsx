import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { World } from "../ui/globe.jsx";

// Globe Configuration (Reduced Glow, Darker theme)
const globeConfig = {
    pointSize: 3, // Slightly smaller points
    globeColor: "#050A1E", // Globe base color
    showAtmosphere: true,
    atmosphereColor: "#3B82F6", // Reduced blue glow
    atmosphereAltitude: 0.05, // Lower altitude for subtler effect
    emissive: "#050A1E",
    emissiveIntensity: 0.1,
    shininess: 0.8,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#1e3a8a", // Darker ambient light (deep blue)
    directionalLeftLight: "#a78bfa",
    directionalTopLight: "#818cf8",
    pointLight: "#fde047",
    arcTime: 1500,
    arcLength: 0.9,
    rings: 3,
    maxRings: 5,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.1, // Even slower rotation
    markers: [], // Markers generated dynamically below
};

// Sample Arcs (Lines connecting key Encora locations/regions)
const colors = ["#06b6d4", "#3b82f6", "#6366f1", "#a855f7", "#ec4899"];
const sampleArcs = [
    { order: 1, startLat: 28.6139, startLng: 77.209, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.3, color: colors[1] },
    { order: 2, startLat: 19.076, startLng: 72.8777, endLat: 40.7128, endLng: -74.006, arcAlt: 0.5, color: colors[3] },
    { order: 3, startLat: 51.5072, startLng: -0.1276, endLat: 14.5995, endLng: 120.9842, arcAlt: 0.4, color: colors[4] },
    { order: 4, startLat: -22.9068, startLng: -43.1729, endLat: 28.6139, endLng: 77.209, arcAlt: 0.7, color: colors[0] },
    { order: 5, startLat: 34.0522, startLng: -118.2437, endLat: 52.52, endLng: 13.405, arcAlt: 0.2, color: colors[2] },
    { order: 6, startLat: 1.3521, startLng: 103.8198, endLat: 28.6139, endLng: 77.209, arcAlt: 0.1, color: colors[1] },
];

const AuthLayout = ({ children, title, subtitle }) => {
    
    // Generate Markers from Arc Endpoints
    const markers = useMemo(() => {
        const uniquePoints = new Map();
        sampleArcs.forEach(arc => {
            uniquePoints.set(`${arc.startLat},${arc.startLng}`, { location: [arc.startLat, arc.startLng], size: 0.05 });
            uniquePoints.set(`${arc.endLat},${arc.endLng}`, { location: [arc.endLat, arc.endLng], size: 0.05 });
        });
        return Array.from(uniquePoints.values());
    }, [sampleArcs]);

    const updatedGlobeConfig = useMemo(() => ({
        ...globeConfig,
        markers: markers,
    }), [markers]);

    return (
        <div className="min-h-screen flex bg-slate-950 overflow-hidden">
            
            {/* LEFT SIDE: GLOBE & BRANDING */}
            <div className="hidden lg:flex w-1/2 bg-slate-950 relative flex-col items-center justify-start overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-slate-900 to-slate-950 z-0" />
                
                <div className="relative z-10 w-full h-92 flex flex-col items-center justify-start px-10 pt-20"> {/* Increased top padding */}
                    
                    {/* Branding text with Blur-in animation */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20, filter: 'blur(5px)' }} 
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1 }}
                        className="text-center mb-10"
                    >
                        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">EncoraOne</h1>
                        <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                            Connecting employees worldwide. A unified platform for grievances, engagement, and growth.
                        </p>
                    </motion.div>

                    {/* Globe below the text - Maximized size */}
                    <div className="w-full max-w-[90%] flex items-center justify-center flex-1 relative">
                        {/* Dark Blur Effect at Bottom */}
                        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-950/90 to-transparent z-20 pointer-events-none" />

                        <World globeConfig={updatedGlobeConfig} data={sampleArcs} />
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: FORM (Dark Theme) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                {/* Mobile Background Gradient */}
                <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-slate-900 to-slate-800 z-0" />
                
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-700 relative z-10"
                >
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                        <p className="text-slate-300">{subtitle}</p>
                    </div>
                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;