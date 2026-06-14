'use client';

import { useEffect } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';

export default function Page() {

  useEffect(() => {
    const button = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-nav-overlay');
    if (!button || !sidebar || !overlay) return;

    const toggleMenu = () => {
      if (sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
      } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
      }
    };
    const closeMenu = () => {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    };

    button.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    return () => {
      button.removeEventListener('click', toggleMenu);
      overlay.removeEventListener('click', closeMenu);
    };
  }, []);

  return (
    <AdminLayout>


      <main className="flex-1 p-unit-md md:p-unit-lg lg:p-unit-xl overflow-y-auto">

      <div className="mb-unit-xl">
      <h2 className="font-section-title text-section-title text-on-surface mb-unit-xs">Verification Queue</h2>
      <p className="font-body-default text-body-default text-on-surface-variant">Review and approve new merchant registrations to maintain platform quality.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-unit-lg mb-unit-xl">
      <div className="bg-surface-container-lowest rounded-2xl p-unit-lg shadow-sm border border-outline-variant/50 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-container rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
      <p className="font-label-bold text-label-bold text-on-surface-variant mb-unit-sm uppercase tracking-wider">Total Pending</p>
      <div className="flex items-baseline gap-unit-md">
      <h3 className="font-page-title text-page-title text-on-surface">142</h3>
      <span className="flex items-center font-label-bold text-label-bold text-primary-container">
      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                                  +12 today
                              </span>
      </div>
      </div>
      <div className="bg-surface-container-lowest rounded-2xl p-unit-lg shadow-sm border border-outline-variant/50 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-error-container rounded-full opacity-30 group-hover:scale-110 transition-transform duration-500"></div>
      <p className="font-label-bold text-label-bold text-error mb-unit-sm uppercase tracking-wider">Urgent Reviews</p>
      <div className="flex items-baseline gap-unit-md">
      <h3 className="font-page-title text-page-title text-on-surface">18</h3>
      <span className="flex items-center font-label-bold text-label-bold text-error">
      <span className="material-symbols-outlined text-[16px]">warning</span>
                                  SLA Risk
                              </span>
      </div>
      </div>
      <div className="bg-surface-container-lowest rounded-2xl p-unit-lg shadow-sm border border-outline-variant/50 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-container rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
      <p className="font-label-bold text-label-bold text-on-surface-variant mb-unit-sm uppercase tracking-wider">Approved Today</p>
      <div className="flex items-baseline gap-unit-md">
      <h3 className="font-page-title text-page-title text-on-surface">45</h3>
      <span className="flex items-center font-label-bold text-label-bold text-on-surface-variant">
      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                  Avg time: 4h
                              </span>
      </div>
      </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/50 overflow-hidden">
      <div className="flex justify-between items-center p-unit-md border-b border-outline-variant/50 bg-surface-container-lowest">
      <h3 className="font-section-title-sm text-section-title-sm text-on-surface">Pending Applications</h3>
      <button className="flex items-center gap-unit-xs font-label-bold text-label-bold text-primary hover:bg-surface-container px-unit-md py-unit-sm rounded-lg transition-colors border border-outline-variant">
      <span className="material-symbols-outlined text-[18px]">filter_list</span>
                              Filter
                          </button>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
      <thead>
      <tr className="bg-surface-bright border-b border-outline-variant/50">
      <th className="py-unit-md px-unit-lg font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Merchant Name</th>
      <th className="py-unit-md px-unit-lg font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Submission Date</th>
      <th className="py-unit-md px-unit-lg font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">SLA Status</th>
      <th className="py-unit-md px-unit-lg font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-right">Action</th>
      </tr>
      </thead>
      <tbody className="font-body-default text-body-default text-on-surface">

      <tr className="border-b border-outline-variant/30 hover:bg-surface transition-colors">
      <td className="py-unit-md px-unit-lg">
      <div className="flex items-center gap-unit-sm">
      <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary font-bold">G</div>
      <span className="font-body-medium text-body-medium">Green Bites Cafe</span>
      </div>
      </td>
      <td className="py-unit-md px-unit-lg text-on-surface-variant">Oct 24, 2023 - 09:15 AM</td>
      <td className="py-unit-md px-unit-lg">
      <span className="inline-flex items-center px-2 py-1 rounded-full bg-error-container text-error font-label-bold text-label-bold">
      <span className="w-2 h-2 rounded-full bg-error mr-2"></span>
                                              Overdue
                                          </span>
      </td>
      <td className="py-unit-md px-unit-lg text-right">
      <button className="bg-[#10b981] text-on-primary px-unit-lg py-2 rounded-lg font-label-bold text-label-bold hover:opacity-90 transition-colors shadow-sm">Review</button>
      </td>
      </tr>

      <tr className="border-b border-outline-variant/30 hover:bg-surface transition-colors">
      <td className="py-unit-md px-unit-lg">
      <div className="flex items-center gap-unit-sm">
      <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary font-bold">T</div>
      <span className="font-body-medium text-body-medium">The Daily Loaf</span>
      </div>
      </td>
      <td className="py-unit-md px-unit-lg text-on-surface-variant">Oct 24, 2023 - 11:30 AM</td>
      <td className="py-unit-md px-unit-lg">
      <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#fef3c7] text-[#92400e] font-label-bold text-label-bold">
      <span className="w-2 h-2 rounded-full bg-[#d97706] mr-2"></span>
                                              Approaching
                                          </span>
      </td>
      <td className="py-unit-md px-unit-lg text-right">
      <button className="bg-[#10b981] text-on-primary px-unit-lg py-2 rounded-lg font-label-bold text-label-bold hover:opacity-90 transition-colors shadow-sm">Review</button>
      </td>
      </tr>

      <tr className="border-b border-outline-variant/30 hover:bg-surface transition-colors">
      <td className="py-unit-md px-unit-lg">
      <div className="flex items-center gap-unit-sm">
      <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary font-bold">S</div>
      <span className="font-body-medium text-body-medium">Sushi Surplus</span>
      </div>
      </td>
      <td className="py-unit-md px-unit-lg text-on-surface-variant">Oct 24, 2023 - 02:45 PM</td>
      <td className="py-unit-md px-unit-lg">
      <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-bold text-label-bold">
      <span className="w-2 h-2 rounded-full bg-primary-container mr-2"></span>
                                              On Track
                                          </span>
      </td>
      <td className="py-unit-md px-unit-lg text-right">
      <button className="bg-[#10b981] text-on-primary px-unit-lg py-2 rounded-lg font-label-bold text-label-bold hover:opacity-90 transition-colors shadow-sm">Review</button>
      </td>
      </tr>

      <tr className="border-b border-outline-variant/30 hover:bg-surface transition-colors">
      <td className="py-unit-md px-unit-lg">
      <div className="flex items-center gap-unit-sm">
      <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary font-bold">P</div>
      <span className="font-body-medium text-body-medium">Pastry Perfect</span>
      </div>
      </td>
      <td className="py-unit-md px-unit-lg text-on-surface-variant">Oct 24, 2023 - 04:10 PM</td>
      <td className="py-unit-md px-unit-lg">
      <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-bold text-label-bold">
      <span className="w-2 h-2 rounded-full bg-primary-container mr-2"></span>
                                              On Track
                                          </span>
      </td>
      <td className="py-unit-md px-unit-lg text-right">
      <button className="bg-[#10b981] text-on-primary px-unit-lg py-2 rounded-lg font-label-bold text-label-bold hover:opacity-90 transition-colors shadow-sm">Review</button>
      </td>
      </tr>
      </tbody>
      </table>
      </div>

      <div className="flex items-center justify-between p-unit-md bg-surface-container-lowest border-t border-outline-variant/50">
      <p className="font-body-default text-body-default text-on-surface-variant">Showing 1 to 4 of 142 entries</p>
      <div className="flex items-center gap-unit-sm">
      <button className="p-1 rounded text-outline-variant cursor-not-allowed" disabled={true}>
      <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button className="w-8 h-8 rounded-full bg-secondary-container text-primary font-label-bold text-label-bold flex items-center justify-center">1</button>
      <button className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant font-label-bold text-label-bold flex items-center justify-center transition-colors">2</button>
      <button className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant font-label-bold text-label-bold flex items-center justify-center transition-colors">3</button>
      <span className="text-on-surface-variant">...</span>
      <button className="p-1 rounded text-on-surface hover:bg-surface-container transition-colors">
      <span className="material-symbols-outlined">chevron_right</span>
      </button>
      </div>
      </div>
      </div>
      </main>
      <script>
              document.getElementById('mobile-menu-btn').addEventListener('click', function() &#123;
                  const sidebar = document.getElementById('sidebar');
                  const overlay = document.getElementById('mobile-nav-overlay');

                  if (sidebar.classList.contains('-translate-x-full')) &#123;
                      sidebar.classList.remove('-translate-x-full');
                      overlay.classList.remove('hidden');
                  &#125; else &#123;
                      sidebar.classList.add('-translate-x-full');
                      overlay.classList.add('hidden');
                  &#125;
              &#125;);

              document.getElementById('mobile-nav-overlay').addEventListener('click', function() &#123;
                  document.getElementById('sidebar').classList.add('-translate-x-full');
                  this.classList.add('hidden');
              &#125;);
          </script>
  </AdminLayout>
  );
}
