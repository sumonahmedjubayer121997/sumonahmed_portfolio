
import React, { useEffect, useRef } from "react";
import { useInteractiveEffects } from "@/contexts/InteractiveEffectsContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const { isVisible } = useInteractiveEffects();
  const isMobile = useIsMobile();

  const colors = [
    "rgba(59, 130, 246, 0.6)", // blue - reduced opacity for mobile
    "rgba(147, 51, 234, 0.6)", // purple
    "rgba(236, 72, 153, 0.6)", // pink
    "rgba(34, 197, 94, 0.6)", // green
    "rgba(251, 191, 36, 0.6)", // yellow
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Disable on very small screens or if mobile performance is poor
    if (window.innerWidth < 480 || (isMobile && window.devicePixelRatio > 2)) {
      return;
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (x: number, y: number): Particle => ({
      x,
      y,
      vx: (Math.random() - 0.5) * (isMobile ? 1 : 2), // Slower movement on mobile
      vy: (Math.random() - 0.5) * (isMobile ? 1 : 2),
      life: isMobile ? 30 : 60, // Shorter life on mobile
      maxLife: isMobile ? 30 : 60,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        return particle.life > 0;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Limit particles on mobile for performance
      const maxParticles = isMobile ? 20 : 50;
      if (particlesRef.current.length > maxParticles) {
        particlesRef.current = particlesRef.current.slice(0, maxParticles);
      }

      particlesRef.current.forEach((particle) => {
        const alpha = particle.life / particle.maxLife;
        const size = alpha * (isMobile ? 2 : 3); // Smaller particles on mobile

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw connections between nearby particles (fewer on mobile)
        if (!isMobile || particlesRef.current.length < 15) {
          particlesRef.current.forEach((otherParticle) => {
            if (particle === otherParticle) return;

            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = isMobile ? 60 : 100; // Shorter connections on mobile

            if (distance < maxDistance) {
              ctx.save();
              ctx.globalAlpha = (1 - distance / maxDistance) * alpha * (isMobile ? 0.2 : 0.3);
              ctx.strokeStyle = particle.color;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
              ctx.restore();
            }
          });
        }
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Reduce particle generation on mobile
      const particleChance = isMobile ? 0.15 : 0.3;
      if (Math.random() < particleChance) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY));
      }
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current = { x: touch.clientX, y: touch.clientY };

        // Less aggressive particle generation on touch
        if (Math.random() < 0.1) {
          particlesRef.current.push(createParticle(touch.clientX, touch.clientY));
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Create fewer particles on mobile click
      const burstCount = isMobile ? 4 : 8;
      for (let i = 0; i < burstCount; i++) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY));
      }
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);
    
    if (isMobile) {
      // Use touch events for mobile
      window.addEventListener("touchmove", handleTouch, { passive: true });
      window.addEventListener("touchstart", handleTouch, { passive: true });
    } else {
      // Use mouse events for desktop
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("click", handleClick);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchmove", handleTouch);
      window.removeEventListener("touchstart", handleTouch);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile]);

  // Don't render on very small screens or low-performance mobile devices
  if (window.innerWidth < 480 || (isMobile && window.devicePixelRatio > 2)) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: isMobile 
          ? "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)"
          : "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
      }}
    />
  );
};

export default InteractiveBackground;
