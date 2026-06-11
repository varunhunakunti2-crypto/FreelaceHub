'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function ClickRipple() {
  const pathname = usePathname();
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback((e: MouseEvent) => {
    // Don't show ripples on the landing page
    if (pathname === '/') return;

    const newRipple = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1000);
  }, []);

  useEffect(() => {
    window.addEventListener('click', addRipple);
    return () => window.removeEventListener('click', addRipple);
  }, [addRipple]);

  return (
    <div className="fixed inset-0 z-[300] pointer-events-none overflow-hidden">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, var(--ripple-color) 0%, transparent 70%)',
          }}
        />
      ))}
      <style jsx>{`
        :root {
          --ripple-color: rgba(99, 102, 241, 0.15); /* primary indigo with low opacity */
        }
        @keyframes ripple-effect {
          0% {
            width: 0;
            height: 0;
            opacity: 0.8;
          }
          100% {
            width: 500px;
            height: 500px;
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple-effect 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
