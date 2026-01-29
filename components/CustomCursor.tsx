'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px) scale(${isClicking ? 0.5 : 1})`;
        dotRef.current.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), margin 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      }
      if (rippleRef.current) {
        rippleRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      // Перевіряємо hover
      const target = e.target as HTMLElement;
      const interactive = !!target.closest('button, a, [role="button"]');
      setIsHovering(interactive);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isClicking]);

  const dotSize = isHovering ? 12 : 8;

  return (
    <>
      {/* Ripple effect при кліку */}
      <div
        ref={rippleRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-2 border-foreground ${
          isClicking ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: isClicking ? '40px' : '8px',
          height: isClicking ? '40px' : '8px',
          marginLeft: isClicking ? '-20px' : '-4px',
          marginTop: isClicking ? '-20px' : '-4px',
          transition: isClicking 
            ? 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' 
            : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Main dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-foreground"
        style={{
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          marginLeft: `-${dotSize / 2}px`,
          marginTop: `-${dotSize / 2}px`,
          boxShadow: '0 0 0 1px var(--background)',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), margin 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </>
  );
}
