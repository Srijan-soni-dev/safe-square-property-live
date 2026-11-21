import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import PropertiesPage from "@/pages/PropertiesPage";
import AddPropertyPage from "@/pages/AddPropertyPage";
import EditPropertyPage from "@/pages/EditPropertyPage";
import PropertyDetailsPage from "@/pages/PropertyDetailsPage";
import SettingsPage from "@/pages/SettingsPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/new" element={<AddPropertyPage />} />
          <Route path="properties/:id" element={<PropertyDetailsPage />} />
          <Route path="properties/:id/edit" element={<EditPropertyPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
