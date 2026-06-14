type AdminNavbarProps = {
    searchPlaceholder?: string;
    adminName?: string;
    adminRole?: string;
    adminImageUrl?: string;
  };
  
  export default function AdminNavbar({
    searchPlaceholder = "Search merchants, orders, or analytics...",
    adminName = "Admin User",
    adminRole = "System Admin",
    adminImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAI4k4Ol6Jooezqm1xOznS5Y5a2nFt5BtfWxunKs-TcySNpKZ9XCP63RXV0ni6ZTWZ8FIy_x0jgsOuB4d8EPx0swlksbWL1cxeCj-QMyqvv7aRh7TKubc4epzVCFZa96CKG4ZWdPDjbt7Jkpl1mld7krk6XQvlz7u1gKMC7Z8VHzXA42f6yrccoSAb1AwBePRfDV9XFTYTMRvGnemGBGh-pKY7jd_uOC4rEfQqbSKsHDCdwdjBenBy1ofMU3sjuaSptIiAniXmfmnqT",
  }: AdminNavbarProps) {
    return (
      <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 sticky top-0 z-40">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative max-w-md w-full group">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              search
            </span>
  
            <input
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
              placeholder={searchPlaceholder}
              type="text"
            />
          </div>
        </div>
  
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
          </button>
  
          <button
            type="button"
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">calendar_today</span>
          </button>
  
          <div className="w-px h-6 bg-slate-200 mx-2" />
  
          <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-all group">
            <img
              alt="Admin Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-emerald-100"
              src={adminImageUrl}
            />
  
            <div className="text-right hidden lg:block">
              <p className="text-xs font-bold text-slate-900">{adminName}</p>
              <p className="text-[10px] text-slate-500 font-medium">
                {adminRole}
              </p>
            </div>
  
            <span className="material-symbols-outlined text-slate-400 text-lg group-hover:text-emerald-600">
              expand_more
            </span>
          </div>
        </div>
      </header>
    );
  }