import type { ReactNode } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar, { AdminSidebarMenuKey } from "./AdminSidebar";

type AdminLayoutProps = {
  children: ReactNode;
  activeMenu?: AdminSidebarMenuKey;
};

export default function AdminLayout({
  children,
  activeMenu = "dashboard",
}: AdminLayoutProps) {
  return (
    <div className="bg-background text-on-background font-body-default flex min-h-screen">
      <AdminSidebar activeMenu={activeMenu} />

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <AdminNavbar />

        <main className="p-gutter flex-1 flex flex-col gap-unit-lg">
          {children}
        </main>
      </div>
    </div>
  );
}