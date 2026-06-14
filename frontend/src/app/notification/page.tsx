"use client";

import { useState } from "react";
import CustomerNavbar from "../../components/navbar/customer_navbar";

type Notification = {
  id: number;
  title: string;
  message: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  time: string;
  section: string;
  isRead: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Order Ready",
    message: 'Your order from Green Leaf Bakery is ready for pickup.',
    icon: "shopping_bag",
    iconBgColor: "bg-primary/10 dark:bg-primary/20",
    iconColor: "text-primary",
    time: "2m ago",
    section: "Today",
    isRead: false,
  },
  {
    id: 2,
    title: "Impact Update",
    message: "You saved 2.3kg of food this month! Keep up the great work.",
    icon: "eco",
    iconBgColor: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    time: "2h ago",
    section: "Today",
    isRead: false,
  },
  {
    id: 3,
    title: "New Deal Available",
    message: "Fresh pastries at 40% off - limited time offer!",
    icon: "local_offer",
    iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    time: "Yesterday",
    section: "Yesterday",
    isRead: true,
  },
  {
    id: 4,
    title: "New Deal Available",
    message: "Fresh pastries at 40% off - limited time offer!",
    icon: "local_offer",
    iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    time: "Yesterday",
    section: "Yesterday",
    isRead: true,
  },
  {
    id: 5,
    title: "New Deal Available",
    message: "Fresh pastries at 40% off - limited time offer!",
    icon: "local_offer",
    iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    time: "Yesterday",
    section: "Yesterday",
    isRead: true,
  },
  {
    id: 6,
    title: "New Deal Available",
    message: "Fresh pastries at 40% off - limited time offer!",
    icon: "local_offer",
    iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    time: "Yesterday",
    section: "Yesterday",
    isRead: true,
  },
  {
    id: 7,
    title: "New Deal Available",
    message: "Fresh pastries at 40% off - limited time offer!",
    icon: "local_offer",
    iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    time: "Yesterday",
    section: "Yesterday",
    isRead: true,
  },
  {
    id: 8,
    title: "New Deal Available",
    message: "Fresh pastries at 40% off - limited time offer!",
    icon: "local_offer",
    iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    time: "Yesterday",
    section: "Yesterday",
    isRead: true,
  },
  {
    id: 9,
    title: "New Deal Available",
    message: "Fresh pastries at 40% off - limited time offer!",
    icon: "local_offer",
    iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    time: "Yesterday",
    section: "Yesterday",
    isRead: true,
  },

];

export default function NotificationPage() {
  const [hasNotification, setHasNotification] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(hasNotification ? mockNotifications : []);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const groupedNotifications = notifications.reduce(
    (acc, notif) => {
      if (!acc[notif.section]) {
        acc[notif.section] = [];
      }
      acc[notif.section].push(notif);
      return acc;
    },
    {} as Record<string, Notification[]>
  );

  return (
    <div className="w-full max-w-md bg-white dark:bg-surface-dark h-full min-h-screen relative flex flex-col shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-gray-300 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-slate-900 dark:text-slate-100">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h1>
        {notifications.length > 0 ? (
          <button
            onClick={markAllAsRead}
            className="text-primary text-sm font-semibold hover:text-primary-dark transition-colors"
          >
            Mark all as read
          </button>
        ) : (
          <button className="text-slate-300 text-sm font-semibold cursor-not-allowed opacity-50">
            Mark all as read
          </button>
        )}
      </header>

      {/* Main Content */}
        {notifications.length === 0 ? (<>
          <main className="h-full flex-grow flex flex-col items-center justify-center px-6 text-center"
            data-purpose="empty-state-container">

          <div className="mb-8 relative" data-purpose="illustration">
            {/* <!-- Minimalist Leaf/Bell Composite Graphic --> */}
            <div className="w-32 h-32 bg-savebite-lightGreen rounded-full flex items-center justify-center mx-auto opacity-60">
              <svg className="h-16 w-16 text-savebite-green" fill="none" stroke="currentColor" stroke-width="1.5"
                viewBox={"0 0 24 24"} xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                  stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            {/* <!-- Small decorative leaf element --> */}
            <div className="absolute -top-2 -right-2">
              <svg className="text-savebite-green" fill="none" height="32" viewBox="0 0 24 24" width="32"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C12 3 12 11 4 11C4 11 12 13 12 21C12 21 12 13 20 13C20 13 12 11 12 3Z" fill="currentColor"
                  fill-opacity="0.3"></path>
              </svg>
            </div>
          </div>
          {/* <!-- Text Information --> */}
          <div className="max-w-xs">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No notifications yet</h2>
            <p className="text-slate-500 text-base leading-relaxed">
              We’ll notify you when something important happens.
            </p>
          </div>
          </main>
        </>
          // Empty state
        ) : (
          // Notifications list
          <>
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">

            {Object.entries(groupedNotifications).map(([section, notifs]) => (
              <div key={section}>
                <div className="px-4 pt-6 pb-2">
                  <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {section}
                  </h2>
                </div>
                {notifs.map((notif) => (
                  <div
                    key={notif.id}
                    className="group relative flex items-start gap-4 p-4 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-gray-800/50 cursor-pointer"
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full ${notif.iconBgColor} flex items-center justify-center ${notif.iconColor}`}
                    >
                      <span className="material-symbols-outlined">{notif.icon}</span>
                    </div>
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                        {notif.title}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">
                        {notif.message}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
                        {notif.time}
                      </p>
                    </div>
                    <div className="flex items-center text-slate-300 ml-2">
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            </main>
          </>
        )}

      {/* Bottom Navigation */}
      <CustomerNavbar active_tab=""/>
    </div>
  );
}
