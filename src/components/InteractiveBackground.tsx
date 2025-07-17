import React, { useEffect, useRef } from "react";
import { useInteractiveEffects } from "@/contexts/InteractiveEffectsContext";

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

  const colors = [
    "rgba(59, 130, 246, 0.8)", // blue
    "rgba(147, 51, 234, 0.8)", // purple
    "rgba(236, 72, 153, 0.8)", // pink
    "rgba(34, 197, 94, 0.8)", // green
    "rgba(251, 191, 36, 0.8)", // yellow
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (x: number, y: number): Particle => ({
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 60,
      maxLife: 60,
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

      particlesRef.current.forEach((particle) => {
        const alpha = particle.life / particle.maxLife;
        const size = alpha * 3;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw connections between nearby particles
        particlesRef.current.forEach((otherParticle) => {
          if (particle === otherParticle) return;

          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (1 - distance / 100) * alpha * 0.3;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Add particles on mouse movement
      if (Math.random() < 0.3) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY));
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Create burst of particles on click
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY));
      }
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
      }}
    />
  );
};

export default InteractiveBackground;
