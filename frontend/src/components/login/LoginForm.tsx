import type { LoginScreenData } from "./types";
import { SocialLoginButton } from "./SocialLoginButton";

type LoginFormProps = {
  data: LoginScreenData;
};

export function LoginForm({ data }: LoginFormProps) {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-900">
          Email
        </label>
        <input
          id="email"
          type="email"
          defaultValue={data.email}
          placeholder="Enter your email"
          className="h-12 w-full rounded-lg border border-rose-600 bg-white px-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-600"
        />
        {data.emailError ? (
          <span className="mt-0.5 text-xs font-medium text-rose-600">
            {data.emailError}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-900">
          Password
        </label>
        <div className="relative flex items-center">
          <input
            id="password"
            type="password"
            placeholder={data.passwordPlaceholder}
            className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-4 pr-12 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#10b77f] focus:ring-2 focus:ring-[#10b77f]"
          />
          <button
            type="button"
            aria-label="Toggle password visibility"
            className="absolute right-4 flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <span aria-hidden="true" className="text-xs font-medium">
              Show
            </span>
          </button>
        </div>
        <div className="mt-1 flex justify-end">
          <a
            className="text-sm font-medium text-[#10b77f] transition-colors hover:text-[#0e9f6e]"
            href={data.forgotPasswordHref}
          >
            Forgot password?
          </a>
        </div>
      </div>

      <button
        type="button"
        disabled
        className="mt-4 flex h-12 w-full cursor-not-allowed items-center justify-center rounded-lg bg-[#10b77f]/50 text-base font-semibold text-white"
      >
        Sign In
      </button>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-slate-200" />
        <span className="mx-4 flex-shrink-0 text-sm text-slate-400">or</span>
        <div className="flex-grow border-t border-slate-200" />
      </div>

      <SocialLoginButton label="Continue with Google" />
    </div>
  );
}
