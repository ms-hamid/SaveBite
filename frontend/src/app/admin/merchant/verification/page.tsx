"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";

import { getMerchantsPendingList } from "@/services/user";
import type { Merchant } from "@/types/merchant";
import Link from "next/link";



export default function Page() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 10;

  async function loadMerchants() {
    try {
      setLoading(true);
      setErrorMessage("");
  
      const data = await getMerchantsPendingList();
  
      setMerchants(data.data.merchants ?? []);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load merchants");
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
      loadMerchants();
  }, []);


  const totalPages = Math.ceil(
    merchants.length / ITEMS_PER_PAGE
  );
  
  const paginatedMerchants = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
  
    return merchants.slice(start, end);
  }, [merchants, currentPage]);


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
  {loading ? (
    <tr>
      <td
        colSpan={4}
        className="py-unit-lg px-unit-lg text-center"
      >
        Loading...
      </td>
    </tr>
  ) : errorMessage ? (
    <tr>
      <td
        colSpan={4}
        className="py-unit-lg px-unit-lg text-center text-error"
      >
        {errorMessage}
      </td>
    </tr>
  ) : paginatedMerchants.length === 0 ? (
    <tr>
      <td
        colSpan={4}
        className="py-unit-lg px-unit-lg text-center"
      >
        No pending merchant found.
      </td>
    </tr>
  ) : (
    paginatedMerchants.map((merchant) => (
      <tr
        key={merchant.user_id}
        className="border-b border-outline-variant/30 hover:bg-surface transition-colors"
      >
        <td className="py-unit-md px-unit-lg">
          <div className="flex items-center gap-unit-sm">
            <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary font-bold">
              {merchant.merchant_name?.charAt(0).toUpperCase() ?? "M"}
            </div>

            <span className="font-body-medium text-body-medium">
              {merchant.merchant_name ?? "-"}
            </span>
          </div>
        </td>

        <td className="py-unit-md px-unit-lg text-on-surface-variant">
          -
        </td>

        <td className="py-unit-md px-unit-lg">
          <span
            className={`
              inline-flex items-center px-2 py-1 rounded-full font-label-bold text-label-bold
              ${
                merchant.kyc_status === "rejected"
                  ? "bg-error-container text-error"
                  : merchant.kyc_status === "pending"
                  ? "bg-[#fef3c7] text-[#92400e]"
                  : "bg-secondary-container text-on-secondary-container"
              }
            `}
          >
            <span
              className={`
                w-2 h-2 rounded-full mr-2
                ${
                  merchant.kyc_status === "rejected"
                    ? "bg-error"
                    : merchant.kyc_status === "pending"
                    ? "bg-[#d97706]"
                    : "bg-primary-container"
                }
              `}
            />

            {merchant.kyc_status ?? "pending"}
          </span>
        </td>

        <td className="py-unit-md px-unit-lg text-right">
          <Link href={`/admin/merchant/${merchant.user_id}/verify`} className="bg-[#10b981] text-on-primary px-unit-lg py-2 rounded-lg font-label-bold text-label-bold hover:opacity-90 transition-colors shadow-sm">
            Review
          </Link>
        </td>
      </tr>
    ))
  )}
</tbody>
      </table>
      </div>

<div className="flex items-center justify-between p-unit-md bg-surface-container-lowest border-t border-outline-variant/50">
<p className="font-body-default text-body-default text-on-surface-variant">
  Showing{" "}
  {merchants.length === 0
    ? 0
    : (currentPage - 1) * ITEMS_PER_PAGE + 1}
  {" "}to{" "}
  {Math.min(
    currentPage * ITEMS_PER_PAGE,
    merchants.length
  )}
  {" "}of{" "}
  {merchants.length}
  {" "}entries
</p>

<div className="flex items-center gap-unit-sm">
  <button
    className="p-1 rounded"
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage((prev) => prev - 1)
    }
  >
    <span className="material-symbols-outlined">
      chevron_left
    </span>
  </button>

  {Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).map((page) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        currentPage === page
          ? "bg-secondary-container text-primary font-label-bold"
          : "hover:bg-surface-container"
      }`}
    >
      {page}
    </button>
  ))}

  <button
    className="p-1 rounded"
    disabled={currentPage === totalPages}
    onClick={() =>
      setCurrentPage((prev) => prev + 1)
    }
  >
    <span className="material-symbols-outlined">
      chevron_right
    </span>
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
