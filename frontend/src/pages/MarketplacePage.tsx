import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { TankerGrid } from "@/components/marketplace/TankerGrid";
import { TankerMap } from "@/components/marketplace/TankerMap";
import { motion } from "framer-motion";
import { createContext, useState, useEffect } from "react";
import { Supplier } from "@/services/api";
import { useSuppliers } from "@/hooks/useAPI";

// Create filter context
export const FilterContext = createContext<{
  filters: {
    search: string;
    capacities: string[];
    minRating: number;
    maxDeliveryTime: number;
    paymentOptions: string[];
    sortBy: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    search: string;
    capacities: string[];
    minRating: number;
    maxDeliveryTime: number;
    paymentOptions: string[];
    sortBy: string;
  }>>;
  filteredSuppliers: Supplier[];
  setFilteredSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}>({
  filters: {
    search: "",
    capacities: [],
    minRating: 0,
    maxDeliveryTime: 180,
    paymentOptions: [],
    sortBy: "rating-high"
  },
  setFilters: () => {},
  filteredSuppliers: [],
  setFilteredSuppliers: () => {}
});

export default function MarketplacePage() {
  // Initialize filter state
  const [filters, setFilters] = useState({
    search: "",
    capacities: [] as string[],
    minRating: 0,
    maxDeliveryTime: 180,
    paymentOptions: [] as string[],
    sortBy: "rating-high"
  });
  
  // State for filtered suppliers
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  
  // Get all suppliers from API
  const { data: allSuppliers, isLoading } = useSuppliers();

  // Filter and sort suppliers based on current filters
  useEffect(() => {
    if (!allSuppliers) return;

    let filtered = [...allSuppliers];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        supplier.area.toLowerCase().includes(filters.search.toLowerCase()) ||
        supplier.city.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply capacity filter
    if (filters.capacities.length > 0) {
      filtered = filtered.filter(supplier => {
        const supplierCapacities = supplier.offers?.map(offer => `${offer.quantity}L`) || [];
        return filters.capacities.some(capacity => supplierCapacities.includes(capacity));
      });
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(supplier => supplier.rating >= filters.minRating);
    }

    // Apply delivery time filter
    filtered = filtered.filter(supplier => {
      const estimatedTime = supplier.estimated_eta || 45; // Default to 45 minutes if not specified
      return estimatedTime <= filters.maxDeliveryTime;
    });

    // Apply payment options filter (assuming all suppliers support all payment methods for now)
    // In a real app, you'd have payment method data in the supplier object

    // Apply sorting
    switch (filters.sortBy) {
      case "rating-high":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = a.starting_from || a.offers?.[0]?.cost || 0;
          const priceB = b.starting_from || b.offers?.[0]?.cost || 0;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = a.starting_from || a.offers?.[0]?.cost || 0;
          const priceB = b.starting_from || b.offers?.[0]?.cost || 0;
          return priceB - priceA;
        });
        break;
      case "delivery":
        filtered.sort((a, b) => {
          const timeA = a.estimated_eta || 45;
          const timeB = b.estimated_eta || 45;
          return timeA - timeB;
        });
        break;
      default:
        filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredSuppliers(filtered);
  }, [allSuppliers, filters]);

  return (
    <FilterContext.Provider value={{ 
      filters, 
      setFilters, 
      filteredSuppliers, 
      setFilteredSuppliers 
    }}>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/savewater.jpg')] bg-cover bg-center opacity-10"></div>
          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Water Tanker Marketplace</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Find and book water tankers from verified suppliers in your area. Quick delivery, competitive prices, and reliable service.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-status-success rounded-full"></div>
                <span>Verified suppliers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Quick delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-status-warning rounded-full"></div>
                <span>Competitive pricing</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-6 h-full">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-80"
          >
            <FilterPanel />
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 space-y-6"
          >
            <TankerMap />
            <TankerGrid />
          </motion.div>
        </div>
      </div>
    </FilterContext.Provider>
  );
}