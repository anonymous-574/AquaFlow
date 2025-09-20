import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import MarketplacePage from "@/pages/MarketplacePage";
import ConsumptionPage from "@/pages/ConsumptionPage";
import LeakDetectionPage from "@/pages/LeakDetectionPage";
import ConservationHubPage from "@/pages/ConservationHubPage";
import SocietyDashboardPage from "@/pages/SocietyDashboardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<MarketplacePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/consumption" element={<ConsumptionPage />} />
            <Route path="/leak-detection" element={<LeakDetectionPage />} />
            <Route path="/conservation" element={<ConservationHubPage />} />
            <Route path="/society" element={<SocietyDashboardPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
