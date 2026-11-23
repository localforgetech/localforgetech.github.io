import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-300 via-cyan-400 to-sky-600 font-black tracking-tighter text-[#04121f] shadow-lg shadow-cyan-500/25",
        className,
      )}
    >
      <span className="text-[15px] leading-none">LF</span>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-white/20" />
    </span>
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandMark />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight text-white">
          LocalForge <span className="text-cyan-300">Tech</span>
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
          Jind · Haryana
        </span>
      </span>
    </span>
  );
}
