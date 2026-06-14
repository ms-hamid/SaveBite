import AdminLayout from "../../../components/admin/AdminLayout";

export const metadata = { title: "SaveBite Admin - Payout Management" };

export default function Page() {
  return (
    <AdminLayout>
<div className="flex-1 mt-[72px] p-page_padding bg-background overflow-y-auto">

  <div className="mb-section_gap flex justify-between items-end">
    <div>
      <h2 className="text-on-background mb-2 font-page-title text-page-title">Payout Management</h2>
      <p className="font-body-lg text-body-lg text-secondary">Manage and process merchant payouts.</p>
    </div>
    <button
      className="bg-primary-container text-on-primary rounded-lg px-6 py-2.5 font-label-md text-label-md flex items-center gap-2 hover:bg-primary transition-colors shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_10px_15px_-5px_rgba(0,0,0,0.03)]">
      <span className="material-symbols-outlined text-[20px]">download</span>
      Export Report
    </button>
  </div>

  <div className="grid grid-cols-2 gap-6 mb-section_gap">

    <div
      className="bg-surface-container-lowest rounded-2xl p-card_padding border border-outline-variant shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_10px_15px_-5px_rgba(0,0,0,0.03)] relative overflow-hidden group">
      <div
        className="absolute top-0 right-0 w-32 h-32 bg-surface-container-low rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500">
      </div>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="font-label-sm text-label-sm text-secondary mb-2 uppercase tracking-wider">Total Pending Payouts
          </p>
          <h3 className="font-display-lg text-display-lg text-on-surface">Rp 42.5M</h3>
        </div>
        <div
          className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined">pending_actions</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 font-label-sm text-label-sm text-secondary">
        <span className="text-error flex items-center"><span
            className="material-symbols-outlined text-[16px]">arrow_upward</span> 12%</span> vs last week
      </div>
    </div>


    <div
      className="bg-surface-container-lowest rounded-2xl p-card_padding border border-outline-variant shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_10px_15px_-5px_rgba(0,0,0,0.03)] relative overflow-hidden group">
      <div
        className="absolute top-0 right-0 w-32 h-32 bg-highlight rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500">
      </div>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="font-label-sm text-label-sm text-secondary mb-2 uppercase tracking-wider">Processed This Month
          </p>
          <h3 className="font-display-lg text-display-lg text-on-surface">Rp 128.4M</h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-highlight flex items-center justify-center text-primary-container">
          <span className="material-symbols-outlined">check_circle</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 font-label-sm text-label-sm text-secondary">
        <span className="text-primary-container flex items-center"><span
            className="material-symbols-outlined text-[16px]">arrow_upward</span> 24%</span> vs last month
      </div>
    </div>
  </div>

  <div
    className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_10px_15px_-5px_rgba(0,0,0,0.03)] flex flex-col">

    <div
      className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright rounded-t-2xl">
      <div className="flex gap-4 items-center">
        <div className="relative w-72">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
          <input
            className="w-full bg-surface-container-lowest text-on-surface border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-4 py-2 font-body-md text-body-md"
            placeholder="Search merchants..." type="text" />
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md">
          <span className="material-symbols-outlined text-[20px]">filter_list</span>
          Filter
        </button>
      </div>

      <div className="flex bg-surface-container-low p-1 rounded-lg"><button
          className="px-4 py-1.5 bg-surface-container-lowest text-primary rounded-md shadow-sm font-label-sm text-label-sm">All</button><button
          className="px-4 py-1.5 text-secondary hover:text-on-surface rounded-md font-label-sm text-label-sm transition-colors">Pending</button><button
          className="px-4 py-1.5 text-secondary hover:text-on-surface rounded-md font-label-sm text-label-sm transition-colors">Completed</button>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-bright">
            <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase tracking-wider">Merchant Name
            </th>
            <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase tracking-wider">Amount (IDR)
            </th>
            <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase tracking-wider">Period</th>
            <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase tracking-wider">Bank Details
            </th>
            <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase tracking-wider">Status</th>
            <th className="py-4 px-6 font-label-sm text-label-sm text-secondary uppercase tracking-wider text-right">
              Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
          <tr className="hover:bg-surface-container-low transition-colors group">
            <td className="py-4 px-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-md">
                  B1</div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Bakmi GM Thamrin</p>
                  <p className="font-body-sm text-body-sm text-secondary text-xs">ID: MER-2941</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-6 font-label-md text-label-md text-on-surface">Rp 4,250,000</td>
            <td className="py-4 px-6 font-body-md text-body-md text-secondary">Oct 1 - Oct 15</td>
            <td className="py-4 px-6">
              <p className="font-label-md text-label-md text-on-surface">BCA •••• 4921</p>
              <p className="font-body-sm text-body-sm text-secondary text-xs">PT Bakmi Gemilang</p>
            </td>
            <td className="py-4 px-6"><span
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-label-sm text-[11px] font-bold">Pending</span>
            </td>
            <td className="py-4 px-6 text-right"><button
                className="bg-primary-container text-on-primary hover:bg-primary px-4 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors shadow-sm">Process</button>
            </td>
          </tr>
          <tr className="hover:bg-surface-container-low transition-colors group">
            <td className="py-4 px-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-md">
                  SB</div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">SaladStop! Senayan</p>
                  <p className="font-body-sm text-body-sm text-secondary text-xs">ID: MER-8422</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-6 font-label-md text-label-md text-on-surface">Rp 1,820,000</td>
            <td className="py-4 px-6 font-body-md text-body-md text-secondary">Oct 16 - Oct 31</td>
            <td className="py-4 px-6">
              <p className="font-label-md text-label-md text-on-surface">Mandiri •••• 1102</p>
              <p className="font-body-sm text-body-sm text-secondary text-xs">SaladStop Indonesia</p>
            </td>
            <td className="py-4 px-6"><span
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-label-sm text-[11px] font-bold">Pending</span>
            </td>
            <td className="py-4 px-6 text-right"><button
                className="bg-primary-container text-on-primary hover:bg-primary px-4 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors shadow-sm">Process</button>
            </td>
          </tr>
          <tr className="hover:bg-surface-container-low transition-colors group">
            <td className="py-4 px-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-md">
                  KJ</div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Kopi Kenangan</p>
                  <p className="font-body-sm text-body-sm text-secondary text-xs">ID: MER-1109</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-6 font-label-md text-label-md text-on-surface">Rp 12,450,000</td>
            <td className="py-4 px-6 font-body-md text-body-md text-secondary">Oct 16 - Oct 31</td>
            <td className="py-4 px-6">
              <p className="font-label-md text-label-md text-on-surface">BCA •••• 8829</p>
              <p className="font-body-sm text-body-sm text-secondary text-xs">PT Bumi Berkah Boga</p>
            </td>
            <td className="py-4 px-6"><span
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-label-sm text-[11px] font-bold">Pending</span>
            </td>
            <td className="py-4 px-6 text-right"><button
                className="bg-primary-container text-on-primary hover:bg-primary px-4 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors shadow-sm">Process</button>
            </td>
          </tr>
          <tr className="hover:bg-surface-container-low transition-colors group">
            <td className="py-4 px-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md bg-surface-variant flex items-center justify-center text-on-surface-variant font-label-md">
                  CP</div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface">Chatime Plaza</p>
                  <p className="font-body-sm text-body-sm text-secondary text-xs">ID: MER-5531</p>
                </div>
              </div>
            </td>
            <td className="py-4 px-6 font-label-md text-label-md text-on-surface">Rp 3,100,000</td>
            <td className="py-4 px-6 font-body-md text-body-md text-secondary">Oct 1 - Oct 15</td>
            <td className="py-4 px-6">
              <p className="font-label-md text-label-md text-on-surface">BNI •••• 4410</p>
              <p className="font-body-sm text-body-sm text-secondary text-xs">PT Chatime Indo</p>
            </td>
            <td className="py-4 px-6"><span
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-highlight text-primary-container font-label-sm text-[11px] font-bold border border-highlight">Completed</span>
            </td>
            <td className="py-4 px-6 text-right"><button
                className="text-primary hover:bg-emerald-50 px-4 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-lowest rounded-b-2xl">
      <p className="font-body-sm text-body-sm text-secondary text-sm">Showing 1 to 4 of 24 entries</p>
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-secondary hover:bg-surface-container-low transition-colors disabled:opacity-50"
          disabled={true}>
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
        <button
          className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center font-label-sm text-label-sm">1</button>
        <button
          className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors font-label-sm text-label-sm">2</button>
        <button
          className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors font-label-sm text-label-sm">3</button>
        <span className="text-secondary px-1">...</span>
        <button
          className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-secondary hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</div>
<script>
  lucide.createIcons();
</script>
    </AdminLayout>
  );
}
