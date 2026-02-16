import { useEffect, useRef, useState } from 'react';
import {
    Code2,
    Cpu,
    Database,
    Globe,
    Laptop,
    Layout,
    Monitor,
    Server,
    Smartphone,
    Terminal,
    Wifi
} from 'lucide-react';

interface Icon {
    id: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    Component: React.ComponentType<any>;
    size: number;
    color: string;
}

const ICONS = [
    Code2, Cpu, Database, Globe, Laptop, Layout, Monitor, Server, Smartphone, Terminal, Wifi
];

const COLORS = [
    '#61DAFB', // React Blue
    '#F7DF1E', // JS Yellow
    '#3776AB', // Python Blue
    '#E34F26', // HTML Orange
    '#1572B6', // CSS Blue
    '#CC3534', // Ruby Red
    '#00ADD8', // Go Blue
    '#DEA584', // Rust Orange
];

export default function BouncingIcons() {
    const [icons, setIcons] = useState<Icon[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);

    // Use a ref to hold the current state of icons for the animation loop
    const iconsRef = useRef<Icon[]>([]);

    useEffect(() => {
        // Initialize Icons
        const newIcons: Icon[] = [];
        const count = 15;

        for (let i = 0; i < count; i++) {
            newIcons.push({
                id: i,
                x: Math.random() * (window.innerWidth - 50),
                y: Math.random() * (window.innerHeight - 50),
                dx: (Math.random() - 0.5) * 2,
                dy: (Math.random() - 0.5) * 2,
                Component: ICONS[Math.floor(Math.random() * ICONS.length)],
                size: 30 + Math.random() * 20,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            });
        }

        iconsRef.current = newIcons;
        setIcons(newIcons);

        // Animation Loop
        const animate = () => {
            const { innerWidth, innerHeight } = window;

            // Update positions inplace in the ref array for performance/simplicity in this context
            // In a strict React sense we might want immutable updates, but for high freq animation 
            // updating the ref and then triggering a render is a common pattern or using canvas.
            // Here we will map to a new array to be safe for React state.

            const updatedIcons = iconsRef.current.map(icon => {
                let { x, y, dx, dy } = icon;

                x += dx;
                y += dy;

                if (x <= 0 || x + icon.size >= innerWidth) {
                    dx = -dx;
                    x = Math.max(0, Math.min(x, innerWidth - icon.size));
                }
                if (y <= 0 || y + icon.size >= innerHeight) {
                    dy = -dy;
                    y = Math.max(0, Math.min(y, innerHeight - icon.size));
                }

                return { ...icon, x, y, dx, dy };
            });

            iconsRef.current = updatedIcons;
            setIcons(updatedIcons);

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                overflow: 'hidden'
            }}
        >
            {icons.map(icon => (
                <div
                    key={icon.id}
                    style={{
                        position: 'absolute',
                        left: icon.x,
                        top: icon.y,
                        color: icon.color,
                        opacity: 0.15, // Subtle opacity
                        transition: 'opacity 0.5s',
                    }}
                >
                    <icon.Component size={icon.size} />
                </div>
            ))}
        </div>
    );
}
