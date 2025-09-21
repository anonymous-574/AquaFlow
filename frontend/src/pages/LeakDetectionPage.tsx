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
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/savewater.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Leak Detection & Management</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Monitor and manage water leaks with real-time alerts and troubleshooting guides to prevent water wastage.
          </p>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-status-success rounded-full"></div>
              <span>Real-time alerts</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Smart detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-status-warning rounded-full"></div>
              <span>Quick resolution</span>
            </div>
          </div>
        </div>
      </div>
      
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