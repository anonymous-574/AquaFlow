import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  icon: React.ElementType;
}

export function KPICard({ title, value, unit, trend, icon: Icon }: KPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-status-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case "stable":
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <Icon className="h-5 w-5 text-primary" />
          {getTrendIcon()}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {unit && <p className="text-sm font-medium text-muted-foreground">{unit}</p>}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}