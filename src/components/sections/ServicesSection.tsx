"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, LayoutDashboard, Terminal } from "lucide-react";

import { BorderBeam } from "@/components/magicui/border-beam";
import { SectionParallax } from "@/components/ui/section-parallax";
import { content, type ServiceIcon } from "@/content/ru";
import { useEasterEgg } from "@/context/EasterEggContext";
import { usePerformanceController } from "@/hooks/usePerformanceController";
import { GPU_LAYER, scaleMotionTransition } from "@/lib/performance";

const icons: Record<ServiceIcon, typeof Bot> = {
  bot: Bot,
  terminal: Terminal,
  "layout-dashboard": LayoutDashboard,
};

const iconColors: Record<ServiceIcon, string> = {
  bot: "text-cyan-400",
  terminal: "text-purple-400",
  "layout-dashboard": "text-pink-400",
};

export function ServicesSection() {
  const { services } = content;
  const { isEasterEggActive, animationMultiplier } = useEasterEgg();
  const { motionTransition } = usePerformanceController();
  const cardTransition = scaleMotionTransition(
    motionTransition,
    animationMultiplier,
  );

  return (
    <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-24">
      <SectionParallax className="mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className={`mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur-sm ${
            isEasterEggActive ? "text-pink-400" : "text-cyan-400"
          }`}
        >
          <span
            className={`flex h-2 w-2 animate-pulse rounded-full ${
              isEasterEggActive ? "bg-pink-400" : "bg-cyan-400"
            }`}
          />
          {services.badge}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 text-3xl font-extrabold tracking-tight text-white md:text-5xl"
        >
          {services.title}{" "}
          <span
            className={
              isEasterEggActive
                ? "bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            }
          >
            {services.titleHighlight}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-base font-light text-gray-400 md:text-lg"
        >
          {services.subtitle}
        </motion.p>
      </SectionParallax>

      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
        {services.items.map((service, index) => {
          const Icon = icons[service.icon];
          const iconColor = iconColors[service.icon];

          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6 * animationMultiplier,
                delay: index * 0.15 * animationMultiplier,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ y: -6, transition: cardTransition }}
              style={
                {
                  "--glow-color": service.glowColor,
                } as React.CSSProperties
              }
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-slate-950/40 p-8 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:border-white/15 ${
                isEasterEggActive
                  ? "hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]"
                  : "hover:shadow-[0_0_40px_var(--glow-color)]"
              } ${GPU_LAYER}`}
            >
              <BorderBeam
                className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                colorFrom={isEasterEggActive ? "#f472b6" : service.beamColorFrom}
                colorTo={isEasterEggActive ? "#e879f9" : service.beamColorTo}
                size={80}
                duration={8 * animationMultiplier}
                delay={index * 2}
                borderWidth={1.5}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />

              <div>
                <div className="mb-8 flex items-center justify-between">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 shadow-inner transition-colors group-hover:border-white/20">
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <span className="rounded-full border border-white/5 bg-white/[0.02] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    {service.badge}
                  </span>
                </div>

                <h3
                  className={`mb-4 text-xl font-bold text-white transition-colors duration-300 ${
                    isEasterEggActive ? "group-hover:text-pink-400" : "group-hover:text-cyan-400"
                  }`}
                >
                  {service.title}
                </h3>
                <p className="mb-8 text-sm font-light leading-relaxed text-gray-400">
                  {service.description}
                </p>
              </div>

              <div>
                <div className="mb-6 flex flex-wrap gap-2 border-t border-white/5 pt-6">
                  {service.techs.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/5 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex w-fit cursor-pointer items-center gap-2 text-xs font-semibold text-gray-400 transition-colors group-hover:text-white">
                  <span>{services.ctaLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
