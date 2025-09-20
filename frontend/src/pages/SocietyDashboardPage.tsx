import { motion } from "framer-motion";
import { DropletIcon, Truck, Target, Leaf } from "lucide-react";
import { KPICard } from "@/components/conservation/KPICard";
import { ConsumptionChart } from "@/components/conservation/ConsumptionChart";
import { ConservationImpactChart } from "@/components/conservation/ConservationImpactChart";
import { UpcomingDeliveries } from "@/components/conservation/UpcomingDeliveries";
import { CommunicationHub } from "@/components/conservation/CommunicationHub";
import { conservationKPIs } from "@/data/conservationData";

export default function SocietyDashboardPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Society Management Dashboard</h1>
        <p className="text-muted-foreground">
          Centralized platform for managing water resources and communication within your society.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Monthly Consumption"
          value={conservationKPIs.monthlyConsumption.value}
          unit={conservationKPIs.monthlyConsumption.unit}
          trend={conservationKPIs.monthlyConsumption.trend}
          icon={DropletIcon}
        />
        <KPICard
          title="Tankers Ordered YTD"
          value={conservationKPIs.tankersOrderedYTD.value}
          unit={conservationKPIs.tankersOrderedYTD.unit}
          trend={conservationKPIs.tankersOrderedYTD.trend}
          icon={Truck}
        />
        <KPICard
          title="Active Initiatives"
          value={conservationKPIs.activeInitiatives.value}
          unit={conservationKPIs.activeInitiatives.unit}
          trend={conservationKPIs.activeInitiatives.trend}
          icon={Target}
        />
        <KPICard
          title="Water Saved (Approx)"
          value={conservationKPIs.waterSaved.value}
          unit={conservationKPIs.waterSaved.unit}
          trend={conservationKPIs.waterSaved.trend}
          icon={Leaf}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Table */}
        <div className="lg:col-span-2 space-y-6">
          <ConsumptionChart />
          <UpcomingDeliveries />
        </div>

        {/* Right Column - Impact Chart and Communication */}
        <div className="space-y-6">
          <ConservationImpactChart />
          <CommunicationHub />
        </div>
      </div>
    </motion.div>
  );
}