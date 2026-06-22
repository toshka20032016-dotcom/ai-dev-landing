"use client";

import { useEffect, useRef } from "react";

type Shape = "circle" | "triangle" | "diamond" | "square";

type Particle = {
  x: number;
  y: number;
  size: number;
  color: string;
  shape: Shape;
  drift: number;
  phase: number;
};

const COLORS = ["#8052ff", "#ffb829", "#15846e", "#ffffff"] as const;
const MAX_PARTICLES = 200;

// ponytail: deterministic LCG — same field on every mount, no SSR mismatch
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildParticles(width: number, height: number, count: number): Particle[] {
  const rand = seededRandom(42);
  const shapes: Shape[] = ["circle", "triangle", "diamond", "square"];
  const cx = width * 0.62;
  const cy = height * 0.45;
  const capped = Math.min(count, MAX_PARTICLES);

  return Array.from({ length: capped }, () => {
    const angle = rand() * Math.PI * 2;
    const radius = Math.pow(rand(), 0.55) * Math.min(width, height) * 0.38;
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      size: 2 + rand() * 4,
      color: COLORS[Math.floor(rand() * COLORS.length)] ?? COLORS[0],
      shape: shapes[Math.floor(rand() * shapes.length)] ?? "circle",
      drift: 0.15 + rand() * 0.35,
      phase: rand() * Math.PI * 2,
    };
  });
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  x: number,
  y: number,
  size: number,
) {
  ctx.beginPath();
  switch (shape) {
    case "circle":
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      break;
    case "square":
      ctx.rect(x - size / 2, y - size / 2, size, size);
      break;
    case "triangle":
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x + size / 2, y + size / 2);
      ctx.lineTo(x - size / 2, y + size / 2);
      ctx.closePath();
      break;
    case "diamond":
      ctx.moveTo(x, y - size / 2);
      ctx.lineTo(x + size / 2, y);
      ctx.lineTo(x, y + size / 2);
      ctx.lineTo(x - size / 2, y);
      ctx.closePath();
      break;
  }
  ctx.fill();
}

export function ParticleConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;
    let raf = 0;
    let particles: Particle[] = [];
    let isVisible = !document.hidden;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = width < 640 ? 120 : MAX_PARTICLES;
      particles = buildParticles(width, height, density);
    };

    const drawStatic = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = p.color;
        drawShape(ctx, p.shape, p.x, p.y, p.size);
      }
    };

    const draw = () => {
      if (!isVisible) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const t = frame * 0.008 * p.drift + p.phase;
        const x = p.x + Math.sin(t) * 6;
        const y = p.y + Math.cos(t * 0.7) * 4;
        ctx.globalAlpha = 0.55 + Math.sin(t) * 0.25;
        ctx.fillStyle = p.color;
        drawShape(ctx, p.shape, x, y, p.size);
      }

      frame += 1;
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      isVisible = !document.hidden;
    };

    resize();
    if (reducedMotion) {
      drawStatic();
    } else {
      draw();
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
