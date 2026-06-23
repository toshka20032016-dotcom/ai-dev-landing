"use client";

import { useEffect, useRef } from "react";

import { previewTokens } from "@/lib/design-tokens";

type Shape = "circle" | "triangle" | "diamond";

type Particle = {
  phi: number;
  theta: number;
  size: number;
  color: string;
  shape: Shape;
};

const COLORS = [
  previewTokens.colors.plum,
  previewTokens.colors.amber,
  previewTokens.colors.lichen,
  previewTokens.colors.bone,
  previewTokens.colors.ash,
] as const;

const SHAPES: Shape[] = ["circle", "triangle", "diamond"];
const DESKTOP_COUNT = 1500;
// ponytail: cap at 800 on small screens — halves fill cost vs desktop
const MOBILE_COUNT = 800;
const MOBILE_BREAKPOINT = 768;

const ROT_X = 0.001;
const ROT_Y = 0.003;
const FOV = 400;
const Z_OFFSET = 600;

function particleCount(width: number): number {
  return width < MOBILE_BREAKPOINT ? MOBILE_COUNT : DESKTOP_COUNT;
}

function sphereCenter(width: number, height: number) {
  return {
    x: width < MOBILE_BREAKPOINT ? width * 0.5 : width * 0.75,
    y: height * 0.5,
  };
}

function sphereRadius(width: number, height: number): number {
  return Math.min(width, height) * 0.4;
}

// ponytail: deterministic LCG — same field on every mount, no SSR mismatch
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function buildParticles(count: number): Particle[] {
  const rand = seededRandom(42);

  return Array.from({ length: count }, () => ({
    phi: Math.acos(rand() * 2 - 1),
    theta: rand() * Math.PI * 2,
    size: rand() * 3 + 1.5,
    color: COLORS[Math.floor(rand() * COLORS.length)] ?? COLORS[0],
    shape: SHAPES[Math.floor(rand() * SHAPES.length)] ?? "circle",
  }));
}

function rotateY(x: number, y: number, z: number, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: x * cos + z * sin, y, z: -x * sin + z * cos };
}

function rotateX(x: number, y: number, z: number, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x, y: y * cos - z * sin, z: y * sin + z * cos };
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  particle: Particle,
  centerX: number,
  centerY: number,
  radius: number,
  rotAngleX: number,
  rotAngleY: number,
) {
  const sinPhi = Math.sin(particle.phi);
  let x3d = radius * sinPhi * Math.cos(particle.theta);
  let y3d = radius * sinPhi * Math.sin(particle.theta);
  let z3d = radius * Math.cos(particle.phi);

  ({ x: x3d, y: y3d, z: z3d } = rotateY(x3d, y3d, z3d, rotAngleY));
  ({ x: x3d, y: y3d, z: z3d } = rotateX(x3d, y3d, z3d, rotAngleX));

  const alpha = mapRange(z3d, -radius, radius, 0.15, 1);
  if (alpha <= 0.1) return;

  const scale = FOV / (FOV + z3d + Z_OFFSET);
  const screenX = centerX + x3d * scale;
  const screenY = centerY + y3d * scale;
  const size = particle.size * scale;

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.fillStyle = particle.color;
  ctx.strokeStyle = particle.color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = alpha;

  ctx.beginPath();
  switch (particle.shape) {
    case "circle":
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "triangle":
      ctx.moveTo(0, -size);
      ctx.lineTo(size, size);
      ctx.lineTo(-size, size);
      ctx.closePath();
      ctx.stroke();
      break;
    case "diamond":
      ctx.moveTo(0, -size);
      ctx.lineTo(size, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size, 0);
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
    let isVisible = !document.hidden;
    let width = 0;
    let height = 0;
    let radius = 0;
    let centerX = 0;
    let centerY = 0;
    let rotAngleX = 0;
    let rotAngleY = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = sphereRadius(width, height);
      ({ x: centerX, y: centerY } = sphereCenter(width, height));
      particles = buildParticles(particleCount(width));
    };

    const render = (animated: boolean) => {
      if (animated) {
        rotAngleX += ROT_X;
        rotAngleY += ROT_Y;
      }

      ctx.clearRect(0, 0, width, height);
      for (const particle of particles) {
        drawParticle(
          ctx,
          particle,
          centerX,
          centerY,
          radius,
          rotAngleX,
          rotAngleY,
        );
      }
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!isVisible) return;
      render(true);
    };

    const onVisibility = () => {
      isVisible = !document.hidden;
    };

    resize();

    if (reducedMotion) {
      render(false);
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
