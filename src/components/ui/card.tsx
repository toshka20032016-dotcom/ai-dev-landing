import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
