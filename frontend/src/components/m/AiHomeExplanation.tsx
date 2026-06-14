type AIPredictionCardProps = {
    confidence?: number | null;
    peakDemand?: string;
    bestPublishTime?: string;
    estimatedSurplus?: string;
    possibleSurplusTime?: string;
    onPrepareListing?: () => void;
  };
  
  export default function AIPredictionCard({
    confidence = null,
    peakDemand = "19:00 - 20:30",
    bestPublishTime = "18:00",
    estimatedSurplus = "~30–40 items expected",
    possibleSurplusTime = "19:00",
    onPrepareListing,
  }: AIPredictionCardProps) {
    const predictionState =
      confidence === null || confidence === undefined
        ? "waiting"
        : confidence > 75
        ? "high"
        : "low";
  
    return (
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">
          AI Prediction
        </h2>
  
        {predictionState === "high" && (
          <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-slate-900">
                <span
                  className="material-symbols-outlined text-[18px] text-primary-emerald"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <span className="text-sm font-bold">Prediction</span>
              </div>
  
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                {confidence}% Confidence
              </span>
            </div>
  
            <div className="grid grid-cols-2 gap-4 mt-1 z-10">
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">
                  Peak Demand
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {peakDemand}
                </p>
              </div>
  
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">
                  Best Publish Time
                </p>
                <p className="text-sm font-bold text-primary-emerald">
                  {bestPublishTime}
                </p>
              </div>
  
              <div className="col-span-2 pt-2 border-t border-emerald-100/50 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">
                    Estimated Surplus Today
                  </p>
                  <p className="text-sm font-extrabold text-slate-700">
                    {estimatedSurplus}
                  </p>
                </div>
  
                <button
                  onClick={onPrepareListing}
                  className="text-xs font-bold text-white bg-primary-emerald px-4 py-2 rounded-lg shadow-sm active:scale-95 transition-all"
                >
                  Prepare listing
                </button>
              </div>
            </div>
          </div>
        )}
  
        {predictionState === "low" && (
          <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-slate-900">
                <span
                  className="material-symbols-outlined text-[18px] text-amber-500"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <span className="text-sm font-bold">Prediction</span>
              </div>
  
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                Low Confidence
              </span>
            </div>
  
            <div className="grid grid-cols-2 gap-4 mt-1 z-10">
              <div className="col-span-2 flex flex-col items-center justify-center py-4">
                <div className="relative flex items-center justify-center mb-3">
                  <div className="absolute w-12 h-12 rounded-full bg-amber-100/60"></div>
                  <span className="material-symbols-outlined text-3xl z-10 text-amber-500">
                    monitoring
                  </span>
                </div>
  
                <p className="text-sm font-semibold text-slate-700 text-center px-4">
                  <span className="block text-base font-bold text-slate-800 mb-1">
                    Possible Surplus Around {possibleSurplusTime}
                  </span>
                  <span className="block text-xs font-medium text-slate-500">
                    We're still learning your store pattern. Predictions improve
                    as you sell more.
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
  
        {predictionState === "waiting" && (
          <div className="p-5 rounded-2xl border shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col gap-4 relative overflow-hidden bg-slate-50 border-slate-100">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-slate-400">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <span className="text-sm font-bold">Prediction</span>
              </div>
  
              <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Waiting for data
              </span>
            </div>
  
            <div className="mt-1 z-10 flex flex-col gap-2">
              <p className="text-sm font-bold text-slate-600">
                Learning your store patterns...
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Predictions improve as you sell more. We need a few more days of
                activity to forecast accurately.
              </p>
            </div>
          </div>
        )}
      </section>
    );
  }