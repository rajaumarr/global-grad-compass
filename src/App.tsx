import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Recommendations from "./pages/Recommendations";
import UniversityComparison from "./pages/UniversityComparison";
import GapAnalysis from "./pages/GapAnalysis";
import ApplicationTracker from "./pages/ApplicationTracker";
import UniversityDetail from "./pages/UniversityDetail";
import NotFound from "./pages/NotFound";
import DataManagement from "./pages/DataManagement";
import UserManagement from "./pages/admin/UserManagement";
import UniversityManagement from "./pages/admin/UniversityManagement";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import UpdateUniversityData from "./pages/admin/UpdateUniversityData";
import Scholarships from "./pages/Scholarships";
import ScholarshipDetail from "./pages/ScholarshipDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="global-grad-compass-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/compare" element={<UniversityComparison />} />
            <Route path="/gap-analysis" element={<GapAnalysis />} />
            <Route path="/applications" element={<ApplicationTracker />} />
            <Route path="/data-management" element={<DataManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/universities" element={<UniversityManagement />} />
            <Route path="/admin/admin-users" element={<AdminUserManagement />} />
            <Route path="/admin/update-data" element={<UpdateUniversityData />} />
            <Route path="/university/:id" element={<UniversityDetail />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/scholarship/:id" element={<ScholarshipDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
