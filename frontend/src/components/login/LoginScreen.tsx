"use client";

import { useState } from "react";
import { LoginFooter } from "./LoginFooter";
import { LoginForm } from "./LoginForm";
import { LoginHeader } from "./LoginHeader";
import type { LoginScreenData } from "./types";

type LoginScreenProps = {
  data: LoginScreenData;
};

export function LoginScreen({ data }: LoginScreenProps) {
  const [login_data, set_login_data] = useState({
    email: "",
    password: ""
  })

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-0">
      <div className="relative flex min-h-screen w-full max-w-md flex-col bg-white p-6 sm:p-8">
        <nav className="flex w-full items-center pb-6 pt-2">
          <button
            type="button"
            aria-label="Go back"
            className="-ml-2 rounded-full p-2 text-slate-900 transition-colors hover:bg-slate-100"
          >
            <span aria-hidden="true">&#8592;</span>
          </button>
        </nav>
        <LoginHeader />
        <LoginForm data={data} />
        <LoginFooter signUpHref={data.signUpHref} />
      </div>
    </main>
  );
}
