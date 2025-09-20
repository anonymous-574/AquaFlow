import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { toast } from "sonner";

export function CommunicationHub() {
  const [message, setMessage] = useState("");

  const handleSendNotification = () => {
    if (message.trim()) {
      toast.success("Notification sent successfully!");
      setMessage("");
    } else {
      toast.error("Please enter a message to send.");
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Communication Hub</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Broadcast Message to Residents
        </p>
      </div>
      <div className="space-y-4">
        <Textarea
          placeholder="Type your announcement or water schedule here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <Button 
          onClick={handleSendNotification}
          className="w-full"
          size="lg"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Notification
        </Button>
      </div>
    </Card>
  );
}