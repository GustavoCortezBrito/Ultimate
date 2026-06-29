import { Truck } from "lucide-react";
import { motion } from "framer-motion";

export function TopBar() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 22 }}
      className="bg-[#f5f5f7] border-b border-[#e8e8ed] text-gray-500 text-[11px] py-2 px-4 text-center fixed top-0 inset-x-0 z-[60] select-none flex items-center justify-center gap-2 font-medium tracking-wide"
    >
      <Truck className="w-4 h-4 text-[#00a650] shrink-0" />
      <span>Entrega rápida para todo o Brasil &nbsp;·&nbsp; Compra 100% protegida pelo Mercado Livre</span>
    </motion.div>
  );
}
