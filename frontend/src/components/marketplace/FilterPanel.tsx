import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export function FilterPanel() {
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Sort</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="supplier-search">Search by Supplier</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                id="supplier-search"
                placeholder="e.g., HydroServe" 
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Capacity</Label>
            <div className="space-y-3">
              {[
                { id: "500L", label: "500L" },
                { id: "800L", label: "800L" },
                { id: "1000L", label: "1000L" },
                { id: "1200L", label: "1200L" },
                { id: "1500L", label: "1500L" },
              ].map((capacity) => (
                <div key={capacity.id} className="flex items-center space-x-2">
                  <Checkbox id={capacity.id} />
                  <Label htmlFor={capacity.id} className="text-sm">
                    {capacity.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Rating</Label>
            <div className="space-y-3">
              {[
                { id: "4.5-up", label: "4.5 Stars & Up" },
                { id: "4-up", label: "4 Stars & Up" },
                { id: "3.5-up", label: "3.5 Stars & Up" },
              ].map((rating) => (
                <div key={rating.id} className="flex items-center space-x-2">
                  <Checkbox id={rating.id} />
                  <Label htmlFor={rating.id} className="text-sm">
                    {rating.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Payment Options</Label>
            <div className="space-y-3">
              {[
                { id: "upi", label: "UPI" },
                { id: "card", label: "Card Payment" },
                { id: "banking", label: "Net Banking" },
                { id: "cod", label: "Cash on Delivery" },
              ].map((payment) => (
                <div key={payment.id} className="flex items-center space-x-2">
                  <Checkbox id={payment.id} />
                  <Label htmlFor={payment.id} className="text-sm">
                    {payment.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Max Delivery Time</Label>
            <div className="px-2">
              <Slider
                defaultValue={[60]}
                max={180}
                min={30}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>30 mins</span>
                <span>180 mins</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort-by">Sort By</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Rating (High to Low)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating-high">Rating (High to Low)</SelectItem>
                <SelectItem value="rating-low">Rating (Low to High)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="delivery">Delivery Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}