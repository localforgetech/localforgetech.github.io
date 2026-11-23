import { redirect } from "next/navigation";

import { BrandLockup } from "@/components/site/brand-mark";
import { isCrmAuthed } from "@/lib/crm-auth";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "CRM sign in",
  description: "Restricted access to the LocalForge Tech CRM.",
};

export default async function CrmLoginPage() {
  if (await isCrmAuthed()) {
    redirect("/crm");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <BrandLockup />
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0a1220] p-6 shadow-2xl shadow-black/40 sm:p-8">
          <div className="mb-6 space-y-1 text-center">
            <h1 className="text-xl font-bold tracking-tight text-white">
              CRM sign in
            </h1>
            <p className="text-xs text-slate-400">
              Restricted access for the LocalForge Tech team.
            </p>
          </div>
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Looking for the website?{" "}
          <a href="/" className="text-cyan-400 hover:text-cyan-300">
            Go back home
          </a>
        </p>
      </div>
    </main>
  );
}
