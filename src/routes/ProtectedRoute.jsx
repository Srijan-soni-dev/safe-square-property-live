import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageLoader from "@/components/common/PageLoader";
import { useAuth } from "@/hooks/useAuth";

/** Only logged-in users can see the nested routes. */
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader label="Checking your session" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}
