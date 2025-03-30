import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
