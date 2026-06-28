export default function Page() {
  return (
    <div
      className="bg-surface font-body-default text-on-surface antialiased selection:bg-primary-container selection:text-white overflow-hidden min-h-screen">
        
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img alt="Subtle Background" className="w-full h-full object-cover opacity-[0.03] grayscale mix-blend-multiply"
          data-alt="A highly stylized, minimalist vector illustration representing global food logistics and sustainable supply chains. The scene features abstract interconnected nodes, subtle geometric representations of delivery networks, and stylized agricultural motifs. The color palette is predominantly soft, airy whites and light grays, with extremely faint, almost translucent emerald green accents. The overall mood is modern, clean, and highly professional, perfectly suited for a light-mode corporate SaaS dashboard background. The lighting is high-key and diffused, creating a sterile yet inviting atmosphere without distracting from foreground elements."
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg4eEtHf5lNa-Rv-JUfWR_AdOKuVKXH7xR1Gm1V5KW8VqLwVILGaTKdEudhJUO4zD3OEaEmGbAz_zgVvrDHoHVHgWoaq6OWnhfM-kqTveZndORe-SZahEKybNSQj-KoBJJMTH5MaXX5xkxgpwgauOYwDVnjwh1mjaSg8gWTb3VlC2qgR4rP3Qu9sikr8onYtkv7GWESX01Duo6hNR1NsYzbCTobXOkJnVBSrR9zi1RDuA3LRaIZhOhdQaBb4wFFGvUpKxCOp8tS1gX" />
        <div className="absolute inset-0 bg-gradient-to-br from-surface/80 to-surface-container-low/90"></div>
      </div>

      <main className="relative z-10 w-full min-h-screen flex items-center justify-center p-unit-lg">

        <div
          className="bg-surface-container-lowest w-full max-w-[440px] rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] p-unit-xl flex flex-col gap-unit-xl relative overflow-hidden backdrop-blur-sm border border-outline-variant/20">

          <div className="flex flex-col items-center text-center gap-unit-sm">
            <div
              className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center mb-2 shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary-container"
                style={{fontSize: "32px", fontVariationSettings: "'FILL' 1"}}>
                eco
              </span>
            </div>
            <h1 className="font-section-title text-section-title text-on-surface">SaveBite</h1>
            <p className="font-body-default text-body-default text-on-surface-variant">Admin Portal Access</p>
          </div>

          <form action="#" className="flex flex-col gap-unit-lg" method="POST">

            <div className="flex flex-col gap-unit-xs">
              <label className="font-label-bold text-label-bold text-on-surface ml-1" htmlFor="email">Email or
                Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-unit-md flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant text-opacity-70 text-[20px]">
                    mail
                  </span>
                </div>
                <input
                  className="w-full pl-11 pr-unit-md py-3 bg-surface-container-lowest border border-outline-variant rounded-[16px] font-body-default text-body-default text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all duration-200"
                  id="email" name="email" placeholder="admin@savebite.com" required={true} type="email" />
              </div>
            </div>

            <div className="flex flex-col gap-unit-xs">
              <label className="font-label-bold text-label-bold text-on-surface ml-1"
                htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-unit-md flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface-variant text-opacity-70 text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  className="w-full pl-11 pr-unit-md py-3 bg-surface-container-lowest border border-outline-variant rounded-[16px] font-body-default text-body-default text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all duration-200"
                  id="password" name="password" placeholder="Your Admin Password" required={true} type="password" />
              </div>
            </div>

            <div className="flex items-center justify-between mt-unit-xs">
              <div className="flex items-center">
                <input
                  className="h-4 w-4 text-primary-container border-outline-variant rounded focus:ring-primary-container/30 bg-surface-container-lowest cursor-pointer transition-colors"
                  id="remember-me" name="remember-me" type="checkbox" />
                <label
                  className="ml-2 block font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none"
                  htmlFor="remember-me">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a className="font-label-bold text-label-bold text-primary-container hover:text-primary transition-colors"
                  href="#">
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-[16px] shadow-sm font-label-bold text-label-bold text-on-primary bg-primary-container hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-all duration-200 transform hover:-translate-y-px active:translate-y-0"
              type="submit">
              Sign In
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </form>

          <div className="text-center mt-unit-sm">
            <p className="font-caption text-caption text-on-surface-variant">
              Protected by reCAPTCHA and subject to the <a className="text-primary-container hover:underline"
                href="#">Privacy Policy</a> and <a className="text-primary-container hover:underline" href="#">Terms of
                Service</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
