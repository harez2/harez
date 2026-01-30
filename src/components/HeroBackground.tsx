import { useEffect, useRef, useState } from "react";
import { useCustomizationsContext } from "@/contexts/CustomizationsContext";
import { hexToHsl, COLOR_PRESETS } from "@/hooks/useCustomizations";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
  colorIndex: number; // 0 = primary, 1 = accent, 2 = secondary
}

const HeroBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const rafRef = useRef<number>();
  const lastSpawnRef = useRef(0);
  
  const { colors } = useCustomizationsContext();
  
  // Get theme colors
  const getThemeColors = () => {
    if (!colors) return { primary: { h: 220, s: 90, l: 56 }, accent: { h: 260, s: 80, l: 60 }, secondary: { h: 190, s: 90, l: 50 } };
    
    let colorValues = colors;
    if (colors.usePreset && colors.preset) {
      const preset = COLOR_PRESETS[colors.preset as keyof typeof COLOR_PRESETS];
      if (preset) colorValues = { ...colors, ...preset };
    }
    
    return {
      primary: hexToHsl(colorValues.primaryColor),
      accent: hexToHsl(colorValues.accentColor),
      secondary: hexToHsl(colorValues.secondaryColor),
    };
  };
  
  const themeColors = getThemeColors();

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Spawn and animate particles
  useEffect(() => {
    const spawnParticle = (x: number) => {
      const id = particleIdRef.current++;
      return {
        id,
        x: x * 100,
        y: 100 + Math.random() * 10,
        size: 2 + Math.random() * 4,
        speedY: 0.3 + Math.random() * 0.5,
        opacity: 0.3 + Math.random() * 0.4,
        colorIndex: Math.floor(Math.random() * 3), // Randomly pick primary, accent, or secondary
      };
    };

    const animate = (timestamp: number) => {
      // Spawn new particles near mouse position
      if (timestamp - lastSpawnRef.current > 80) {
        setParticles((prev) => {
          const newParticles = [...prev];
          // Spawn 2-3 particles around mouse X position
          for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
            const offsetX = (Math.random() - 0.5) * 0.3;
            newParticles.push(spawnParticle(mousePos.x + offsetX));
          }
          return newParticles;
        });
        lastSpawnRef.current = timestamp;
      }

      // Update particle positions
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y - p.speedY,
            opacity: p.opacity - 0.003,
          }))
          .filter((p) => p.y > -10 && p.opacity > 0)
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mousePos.x]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      
      {/* Mouse-following gradient glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full transition-all duration-300 ease-out"
        style={{
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, hsla(var(--primary), 0.15) 0%, hsla(var(--accent), 0.08) 40%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Rising bar/spike indicators - evokes revenue charts */}
      <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-around gap-1 opacity-20">
        {Array.from({ length: 40 }).map((_, i) => {
          const distFromMouse = Math.abs((i / 40) - mousePos.x);
          const height = Math.max(10, (1 - distFromMouse * 2) * 80 + Math.sin(i * 0.5) * 15);
          return (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t transition-all duration-500"
              style={{
                height: `${Math.max(5, height)}%`,
                opacity: 0.3 + (1 - distFromMouse) * 0.5,
              }}
            />
          );
        })}
      </div>

      {/* Floating particles (rising like revenue growth) */}
      <svg className="absolute inset-0 w-full h-full">
        {particles.map((p) => {
          const colorOptions = [themeColors.primary, themeColors.accent, themeColors.secondary];
          const color = colorOptions[p.colorIndex];
          return (
            <circle
              key={p.id}
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              r={p.size}
              fill={`hsla(${color.h}, ${color.s}%, ${Math.min(color.l + 10, 70)}%, ${p.opacity})`}
              className="transition-all duration-100"
            />
          );
        })}
      </svg>

      {/* Ambient orbs */}
      <div 
        className="absolute w-[500px] h-[500px] crystal-orb animate-float"
        style={{
          top: "10%",
          left: `${10 + mousePos.x * 5}%`,
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] crystal-orb animate-float animation-delay-400"
        style={{
          bottom: "10%",
          right: `${10 + (1 - mousePos.x) * 5}%`,
        }}
      />
      
      {/* Center glow that subtly follows mouse */}
      <div 
        className="absolute w-[800px] h-[800px] crystal-orb opacity-30 transition-all duration-700"
        style={{
          top: "50%",
          left: "50%",
          transform: `translate(calc(-50% + ${(mousePos.x - 0.5) * 50}px), calc(-50% + ${(mousePos.y - 0.5) * 50}px))`,
        }}
      />
    </div>
  );
};

export default HeroBackground;
