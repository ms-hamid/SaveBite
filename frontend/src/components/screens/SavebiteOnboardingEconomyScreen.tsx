export function SavebiteOnboardingEconomyScreen() {
  return (
    <>
      <div className="relative flex h-full w-full max-w-md mx-auto flex-col overflow-hidden bg-white shadow-2xl sm:rounded-[3rem] sm:my-8 sm:h-[844px] sm:border-8 border-gray-100">
        <div className="h-12 w-full bg-white z-20" />
        <div className="flex px-6 pt-2 pb-4 justify-end z-20 bg-white">
          <button className="flex items-center justify-center rounded-full h-8 px-3 bg-transparent text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium opacity-60 hover:opacity-100">
            <span>Skip</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-between pb-8">
          <div className="flex-1 flex items-center justify-center w-full px-8 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 bg-emerald-50 rounded-full blur-3xl transform -translate-y-8" />
            </div>
            <div className="relative w-full aspect-[4/5] max-w-sm rounded-3xl overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-contain bg-center bg-no-repeat transform scale-100" data-alt="Minimalist flat illustration of a grocery bag with fresh vegetables and fruits in a store setting" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBqpekbePXWsVFC8Odz3CA1Du3GX-uGRwFwE53ld-RCG40j_BjcabXLPQCzgUYgR7hd7l0NkgVLtthi_5u7cZpdT_3Kp4K--8KGrBPBdccy8QSol2D2UqykItj18jMCeVFzD13pzfZcNaX4j3kI8MOdRLg3bujJh9QW-wI6VV6QivPcWpUiRRyK5suqGaowM_oTMeeO01IHlwa38BMSQYPI1jc5OFTxRdJ1nXpD-NZZ92m9rY3mdTOIU1nesWFX5csK0_GfJvFb-t4V")'}}>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center px-6 pt-2 pb-8 z-10 bg-white">
            <div className="text-center mb-8 w-full">
              <h1 className="text-slate-900 text-3xl font-bold leading-tight mb-4 tracking-tight">
                Save food. <br />
                <span className="text-primary">Save money.</span>
              </h1>
              <p className="text-slate-500 text-base font-normal leading-relaxed max-w-[280px] mx-auto">
                Buy surplus meals from local stores at lower prices.
              </p>
            </div>
            <div className="flex flex-row items-center justify-center gap-2 mb-8">
              <div className="h-2 w-6 rounded-full bg-primary transition-all duration-300" />
              <div className="h-2 w-2 rounded-full bg-slate-200 transition-all duration-300" />
              <div className="h-2 w-2 rounded-full bg-slate-200 transition-all duration-300" />
            </div>
            <div className="w-full px-2 mb-4">
              <button className="w-full flex items-center justify-center h-14 rounded-2xl bg-primary text-white text-lg font-semibold shadow-lg shadow-emerald-200 hover:bg-primary-dark active:scale-[0.98] transition-all duration-200">
                Continue
              </button>
            </div>
          </div>
        </div>
        <div className="h-1 w-32 bg-slate-200 rounded-full mx-auto mb-2 opacity-50 absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none" />
      </div>
    </>
  );
}
