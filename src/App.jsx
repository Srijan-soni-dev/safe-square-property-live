import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AppRoutes from "@/routes/AppRoutes";
import EnvWarning from "@/components/common/EnvWarning";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function App() {
  if (!isSupabaseConfigured) return <EnvWarning />;

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
