import { Navigate, Outlet } from "react-router-dom";
import PageLoader from "@/components/common/PageLoader";
import { useAuth } from "@/hooks/useAuth";

/** Login page: logged-in users are sent straight to the dashboard. */
export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
