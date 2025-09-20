import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { TankerGrid } from "@/components/marketplace/TankerGrid";
import { TankerMap } from "@/components/marketplace/TankerMap";
import { motion } from "framer-motion";

export default function MarketplacePage() {
  return (
    <div className="flex gap-6 h-full">
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80"
      >
        <FilterPanel />
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 space-y-6"
      >
        <TankerMap />
        <TankerGrid />
      </motion.div>
    </div>
  );
}