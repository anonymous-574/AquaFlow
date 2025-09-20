import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";

const dailyData = [
  { day: 'Mon', consumption: 165 },
  { day: 'Wed', consumption: 185 },
  { day: 'Fri', consumption: 220 },
  { day: 'Sun', consumption: 190 },
];

const weeklyData = [
  { week: 'Week 2', consumption: 1050 },
  { week: 'Week 3', consumption: 1200 },
  { week: 'Week 4', consumption: 1100 },
  { week: 'Week 5', consumption: 1400 },
];

const monthlyData = [
  { month: 'Feb', consumption: 4200 },
  { month: 'Apr', consumption: 4500 },
  { month: 'Jun', consumption: 5100 },
];

export function ConsumptionCharts() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="hsl(var(--chart-primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-primary rounded-full"></div>
                <span>Consumption (L)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Bar 
                  dataKey="consumption" 
                  fill="hsl(var(--chart-secondary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-secondary rounded-full"></div>
                <span>Consumption (L)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar 
                  dataKey="consumption" 
                  fill="hsl(var(--foreground))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-foreground rounded-full"></div>
                <span>Consumption (L)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}