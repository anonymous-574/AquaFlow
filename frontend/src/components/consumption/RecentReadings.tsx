import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { apiRequest } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Reading {
  timestamp: string;
  reading: number;
}

interface ApiResponse {
  total: number;
  average: number;
  readings: Reading[];
}

interface TableReading {
  date: string;
  meterReading: number;
  consumption: number;
}

export function RecentReadings() {
  const [readings, setReadings] = useState<TableReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await apiRequest<ApiResponse>('/consumption_report?period=weekly&detailed=true', {
          method: 'GET'
        });
        
        // Sort readings by timestamp ascending
        const sortedReadings = [...response.readings].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        // Calculate consumption differences
        const tableData: TableReading[] = sortedReadings.map((reading, index) => {
          const date = format(new Date(reading.timestamp), 'yyyy-MM-dd');
          const previousReading = index > 0 ? sortedReadings[index - 1].reading : 0;
          const consumption = reading.reading - previousReading;
          
          return {
            date,
            meterReading: reading.reading,
            consumption: Math.max(0, consumption) // Ensure non-negative
          };
        });

        setReadings(tableData);
      } catch (err) {
        setError('Failed to fetch recent readings. Please try again later.');
        console.error('Error fetching readings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReadings();
  }, []);

  if (isLoading) {
    return (
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
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

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
              {readings.map((reading, index) => (
                <motion.tr
                  key={reading.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-b"
                >
                  <TableCell>{reading.date}</TableCell>
                  <TableCell>{reading.meterReading.toLocaleString()}</TableCell>
                  <TableCell>{reading.consumption.toLocaleString()}</TableCell>
                </motion.tr>
              ))}
              {readings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No recent readings available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}