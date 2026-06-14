export function CustomerReviewsUpdatedNavScreen() {
  return (
    <>
      <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-white dark:bg-surface-dark shadow-2xl">
        <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-surface-dark sticky top-0 z-20 shadow-[0_1px_1px_rgba(0,0,0,0.02)]">
          <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back</span>
          </button>
          <h2 className="text-[15px] font-bold text-center flex-1 dark:text-white">Customer Reviews</h2>
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-100 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-300 text-[18px] font-light">tune</span>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
          <div className="px-4 pt-1 pb-1 text-center">
            <h1 className="text-base font-semibold mb-0 text-slate-800 dark:text-slate-100">Green Leaf Bakery</h1>
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-[11px] font-medium mt-0.5">
              <span className="material-symbols-outlined text-primary text-[14px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
              <span className="text-slate-900 dark:text-white font-bold">4.6</span>
              <span>(128 reviews)</span>
            </div>
          </div>
          <div className="px-4 py-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4 items-center">
              <div className="flex flex-col items-center justify-center w-[30%] border-r border-slate-100/80 dark:border-slate-700/80 pr-4">
                <span className="text-[42px] font-extrabold text-slate-900 dark:text-white tracking-tighter leading-none mb-1">4.6</span>
                <div className="flex text-primary mb-1 justify-center w-full gap-[1px]">
                  <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                  <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                  <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                  <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                  <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: '"FILL" 1'}}>star_half</span>
                </div>
                <span className="text-[9px] text-slate-300 dark:text-slate-500 font-normal text-center leading-tight">based on 128 ratings</span>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 text-right font-bold text-slate-400 dark:text-slate-500 text-[10px]">5</span>
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '78%'}} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 text-right font-bold text-slate-400 dark:text-slate-500 text-[10px]">4</span>
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '14%'}} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 text-right font-bold text-slate-400 dark:text-slate-500 text-[10px]">3</span>
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '4%'}} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 text-right font-bold text-slate-400 dark:text-slate-500 text-[10px]">2</span>
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '2%'}} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 text-right font-bold text-slate-400 dark:text-slate-500 text-[10px]">1</span>
                  <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '2%'}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full overflow-x-auto no-scrollbar px-4 pb-3 pt-1">
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-full bg-navy-soft text-white text-[11px] font-medium whitespace-nowrap shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-transparent">All Reviews</button>
              <button className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap flex items-center gap-1 hover:bg-slate-50">
                5 <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
              </button>
              <button className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap flex items-center gap-1 hover:bg-slate-50">
                With Photos
              </button>
              <button className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap flex items-center gap-1 hover:bg-slate-50">
                Most Recent
              </button>
              <button className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap flex items-center gap-1 hover:bg-slate-50">
                Verified
              </button>
            </div>
          </div>
          <div className="px-4 flex flex-col gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-[0_2px_6px_-2px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <img alt="Smiling woman portrait avatar" className="w-8 h-8 rounded-full object-cover border border-slate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVLGlqLq1WInpGTr1MxO3q8asLNMhe_iZiPziaSfL5nt8UopAcnADSx3sIo_5v5sKnyViD5SDXTq3OLXStjt14s1qBau-vebKwpCTXhmEqFI6WiirUP-APaPEgvcq0sVIgJJed6G8al91falLz9nmCpGwZe94DB6mKEOAre9F0R9TR8iKU2B3Mo5S6g7mfdozhkikb27i_UkE2XABSmxNmHKAnEjtvtg-WKy3EXLXx3ksC3GxjLCaCcWOr_wn3k9BFOwQoqqUoV6q1" />
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Sarah Jenkins</h4>
                      <span className="inline-flex items-center gap-0.5 text-primary text-[8px] font-bold uppercase tracking-wider translate-y-[1px]">
                        <span className="material-symbols-outlined text-[9px]" style={{fontVariationSettings: '"FILL" 1'}}>verified</span> Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      <div className="flex text-primary">
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                      </div>
                      <span>• 2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                  Absolutely loved the surprise bag! The croissants were still warm and the sourdough is amazing. Great value for the price and knowing I'm saving food makes it taste even better!
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
                <img alt="Freshly baked croissants on a wooden table" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8fDexdUeJHWV6EAw3-ngcUJzCeLpEDhcDLUNb-fx_-UlRwjRy14eMccKPmj3BXenYY4uHpUHo0Q5JQM3YXoBIifATEWdPcHnolb8TFjQgRsRWyqs9uzFHe4n7-7YWaurpxb1FL1rYfCAveVgkCbPagdJddBZEbca5tLNi6n9syz-4kbUluftYT41hKb_WddH3tycY13t7pDl94lT6laDEbDrDWNuGTmYUERWP7sT0wrZ77VEKNVon8B62Hu6Es3b9EUJaNW91Pbwf" />
                <img alt="Sourdough bread loaf close up texture" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPbUsv6j_XuicHcr8wTuOZerJQ21pPdjUMW2UAXEDVnyhSNYj0qJ6uUzjq9hPIctz5fBB8loEXdRA92ufQTJagorU5bL9Im-pmUvQ1CxtyYT719zA9DTFPKGoTn95HoyMPAs8pSLdiPcSBdgklzU3K3cvxRiRCqOzUsFAK0Q-OHmGzApZAa8QnJGx1S7RSw43gzNN2x6lC_ocehPRwSUFFcu95FZkBZuxZv6LJsg22UDJFAs9nNOb6HQzGuEhsUnowobsbnVyEttXL" />
              </div>
              <div className="h-px bg-slate-50 dark:bg-slate-700/50 mb-3" />
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                  Helpful (12)
                </button>
                <button className="text-xs font-medium text-slate-300 hover:text-slate-400 transition-colors opacity-70 hover:opacity-100">Report</button>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-[0_2px_6px_-2px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-500 dark:text-indigo-300 font-bold text-xs">
                    MK
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Mike K.</h4>
                      <span className="inline-flex items-center gap-0.5 text-primary text-[8px] font-bold uppercase tracking-wider translate-y-[1px]">
                        <span className="material-symbols-outlined text-[9px]" style={{fontVariationSettings: '"FILL" 1'}}>verified</span> Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      <div className="flex text-primary">
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                        <span className="material-symbols-outlined text-[12px] text-slate-200 dark:text-slate-600">star</span>
                      </div>
                      <span>• 1 week ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                  Pretty good selection today. I got mostly savory items which I prefer. The pickup process was super quick and easy. Will definitely be back next week. <span className="text-primary font-medium cursor-pointer ml-1">Read more</span>
                </p>
              </div>
              <div className="h-px bg-slate-50 dark:bg-slate-700/50 mb-3" />
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                  Helpful (4)
                </button>
                <button className="text-xs font-medium text-slate-300 hover:text-slate-400 transition-colors opacity-70 hover:opacity-100">Report</button>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-[0_2px_6px_-2px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <img alt="Man with glasses portrait avatar" className="w-8 h-8 rounded-full object-cover border border-slate-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApJNZWpDLGHXPgH069Q5hkYPnZJ0lt1jNt6BxImPDUn8Su4V19gu3i3ROtUGYPQr-hUyjEsjOWSl0fdqIEkSBU6dOMAWmjBn1EIEFpViV0in9IhnG9uSdP5KJ48Hek-klmQnQoQRrfY8mEK4URCBoBtBi3ZH5DRuZFV3KItzCD2ENhIP_KMPfh57w39ssX2WAVkh0vXcwlAwv5bJOpqPwwEBUjuApz0ClEpTeNQDnazDiJfJEh6mt9x1Gbh6WA4L0JJpLt3wvFh5tt" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">David Chen</h4>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      <div className="flex text-primary">
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                        <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                      </div>
                      <span>• 2 weeks ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                  The quantity was huge! Got a whole loaf, 4 muffins and some bagels. Everything was fresh. I froze half of it and it reheated perfectly.
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
                <img alt="Bagels and muffins in a brown paper bag" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaz7hWr4g6RQoEXBzz7pKGHUl0c_HN2QMcO2AKmW8FjFdx7nOqwvZJhRwaGEvXXDY1G7mypUfDt3Evwlrl4h1kwc1E7PXJIicsp0Gt5mVTMu464QJGVt1croYWXCb-ZOQ5OVNj5zaOGzIy9xgphtjwxQQ-rWcB-sFZVJ5hge5BpG-ScWXwcfrcPIJ03_yb4V_8jKQM_5_uXAW1-wwE2mu085kC5FpzpNHXy4Kc4KpNuzsZ14V9vAjLhx2sunvOMAUUKh-_9fAT6aWp" />
              </div>
              <div className="h-px bg-slate-50 dark:bg-slate-700/50 mb-3" />
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                  Helpful (28)
                </button>
                <button className="text-xs font-medium text-slate-300 hover:text-slate-400 transition-colors opacity-70 hover:opacity-100">Report</button>
              </div>
            </div>
          </div>
        </main>
        <nav className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark px-8 py-3 sticky bottom-0 w-full z-30 h-[72px]">
          <a className="flex flex-col items-center justify-center gap-1 text-slate-400 transition-colors" href="#">
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-[10px] font-medium">Home</span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 text-slate-400 transition-colors" href="#">
            <span className="material-symbols-outlined text-[24px]">search</span>
            <span className="text-[10px] font-medium">Search</span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 text-slate-400 transition-colors" href="#">
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            <span className="text-[10px] font-medium">Orders</span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 text-slate-400 transition-colors" href="#">
            <span className="material-symbols-outlined text-[24px]">bookmark</span>
            <span className="text-[10px] font-medium">Saved</span>
          </a>
          <a className="flex flex-col items-center justify-center gap-1 text-slate-400 transition-colors" href="#">
            <span className="material-symbols-outlined text-[24px]">person</span>
            <span className="text-[10px] font-medium">Profile</span>
          </a>
        </nav>
      </div>
    </>
  );
}



