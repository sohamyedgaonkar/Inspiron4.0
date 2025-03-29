import { useEffect, useRef } from "react";

const DotBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dots: { x: number; y: number; vx: number; vy: number }[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots();
    };

    const initDots = () => {
      dots = [];
      const numberOfDots = Math.floor((canvas.width * canvas.height) / 20000);
      for (let i = 0; i < numberOfDots; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const drawDots = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";

      dots.forEach((dot, i) => {
        // Update position
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Bounce off walls
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        // Mouse interaction
        const dx = mouseX - dot.x;
        const dy = mouseY - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 100;
          dot.vx += Math.cos(angle) * force * 0.2;
          dot.vy += Math.sin(angle) * force * 0.2;
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby dots
        dots.slice(i + 1).forEach((otherDot) => {
          const dx = dot.x - otherDot.x;
          const dy = dot.y - otherDot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(otherDot.x, otherDot.y);
            ctx.stroke();
          }
        });
      });

      // Apply velocity limits
      dots.forEach(dot => {
        const speed = Math.sqrt(dot.vx * dot.vx + dot.vy * dot.vy);
        if (speed > 2) {
          dot.vx = (dot.vx / speed) * 2;
          dot.vy = (dot.vy / speed) * 2;
        }
      });

      animationFrameId = requestAnimationFrame(drawDots);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();
    drawDots();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-transparent pointer-events-none"
    />
  );
};

export default DotBackground;