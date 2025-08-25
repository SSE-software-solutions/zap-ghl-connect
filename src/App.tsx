import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { LaunchpadPage } from "./pages/LaunchpadPage";
import { SubaccountsPage } from "./pages/SubaccountsPage";
import { BrandingPage } from "./pages/BrandingPage";
import { CommunityPage, DocumentationPage, AffiliatePage, HelpPage, IntegrationsPage, SettingsPage } from "./pages/PlaceholderPages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<LaunchpadPage />} />
              <Route path="subaccounts" element={<SubaccountsPage />} />
              <Route path="branding" element={<BrandingPage />} />
              <Route path="community" element={<CommunityPage />} />
              <Route path="documentation" element={<DocumentationPage />} />
              <Route path="affiliate" element={<AffiliatePage />} />
              <Route path="help" element={<HelpPage />} />
              <Route path="integrations" element={<IntegrationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;