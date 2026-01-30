import { useEffect, useRef, useMemo, useCallback } from "react";
import { useCustomizationsContext } from "@/contexts/CustomizationsContext";
import { hexToHsl, COLOR_PRESETS } from "@/hooks/useCustomizations";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
  colorIndex: number;
}

const HeroBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const particlesRef = useRef<Particle[]>([]);
  const particleIdRef = useRef(0);
  const rafRef = useRef<number>();
  const lastSpawnRef = useRef(0);
  
  const { colors } = useCustomizationsContext();
  
  // Memoize theme colors to prevent recalculation
  const themeColors = useMemo(() => {
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
  }, [colors]);

  // Handle mouse movement with throttling
  useEffect(() => {
    let throttleTimer: number | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (throttleTimer) return;
      
      throttleTimer = window.setTimeout(() => {
        throttleTimer = null;
      }, 16); // ~60fps throttle
      
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mousePosRef.current = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, []);

  // Canvas-based particle animation (much more performant than SVG with React state)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colorOptions = [themeColors.primary, themeColors.accent, themeColors.secondary];

    const spawnParticle = () => {
      const id = particleIdRef.current++;
      return {
        id,
        x: mousePosRef.current.x * canvas.width + (Math.random() - 0.5) * canvas.width * 0.3,
        y: canvas.height + Math.random() * 20,
        size: 2 + Math.random() * 4,
        speedY: 0.8 + Math.random() * 1.2,
        opacity: 0.3 + Math.random() * 0.4,
        colorIndex: Math.floor(Math.random() * 3),
      };
    };

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Spawn new particles less frequently
      if (timestamp - lastSpawnRef.current > 150) {
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push(spawnParticle());
        }
        lastSpawnRef.current = timestamp;
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.y -= p.speedY;
        p.opacity -= 0.004;
        
        if (p.y < -10 || p.opacity <= 0) return false;
        
        const color = colorOptions[p.colorIndex];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${Math.min(color.l + 10, 70)}%, ${p.opacity})`;
        ctx.fill();
        
        return true;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [themeColors]);

  // Memoized mouse position for CSS (updates less frequently)
  const glowRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let animating = true;
    
    const updateGlow = () => {
      if (!animating) return;
      
      const { x, y } = mousePosRef.current;
      
      if (glowRef.current) {
        glowRef.current.style.left = `${x * 100}%`;
        glowRef.current.style.top = `${y * 100}%`;
      }
      
      requestAnimationFrame(updateGlow);
    };
    
    requestAnimationFrame(updateGlow);
    return () => { animating = false; };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      
      {/* Mouse-following gradient glow */}
      <div
        ref={glowRef}
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, hsla(var(--primary), 0.15) 0%, hsla(var(--accent), 0.08) 40%, transparent 70%)`,
          filter: "blur(40px)",
          willChange: "left, top",
        }}
      />

      {/* Rising bar/spike indicators - simplified static version */}
      <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-around gap-1 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-primary/60 to-primary/20 rounded-t"
            style={{
              height: `${20 + Math.sin(i * 0.8) * 30 + Math.random() * 20}%`,
              opacity: 0.4 + Math.sin(i * 0.5) * 0.3,
            }}
          />
        ))}
      </div>

      {/* Canvas for particles (much more performant than SVG) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Ambient orbs - static positions */}
      <div 
        className="absolute w-[500px] h-[500px] crystal-orb animate-float"
        style={{ top: "10%", left: "12%" }}
      />
      <div 
        className="absolute w-[400px] h-[400px] crystal-orb animate-float animation-delay-400"
        style={{ bottom: "10%", right: "12%" }}
      />
      
      {/* Center glow */}
      <div 
        className="absolute w-[800px] h-[800px] crystal-orb opacity-30"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};

export default HeroBackground;
