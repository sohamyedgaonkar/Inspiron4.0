import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
// import { useAuth } from "@/hooks/use-auth"; // You'll need to implement this hook

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // For now, let's make a simple version that always allows access
  // Later you can add proper authentication checks
  return <>{children}</>;

  // When you implement authentication, you can use this pattern:
  /*
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
  */
};