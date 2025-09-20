import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Droplets } from "lucide-react";
import { motion } from "framer-motion";

const leakEvents = [
  {
    id: 1,
    date: "October 26, 2024, 02:15 PM",
    title: "Unusual Overnight Flow",
    severity: "Critical Severity",
    loss: "500 Liters",
    location: "Main Pipeline",
  },
  {
    id: 2,
    date: "October 20, 2024, 09:30 AM",
    title: "Continuous High Usage",
    severity: "Moderate Severity",
    loss: "250 Liters",
    location: "Kitchen Area",
  },
  {
    id: 3,
    date: "September 15, 2024, 01:00 PM",
    title: "Sporadic Small Drips",
    severity: "Minor Severity",
    loss: "50 Liters",
    location: "Bathroom",
  },
  {
    id: 4,
    date: "September 01, 2024, 04:45 AM",
    title: "High Usage Alert",
    severity: "Moderate Severity",
    loss: "300 Liters",
    location: "Garden Area",
  },
];

export function LeakHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leak Event History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leakEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <h3 className="font-semibold">{event.title}</h3>
                <Badge 
                  variant={event.severity === "Critical Severity" ? "destructive" : 
                          event.severity === "Moderate Severity" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {event.severity}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Droplets className="h-4 w-4" />
                <span>Est. Loss: {event.loss}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
            
            <Button variant="link" className="p-0 h-auto text-primary">
              View Details
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}