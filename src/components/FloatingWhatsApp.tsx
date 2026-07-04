import { MessageCircle } from "lucide-react";

const FloatingWhatsApp = () => (
  <a
    href="https://wa.me/8801797395739"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-[#25D366] text-white shadow-crystal hover:shadow-glow hover:scale-105 transition-all duration-300"
  >
    <MessageCircle className="w-5 h-5" />
    <span className="font-body text-sm font-medium hidden sm:inline">Chat on WhatsApp</span>
    <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10" />
  </a>
);

export default FloatingWhatsApp;