"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image, { type StaticImageData } from "next/image";

export type CarouselSlide = {
  src?: string | StaticImageData;
  alt: string;
  label: string;
};

export function ProductCarousel({ slides }: { slides: CarouselSlide[] }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(0);
  const total = slides.length;

  const go = (d: number) => {
    setDir(d);
    setI((prev) => (prev + d + total) % total);
  };

  const current = slides[i];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? "100%" : "-100%", opacity: 0 }),
  };

  if (!slides?.length) {
    return (
      <div className="relative aspect-square bg-[#111113] flex items-center justify-center text-white/20 rounded-3xl border border-white/5">
        <ImageIcon className="w-12 h-12 opacity-30" />
      </div>
    );
  }

  return (
    <div className="relative aspect-square bg-[#111113] overflow-hidden group rounded-3xl border border-white/5">
      <AnimatePresence initial={false} custom={dir}>
        {current.src ? (
          <motion.div
            key={i}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 280, damping: 30 }, opacity: { duration: 0.2 } }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-cover rounded-3xl"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
          </motion.div>
        ) : (
          <motion.div
            key={i}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 280, damping: 30 }, opacity: { duration: 0.2 } }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white/20 p-6 text-center rounded-3xl"
          >
            <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
            <span className="text-sm font-semibold text-white/30">{current.label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {total > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 backdrop-blur border border-white/10 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-105 hover:bg-black/70 z-10 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 backdrop-blur border border-white/10 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-105 hover:bg-black/70 z-10 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setDir(idx > i ? 1 : -1); setI(idx); }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === i ? "w-6 bg-[#FF5722]" : "w-1.5 bg-white/20"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
