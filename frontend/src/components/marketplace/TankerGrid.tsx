import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import tankerImg from "./s-1.png"; 
import tankerIms from "./s-2.png";
import tankerImt from "./s-3.png";
import tankerImu from "./s-4.png";
import tankerImv from "./s-5.png";
import tankerImz from "./s-6.png";

const tankerData = [
  {
    id: 1,
    name: "HydroServe Tankers",
    rating: 4.8,
    reviews: 1245,
    location: "Kotrund, Pune",
    capacities: ["500L", "1000L"],
    startPrice: 500,
    deliveryTime: "30-45 mins",
    image: tankerImg,
    badge: "500ML"
  },
  {
    id: 2,
    name: "AquaLogistics Solutions",
    rating: 4.2,
    reviews: 892,
    location: "Hinjewadi, Pune",
    capacities: ["500L", "1200L", "1500L"],
    startPrice: 650,
    deliveryTime: "45-60 mins",
    image: tankerIms,
    badge: "500ML"
  },
  {
    id: 3,
    name: "City Water Carriers",
    rating: 4.2,
    reviews: 732,
    location: "Shivajinagar, Pune",
    capacities: ["800L", "1000L"],
    startPrice: 600,
    deliveryTime: "60-75 mins",
    image: tankerImu,
    badge: "500ML"
  },
  {
    id: 4,
    name: "Reliable Aqua Supply",
    rating: 4.9,
    reviews: 1500,
    location: "Eames, Pune",
    capacities: ["500L", "1000L"],
    startPrice: 550,
    deliveryTime: "25-40 mins",
    image: tankerImt,
    badge: "500ML"
  },
  {
    id: 5,
    name: "Ganga Water Services",
    rating: 4.4,
    reviews: 680,
    location: "Fangri-Chinchhad, Pune",
    capacities: ["500L", "800L"],
    startPrice: 480,
    deliveryTime: "50-65 mins",
    image: tankerImv,
    badge: "500ML"
  },
  {
    id: 6,
    name: "Shanti Water Tankers",
    rating: 4.7,
    reviews: 1100,
    location: "Wakd, Pune",
    capacities: ["1000L", "1500L"],
    startPrice: 700,
    deliveryTime: "40-55 mins",
    image: tankerImz,
    badge: "1000ML"
  }
];

export function TankerGrid() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Showing {tankerData.length} Water Tankers Available</h2>
      
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tankerData.map((tanker, index) => (
          <motion.div
            key={tanker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={tanker.image} 
                  alt={tanker.name}
                  className="w-full h-32 object-cover"
                />
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 left-2 bg-status-success text-white"
                >
                  {tanker.badge}
                </Badge>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{tanker.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{tanker.rating}</span>
                    <span>({tanker.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{tanker.location}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {tanker.capacities.map((capacity) => (
                    <Badge key={capacity} variant="outline" className="text-xs">
                      {capacity}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold">₹ Starts from ₹{tanker.startPrice}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Est {tanker.deliveryTime}</span>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary-hover">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}