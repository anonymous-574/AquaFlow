import { LogReadingForm } from "@/components/consumption/LogReadingForm";
import { ConsumptionCharts } from "@/components/consumption/ConsumptionCharts";
import { RecentReadings } from "@/components/consumption/RecentReadings";
import { motion } from "framer-motion";

export default function ConsumptionPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-foreground">Manual Consumption Tracking</h1>
      
      <div className="grid lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <LogReadingForm />
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <ConsumptionCharts />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <RecentReadings />
      </motion.div>
    </motion.div>
  );
}