import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "../../../utils/cn";
import { useEffect } from "react";

export type NotificationType = "success" | "error" | "info";

interface NotificationProps {
  isVisible: boolean;
  message: string;
  type?: NotificationType;
  onClose: () => void;
  autoCloseDuration?: number; // Duration in ms
}

const variants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
};

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  info: <div className="w-5 h-5 rounded-full border-2 border-blue-400" />,
};

export function Notification({
  isVisible,
  message,
  type = "info",
  onClose,
  autoCloseDuration = 3000,
}: NotificationProps) {
  
  useEffect(() => {
    if (isVisible && autoCloseDuration > 0) {
      const timer = setTimeout(onClose, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDuration, onClose]);

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed top-5 right-5 z-50 flex items-center gap-3 pr-2 pl-4 py-3 rounded-lg shadow-xl backdrop-blur-md border min-w-[300px]",
            type === "success" && "bg-green-500/10 border-green-500/20",
            type === "error" && "bg-red-500/10 border-red-500/20",
            type === "info" && "bg-blue-500/10 border-blue-500/20"
          )}
        >
          <div className="flex-shrink-0">{icons[type]}</div>
          <p className="text-sm font-medium text-white flex-1">{message}</p>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-white/60 hover:text-white" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
