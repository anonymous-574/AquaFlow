import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";

const recentReadings = [
  { date: "2024-07-28", meterReading: 12540, consumption: 160 },
  { date: "2024-07-27", meterReading: 12380, consumption: 180 },
  { date: "2024-07-26", meterReading: 12200, consumption: 175 },
  { date: "2024-07-25", meterReading: 12025, consumption: 190 },
  { date: "2024-07-24", meterReading: 11835, consumption: 155 },
  { date: "2024-07-23", meterReading: 11680, consumption: 210 },
];

export function RecentReadings() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent Readings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Meter Reading (L)</TableHead>
                <TableHead>Consumption (L)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReadings.map((reading, index) => (
                <motion.tr
                  key={reading.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-b"
                >
                  <TableCell>{reading.date}</TableCell>
                  <TableCell>{reading.meterReading.toLocaleString()}</TableCell>
                  <TableCell>{reading.consumption}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}