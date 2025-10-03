import { motion } from "framer-motion";
import { memo } from "react";

const Card = memo(({ title, children, highlight }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`bg-white p-6 rounded-lg shadow-xs mb-6 border-l-3 border-l-green-500 ${highlight ? "border-green-500" : "border-gray-200"
            }`}
    >
        {title && <h3 className="text-xl font-semibold mb-2 text-green-700">{title}</h3>}
        {children}
    </motion.div>
));

export default Card;
