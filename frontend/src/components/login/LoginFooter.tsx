type LoginFooterProps = {
  signUpHref: string;
};

export function LoginFooter({ signUpHref }: LoginFooterProps) {
  return (
    <footer className="mt-auto pb-4 pt-8 text-center">
      <p className="text-sm text-slate-500">
        Don&apos;t have an account?
        <a
          className="ml-1 font-semibold text-[#10b77f] hover:text-[#0e9f6e]"
          href={signUpHref}
        >
          Sign Up
        </a>
      </p>
    </footer>
  );
}
