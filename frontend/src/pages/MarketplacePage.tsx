import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { TankerGrid } from "@/components/marketplace/TankerGrid";
import { TankerMap } from "@/components/marketplace/TankerMap";
import { motion } from "framer-motion";
import { createContext, useState } from "react";
import { Supplier } from "@/services/api";

// Create filter context
export const FilterContext = createContext<{
  filters: {
    search: string;
    capacities: string[];
    minRating: number;
    maxDeliveryTime: number;
    paymentOptions: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    search: string;
    capacities: string[];
    minRating: number;
    maxDeliveryTime: number;
    paymentOptions: string[];
  }>>;
  filteredSuppliers: Supplier[];
  setFilteredSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
}>({
  filters: {
    search: "",
    capacities: [],
    minRating: 0,
    maxDeliveryTime: 180,
    paymentOptions: []
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
    paymentOptions: [] as string[]
  });
  
  // State for filtered suppliers
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  return (
    <FilterContext.Provider value={{ 
      filters, 
      setFilters, 
      filteredSuppliers, 
      setFilteredSuppliers 
    }}>
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
    </FilterContext.Provider>
  );
}