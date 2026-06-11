'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;
    
    // Configuration for bold, visible dots
    const dotSpacing = 28; 
    const dotRadius = 2; // Increased size for better visibility

    interface Dot {
      x: number;
      y: number;
    }

    let dots: Dot[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initDots();
    };

    const initDots = () => {
      dots = [];
      for (let x = 0; x < width + dotSpacing; x += dotSpacing) {
        for (let y = 0; y < height + dotSpacing; y += dotSpacing) {
          dots.push({ x, y });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Black dots for light mode, light gray for dark mode
      const baseColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)';
      
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const dx = mouseRef.current.x - dot.x;
        const dy = mouseRef.current.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const glowStrength = Math.exp(-distance / 70); 

        if (glowStrength > 0.01) {
          // Highlight color: Black becomes deeper, white becomes brighter
          ctx.fillStyle = isDarkMode 
            ? `rgba(255, 255, 255, ${0.2 + (glowStrength * 0.6)})` 
            : `rgba(0, 0, 0, ${0.15 + (glowStrength * 0.5)})`;
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotRadius + (glowStrength * 1.5), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = baseColor;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-white dark:bg-slate-950 overflow-hidden pointer-events-none">
      {/* Subtle interaction glow */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.04), transparent 100%)`,
        }}
      />
      
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Global fade for a premium look */}
      <div className="absolute inset-0 bg-white dark:bg-slate-950 [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)] opacity-30" />
    </div>
  );
}
