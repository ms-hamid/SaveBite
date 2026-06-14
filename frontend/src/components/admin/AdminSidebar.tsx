import Link from "next/link";

export type AdminSidebarMenuKey =
  | "dashboard"
  | "merchant-management"
  | "merchant-verification"
  | "customer-management"
  | "order-monitoring"
  | "payout-management"
  | "reports";

type SidebarItem = {
  key: AdminSidebarMenuKey;
  label: string;
  href: string;
  icon: string;
};

type AdminSidebarProps = {
  activeMenu?: AdminSidebarMenuKey;
  logoutHref?: string;
};

const sidebarItems: SidebarItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/admin",
    icon: "dashboard",
  },
  {
    key: "merchant-management",
    label: "Merchant Management",
    href: "/admin/merchant",
    icon: "storefront",
  },
  {
    key: "merchant-verification",
    label: "Merchant Verification",
    href: "/admin/merchant/verification",
    icon: "verified",
  },
  {
    key: "customer-management",
    label: "Customer Management",
    href: "/admin/customer",
    icon: "group",
  },
  {
    key: "order-monitoring",
    label: "Order Monitoring",
    href: "/admin/order",
    icon: "receipt_long",
  },
  {
    key: "payout-management",
    label: "Payout Management",
    href: "/admin/payout",
    icon: "payments",
  },
  {
    key: "reports",
    label: "Reports",
    href: "/admin/reports",
    icon: "monitoring",
  },
];

export default function AdminSidebar({
  activeMenu = "dashboard",
  logoutHref = "/logout",
}: AdminSidebarProps) {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col py-6 z-50">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <span className="material-symbols-outlined text-2xl">eco</span>
          </div>

          <div>
            <h1 className="font-bold text-xl text-slate-900 leading-none">
              SaveBite
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = activeMenu === item.key;

            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={
                    isActive
                      ? "flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 font-semibold text-sm rounded-lg border-l-4 border-emerald-600"
                      : "flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all font-medium text-sm"
                  }
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto px-4 pt-6 border-t border-slate-100 space-y-1">
        <Link
          href={logoutHref}
          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium text-sm"
        >
          <span className="material-symbols-outlined text-[22px]">
            logout
          </span>
          Logout
        </Link>
      </div>
    </aside>
  );
}