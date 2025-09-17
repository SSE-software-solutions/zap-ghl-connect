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
import AccountSettings from "./pages/AccountSettings";
import { SubaccountsPage } from "./pages/SubaccountsPage";
import { BrandingPage } from "./pages/BrandingPage";
import { CommunityPage, DocumentationPage, AffiliatePage, HelpPage, IntegrationsPage, SettingsPage } from "./pages/PlaceholderPages";
import { InstancePage } from "./pages/InstancePage";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/admin/AdminPage";
import RequireAdmin from "./pages/admin/RequireAdmin";
import RequireActive from "./pages/guards/RequireActive";

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
            <Route path="/instance" element={<InstancePage />} />
            <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<LaunchpadPage />} />
              <Route path="subaccounts" element={<RequireActive><SubaccountsPage /></RequireActive>} />
              <Route path="branding" element={<RequireActive><BrandingPage /></RequireActive>} />
              <Route path="account" element={<AccountSettings />} />
              <Route path="community" element={<RequireActive><CommunityPage /></RequireActive>} />
              <Route path="documentation" element={<RequireActive><DocumentationPage /></RequireActive>} />
              <Route path="affiliate" element={<RequireActive><AffiliatePage /></RequireActive>} />
              <Route path="help" element={<RequireActive><HelpPage /></RequireActive>} />
              <Route path="integrations" element={<RequireActive><IntegrationsPage /></RequireActive>} />
              <Route path="settings" element={<RequireActive><SettingsPage /></RequireActive>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;