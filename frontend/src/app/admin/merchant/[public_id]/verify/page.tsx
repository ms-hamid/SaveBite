export const metadata = { title: "Merchant Verification Detail - SaveBite Admin" };

export default function Page() {
  return (
    <div className="light bg-background text-on-background flex h-screen overflow-hidden antialiased font-body-default">


      <aside className="bg-surface-container-lowest border-r border-outline-variant shadow-sm w-[280px] h-screen sticky left-0 top-0 flex-col py-unit-xl px-unit-md z-40 hidden md:flex transition-transform duration-300" id="sidebar">
      <div className="flex items-center gap-unit-md mb-unit-xl px-unit-md">
      <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container">
      <span className="material-symbols-outlined" data-weight="fill" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
      </div>
      <div>
      <h1 className="font-section-title-sm text-section-title-sm font-bold text-primary">SaveBite</h1>
      <p className="font-caption text-caption text-on-surface-variant">Admin Portal</p>
      </div>
      </div>
      <nav className="flex-1 flex flex-col gap-unit-sm overflow-y-auto">
      <a className="flex items-center gap-unit-md text-on-surface-variant hover:text-primary px-unit-md py-unit-sm hover:bg-surface-container-low transition-colors rounded-lg font-body-medium text-body-medium" href="#">
      <span className="material-symbols-outlined">dashboard</span>
                      Dashboard
                  </a>
      <a className="flex items-center gap-unit-md text-on-surface-variant hover:text-primary px-unit-md py-unit-sm hover:bg-surface-container-low transition-colors rounded-lg font-body-medium text-body-medium" href="#">
      <span className="material-symbols-outlined">storefront</span>
                      Merchant Management
                  </a>
      <a className="flex items-center gap-unit-md bg-[#DFF7EC] text-[#10B981] font-bold rounded-lg px-unit-md py-unit-sm scale-[0.95] transition-transform duration-200 border-l-2 border-primary shadow-[0px_1px_3px_rgba(0,0,0,0.05),0px_10px_15px_-5px_rgba(0,0,0,0.03)] font-body-medium text-body-medium" href="#">
      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                      Merchant Verification
                  </a>
      <a className="flex items-center gap-unit-md text-on-surface-variant hover:text-primary px-unit-md py-unit-sm hover:bg-surface-container-low transition-colors rounded-lg font-body-medium text-body-medium" href="#">
      <span className="material-symbols-outlined">group</span>
                      Customer Management
                  </a>
      <a className="flex items-center gap-unit-md text-on-surface-variant hover:text-primary px-unit-md py-unit-sm hover:bg-surface-container-low transition-colors rounded-lg font-body-medium text-body-medium" href="#">
      <span className="material-symbols-outlined">monitoring</span>
                      Order Monitoring
                  </a>
      <a className="flex items-center gap-unit-md text-on-surface-variant hover:text-primary px-unit-md py-unit-sm hover:bg-surface-container-low transition-colors rounded-lg font-body-medium text-body-medium" href="#">
      <span className="material-symbols-outlined">payments</span>
                      Payout Management
                  </a>
      <a className="flex items-center gap-unit-md text-on-surface-variant hover:text-primary px-unit-md py-unit-sm hover:bg-surface-container-low transition-colors rounded-lg font-body-medium text-body-medium" href="#">
      <span className="material-symbols-outlined">assessment</span>
                      Reports
                  </a>
      </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">

      <header className="h-[72px] w-full sticky top-0 z-30 border-b border-outline-variant bg-[#ffffff] shadow-sm flex justify-between items-center px-8">
      <div className="flex items-center flex-1">
      <button className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all" id="mobile-menu-btn">
      <span className="material-symbols-outlined">menu</span>
      </button>
      <div className="flex-1 flex items-center hidden md:flex">
      <div className="relative w-96 group">
      <svg className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af] group-focus-within:text-[#006c49] transition-colors" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="m21 21-4.34-4.34"></path>
      <circle cx="11" cy="11" r="8"></circle>
      </svg>
      <input className="w-full bg-[#f3f4f6] text-[#111827] border-transparent focus:border-[#006c49] focus:ring-1 focus:ring-[#006c49] focus:bg-white rounded-lg pl-10 pr-4 py-2 font-body-default text-body-sm transition-all" placeholder="Search merchants..." type="text" />
      </div>
      </div>
      </div>
      <div className="flex items-center gap-unit-sm">
      <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all">
      <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
      </button>
      <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all">
      <span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
      </button>
      <div className="ml-4 flex items-center gap-unit-sm cursor-pointer hover:opacity-80 transition-opacity">
      <img alt="Administrator Avatar" className="w-8 h-8 rounded-full object-cover border border-outline-variant" data-alt="A professional headshot of a confident administrative user in a modern office setting. The lighting is soft and natural, emphasizing a trustworthy and approachable demeanor. The background features subtle indoor plants to hint at an eco-conscious corporate environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIv6iAevjcHGeOb4-dGHq3JhFnNrx5e7WZXidFGOK7XeUmfQjRjfHWtjzBE1g5d3izhasUghNvGVv2s2p3IyrarlAOET8seQZ8cfroarloOm6IN0AfQsBwGCDfk2_I20HEMx5oSyZ9bkyele5uN2PRyuyPjAUeaGij8ckB3PssZoP-KnnvI93Von9dPSmIHzy7RZPRYR0GpwygnwVvDT30zBrFNl6wK38IdpLs6LoJrgmhow8aXhhhJ1OBWLt4xAoAJkiSYKKdfAwu" />
      <span className="font-label-bold text-label-bold text-on-surface hidden sm:block">Admin Profile</span>
      <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
      </div>
      </div>
      </header>

      <div className="flex-1 overflow-y-auto p-margin-tablet lg:p-margin-desktop">
      <div className="max-w-container-max mx-auto">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-unit-md mb-unit-xl">
      <div>
      <div className="flex items-center gap-3 mb-2">
      <a className="text-on-surface-variant hover:text-primary transition-colors flex items-center" href="#">
      <span className="material-symbols-outlined text-[20px]">arrow_back</span>
      </a>
      <span className="px-2 py-1 bg-surface-variant text-on-tertiary-container rounded-full font-caption text-caption uppercase tracking-wider font-semibold">Pending Review</span>
      </div>
      <h2 className="font-page-title text-page-title text-on-background">Bella Napoli Trattoria</h2>
      <p className="font-body-medium text-body-medium text-on-surface-variant mt-1">Application ID: #APP-2023-8942 • Submitted Oct 24, 2023</p>
      </div>
      <div className="flex items-center gap-3">
      <button className="px-4 py-2 border border-outline text-on-surface-variant rounded-lg font-label-bold text-label-bold hover:bg-surface-container-low transition-colors flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px]">info</span>
                                  Request More Info
                              </button>
      <button className="px-4 py-2 bg-error-container text-on-error-container rounded-lg font-label-bold text-label-bold hover:bg-[#ffb4ab] transition-colors flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px]">close</span>
                                  Reject Application
                              </button>
      <button className="px-4 py-2 bg-primary-container text-on-primary rounded-lg font-label-bold text-label-bold hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px]">check</span>
                                  Approve Merchant
                              </button>
      </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

      <div className="lg:col-span-8 space-y-gutter">

      <div className="bg-surface-container-lowest rounded-xl p-unit-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-unit-md border-b border-surface-container pb-unit-sm">
      <h3 className="font-section-title-sm text-section-title-sm text-on-background flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-[22px]">store</span>
                                          Business Information
                                      </h3>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-unit-md gap-x-gutter">
      <div>
      <dt className="font-caption text-caption text-on-surface-variant mb-1">Legal Business Name</dt>
      <dd className="font-body-medium text-body-medium text-on-background">Bella Napoli Foods LLC</dd>
      </div>
      <div>
      <dt className="font-caption text-caption text-on-surface-variant mb-1">Doing Business As (DBA)</dt>
      <dd className="font-body-medium text-body-medium text-on-background">Bella Napoli Trattoria</dd>
      </div>
      <div>
      <dt className="font-caption text-caption text-on-surface-variant mb-1">Tax ID / EIN</dt>
      <dd className="font-body-medium text-body-medium text-on-background font-mono">XX-XXXX892</dd>
      </div>
      <div>
      <dt className="font-caption text-caption text-on-surface-variant mb-1">Business Type</dt>
      <dd className="font-body-medium text-body-medium text-on-background">Restaurant / Cafe</dd>
      </div>
      <div className="sm:col-span-2 pt-2">
      <dt className="font-caption text-caption text-on-surface-variant mb-1">Registered Address</dt>
      <dd className="font-body-medium text-body-medium text-on-background flex items-start gap-2">
      <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">location_on</span>
                                              1244 Olive Grove Ave, Suite 100<br />San Francisco, CA 94110
                                          </dd>
      </div>
      </dl>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-unit-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-unit-md border-b border-surface-container pb-unit-sm">
      <h3 className="font-section-title-sm text-section-title-sm text-on-background flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-[22px]">contact_page</span>
                                          Primary Contact Details
                                      </h3>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-unit-md gap-x-gutter">
      <div>
      <dt className="font-caption text-caption text-on-surface-variant mb-1">Full Name</dt>
      <dd className="font-body-medium text-body-medium text-on-background">Marco Rossi</dd>
      </div>
      <div>
      <dt className="font-caption text-caption text-on-surface-variant mb-1">Role/Title</dt>
      <dd className="font-body-medium text-body-medium text-on-background">Owner / Manager</dd>
      </div>
      <div>
      <dt className="font-caption text-caption text-on-surface-variant mb-1">Email Address</dt>
      <dd className="font-body-medium text-body-medium text-on-background flex items-center gap-2">
      <span className="material-symbols-outlined text-outline text-[18px]">mail</span>
                                              marco.r@bellanapoli.example.com
                                          </dd>
      </div>
      <div>
      <dt className="font-caption text-caption text-on-surface-variant mb-1">Phone Number</dt>
      <dd className="font-body-medium text-body-medium text-on-background flex items-center gap-2">
      <span className="material-symbols-outlined text-outline text-[18px]">call</span>
                                              +1 (415) 555-0198
                                          </dd>
      </div>
      </dl>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-unit-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-unit-md border-b border-surface-container pb-unit-sm">
      <h3 className="font-section-title-sm text-section-title-sm text-on-background flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-[22px]">folder_open</span>
                                          Document Verification
                                      </h3>
      </div>
      <div className="space-y-3">

      <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-bright hover:bg-surface-container transition-colors group">
      <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
      <span className="material-symbols-outlined">description</span>
      </div>
      <div>
      <p className="font-label-bold text-label-bold text-on-background">Business_License_2023.pdf</p>
      <p className="font-caption text-caption text-on-surface-variant">2.4 MB • Uploaded Oct 24</p>
      </div>
      </div>
      <button className="text-primary hover:bg-secondary-container p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center">
      <span className="material-symbols-outlined">visibility</span>
      </button>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-bright hover:bg-surface-container transition-colors group">
      <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
      <span className="material-symbols-outlined">badge</span>
      </div>
      <div>
      <p className="font-label-bold text-label-bold text-on-background">Owner_ID_Front_Scan.jpg</p>
      <p className="font-caption text-caption text-on-surface-variant">1.1 MB • Uploaded Oct 24</p>
      </div>
      </div>
      <button className="text-primary hover:bg-secondary-container p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center">
      <span className="material-symbols-outlined">visibility</span>
      </button>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-bright hover:bg-surface-container transition-colors group">
      <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
      <span className="material-symbols-outlined">badge</span>
      </div>
      <div>
      <p className="font-label-bold text-label-bold text-on-background">Owner_ID_Back_Scan.jpg</p>
      <p className="font-caption text-caption text-on-surface-variant">0.9 MB • Uploaded Oct 24</p>
      </div>
      </div>
      <button className="text-primary hover:bg-secondary-container p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center">
      <span className="material-symbols-outlined">visibility</span>
      </button>
      </div>
      </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-unit-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-unit-md border-b border-surface-container pb-unit-sm">
      <h3 className="font-section-title-sm text-section-title-sm text-on-background flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-[22px]">account_balance</span>
                                          Settlement Bank Account
                                      </h3>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-unit-md gap-x-gutter mb-unit-md">
      <div>
      <dt className="font-caption text-caption text-on-surface-variant mb-1">Bank Name</dt>
      <dd className="font-body-medium text-body-medium text-on-background">Chase Bank</dd>
      </div>
      <div>
      <dt className="font-caption text-caption text-on-surface-variant mb-1">Account Holder</dt>
      <dd className="font-body-medium text-body-medium text-on-background">Bella Napoli Foods LLC</dd>
      </div>
      <div>
      <dt className="font-caption text-caption text-on-surface-variant mb-1">Account Number</dt>
      <dd className="font-body-medium text-body-medium text-on-background font-mono">**** **** 4592</dd>
      </div>
      </dl>
      <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-bright hover:bg-surface-container transition-colors group">
      <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
      <span className="material-symbols-outlined">image</span>
      </div>
      <div>
      <p className="font-label-bold text-label-bold text-on-background">Voided_Check.jpg</p>
      <p className="font-caption text-caption text-on-surface-variant">1.2 MB • Uploaded Oct 24</p>
      </div>
      </div>
      <button className="text-primary hover:bg-secondary-container p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center">
      <span className="material-symbols-outlined">visibility</span>
      </button>
      </div>
      </div>
      </div>

      <div className="lg:col-span-4">
      <div className="sticky top-unit-lg space-y-gutter">

      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
      <div className="p-unit-lg border-b border-surface-container">
      <h3 className="font-section-title-sm text-section-title-sm text-on-background flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-[22px]">checklist</span>
                                              Verification Checklist
                                          </h3>
      </div>
      <div className="p-unit-lg space-y-4">
      <label className="flex items-center gap-3 cursor-pointer">
      <input defaultChecked={true} className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-bright" type="checkbox" />
      <span className="font-body-medium text-body-medium text-on-background">Identity Uploaded</span>
      </label>
      <label className="flex items-center gap-3 cursor-pointer">
      <input defaultChecked={true} className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-bright" type="checkbox" />
      <span className="font-body-medium text-body-medium text-on-background">Business License Uploaded</span>
      </label>
      <label className="flex items-center gap-3 cursor-pointer">
      <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-bright" type="checkbox" />
      <span className="font-body-medium text-body-medium text-on-background">Store Photo Uploaded</span>
      </label>
      <label className="flex items-center gap-3 cursor-pointer">
      <input defaultChecked={true} className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-bright" type="checkbox" />
      <span className="font-body-medium text-body-medium text-on-background">Bank Account Uploaded</span>
      </label>
      <label className="flex items-center gap-3 cursor-pointer">
      <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary bg-surface-bright" type="checkbox" />
      <span className="font-body-medium text-body-medium text-on-background">Address Verified</span>
      </label>
      </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] flex flex-col h-[400px]">
      <div className="p-unit-lg border-b border-surface-container flex-shrink-0">
      <h3 className="font-section-title-sm text-section-title-sm text-on-background flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-[22px]">history</span>
                                          Audit Log &amp; Notes
                                      </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-unit-md space-y-6">

      <div className="relative pl-6">
      <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-outline-variant"></div>
      <div className="absolute left-[3px] top-3 bottom-[-24px] w-px bg-outline-variant opacity-30"></div>
      <p className="font-caption text-caption text-on-surface-variant mb-0.5">Oct 24, 2023 - 10:15 AM</p>
      <p className="font-body-sm text-body-sm text-on-background"><span className="font-semibold text-primary">System</span> automatically received application.</p>
      </div>

      <div className="relative pl-6">
      <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary"></div>
      <div className="absolute left-[3px] top-3 bottom-[-24px] w-px bg-outline-variant opacity-30"></div>
      <p className="font-caption text-caption text-on-surface-variant mb-0.5">Oct 24, 2023 - 10:16 AM</p>
      <p className="font-body-sm text-body-sm text-on-background"><span className="font-semibold text-primary">System</span> verified email address.</p>
      </div>

      <div className="relative pl-6">
      <div className="absolute left-[-4px] top-0 w-4 h-4 rounded-full bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center">
      <div className="w-1.5 h-1.5 bg-tertiary rounded-full"></div>
      </div>
      <p className="font-caption text-caption text-on-surface-variant mb-1">Oct 25, 2023 - 09:30 AM • Sarah Jenkins (Admin)</p>
      <div className="bg-surface-bright border border-surface-container rounded-lg p-3">
      <p className="font-body-sm text-body-sm text-on-background">Documents look clear. Business license matches the state database perfectly. Just waiting to verify the physical address through maps.</p>
      </div>
      </div>
      </div>

      <div className="p-unit-md border-t border-surface-container bg-surface-bright rounded-b-xl flex-shrink-0">
      <label className="sr-only" htmlFor="internal-note">Add an internal note</label>
      <textarea className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 font-body-sm text-body-sm text-on-background placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all" id="internal-note" placeholder="Add an internal note or flag an issue..." rows={3}></textarea>
      <div className="flex justify-end mt-2">
      <button className="px-4 py-1.5 bg-surface-container-high text-primary rounded-lg font-label-bold text-label-bold hover:bg-secondary-container transition-colors">
                                              Post Note
                                          </button>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </main>
    </div>
  );
}
