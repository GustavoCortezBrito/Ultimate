import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type CarouselSlide = {
  src?: string;
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
      <div className="relative aspect-square bg-[#f5f5f7] flex items-center justify-center text-gray-400 rounded-3xl">
        <ImageIcon className="w-12 h-12 opacity-30" />
      </div>
    );
  }

  return (
    <div className="relative aspect-square bg-[#f5f5f7] overflow-hidden group rounded-3xl">
      <AnimatePresence initial={false} custom={dir}>
        {current.src ? (
          <motion.img
            key={i}
            src={current.src}
            alt={current.alt}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 280, damping: 30 }, opacity: { duration: 0.2 } }}
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
          />
        ) : (
          <motion.div
            key={i}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 280, damping: 30 }, opacity: { duration: 0.2 } }}
            className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-6 text-center rounded-3xl"
          >
            <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
            <span className="text-sm font-semibold text-gray-500">{current.label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {total > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 z-10 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 z-10 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setDir(idx > i ? 1 : -1); setI(idx); }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === i ? "w-6 bg-[#A61713]" : "w-1.5 bg-gray-300/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
