import { LeakAlert } from "@/components/leak-detection/LeakAlert";
import { LeakHistory } from "@/components/leak-detection/LeakHistory";
import { TroubleshootingGuide } from "@/components/leak-detection/TroubleshootingGuide";
import { SupportPanel } from "@/components/leak-detection/SupportPanel";
import { motion } from "framer-motion";

export default function LeakDetectionPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <LeakAlert />
      
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <LeakHistory />
        </motion.div>
        
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <TroubleshootingGuide />
          <SupportPanel />
        </motion.div>
      </div>
    </motion.div>
  );
}