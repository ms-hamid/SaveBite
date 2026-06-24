import AdminLayout from "../../components/admin/AdminLayout";


export default function Page() {
  return (
    <AdminLayout>
      <div className="max-w-container-max mx-auto space-y-unit-xl">
        <div>
          <h2 className="font-section-title text-section-title text-on-background">
            Platform Overview
          </h2>
          <p className="font-body-default text-body-default text-on-surface-variant mt-1">
            Real-time metrics and operational status.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-md">
          <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="flex justify-between items-start mb-unit-md">
              <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                Total Orders
              </span>

              <div className="w-8 h-8 rounded-full bg-highlight flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">
                  shopping_bag
                </span>
              </div>
            </div>

            <div>
              <div className="font-section-title text-section-title text-on-background">
                12,450
              </div>

              <div className="flex items-center mt-unit-sm">
                <span className="material-symbols-outlined text-primary text-[16px] mr-1">
                  trending_up
                </span>
                <span className="font-label-bold text-label-bold text-primary">
                  +8.2%
                </span>
                <span className="font-label-bold text-label-bold text-on-surface-variant ml-2 font-normal">
                  vs last week
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="flex justify-between items-start mb-unit-md">
              <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                Food Saved (kg)
              </span>

              <div className="w-8 h-8 rounded-full bg-highlight flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">
                  eco
                </span>
              </div>
            </div>

            <div>
              <div className="font-section-title text-section-title text-on-background">
                8,230
              </div>

              <div className="flex items-center mt-unit-sm">
                <span className="material-symbols-outlined text-primary text-[16px] mr-1">
                  trending_up
                </span>
                <span className="font-label-bold text-label-bold text-primary">
                  +12.4%
                </span>
                <span className="font-label-bold text-label-bold text-on-surface-variant ml-2 font-normal">
                  vs last week
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="flex justify-between items-start mb-unit-md">
              <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                Active Merchants
              </span>

              <div className="w-8 h-8 rounded-full bg-highlight flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">
                  store
                </span>
              </div>
            </div>

            <div>
              <div className="font-section-title text-section-title text-on-background">
                342
              </div>

              <div className="flex items-center mt-unit-sm">
                <span className="material-symbols-outlined text-primary text-[16px] mr-1">
                  trending_up
                </span>
                <span className="font-label-bold text-label-bold text-primary">
                  +4.1%
                </span>
                <span className="font-label-bold text-label-bold text-on-surface-variant ml-2 font-normal">
                  vs last week
                </span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="flex justify-between items-start mb-unit-md">
              <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                Platform Revenue
              </span>

              <div className="w-8 h-8 rounded-full bg-highlight flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">
                  attach_money
                </span>
              </div>
            </div>

            <div>
              <div className="font-section-title text-section-title text-on-background">
                $45,200
              </div>

              <div className="flex items-center mt-unit-sm">
                <span className="material-symbols-outlined text-primary text-[16px] mr-1">
                  trending_up
                </span>
                <span className="font-label-bold text-label-bold text-primary">
                  +15.3%
                </span>
                <span className="font-label-bold text-label-bold text-on-surface-variant ml-2 font-normal">
                  vs last week
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-unit-md">
          <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-unit-lg">
              <h3 className="font-body-medium text-body-medium font-semibold text-on-background">
                Order Volume Trends
              </h3>

              <button className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-[20px]">
                  more_vert
                </span>
              </button>
            </div>

            <div className="flex-1 bg-surface-container-low rounded-lg flex items-center justify-center border border-dashed border-outline-variant relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, #10b77f 10px, #10b77f 20px)",
                }}
              />

              <span className="font-body-sm text-body-sm text-on-surface-variant relative z-10 bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant shadow-sm">
                [Chart Visualization: Order Volume]
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-unit-lg">
              <h3 className="font-body-medium text-body-medium font-semibold text-on-background">
                Food Saved Trends (kg)
              </h3>

              <button className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-[20px]">
                  more_vert
                </span>
              </button>
            </div>

            <div className="flex-1 bg-surface-container-low rounded-lg flex items-center justify-center border border-dashed border-outline-variant relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, transparent, transparent 10px, #10b77f 10px, #10b77f 20px)",
                }}
              />

              <span className="font-body-sm text-body-sm text-on-surface-variant relative z-10 bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant shadow-sm">
                [Chart Visualization: Food Saved]
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container min-h-[250px] flex flex-col">
            <div className="flex justify-between items-center mb-unit-lg">
              <h3 className="font-body-medium text-body-medium font-semibold text-on-background">
                Merchant Growth
              </h3>
            </div>

            <div className="flex-1 bg-surface-container-low rounded-lg flex items-center justify-center border border-dashed border-outline-variant">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                [Chart: Merchant Growth]
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container min-h-[250px] flex flex-col">
            <div className="flex justify-between items-center mb-unit-lg">
              <h3 className="font-body-medium text-body-medium font-semibold text-on-background">
                Customer Growth
              </h3>
            </div>

            <div className="flex-1 bg-surface-container-low rounded-lg flex items-center justify-center border border-dashed border-outline-variant">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                [Chart: Customer Growth]
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-unit-md">
          <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container flex flex-col">
            <div className="flex justify-between items-center mb-unit-md pb-unit-sm border-b border-surface-container">
              <h3 className="font-body-medium text-body-medium font-semibold text-on-background flex items-center gap-2">
                Pending Verifications
                <span className="bg-amber-soft text-amber-icon font-label-bold text-label-bold px-2 py-0.5 rounded-full">
                  3
                </span>
              </h3>

              <button className="text-primary font-label-bold text-label-bold hover:underline">
                View All
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between gap-unit-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">
                      bakery_dining
                    </span>
                  </div>

                  <div>
                    <div className="font-body-sm text-body-sm font-medium text-on-background">
                      The Daily Loaf
                    </div>
                    <div className="font-label-bold text-label-bold text-on-surface-variant font-normal">
                      Submitted 2h ago
                    </div>
                  </div>
                </div>

                <button className="px-3 py-1.5 border border-primary text-primary rounded-lg font-label-bold text-label-bold hover:bg-secondary-container transition-colors">
                  Review
                </button>
              </div>

              <div className="flex items-center justify-between gap-unit-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">
                      restaurant
                    </span>
                  </div>

                  <div>
                    <div className="font-body-sm text-body-sm font-medium text-on-background">
                      Green Bowl Co.
                    </div>
                    <div className="font-label-bold text-label-bold text-on-surface-variant font-normal">
                      Submitted 5h ago
                    </div>
                  </div>
                </div>

                <button className="px-3 py-1.5 border border-primary text-primary rounded-lg font-label-bold text-label-bold hover:bg-secondary-container transition-colors">
                  Review
                </button>
              </div>

              <div className="flex items-center justify-between gap-unit-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">
                      local_cafe
                    </span>
                  </div>

                  <div>
                    <div className="font-body-sm text-body-sm font-medium text-on-background">
                      Morning Brew
                    </div>
                    <div className="font-label-bold text-label-bold text-on-surface-variant font-normal">
                      Submitted 1d ago
                    </div>
                  </div>
                </div>

                <button className="px-3 py-1.5 border border-primary text-primary rounded-lg font-label-bold text-label-bold hover:bg-secondary-container transition-colors">
                  Review
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container flex flex-col">
            <div className="flex justify-between items-center mb-unit-md pb-unit-sm border-b border-surface-container">
              <h3 className="font-body-medium text-body-medium font-semibold text-on-background flex items-center gap-2">
                Pending Payouts
                <span className="bg-tertiary-fixed text-on-tertiary-container font-label-bold text-label-bold px-2 py-0.5 rounded-full">
                  3
                </span>
              </h3>

              <button className="text-primary font-label-bold text-label-bold hover:underline">
                View All
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between gap-unit-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant font-label-bold text-label-bold">
                    SS
                  </div>

                  <div>
                    <div className="font-body-sm text-body-sm font-medium text-on-background">
                      Sushi Station
                    </div>
                    <div className="font-label-bold text-label-bold text-on-surface-variant font-normal">
                      $450.00 • Due Today
                    </div>
                  </div>
                </div>

                <button className="px-3 py-1.5 bg-primary text-on-primary rounded-lg font-label-bold text-label-bold hover:bg-primary-dark transition-colors">
                  Process
                </button>
              </div>

              <div className="flex items-center justify-between gap-unit-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant font-label-bold text-label-bold">
                    PP
                  </div>

                  <div>
                    <div className="font-body-sm text-body-sm font-medium text-on-background">
                      Pizza Palace
                    </div>
                    <div className="font-label-bold text-label-bold text-on-surface-variant font-normal">
                      $320.50 • Due Tomorrow
                    </div>
                  </div>
                </div>

                <button className="px-3 py-1.5 bg-primary text-on-primary rounded-lg font-label-bold text-label-bold hover:bg-primary-dark transition-colors">
                  Process
                </button>
              </div>

              <div className="flex items-center justify-between gap-unit-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant font-label-bold text-label-bold">
                    VF
                  </div>

                  <div>
                    <div className="font-body-sm text-body-sm font-medium text-on-background">
                      Vegan Fresh
                    </div>
                    <div className="font-label-bold text-label-bold text-on-surface-variant font-normal">
                      $185.20 • Due in 2 days
                    </div>
                  </div>
                </div>

                <button className="px-3 py-1.5 bg-primary text-on-primary rounded-lg font-label-bold text-label-bold hover:bg-primary-dark transition-colors">
                  Process
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[16px] p-unit-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-surface-container flex flex-col">
            <div className="flex justify-between items-center mb-unit-md pb-unit-sm border-b border-surface-container">
              <h3 className="font-body-medium text-body-medium font-semibold text-on-background">
                Recent Activity
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-surface-container z-0" />

              <div className="space-y-4 relative z-10">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-highlight border-2 border-surface-container-lowest flex items-center justify-center text-primary-content shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">
                      check_circle
                    </span>
                  </div>

                  <div>
                    <div className="font-body-sm text-body-sm text-on-background">
                      <span className="font-semibold">Merchant Approved:</span>{" "}
                      Bakery Bliss
                    </div>
                    <div className="font-label-bold text-label-bold text-on-surface-variant font-normal">
                      10 mins ago by Admin Sarah
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed border-2 border-surface-container-lowest flex items-center justify-center text-on-tertiary-container shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">
                      paid
                    </span>
                  </div>

                  <div>
                    <div className="font-body-sm text-body-sm text-on-background">
                      <span className="font-semibold">Payout Processed:</span>{" "}
                      $1,200 Batch
                    </div>
                    <div className="font-label-bold text-label-bold text-on-surface-variant font-normal">
                      45 mins ago by System
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-error-light border-2 border-surface-container-lowest flex items-center justify-center text-error shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">
                      error
                    </span>
                  </div>

                  <div>
                    <div className="font-body-sm text-body-sm text-on-background">
                      <span className="font-semibold">
                        Verification Failed:
                      </span>{" "}
                      Joe&apos;s Diner
                    </div>
                    <div className="font-label-bold text-label-bold text-on-surface-variant font-normal">
                      2 hrs ago by Admin Mike
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-surface-container-lowest flex items-center justify-center text-on-surface-variant shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">
                      description
                    </span>
                  </div>

                  <div>
                    <div className="font-body-sm text-body-sm text-on-background">
                      <span className="font-semibold">Report Generated:</span>{" "}
                      Monthly Metrics
                    </div>
                    <div className="font-label-bold text-label-bold text-on-surface-variant font-normal">
                      5 hrs ago by System
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}