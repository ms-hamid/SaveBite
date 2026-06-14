import AdminLayout from "../../../../components/admin/AdminLayout";

export const metadata = { title: "SaveBite Admin - Payout Detail" };

export default function Page() {
  return (
    <AdminLayout>


      <main className="flex-1 p-gutter overflow-y-auto">

      <nav className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm mb-unit-lg">
      <a className="hover:text-primary transition-colors" href="#">Payout Management</a>
      <span className="material-symbols-outlined text-sm">chevron_right</span>
      <span className="text-on-surface font-medium">Payout Detail</span>
      </nav>

      <div className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30 mb-gutter flex flex-col md:flex-row justify-between items-start md:items-end gap-unit-md">
      <div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Transfer Reference: #TRX-9982-SB</p>
      <h2 className="font-page-title-mobile md:font-page-title text-page-title-mobile md:text-page-title text-on-surface">The Green Bowl Cafe</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Period: Oct 1 - Oct 7, 2023</p>
      </div>
      <div className="flex flex-col items-end gap-3">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning-container text-on-warning-container font-label-bold text-label-bold">
      <span className="material-symbols-outlined text-[16px]">pending</span>
                              Pending
                          </div>
      <div className="text-right">
      <p className="font-caption text-caption text-on-surface-variant mb-0.5">Total Payout Amount</p>
      <p className="font-section-title text-section-title text-primary">Rp 4.250.000</p>
      </div>
      <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-bold text-label-bold hover:bg-primary/90 transition-colors shadow-sm">Mark as Completed</button>
      </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

      <div className="lg:col-span-8 flex flex-col gap-gutter">

      <section className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30">
      <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-unit-md flex items-center gap-2">
      <span className="material-symbols-outlined text-primary">store</span>
                                  Merchant Information
                              </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
      <div>
      <p className="font-caption text-caption text-on-surface-variant">Merchant Name</p>
      <p className="font-body-medium text-body-medium text-on-surface">The Green Bowl Cafe</p>
      </div>
      <div>
      <p className="font-caption text-caption text-on-surface-variant">Merchant ID</p>
      <p className="font-body-medium text-body-medium text-on-surface">MER-77A-21X</p>
      </div>
      <div className="md:col-span-2 mt-2 pt-4 border-t border-outline-variant/50">
      <p className="font-caption text-caption text-on-surface-variant">Business Address</p>
      <p className="font-body-default text-body-default text-on-surface">Jl. Sudirman No. 45, Senayan, Kebayoran Baru, Jakarta Selatan 12190</p>
      </div>
      </div>
      </section>

      <section className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30">
      <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-unit-md flex items-center gap-2">
      <span className="material-symbols-outlined text-primary">account_balance</span>
                                  Settlement Bank Account
                              </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
      <div>
      <p className="font-caption text-caption text-on-surface-variant">Bank Name</p>
      <p className="font-body-medium text-body-medium text-on-surface">Bank Central Asia (BCA)</p>
      </div>
      <div>
      <p className="font-caption text-caption text-on-surface-variant">Account Holder Name</p>
      <p className="font-body-medium text-body-medium text-on-surface">PT Green Bowl Indonesia</p>
      </div>
      <div>
      <p className="font-caption text-caption text-on-surface-variant">Account Number</p>
      <p className="font-body-medium text-body-medium text-on-surface font-mono">**** **** 8821</p>
      </div>
      </div>
      </section>

      <section className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30">
      <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-unit-md flex items-center gap-2">
      <span className="material-symbols-outlined text-primary">payments</span>
                                  Payout Information
                              </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
      <div>
      <p className="font-caption text-caption text-on-surface-variant">Payout Amount</p>
      <p className="font-body-medium text-body-medium text-on-surface">Rp 4.250.000</p>
      </div>
      <div>
      <p className="font-caption text-caption text-on-surface-variant">Payout Period</p>
      <p className="font-body-medium text-body-medium text-on-surface">Oct 1 - Oct 7, 2023</p>
      </div>
      <div>
      <p className="font-caption text-caption text-on-surface-variant">Created Date</p>
      <p className="font-body-medium text-body-medium text-on-surface">Oct 1, 2023</p>
      </div>
      </div>
      </section>

      <section className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30">
      <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-unit-sm">Admin Notes</h3>
      <p className="font-caption text-caption text-on-surface-variant mb-unit-md">Internal log for this payout transaction.</p>
      <div className="flex flex-col gap-unit-md">
      <div>
      <label className="block font-caption text-caption text-on-surface-variant mb-1">Internal Notes</label>
      <textarea className="w-full rounded-lg border border-outline-variant p-3 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none bg-surface-bright" placeholder="Add a note..." rows={3}></textarea>
      </div>
      <div>
      <label className="block font-caption text-caption text-on-surface-variant mb-1">Transfer Reference (if external)</label>
      <input className="w-full rounded-lg border border-outline-variant p-3 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-bright" placeholder="Enter bank reference number..." type="text" />
      </div>
      </div>
      <div className="flex justify-end mt-4">
      <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-bold text-label-bold hover:bg-primary/90 transition-colors">Save Note</button>
      </div>
      </section>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-gutter">

      <section className="bg-surface-container-lowest rounded-lg p-gutter shadow-sm border border-outline-variant/30">
      <h3 className="font-section-title-sm text-section-title-sm text-on-surface mb-unit-lg">Status History</h3>
      <ul className="space-y-4">
      <li className="flex items-start gap-3">
      <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0"></div>
      <div>
      <p className="font-label-bold text-label-bold text-on-surface">Created</p>
      <p className="font-caption text-caption text-on-surface-variant">Oct 1, 2023</p>
      </div>
      </li>
      </ul>
      </section>
      </div>
      </div>
      </main>
      </AdminLayout>

  );
}
