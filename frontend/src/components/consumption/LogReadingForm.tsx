import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { motion } from "framer-motion";

export function LogReadingForm() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reading, setReading] = useState("12345");

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Log New Reading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meter-reading">Current Meter Reading (Litres)</Label>
            <Input
              id="meter-reading"
              placeholder="e.g., 12345"
              value={reading}
              onChange={(e) => setReading(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date of Reading</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "yyyy-MM-dd") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button className="w-full bg-primary hover:bg-primary-hover">
            Save Reading
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}