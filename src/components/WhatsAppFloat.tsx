import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WA } from "../lib/site";
import { track } from "../lib/analytics";

export function WhatsAppFloat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          href={WA.devis}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("generate_lead", { method: "whatsapp_float" })}
          aria-label="Nous écrire sur WhatsApp"
          className="group fixed bottom-6 right-6 z-[150] flex items-center gap-0 rounded-full bg-lime p-4 text-white shadow-[0_10px_40px_rgba(124,58,237,0.4)] transition-colors duration-300 hover:bg-milk"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-500 group-hover:ml-2.5 group-hover:max-w-[140px]">
            WhatsApp
          </span>
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute h-full w-full animate-ping rounded-full bg-lime opacity-75" />
            <span className="h-full w-full rounded-full border-2 border-ink bg-lime" />
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
