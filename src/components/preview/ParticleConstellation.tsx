"use client";

import { useEffect, useRef } from "react";

import { previewTokens } from "@/lib/design-tokens";

type Shape = "circle" | "triangle" | "diamond";

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  shape: Shape;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
};

const COLORS = [
  previewTokens.colors.plum,
  previewTokens.colors.amber,
  previewTokens.colors.lichen,
  previewTokens.colors.bone,
  previewTokens.colors.ash,
] as const;

const SHAPES: Shape[] = ["circle", "triangle", "diamond"];
const DESKTOP_COUNT = 1000;
// ponytail: cap at 400 on small screens — 1000× O(1) draw is fine, but halves GPU fill on mobile
const MOBILE_COUNT = 400;
const MOBILE_BREAKPOINT = 768;

function particleCount(width: number): number {
  return width < MOBILE_BREAKPOINT ? MOBILE_COUNT : DESKTOP_COUNT;
}

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

  return Array.from({ length: count }, () => {
    const x = width * 0.7 + (rand() - 0.5) * width * 0.6;
    const y = height * 0.5 + (rand() - 0.5) * height * 0.8;

    return {
      x,
      y,
      baseX: x,
      baseY: y,
      size: rand() * 3 + 1.5,
      color: COLORS[Math.floor(rand() * COLORS.length)] ?? COLORS[0],
      shape: SHAPES[Math.floor(rand() * SHAPES.length)] ?? "circle",
      vx: (rand() - 0.5) * 0.5,
      vy: (rand() - 0.5) * 0.5,
      angle: rand() * Math.PI * 2,
      spin: (rand() - 0.5) * 0.05,
    };
  });
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  particle: Particle,
  scrollY: number,
  animated: boolean,
) {
  let { x, y, angle } = particle;

  if (animated) {
    x += particle.vx;
    y += particle.vy;
    angle += particle.spin;

    const targetY = particle.baseY - scrollY * 0.2;
    y += (targetY - y) * 0.05;

    if (Math.abs(x - particle.baseX) > 100) {
      particle.vx *= -1;
    }

    particle.x = x;
    particle.y = y;
    particle.angle = angle;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = particle.color;
  ctx.strokeStyle = particle.color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.8;

  ctx.beginPath();
  switch (particle.shape) {
    case "circle":
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "triangle":
      ctx.moveTo(0, -particle.size);
      ctx.lineTo(particle.size, particle.size);
      ctx.lineTo(-particle.size, particle.size);
      ctx.closePath();
      ctx.stroke();
      break;
    case "diamond":
      ctx.moveTo(0, -particle.size);
      ctx.lineTo(particle.size, 0);
      ctx.lineTo(0, particle.size);
      ctx.lineTo(-particle.size, 0);
      ctx.closePath();
      ctx.stroke();
      break;
  }
  ctx.restore();
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

    let raf = 0;
    let particles: Particle[] = [];
    let scrollY = 0;
    let isVisible = !document.hidden;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = buildParticles(width, height, particleCount(width));
    };

    const render = (animated: boolean) => {
      ctx.clearRect(0, 0, width, height);
      for (const particle of particles) {
        drawParticle(ctx, particle, scrollY, animated);
      }
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!isVisible) return;
      render(true);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const onVisibility = () => {
      isVisible = !document.hidden;
    };

    resize();
    onScroll();

    if (reducedMotion) {
      render(false);
    } else {
      draw();
    }

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
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
