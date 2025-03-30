
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* No navigation for public pages */}
      <main>
        <Outlet /> {/* This renders the child routes */}
      </main>
    </div>
  );
}