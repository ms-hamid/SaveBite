export default function LoadingOverlay({ isLoading = false }) {
    if (!isLoading) return null;
  
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-700">
            Loading...
          </p>
        </div>
      </div>
    );
  }