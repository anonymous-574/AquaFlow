import { NavLink } from "react-router-dom";
import { 
  Truck, 
  BarChart3, 
  AlertTriangle, 
  Leaf, 
  Building2,
  Home
} from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar() {
  const navItems = [
    { 
      name: "Water Tanker Marketplace", 
      path: "/marketplace", 
      icon: Truck 
    },
    { 
      name: "Consumption Tracking", 
      path: "/consumption", 
      icon: BarChart3 
    },
    { 
      name: "Leak Detection", 
      path: "/leak-detection", 
      icon: AlertTriangle 
    },
    { 
      name: "Conservation Hub", 
      path: "/conservation", 
      icon: Leaf 
    },
    { 
      name: "Society Dashboard", 
      path: "/society", 
      icon: Building2 
    },
  ];

  return (
    <aside className="w-64 bg-sidebar-bg border-r border-border h-[calc(100vh-80px)] p-4">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-active text-white"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-4 w-4" />
              </motion.div>
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}