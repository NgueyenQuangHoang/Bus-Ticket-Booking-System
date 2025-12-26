import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "../../../components/admin/Auth/LoginForm";
import { RegisterForm } from "../../../components/admin/Auth/RegisterForm";

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Main Container */}
      <motion.div 
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-full aspect-[4/5] perspective-1000">
           {/* Card Container with Glassmorphism */}
           <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white/10 backdrop-blur-md">
             <AnimatePresence mode="wait" initial={false}>
               {isLogin ? (
                 <motion.div
                   key="login"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   transition={{ duration: 0.3 }}
                   className="absolute inset-0"
                 >
                   <LoginForm onToggle={toggleAuthMode} />
                 </motion.div>
               ) : (
                 <motion.div
                   key="register"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.3 }}
                   className="absolute inset-0"
                 >
                   <RegisterForm onToggle={toggleAuthMode} />
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
