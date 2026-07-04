import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto min-h-dvh max-w-[430px] bg-background pb-28">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
