"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import logoAsset from "@/assets/ultimate-fitness-logo.png";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 700);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0a0a0c] overflow-hidden"
        >
          {/* Ambient background glows */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,87,34,0.07) 0%, transparent 70%)",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,87,34,0.12) 0%, transparent 65%)",
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col items-center gap-5 px-8">
            {/* Logo (contains real bolt from header) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.34, 1.4, 0.64, 1] }}
              className="relative"
            >
              {/* Halo ring behind logo */}
              <motion.div
                animate={{ opacity: [0, 0.5, 0], scale: [0.85, 1.1, 0.85] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(255,87,34,0.25) 0%, transparent 65%)",
                }}
              />
              <Image
                src={logoAsset}
                alt="Ultimate Fitness"
                className="h-16 sm:h-20 w-auto relative z-10 drop-shadow-[0_0_20px_rgba(255,87,34,0.45)]"
                priority
              />
            </motion.div>

            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
              className="w-32 h-px origin-center"
              style={{ background: "linear-gradient(90deg, transparent, #FF5722, transparent)" }}
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/35 text-center"
            >
              Equipamentos fitness de alta qualidade
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="w-44 h-[2px] rounded-full bg-white/8 overflow-hidden mt-1"
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #D11919, #FF5722, #FF8C55)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.6, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
