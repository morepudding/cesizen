"use client";
import { motion } from "framer-motion";

export default function AnimatedCard() {
  return (
    <motion.div
      className="w-80 p-6 bg-green-50 border border-green-200 rounded-xl shadow-md text-green-800 mx-auto my-6 flex items-center justify-center"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-2xl font-bold text-center">Activités de détente</h3>
    </motion.div>
  );
}
