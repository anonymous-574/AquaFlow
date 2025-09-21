import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";
import { useConsumptionReport } from "@/hooks/useAPI";

export function ConsumptionCharts() {
  const { data: dailyReport, isLoading: dailyLoading } = useConsumptionReport('daily', true);
  const { data: weeklyReport, isLoading: weeklyLoading } = useConsumptionReport('weekly',true);
  const { data: monthlyReport, isLoading: monthlyLoading } = useConsumptionReport('monthly',true);

  // Debug logging
  console.log('Daily Report:', dailyReport);
  console.log('Weekly Report:', weeklyReport);
  console.log('Monthly Report:', monthlyReport);

  // Transform API data to chart format
  const dailyData = dailyReport?.readings?.map((reading, index) => ({
    day: `Day ${index + 1}`,
    consumption: reading.reading
  })) || [];

  // Process weekly data - group readings by week
  const processWeeklyData = (readings: any[]) => {
    if (!readings || readings.length === 0) return [];
    
    const weeklyGroups: { [key: string]: any[] } = {};
    
    readings.forEach(reading => {
      const date = new Date(reading.timestamp);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyGroups[weekKey]) {
        weeklyGroups[weekKey] = [];
      }
      weeklyGroups[weekKey].push(reading);
    });
    
    return Object.entries(weeklyGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([weekKey, weekReadings], index) => {
        weekReadings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const consumption = weekReadings.length > 1 
          ? weekReadings[weekReadings.length - 1].reading - weekReadings[0].reading
          : 0;
        
        return {
          week: `Week ${index + 1}`,
          consumption: Math.max(0, consumption)
        };
      });
  };

  const weeklyData = processWeeklyData(weeklyReport?.readings || []);
  console.log('Processed Weekly Data:', weeklyData);

  // Process monthly data - group readings by month
  const processMonthlyData = (readings: any[]) => {
    if (!readings || readings.length === 0) return [];
    
    const monthlyGroups: { [key: string]: any[] } = {};
    
    readings.forEach(reading => {
      const date = new Date(reading.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = [];
      }
      monthlyGroups[monthKey].push(reading);
    });
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return Object.entries(monthlyGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, monthReadings], index) => {
        monthReadings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const consumption = monthReadings.length > 1 
          ? monthReadings[monthReadings.length - 1].reading - monthReadings[0].reading
          : 0;
        
        const date = new Date(monthKey + '-01');
        return {
          month: monthNames[date.getMonth()],
          consumption: Math.max(0, consumption)
        };
      });
  };

  const monthlyData = processMonthlyData(monthlyReport?.readings || []);
  console.log('Processed Monthly Data:', monthlyData);
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
            {weeklyLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-muted-foreground">Loading weekly data...</div>
              </div>
            ) : weeklyData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-muted-foreground">No weekly data available</div>
              </div>
            ) : (
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
            )}
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
            {monthlyLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-muted-foreground">Loading monthly data...</div>
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-muted-foreground">No monthly data available</div>
              </div>
            ) : (
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
            )}
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