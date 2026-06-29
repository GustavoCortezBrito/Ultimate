import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import logoAsset from "@/assets/ultimate-fitness-logo.png";

const PHONE = "5548XXXXXXXX"; // Substitua pelo número real
const BASE_MSG = encodeURIComponent("Olá! Gostaria de saber mais sobre os produtos Ultimate Fitness.");

function makeUrl(msg: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
}

const quickActions = [
  { emoji: "🛒", label: "Quero comprar uma Mini Bike", msg: "Olá! Quero comprar uma Mini Bike Ergométrica Ultimate Fitness." },
  { emoji: "🚲", label: "Quero comprar uma Bicicleta Spinning", msg: "Olá! Quero comprar uma Bicicleta Spinning Ultimate Fitness." },
  { emoji: "📦", label: "Dúvida sobre entrega / Mercado Livre", msg: "Olá! Tenho uma dúvida sobre entrega e logística do Mercado Livre Full." },
];

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-[60]"
      >
        {/* Pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[#25D366] rounded-full"
        />

        {/* Main button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#1ebe5d] rounded-full shadow-2xl flex items-center justify-center cursor-pointer"
          style={{ boxShadow: "0 8px 32px rgba(37,211,102,0.45)" }}
          aria-label="Abrir chat WhatsApp"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-7 h-7 text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="whats"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>

          {/* Notification badge */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ delay: 1.8, type: "spring", stiffness: 400, damping: 15 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-[#D11919] rounded-full flex items-center justify-center shadow"
              >
                <span className="text-white text-[10px] font-bold">1</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Tooltip (only when closed) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.85 }}
              transition={{ delay: 2.2, duration: 0.25 }}
              className="absolute right-[4.5rem] top-1/2 -translate-y-1/2 bg-[#1d1d1f] text-white px-4 py-2.5 rounded-2xl whitespace-nowrap shadow-xl pointer-events-none"
            >
              <div className="text-sm font-bold">Fale conosco! 💬</div>
              <div className="text-[11px] text-white/60 font-semibold">Respondemos em minutos</div>
              {/* Arrow */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[8px] border-l-[#1d1d1f]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Expanded Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-28 right-6 z-[60] w-[22rem] sm:w-96"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e8e8ed]">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#25D366] to-[#1ebe5d] px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Logo box */}
                  <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow">
                    <img
                      src={logoAsset}
                      alt="Ultimate Fitness"
                      className="w-9 h-auto object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm leading-tight">Ultimate Fitness</h3>
                    <p className="text-green-100 text-[11px] font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-green-200 rounded-full animate-pulse shrink-0" />
                      Respondemos rapidamente
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-xl transition-colors cursor-pointer"
                  aria-label="Fechar chat"
                >
                  <X size={18} />
                </button>
              </div>

              {/* WhatsApp-like chat background pattern */}
              <div
                className="p-4 min-h-[180px] flex flex-col justify-end space-y-3"
                style={{
                  background: "#ece5dd",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c5b9ad' fill-opacity='0.25'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              >
                {/* Agent message bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex gap-2 items-end"
                >
                  <div className="w-7 h-7 bg-[#25D366] rounded-full flex items-center justify-center shrink-0 mb-1">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div
                    className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm max-w-[82%]"
                    style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                  >
                    <p className="text-sm text-[#1d1d1f] font-semibold leading-snug">
                      Olá! 👋 Como podemos te ajudar hoje?
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium mt-1 block">agora</span>
                  </div>
                </motion.div>

                {/* Quick action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-2 ml-9"
                >
                  {quickActions.map((action) => (
                    <a
                      key={action.label}
                      href={makeUrl(action.msg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] px-4 py-2.5 rounded-2xl text-sm text-left shadow-sm hover:shadow transition-all border border-white/60 font-semibold flex items-center gap-2 cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-base">{action.emoji}</span>
                      {action.label}
                    </a>
                  ))}
                </motion.div>
              </div>

              {/* Footer CTA */}
              <div className="p-4 bg-white border-t border-[#e8e8ed]">
                <motion.a
                  href={`https://wa.me/${PHONE}?text=${BASE_MSG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2.5 bg-gradient-to-r from-[#25D366] to-[#1ebe5d] text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Iniciar Conversa no WhatsApp
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
