import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { upcomingDeliveries } from "@/data/conservationData";

export function UpcomingDeliveries() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Badge variant="secondary" className="bg-status-success/10 text-status-success hover:bg-status-success/20">Scheduled</Badge>;
      case "Delayed":
        return <Badge variant="destructive">Delayed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Tanker Deliveries</h3>
      </div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium">Supplier</TableHead>
              <TableHead className="text-xs font-medium">Date</TableHead>
              <TableHead className="text-xs font-medium">Time</TableHead>
              <TableHead className="text-xs font-medium">Volume</TableHead>
              <TableHead className="text-xs font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingDeliveries.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell className="text-sm font-medium">{delivery.supplier}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{delivery.date}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{delivery.time}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{delivery.volume}</TableCell>
                <TableCell>{getStatusBadge(delivery.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}